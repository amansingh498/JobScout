from typing import List
from backend.schemas.job import Job

class RankingService:
    @staticmethod
    def rank_jobs(jobs: List[Job]) -> List[Job]:
        """
        Rank jobs deterministically per Spec §9:
        1. match_score desc
        2. confidence_score desc
        3. compensation desc
        """
        for job in jobs:
            # Calculate average research confidence
            if job.research_results:
                avg_conf = sum(e.confidence for e in job.research_results) / len(job.research_results)
                job.confidence_score = round(avg_conf, 2)
            else:
                job.confidence_score = 1.0  # Job had all info directly without research

        def sort_key(j: Job):
            match_s = j.match_score if j.match_score is not None else 0.0
            conf_s = j.confidence_score if j.confidence_score is not None else 0.0
            comp_s = j.stipend_min or j.stipend_max or j.salary_min or 0
            return (match_s, conf_s, comp_s)

        return sorted(jobs, key=sort_key, reverse=True)
