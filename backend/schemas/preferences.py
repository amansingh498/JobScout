from typing import List, Optional
from pydantic import BaseModel, Field

class UserPreferences(BaseModel):
    target_roles: List[str] = Field(default_factory=list, description="Target job roles, e.g., ['Software Engineer', 'Frontend Developer']")
    min_salary: Optional[int] = Field(default=None, description="Minimum expected annual salary")
    min_stipend: Optional[int] = Field(default=None, description="Minimum expected monthly stipend")
    preferred_locations: List[str] = Field(default_factory=list, description="Preferred locations, e.g., ['Bangalore', 'Remote']")
    remote_allowed: bool = Field(default=True, description="Whether remote positions are acceptable")
    skills: List[str] = Field(default_factory=list, description="Key skills, e.g., ['Python', 'React']")
    employment_type: str = Field(default="Internship", description="Internship | Full-time | Contract")
    resume_text: Optional[str] = Field(default=None, description="Extracted plain text from candidate's resume")
    resume_skills: List[str] = Field(default_factory=list, description="Extracted skills list from candidate's resume")
    resume_filename: Optional[str] = Field(default=None, description="Uploaded resume file name")

