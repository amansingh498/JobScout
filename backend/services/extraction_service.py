import os
import json
import re
import uuid
from typing import Optional, Dict, Any
from google import genai
from google.genai import types
from backend.schemas.job import Job
from backend.services.discovery_service import RawJob

class ExtractionService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.client = None
        if self.api_key:
            try:
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                print(f"Warning: Failed to initialize Gemini Client: {e}")

    async def extract_job_data(self, raw_job: RawJob) -> Job:
        """Extract structured fields from raw JD text."""
        # If API key is available, use Gemini with structured output
        if self.client:
            try:
                prompt = f"""You are a precise job description parser.
Extract the structured information from the following Job Description into exact JSON format.
Only return valid JSON without markdown wrapping or commentary.

Fields to extract:
- title (string)
- company (string)
- description (brief summary string)
- location (string or null)
- work_mode (In-office | Remote | Hybrid | null)
- employment_type (Internship | Full-time | Contract | null)
- salary_min (integer or null)
- salary_max (integer or null)
- stipend_min (monthly stipend integer or null)
- stipend_max (monthly stipend integer or null)
- skills (list of strings)

Raw Job Description:
Company: {raw_job.company}
Title: {raw_job.title}
Text:
{raw_job.raw_text}
"""
                response = self.client.models.generate_content(
                    model="gemini-2.0-flash",
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json"
                    )
                )
                data = json.loads(response.text)
                return self._create_job_instance(data, raw_job)
            except Exception as err:
                print(f"Extraction via Gemini failed, falling back to heuristic parser: {err}")

        # Heuristic fallback parser (guarantees MVP functionality even offline/without key)
        return self._heuristic_extract(raw_job)

    def _heuristic_extract(self, raw_job: RawJob) -> Job:
        text = raw_job.raw_text
        title = raw_job.title
        company = raw_job.company

        # Location
        location = raw_job.location or "Bangalore"
        if "remote" in text.lower():
            if "hybrid" in text.lower():
                work_mode = "Hybrid"
            else:
                work_mode = "Remote"
        elif "hybrid" in text.lower():
            work_mode = "Hybrid"
        elif "in-office" in text.lower() or "office" in text.lower():
            work_mode = "In-office"
        else:
            work_mode = None

        # Stipend detection (₹xx,xxx)
        stipend_match = re.search(r'[₹|Rs\.?]\s*([0-9,]+)', text)
        stipend_val = None
        if stipend_match:
            try:
                stipend_val = int(stipend_match.group(1).replace(',', ''))
            except ValueError:
                pass

        # Skills extraction
        skills_match = re.search(r'Skills:\s*(.+)', text, re.IGNORECASE)
        skills = []
        if skills_match:
            skills = [s.strip().rstrip('.') for s in skills_match.group(1).split(',')]

        data = {
            "title": title,
            "company": company,
            "description": text[:200] + "...",
            "location": location,
            "work_mode": work_mode,
            "employment_type": raw_job.employment_type or "Internship",
            "stipend_min": stipend_val,
            "stipend_max": stipend_val,
            "salary_min": None,
            "salary_max": None,
            "skills": skills
        }
        return self._create_job_instance(data, raw_job)

    def _create_job_instance(self, data: Dict[str, Any], raw_job: RawJob) -> Job:
        job_id = str(uuid.uuid4())
        company = data.get("company", raw_job.company)
        title = data.get("title", raw_job.title)
        location = data.get("location", raw_job.location)
        
        dedup_key = Job.generate_dedup_key(company, title, location)

        return Job(
            id=job_id,
            title=title,
            company=company,
            description=data.get("description", raw_job.raw_text[:200]),
            location=location,
            work_mode=data.get("work_mode"),
            employment_type=data.get("employment_type", "Internship"),
            salary_min=data.get("salary_min"),
            salary_max=data.get("salary_max"),
            stipend_min=data.get("stipend_min"),
            stipend_max=data.get("stipend_max"),
            skills=data.get("skills", []),
            source_url=raw_job.source_url,
            dedup_key=dedup_key,
            missing_fields=[],
            research_results=[]
        )
