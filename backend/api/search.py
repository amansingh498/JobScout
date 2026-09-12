import uuid
from fastapi import APIRouter, BackgroundTasks, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.schemas.preferences import UserPreferences
from backend.schemas.job import SearchRequest, Job
from backend.database.database import get_db
from backend.database.models import SearchRequestModel
from backend.services.agent_orchestrator import run_job_research_agent

router = APIRouter(prefix="/search", tags=["search"])

@router.post("", response_model=dict)
async def create_search(
    preferences: UserPreferences,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    search_id = str(uuid.uuid4())
    search_record = SearchRequestModel(
        search_id=search_id,
        status="pending",
        preferences=preferences.model_dump(),
        jobs=[],
        current_step="Request queued for autonomous research...",
        step_index=0
    )
    db.add(search_record)
    await db.commit()

    # Launch background agent pipeline
    background_tasks.add_task(run_job_research_agent, search_id, preferences)

    return {
        "search_id": search_id,
        "status": "processing",
        "message": "Job research agent dispatched"
    }

@router.get("/{search_id}", response_model=SearchRequest)
async def get_search_status(search_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(SearchRequestModel).where(SearchRequestModel.search_id == search_id)
    result = await db.execute(stmt)
    record = result.scalars().first()

    if not record:
        raise HTTPException(status_code=404, detail="Search request not found")

    return SearchRequest(
        search_id=record.search_id,
        status=record.status,
        preferences=UserPreferences(**record.preferences),
        created_at=record.created_at,
        jobs=[Job(**j) for j in record.jobs],
        error=record.error,
        current_step=record.current_step,
        step_index=record.step_index
    )
