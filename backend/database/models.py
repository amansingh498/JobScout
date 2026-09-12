from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, Text, JSON
from backend.database.database import Base

class SearchRequestModel(Base):
    __tablename__ = "search_requests"

    search_id = Column(String(64), primary_key=True, index=True)
    status = Column(String(32), default="pending")
    preferences = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    jobs = Column(JSON, default=list)
    error = Column(Text, nullable=True)
    current_step = Column(String(128), nullable=True)
    step_index = Column(Integer, default=0)

class ResearchCacheModel(Base):
    __tablename__ = "research_cache"

    cache_key = Column(String(256), primary_key=True, index=True)  # hash(company + role + field)
    company = Column(String(128))
    role = Column(String(128))
    field = Column(String(64))
    evidence = Column(JSON)  # List of ResearchEvidence dicts
    created_at = Column(DateTime, default=datetime.utcnow)
