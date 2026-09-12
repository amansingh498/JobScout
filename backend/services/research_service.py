import os
import json
import re
from typing import List, Optional
from backend.schemas.job import Job
from backend.schemas.research import ResearchEvidence, get_confidence_for_source, get_confidence_tier
from backend.tools.web_search import WebSearchTool
from backend.tools.web_reader import WebReaderTool
from google import genai
from google.genai import types

class ResearchService:
    def __init__(self):
        self.search_tool = WebSearchTool()
        self.reader_tool = WebReaderTool()
        self.cache = {} # In-memory and extensible to DB cache
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.client = None
        if self.api_key:
            try:
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                print(f"Gemini client in ResearchService failed: {e}")

    async def research_missing_fields(self, job: Job) -> List[ResearchEvidence]:
        """Research all missing critical fields for a given job."""
        evidences: List[ResearchEvidence] = []
        for field in job.missing_fields:
            evidence = await self.research_field(job.company, job.title, field)
            if evidence:
                evidences.append(evidence)
                # Fill back the verified value into the job object
                self._apply_evidence_to_job(job, evidence)
        
        job.research_results = evidences
        return evidences

    async def research_field(self, company: str, role: str, field: str) -> Optional[ResearchEvidence]:
        cache_key = f"{company.strip().lower()}:{role.strip().lower()}:{field.strip().lower()}"
        if cache_key in self.cache:
            return self.cache[cache_key]

        # Generate targeted search queries (spec: 2-4 targeted queries)
        queries = [
            f"{company} {role} {field} compensation details",
            f"{company} internship {field} verified",
        ]

        found_evidence = None
        for query in queries:
            results = await self.search_tool.search(query, num_results=2)
            if not results:
                continue

            for res in results:
                snippet = res.get("snippet", "")
                url = res.get("url", "")
                source_type = res.get("source", "unknown")
                source_name = res.get("title", f"{company} Source")

                # Parse value from snippet / page
                extracted_value = await self._extract_field_value(field, snippet, company, role)
                if extracted_value:
                    confidence = get_confidence_for_source(source_type)
                    found_evidence = ResearchEvidence(
                        field=field,
                        value=extracted_value,
                        source_url=url,
                        source_name=source_name,
                        source_type=source_type,
                        confidence=confidence,
                        confidence_tier=get_confidence_tier(confidence)
                    )
                    break
            if found_evidence:
                break

        if not found_evidence:
            # Low confidence unknown value per spec §8 (never hallucinate)
            found_evidence = ResearchEvidence(
                field=field,
                value="Not disclosed",
                source_url="",
                source_name="Web Search Exhausted",
                source_type="unknown",
                confidence=0.20,
                confidence_tier="Low"
            )

        self.cache[cache_key] = found_evidence
        return found_evidence

    async def _extract_field_value(self, field: str, text: str, company: str, role: str) -> Optional[str]:
        if self.client:
            try:
                prompt = f"""Extract the exact '{field}' value for {company} {role} from the text below.
Return a brief JSON response: {{"value": "..."}} or {{"value": null}} if not found.
Text:
{text}
"""
                resp = self.client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt,
                    config=types.GenerateContentConfig(response_mime_type="application/json")
                )
                data = json.loads(resp.text)
                if data.get("value"):
                    return str(data["value"])
            except Exception as e:
                print(f"LLM field extraction error: {e}")

        # Heuristic regex extraction
        if field in ["stipend", "salary"]:
            match = re.search(r'[₹|Rs\.?\$]\s*([0-9,]+(?:\s*(?:k|lakh|per month|/month|/mo))?)', text, re.IGNORECASE)
            if match:
                return match.group(0).strip()
        elif field == "work_mode":
            for mode in ["Remote", "Hybrid", "In-office"]:
                if mode.lower() in text.lower():
                    return mode
        elif field == "location":
            for loc in ["Bangalore", "Bengaluru", "Hyderabad", "Pune", "Mumbai", "Remote", "Delhi NCR"]:
                if loc.lower() in text.lower():
                    return loc

        return None

    def _apply_evidence_to_job(self, job: Job, evidence: ResearchEvidence):
        if evidence.value in ["Not disclosed", None]:
            return

        if evidence.field == "stipend":
            digits = re.findall(r'\d+', evidence.value.replace(',', ''))
            if digits:
                val = int(digits[0])
                if "k" in evidence.value.lower() and val < 1000:
                    val *= 1000
                job.stipend_min = val
                job.stipend_max = val
        elif evidence.field == "work_mode":
            job.work_mode = evidence.value
        elif evidence.field == "location":
            job.location = evidence.value
