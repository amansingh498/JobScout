from typing import Optional
from pydantic import BaseModel, Field

# Fixed confidence lookup table as per Spec §8
CONFIDENCE_WEIGHTS = {
    "official_site": 1.00,
    "careers_page": 0.95,
    "placement_page": 0.85,
    "job_board": 0.75,
    "employee_report": 0.60,
    "forum": 0.45,
    "unknown": 0.20
}

def get_confidence_for_source(source_type: str) -> float:
    return CONFIDENCE_WEIGHTS.get(source_type.lower(), 0.20)

def get_confidence_tier(confidence: float) -> str:
    if confidence >= 0.95:
        return "Confirmed"
    elif confidence >= 0.75:
        return "High"
    elif confidence >= 0.45:
        return "Medium"
    return "Low"

class ResearchEvidence(BaseModel):
    field: str = Field(..., description="The researched field name (e.g., stipend, salary, work_mode, location)")
    value: str = Field(..., description="The verified value found")
    source_url: str = Field(..., description="URL of the source where evidence was found")
    source_name: str = Field(..., description="Readable source name")
    source_type: str = Field(..., description="official_site | careers_page | placement_page | job_board | employee_report | forum | unknown")
    confidence: float = Field(..., description="Deterministic weight for source_type (never LLM assigned)")
    confidence_tier: Optional[str] = Field(default=None)

    def model_post_init(self, __context):
        if not self.confidence:
            self.confidence = get_confidence_for_source(self.source_type)
        if not self.confidence_tier:
            self.confidence_tier = get_confidence_tier(self.confidence)
