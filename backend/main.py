import os
import sys
from pathlib import Path

# Add project root and backend dir to sys.path so it works whether run from root or backend/
ROOT_DIR = Path(__file__).resolve().parent.parent
BACKEND_DIR = Path(__file__).resolve().parent
for p in [str(ROOT_DIR), str(BACKEND_DIR)]:
    if p not in sys.path:
        sys.path.insert(0, p)

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from backend.database.database import init_db
from backend.api.search import router as search_router
from backend.api.resume import router as resume_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize Database
    await init_db()
    yield
    # Shutdown

app = FastAPI(
    title="JobScout Autonomous Research Agent API",
    description="Backend API for discovering, extracting, researching missing info, scoring and ranking jobs.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for all environments (Vercel, Render, Localhost, Preview domains)
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers under /api and also root aliases to handle all client URL configs
app.include_router(search_router, prefix="/api")
app.include_router(search_router)
app.include_router(resume_router, prefix="/api")
app.include_router(resume_router)

@app.get("/")
async def root():
    return {
        "service": "JobScout Autonomous Research Agent Backend",
        "docs": "/docs",
        "health": "/api/health",
        "endpoints": {
            "create_search": "POST /api/search",
            "get_search": "GET /api/search/{search_id}"
        }
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "ok",
        "service": "JobScout Backend",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
