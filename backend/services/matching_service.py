from typing import Dict, Tuple
from backend.schemas.job import Job
from backend.schemas.preferences import UserPreferences

ROLE_SYNONYMS = {
    "software engineer": ["software engineering", "swe", "sde", "developer", "backend engineer", "frontend engineer", "full stack"],
    "swe": ["software engineer", "software engineering", "sde", "developer"],
    "frontend": ["ui engineer", "react developer", "frontend developer", "web developer"],
    "backend": ["backend developer", "api engineer", "server engineer"],
    "full stack": ["fullstack", "full-stack", "software engineer"],
    "ml": ["machine learning", "ai", "data scientist", "deep learning"],
}

class MatchingService:
    @staticmethod
    def calculate_match_score(job: Job, prefs: UserPreferences) -> Tuple[float, Dict[str, float]]:
        """
        Deterministic match scoring per Spec §9:
        - Role match:       30
        - Skills match:     25
        - Compensation:     20
        - Location:         15
        - Work mode:        10
        Total max = 100
        """
        score_breakdown: Dict[str, float] = {
            "role_match": 0.0,
            "skills_match": 0.0,
            "compensation": 0.0,
            "location": 0.0,
            "work_mode": 0.0
        }

        # 1. Role Match (30 pts)
        job_title = job.title.lower()
        role_matched = False
        if not prefs.target_roles:
            score_breakdown["role_match"] = 30.0
        else:
            for target in prefs.target_roles:
                target_clean = target.lower().strip()
                if target_clean in job_title:
                    role_matched = True
                    break
                # Check synonym mappings
                synonyms = ROLE_SYNONYMS.get(target_clean, [])
                if any(syn in job_title for syn in synonyms):
                    role_matched = True
                    break
            score_breakdown["role_match"] = 30.0 if role_matched else 10.0

        # 2. Skills Match (25 pts)
        if not prefs.skills:
            score_breakdown["skills_match"] = 25.0
        else:
            job_skills_lower = [s.lower().strip() for s in job.skills]
            matched_skills = 0
            for skill in prefs.skills:
                skill_clean = skill.lower().strip()
                if any(skill_clean in js or js in skill_clean for js in job_skills_lower):
                    matched_skills += 1
            ratio = matched_skills / max(len(prefs.skills), 1)
            score_breakdown["skills_match"] = round(ratio * 25.0, 1)

        # 3. Compensation Match (20 pts)
        comp_val = job.stipend_min or job.stipend_max or job.salary_min
        req_comp = prefs.min_stipend or prefs.min_salary
        if req_comp is None or req_comp == 0:
            score_breakdown["compensation"] = 20.0
        elif comp_val is not None:
            if comp_val >= req_comp:
                score_breakdown["compensation"] = 20.0
            elif comp_val >= req_comp * 0.8:
                score_breakdown["compensation"] = 14.0
            else:
                score_breakdown["compensation"] = 5.0
        else:
            score_breakdown["compensation"] = 10.0 # Unspecified gets neutral score

        # 4. Location Match (15 pts)
        job_loc = (job.location or "").lower()
        if not prefs.preferred_locations:
            score_breakdown["location"] = 15.0
        else:
            loc_matched = False
            for pref_loc in prefs.preferred_locations:
                pl = pref_loc.lower().strip()
                if pl in job_loc or job_loc in pl or (pl == "remote" and "remote" in (job.work_mode or "").lower()):
                    loc_matched = True
                    break
            score_breakdown["location"] = 15.0 if loc_matched else 0.0

        # 5. Work Mode Match (10 pts)
        job_mode = (job.work_mode or "").lower()
        if prefs.remote_allowed and "remote" in job_mode:
            score_breakdown["work_mode"] = 10.0
        elif "hybrid" in job_mode or "in-office" in job_mode:
            score_breakdown["work_mode"] = 8.0
        else:
            score_breakdown["work_mode"] = 5.0

        total_score = sum(score_breakdown.values())
        job.match_score = round(total_score, 1)
        job.score_breakdown = score_breakdown
        return job.match_score, score_breakdown
