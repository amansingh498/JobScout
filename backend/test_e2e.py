import asyncio
import httpx
from backend.schemas.preferences import UserPreferences

async def test_end_to_end():
    print("Testing JobScout Backend & Agent Pipeline...")
    
    # 1. Health check
    async with httpx.AsyncClient(base_url="http://127.0.0.1:8000") as client:
        health_resp = await client.get("/api/health")
        print(f"1. Health Check Response: {health_resp.status_code} -> {health_resp.json()}")
        assert health_resp.status_code == 200

        # 2. Submit Search Request
        prefs = {
            "target_roles": ["Software Engineering Intern", "SWE"],
            "min_stipend": 50000,
            "preferred_locations": ["Bangalore", "Remote"],
            "remote_allowed": True,
            "skills": ["Python", "React", "TypeScript"],
            "employment_type": "Internship"
        }
        search_resp = await client.post("/api/search", json=prefs)
        print(f"2. Search Dispatched Response: {search_resp.status_code} -> {search_resp.json()}")
        assert search_resp.status_code == 200
        search_id = search_resp.json()["search_id"]

        # 3. Poll until completed
        print(f"3. Polling search status for {search_id}...")
        for _ in range(25):
            await asyncio.sleep(1.0)
            status_resp = await client.get(f"/api/search/{search_id}")
            data = status_resp.json()
            status = data.get("status")
            step = data.get("current_step")
            print(f"   Status: [{status}] - Step {data.get('step_index')}/7: {step}")
            if status in ["completed", "failed"]:
                break

        assert status == "completed", f"Search did not complete: {data.get('error')}"
        jobs = data.get("jobs", [])
        print(f"\n4. Pipeline Completed Successfully! Found {len(jobs)} ranked jobs:")
        for idx, job in enumerate(jobs):
            print(f"   #{idx+1}: {job['title']} @ {job['company']}")
            print(f"       Match Score: {job['match_score']}% | Confidence: {job['confidence_score']}")
            print(f"       Stipend: Rs. {job['stipend_min'] or 'N/A'}/mo | Location: {job['location']} ({job['work_mode']})")
            print(f"       Missing fields researched: {job['missing_fields']}")
            print(f"       Research evidence items: {len(job['research_results'])}")
            for ev in job['research_results']:
                val = str(ev['value']).replace('\u20b9', 'Rs. ')
                print(f"         - [{ev['field']}]: {val} (Source: {ev['source_type']}, Conf: {ev['confidence']})")

if __name__ == "__main__":
    asyncio.run(test_end_to_end())
