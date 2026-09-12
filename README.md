# JobScout 🎯

Autonomous Job & Internship Research Agent that discovers listings matching user preferences and autonomously researches the web to verify missing details (stipends, salaries, locations, work modes) before ranking.

## Pipeline
`Preferences → Discovery → Extraction → Missing-Field Detection → Research → Verification → Scoring → Ranking`

## Stack
- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, Lucide icons
- **Backend**: FastAPI, Pydantic, SQLAlchemy (async SQLite)
- **AI**: Google Gemini (structured JSON extraction & research synthesis)
- **Scoring**: Deterministic Python rules engine

## Getting Started

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
