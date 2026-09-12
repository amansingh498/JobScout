from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field
import hashlib
from backend.schemas.preferences import UserPreferences
from backend.schemas.research import ResearchEvidence

class InterviewRound(BaseModel):
    round_name: str
    focus: str
    difficulty: str  # Easy | Medium | Hard
    tips: str

class InterviewBlueprint(BaseModel):
    rounds: List[InterviewRound] = Field(default_factory=list)
    top_technical_questions: List[str] = Field(default_factory=list)
    hiring_manager_focus: str = ""

class ApplicationPitch(BaseModel):
    cold_email: str = ""
    linkedin_dm: str = ""
    elevator_pitch_30s: str = ""
    skills_to_highlight: List[str] = Field(default_factory=list)
    quick_prep_plan: List[str] = Field(default_factory=list)

class GhostJobAudit(BaseModel):
    legitimacy_score: int = Field(default=90, description="0-100% hiring legitimacy score")
    verdict: str = Field(default="Active & Verified", description="Active & Verified | Recent Refresh | Stale / Evergreen | High Ghost Risk")
    days_active: int = Field(default=7, description="Estimated days since posting was first observed")
    signals: List[Dict[str, Any]] = Field(default_factory=list, description="List of positive & risk indicators")
    recommendation: str = Field(default="Safe to apply", description="Actionable advice for the applicant")

class Job(BaseModel):
    id: str
    title: str
    company: str
    description: str = ""
    location: Optional[str] = None
    work_mode: Optional[str] = None
    employment_type: Optional[str] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    stipend_min: Optional[int] = None
    stipend_max: Optional[int] = None
    skills: List[str] = Field(default_factory=list)
    source_url: str = ""
    dedup_key: str = ""
    missing_fields: List[str] = Field(default_factory=list)
    research_results: List[ResearchEvidence] = Field(default_factory=list)
    match_score: Optional[float] = None
    confidence_score: Optional[float] = None
    score_breakdown: Optional[Dict[str, float]] = None
    ghost_audit: Optional[GhostJobAudit] = None
    interview_blueprint: Optional[InterviewBlueprint] = None
    application_pitch: Optional[ApplicationPitch] = None

    @staticmethod
    def generate_dedup_key(company: str, title: str, location: Optional[str]) -> str:
        raw = f"{company.strip().lower()}|{title.strip().lower()}|{(location or '').strip().lower()}"
        return hashlib.md5(raw.encode('utf-8')).hexdigest()

class SearchRequest(BaseModel):
    search_id: str
    status: str = "pending"  # pending | processing | completed | failed
    preferences: UserPreferences
    created_at: datetime = Field(default_factory=datetime.utcnow)
    jobs: List[Job] = Field(default_factory=list)
    error: Optional[str] = None
    current_step: Optional[str] = None
    total_steps: int = 7
    step_index: int = 0
