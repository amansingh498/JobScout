import asyncio
from typing import List
from backend.schemas.job import Job, SearchRequest
from backend.schemas.preferences import UserPreferences
from backend.services.discovery_service import MockSearchProvider
from backend.services.extraction_service import ExtractionService
from backend.services.missing_field_service import MissingFieldService
from backend.services.research_service import ResearchService
from backend.services.matching_service import MatchingService
from backend.services.ranking_service import RankingService
from backend.database.database import async_session
from backend.database.models import SearchRequestModel
from sqlalchemy import select

async def run_job_research_agent(search_id: str, preferences: UserPreferences):
    """
    Main Orchestrator for Job Research Agent:
    1. Update status to 'processing'
    2. Discovery: Find job listings (dedup by key)
    3. Extraction: Extract structured Job data
    4. Missing-Field Detection: Flag missing fields
    5. Research: Web research missing fields & verify
    6. Matching: Deterministic scoring
    7. Ranking: Multi-factor sorting
    8. Store results & mark status as 'completed'
    """
    async def update_status(status: str, step_msg: str, step_idx: int, jobs: List[Job] = None, error: str = None):
        async with async_session() as session:
            stmt = select(SearchRequestModel).where(SearchRequestModel.search_id == search_id)
            result = await session.execute(stmt)
            record = result.scalars().first()
            if record:
                record.status = status
                record.current_step = step_msg
                record.step_index = step_idx
                if jobs is not None:
                    record.jobs = [j.model_dump() for j in jobs]
                if error:
                    record.error = error
                await session.commit()

    try:
        # Step 1: Understanding preferences
        await update_status("processing", "Understanding preferences and building search query...", 1)
        await asyncio.sleep(0.6)

        # Step 2: Discovery
        query = f"{' '.join(preferences.target_roles)} {' '.join(preferences.preferred_locations)} {preferences.employment_type}"
        await update_status("processing", f"Discovering job listings matching: '{query}'...", 2)
        
        discovery_provider = MockSearchProvider()
        raw_jobs = await discovery_provider.search(query)
        await asyncio.sleep(0.8)

        # Step 3: Extraction & Dedup
        await update_status("processing", f"Extracting structured fields from {len(raw_jobs)} listings...", 3)
        extractor = ExtractionService()
        seen_keys = set()
        structured_jobs: List[Job] = []

        for rj in raw_jobs:
            job = await extractor.extract_job_data(rj)
            if job.dedup_key not in seen_keys:
                seen_keys.add(job.dedup_key)
                structured_jobs.append(job)
        await asyncio.sleep(0.8)

        # Step 4: Missing field detection
        await update_status("processing", "Detecting missing critical compensation, location & work mode info...", 4)
        for job in structured_jobs:
            MissingFieldService.detect_missing_fields(job)
        await asyncio.sleep(0.6)

        # Step 5: Research & verification
        await update_status("processing", "Autonomously researching verified web evidence for missing fields...", 5)
        researcher = ResearchService()
        for job in structured_jobs:
            if job.missing_fields:
                await researcher.research_missing_fields(job)
        await asyncio.sleep(1.0)

        # Step 6: Scoring
        await update_status("processing", "Calculating deterministic match scores against your criteria...", 6)
        for job in structured_jobs:
            MatchingService.calculate_match_score(job, preferences)
        await asyncio.sleep(0.5)

        # Step 7: Ranking
        await update_status("processing", "Ranking listings by match score, evidence confidence, and compensation...", 7)
        ranked_jobs = RankingService.rank_jobs(structured_jobs)
        await asyncio.sleep(0.5)

        # Finished
        await update_status("completed", "Analysis complete! Ready to view results.", 7, jobs=ranked_jobs)

    except Exception as e:
        print(f"Error in run_job_research_agent: {e}")
        await update_status("failed", "Failed to process search request", 0, error=str(e))
