from abc import ABC, abstractmethod
from typing import List
from pydantic import BaseModel

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
        return [
            RawJob(
                title="Software Engineering Intern",
                company="Google",
                raw_text="""Google is looking for Software Engineering Interns for Summer 2026.
Responsibilities: Develop and test software solutions. Collaborate with senior engineers on distributed systems and cloud infrastructure.
Requirements: Currently enrolled in a BS/MS/PhD in Computer Science or related technical field.
Skills: Python, C++, Go, Algorithms, Data Structures, Distributed Systems.
Location: Bangalore, Karnataka, India.
Work Mode: Hybrid (3 days in office).
Compensation: Competitive industry-standard internship package.""",
                source_url="https://careers.google.com/jobs/results/swe-intern-bangalore",
                location="Bangalore",
                employment_type="Internship"
            ),
            RawJob(
                title="Frontend Developer Intern",
                company="Razorpay",
                raw_text="""Razorpay is hiring a Frontend Developer Intern.
About the Role: Build high-performance, accessible, and delightful merchant-facing interfaces using React and TypeScript.
Key Skills: React, TypeScript, Next.js, Tailwind CSS, REST APIs, Git.
Location: Bangalore, India.
Work Mode: In-office.
Stipend: ₹45,000 / month.
Duration: 6 months.""",
                source_url="https://razorpay.com/careers/frontend-intern",
                location="Bangalore",
                employment_type="Internship"
            ),
            RawJob(
                title="Full Stack Engineer Intern",
                company="Postman",
                raw_text="""Postman is looking for an enthusiastic Full Stack Engineer Intern to join our API platform team.
What you'll do: Design and implement frontend UI components and backend REST microservices.
Skills: Node.js, React, TypeScript, PostgreSQL, Docker, AWS.
Work Mode: Remote.
Location: India (Remote).
Duration: 6 months.
Salary/Stipend: Details provided upon shortlisting.""",
                source_url="https://www.postman.com/careers/full-stack-intern-2026",
                location="Remote",
                employment_type="Internship"
            ),
            RawJob(
                title="Backend Engineering Intern",
                company="Swiggy",
                raw_text="""Swiggy's logistics & food delivery team is looking for Backend Interns.
Responsibilities: Build low-latency APIs and manage real-time tracking pipelines.
Skills: Java, Spring Boot, MySQL, Redis, Kafka, Microservices.
Work Mode: Hybrid.
Location: Bangalore.
Compensation: ₹60,000 / month.""",
                source_url="https://careers.swiggy.com/backend-intern",
                location="Bangalore",
                employment_type="Internship"
            ),
            RawJob(
                title="AI / ML Research Intern",
                company="Microsoft",
                raw_text="""Microsoft Research India is seeking ML Interns.
Work on state-of-the-art foundation models, agentic workflows, and NLP reasoning pipelines.
Skills: Python, PyTorch, LLMs, NLP, Transformers, Deep Learning.
Location: Bangalore / Hyderabad.
Work Mode: Hybrid.
Stipend: ₹1,00,000 / month.""",
                source_url="https://careers.microsoft.com/ml-research-intern",
                location="Bangalore",
                employment_type="Internship"
            )
        ]
