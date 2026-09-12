# JobScout 🎯

Autonomous Job & Internship Research Agent that discovers listings matching user preferences, autonomously researches the web to verify missing details (stipends, salaries, locations, work modes), parses candidate resumes with ATS skill alignment, and runs a **Ghost Job & Phantom Posting Legitimacy Audit** before ranking opportunities.

---

## 🚀 Key Distinctive Features

1. **📄 Candidate Resume Upload & ATS Skill-Match Engine**:
   - Accepts candidate resume (PDF, TXT, MD) with auto-skill extraction.
   - Saves resume locally across sessions with 1-click replace/remove.
   - Highlights **Resume Matches** (🟢) vs **Skill Gaps to Prepare** (🟡) with a **% Resume Fit Score** for every job.

2. **🎙️ Candidate Action Center (Interview Blueprint & Pitch Kit)**:
   - **Round-by-Round Breakdown**: Shows verified interview stages (*OA $\to$ Live System Coding $\to$ Culture Fit*), stage difficulties (*Easy, Medium, Hard*), and actionable tips.
   - **Frequently Asked Technical Questions**: Curated top questions asked by that specific company.
   - **1-Click Cold Outreach Kit**: Copyable recruiter cold emails and LinkedIn direct messages tailored to the candidate's skills and the company's tech stack.
   - **48-Hour Prep Checklist**: 3-step prioritized study checklist.

3. **🕵️ Ghost Job & Phantom Posting Auditor**:
   - Detects stale/evergreen talent pool postings and passive listings.
   - Computes a **0–100% Legitimacy Score** based on ATS domain verification, active recruiter headcount momentum, and posting duration.
   - Provides concrete recommendations (*“Safe to apply”*, *“Evergreen talent pool”*, *“High Ghost Risk”*).

4. **🔍 Autonomous Web Evidence Research**:
   - Automatically detects missing critical info (`stipend`, `salary`, `work_mode`, `location`).
   - Researches the web and assigns fixed deterministic confidence ratings (*Confirmed $\ge$ 0.95, High $\ge$ 0.75, Medium $\ge$ 0.45, Low < 0.45*) without hallucinations.

5. **📊 100-Point Deterministic Match Scoring**:
   - Transparent point breakdown (Role 30, Skills 25, Comp 20, Location 15, Mode 10) with synonym mapping.

---

## 🌐 Free Cloud Deployment Guide (5 Minutes)

Deploying JobScout is straightforward with **Render (Backend)** and **Vercel (Frontend)**:

### Step 1: Deploy Backend to Render (Free)

1. Go to [render.com](https://render.com) and create a free account (Sign in with GitHub).
2. Click **New +** $\to$ **Web Service**.
3. Select your GitHub repository: `amansingh498/JobScout`.
4. Configure the settings:
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Under **Environment Variables**, add:
   - `GEMINI_API_KEY`: *(Your Google Gemini API Key)*
   - `TAVILY_API_KEY`: *(Your Tavily Search Key - optional)*
   - `SERPAPI_API_KEY`: *(Your SerpAPI Key - optional)*
6. Click **Create Web Service**.
7. Once deployed, copy your backend URL (e.g., `https://jobscout-backend.onrender.com`).

---

### Step 2: Deploy Frontend to Vercel (Free)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New...** $\to$ **Project**.
3. Select your `JobScout` repository.
4. In the configuration settings:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Click `Edit` and select `frontend`.
5. Under **Environment Variables**, add:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://jobscout-backend.onrender.com/api` *(Your Render backend URL + `/api`)*
6. Click **Deploy**.

Your live full-stack app is now deployed and accessible globally!

---

## 💻 Local Development

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows (or source venv/bin/activate on Linux/Mac)
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

