from typing import List
from backend.schemas.job import Job

CRITICAL_FIELDS = ["stipend", "salary", "location", "work_mode"]

class MissingFieldService:
    @staticmethod
    def detect_missing_fields(job: Job) -> List[str]:
        missing = []
        
        # Check stipend and salary
        is_internship = (job.employment_type or "").lower() == "internship"
        
        if is_internship:
            if job.stipend_min is None and job.stipend_max is None:
                missing.append("stipend")
        else:
            if job.salary_min is None and job.salary_max is None:
                missing.append("salary")

        # Check location
        if not job.location or job.location.strip().lower() in ["unknown", "not specified"]:
            missing.append("location")

        # Check work mode
        if not job.work_mode or job.work_mode.strip().lower() in ["unknown", "not specified"]:
            missing.append("work_mode")

        job.missing_fields = missing
        return missing
