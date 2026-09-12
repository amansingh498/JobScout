# JobScout 🎯

Autonomous Job & Internship Research Agent that discovers listings matching user preferences, autonomously researches the web to verify missing details (stipends, salaries, locations, work modes), and runs a **Ghost Job & Phantom Posting Legitimacy Audit** before ranking opportunities.

## 🚀 Key Distinctive Features

1. **🎙️ Candidate Action Center (Interview Blueprint & Pitch Kit)**:
   - **Round-by-Round Breakdown**: Shows verified interview stages (*OA $\to$ Live System Coding $\to$ Culture Fit*), stage difficulties (*Easy, Medium, Hard*), and actionable tips.
   - **Frequently Asked Technical Questions**: Curated top questions asked by that specific company.
   - **1-Click Cold Outreach Kit**: Copyable recruiter cold emails and LinkedIn direct messages tailored to the candidate's skills and the company's tech stack.
   - **48-Hour Prep Checklist**: 3-step prioritized study checklist.

2. **🕵️ Ghost Job & Phantom Posting Auditor**:
   - Detects stale/evergreen talent pool postings and passive listings.
   - Computes a **0–100% Legitimacy Score** based on ATS domain verification, active recruiter headcount momentum, and posting duration.
   - Provides concrete recommendations (*“Safe to apply”*, *“Evergreen talent pool”*, *“High Ghost Risk”*).

3. **🔍 Autonomous Web Evidence Research**:
   - Automatically detects missing critical info (`stipend`, `salary`, `work_mode`, `location`).
   - Researches the web and assigns fixed deterministic confidence ratings (*Confirmed $\ge$ 0.95, High $\ge$ 0.75, Medium $\ge$ 0.45, Low < 0.45*) without hallucinations.

4. **📊 100-Point Deterministic Match Scoring**:
   - Transparent point breakdown (Role 30, Skills 25, Comp 20, Location 15, Mode 10) with synonym mapping.

## Pipeline
`Preferences → Discovery → Extraction → Missing-Field Detection → Web Research → Ghost Job Audit → Deterministic Scoring → Ranking`

## Stack
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Lucide icons
- **Backend**: FastAPI, Pydantic v2, SQLAlchemy (async SQLite)
- **AI & Tools**: Google Gemini, Tavily / SerpAPI, BeautifulSoup4, httpx
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
Open **[http://localhost:3000](http://localhost:3000)** in your browser.
