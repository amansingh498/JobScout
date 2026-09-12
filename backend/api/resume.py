from fastapi import APIRouter, UploadFile, File, HTTPException
from backend.services.resume_service import parse_resume_bytes

router = APIRouter()

@router.post("/resume/parse")
@router.post("/resume/parse/")
@router.post("/parse")
@router.post("/parse/")
async def parse_resume(file: UploadFile = File(...)):
    """
    Accepts an uploaded resume file (PDF, TXT, MD, etc.) and parses out
    candidate skills, experience keywords, and suggested target roles.
    """
    try:
        content = await file.read()
        if not content:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")
        
        result = parse_resume_bytes(content, file.filename or "resume.pdf")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse resume: {str(e)}")
