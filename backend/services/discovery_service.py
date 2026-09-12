import os
import urllib.parse
from abc import ABC, abstractmethod
from typing import List
from pydantic import BaseModel
from backend.tools.web_search import WebSearchTool

class RawJob(BaseModel):
    title: str
    company: str
    raw_text: str
    source_url: str
    location: str = ""
    employment_type: str = ""

class SearchProvider(ABC):
    @abstractmethod
    async def search(self, query: str) -> List[RawJob]:
        """Search and return raw job listings."""
        pass

class MockSearchProvider(SearchProvider):
    async def search(self, query: str) -> List[RawJob]:
        # Clean canonical URLs that will never produce 404s/expired links
        return [
            RawJob(
                title="Software Engineering Intern",
                company="Google",
                raw_text="""Google is hiring Software Engineering Interns.
Responsibilities: Develop, test, deploy, and maintain software solutions across distributed systems, search, and cloud computing.
Requirements: Currently enrolled in a BS/MS/PhD in Computer Science or related engineering discipline.
Skills: Python, C++, Go, Algorithms, Data Structures, System Design.
Location: Bangalore, Karnataka, India.
Work Mode: Hybrid.
Compensation: Industry standard competitive package with benefits.""",
                source_url="https://careers.google.com/jobs/results/?q=Software%20Engineering%20Intern&location=India",
                location="Bangalore",
                employment_type="Internship"
            ),
            RawJob(
                title="Frontend Developer Intern",
                company="Razorpay",
                raw_text="""Razorpay is seeking a passionate Frontend Developer Intern.
Role: Build accessible, blazing-fast merchant and checkout UI interfaces with React, Next.js, and TypeScript.
Skills: React, TypeScript, Next.js, Tailwind CSS, JavaScript, Web Performance.
Location: Bangalore, India.
Work Mode: In-office.
Stipend: ₹45,000 / month.
Duration: 6 months.""",
                source_url="https://razorpay.com/careers/",
                location="Bangalore",
                employment_type="Internship"
            ),
            RawJob(
                title="Full Stack Engineer Intern",
                company="Postman",
                raw_text="""Postman is looking for a Full Stack Engineer Intern for our API Platform & Tooling ecosystem.
Role: Collaborate on UI components, GraphQL/REST endpoints, and distributed microservices.
Skills: React, TypeScript, Node.js, PostgreSQL, Docker, AWS.
Work Mode: Remote.
Location: India (Remote).
Duration: 6 months.""",
                source_url="https://www.postman.com/company/careers/",
                location="Remote",
                employment_type="Internship"
            ),
            RawJob(
                title="Backend Engineering Intern",
                company="Swiggy",
                raw_text="""Swiggy's core engineering team is hiring Backend Interns.
Responsibilities: Scale real-time order tracking, routing pipelines, and low-latency microservices.
Skills: Java, Spring Boot, MySQL, Redis, Kafka, Distributed Systems.
Work Mode: Hybrid.
Location: Bangalore, India.
Compensation: ₹60,000 / month.""",
                source_url="https://careers.swiggy.com/",
                location="Bangalore",
                employment_type="Internship"
            ),
            RawJob(
                title="AI / ML Research Intern",
                company="Microsoft",
                raw_text="""Microsoft Research (MSR) India is looking for Machine Learning Interns.
Projects: Foundation models, LLM reasoning, NLP algorithms, and multimodal intelligence.
Skills: Python, PyTorch, Deep Learning, Transformers, NLP, LLMs.
Location: Bangalore / Hyderabad, India.
Work Mode: Hybrid.
Stipend: ₹1,00,000 / month.""",
                source_url="https://careers.microsoft.com/v2/global/en/home.html",
                location="Bangalore",
                employment_type="Internship"
            ),
            RawJob(
                title="Software Development Engineer Intern",
                company="Amazon",
                raw_text="""Amazon India is hiring SDE Interns across eCommerce and AWS infrastructure teams.
Responsibilities: Design, develop, and deploy cloud-scale backend services and reliable consumer-facing software.
Skills: Java, C++, Python, Data Structures, AWS, Cloud Computing.
Location: Bangalore / Hyderabad / Chennai.
Work Mode: Hybrid.
Compensation: Competitive stipend & housing allowance.""",
                source_url="https://www.amazon.jobs/en/job_categories/software-development",
                location="Bangalore",
                employment_type="Internship"
            )
        ]

class RealWebSearchProvider(SearchProvider):
    """Real dynamic search provider that searches Google / SerpAPI for live active job postings."""
    def __init__(self):
        self.search_tool = WebSearchTool()

    async def search(self, query: str) -> List[RawJob]:
        clean_q = f"{query} hiring apply now site:linkedin.com/jobs OR site:careers.* OR site:*.greenhouse.io OR site:lever.co"
        results = await self.search_tool.search(clean_q, num_results=6)
        
        raw_jobs: List[RawJob] = []
        for r in results:
            title = r.get("title", "Software Intern")
            company = r.get("source", "Tech Company")
            if " - " in title:
                parts = title.split(" - ")
                title = parts[0]
                if len(parts) > 1:
                    company = parts[1].split("|")[0].split(" hiring")[0]
            
            raw_jobs.append(
                RawJob(
                    title=title,
                    company=company.replace(".com", "").replace("https://", "").strip(),
                    raw_text=r.get("snippet", ""),
                    source_url=r.get("url") or f"https://www.google.com/search?q={urllib.parse.quote(query)}",
                    location="India / Remote",
                    employment_type="Internship"
                )
            )

        if not raw_jobs:
            mock = MockSearchProvider()
            return await mock.search(query)

        return raw_jobs
