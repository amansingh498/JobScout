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
        # Comprehensive catalog of diverse listings
        job_catalog = [
            # Software / Full Stack
            {
                "roles": ["software", "swe", "sde", "full stack", "fullstack", "developer", "backend", "intern"],
                "title": "Software Engineering Intern",
                "company": "Google",
                "skills": ["Python", "C++", "Go", "Algorithms", "Data Structures", "Distributed Systems"],
                "location": "Bangalore",
                "work_mode": "Hybrid",
                "raw_text": "Google is hiring Software Engineering Interns for 2026. Develop distributed systems and cloud services. Skills: Python, C++, Go, Algorithms.",
                "source_url": "https://careers.google.com/jobs/results/?q=Software%20Engineering%20Intern&location=India",
                "employment_type": "Internship"
            },
            {
                "roles": ["full stack", "fullstack", "react", "node", "web", "developer", "intern"],
                "title": "Full Stack Engineer Intern",
                "company": "Postman",
                "skills": ["React", "TypeScript", "Node.js", "PostgreSQL", "Docker", "AWS"],
                "location": "Remote",
                "work_mode": "Remote",
                "raw_text": "Postman is hiring Full Stack Interns. Build API tooling, UI components and GraphQL microservices. Skills: React, TypeScript, Node.js, PostgreSQL.",
                "source_url": "https://www.postman.com/company/careers/",
                "employment_type": "Internship"
            },
            # Frontend / UI
            {
                "roles": ["frontend", "ui", "react", "next", "web", "javascript", "intern"],
                "title": "Frontend Developer Intern",
                "company": "Razorpay",
                "skills": ["React", "TypeScript", "Next.js", "Tailwind CSS", "JavaScript"],
                "location": "Bangalore",
                "work_mode": "In-office",
                "raw_text": "Razorpay is hiring Frontend Interns to build checkout UIs and dashboard components. Skills: React, TypeScript, Tailwind CSS, Next.js. Stipend: ₹45,000 / month.",
                "source_url": "https://razorpay.com/careers/",
                "employment_type": "Internship"
            },
            {
                "roles": ["frontend", "ui", "web", "vue", "angular", "react", "designer"],
                "title": "UI / Frontend Engineering Intern",
                "company": "Zepto",
                "skills": ["React", "JavaScript", "Redux", "Tailwind CSS", "CSS3"],
                "location": "Mumbai",
                "work_mode": "In-office",
                "raw_text": "Zepto is hiring UI Engineering Interns for consumer apps. Fast-paced delivery infrastructure. Skills: React, Redux, Tailwind CSS. Stipend: ₹40,000 / mo.",
                "source_url": "https://www.zeptonow.com/careers",
                "employment_type": "Internship"
            },
            # AI / Machine Learning / Data Science
            {
                "roles": ["ai", "ml", "machine learning", "data science", "nlp", "deep learning", "llm", "research", "intern"],
                "title": "AI / ML Research Intern",
                "company": "Microsoft Research",
                "skills": ["Python", "PyTorch", "Deep Learning", "Transformers", "NLP", "LLMs"],
                "location": "Bangalore",
                "work_mode": "Hybrid",
                "raw_text": "Microsoft Research (MSR) India is seeking Machine Learning Interns. Work on multimodal models and reasoning LLMs. Skills: Python, PyTorch, Deep Learning. Stipend: ₹1,00,000 / month.",
                "source_url": "https://careers.microsoft.com/v2/global/en/home.html",
                "employment_type": "Internship"
            },
            {
                "roles": ["data science", "data analyst", "analytics", "data engineer", "python", "sql", "intern"],
                "title": "Data Science & Analytics Intern",
                "company": "Flipkart",
                "skills": ["Python", "SQL", "Pandas", "Scikit-Learn", "Tableau", "Machine Learning"],
                "location": "Bangalore",
                "work_mode": "Hybrid",
                "raw_text": "Flipkart is hiring Data Science Interns to optimize pricing models and logistics predictions. Skills: Python, SQL, Machine Learning. Stipend: ₹65,000 / month.",
                "source_url": "https://www.flipkartcareers.com/",
                "employment_type": "Internship"
            },
            # Backend / Distributed Systems / DevOps
            {
                "roles": ["backend", "java", "spring", "golang", "api", "systems", "intern"],
                "title": "Backend Engineering Intern",
                "company": "Swiggy",
                "skills": ["Java", "Spring Boot", "MySQL", "Redis", "Kafka", "Microservices"],
                "location": "Bangalore",
                "work_mode": "Hybrid",
                "raw_text": "Swiggy is looking for Backend Interns. Scale low-latency microservices for order delivery. Skills: Java, Spring Boot, MySQL, Redis. Compensation: ₹60,000 / month.",
                "source_url": "https://careers.swiggy.com/",
                "employment_type": "Internship"
            },
            {
                "roles": ["devops", "cloud", "aws", "kubernetes", "docker", "sre", "infrastructure", "intern"],
                "title": "Cloud & DevOps Engineer Intern",
                "company": "Atlassian",
                "skills": ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD", "Linux", "Python"],
                "location": "Remote",
                "work_mode": "Remote",
                "raw_text": "Atlassian is seeking Cloud Platform & DevOps Interns. Manage global Kubernetes clusters and CI/CD automation pipelines. Skills: AWS, Docker, Kubernetes, Terraform.",
                "source_url": "https://www.atlassian.com/company/careers",
                "employment_type": "Internship"
            },
            {
                "roles": ["cybersecurity", "security", "infosec", "penetration testing", "network", "intern"],
                "title": "Information Security Intern",
                "company": "Cisco",
                "skills": ["Networking", "Python", "Linux", "Penetration Testing", "Security Operations", "Wireshark"],
                "location": "Bangalore",
                "work_mode": "Hybrid",
                "raw_text": "Cisco is looking for InfoSec Interns to analyze threat vectors and vulnerability scans. Skills: Networking, Python, Linux, Cyber Security. Stipend: ₹55,000 / mo.",
                "source_url": "https://jobs.cisco.com/",
                "employment_type": "Internship"
            },
            # Mobile / App Developer
            {
                "roles": ["mobile", "android", "ios", "flutter", "react native", "swift", "kotlin", "intern"],
                "title": "Mobile App Developer Intern (Flutter / React Native)",
                "company": "CRED",
                "skills": ["Flutter", "React Native", "Kotlin", "Swift", "Dart", "Mobile UI"],
                "location": "Bangalore",
                "work_mode": "In-office",
                "raw_text": "CRED is hiring Mobile Interns to build slick 60fps member experiences. Skills: Flutter, React Native, Mobile UI. Stipend: ₹75,000 / month.",
                "source_url": "https://cred.club/careers",
                "employment_type": "Internship"
            },
            # Generic SDE
            {
                "roles": ["software", "sde", "developer", "aws", "cloud", "intern"],
                "title": "Software Development Engineer Intern",
                "company": "Amazon",
                "skills": ["Java", "C++", "Python", "Data Structures", "AWS", "Cloud"],
                "location": "Hyderabad",
                "work_mode": "Hybrid",
                "raw_text": "Amazon is hiring SDE Interns for AWS & Retail systems. Skills: Java, C++, Python, Data Structures, AWS.",
                "source_url": "https://www.amazon.jobs/en/job_categories/software-development",
                "employment_type": "Internship"
            }
        ]

        q_lower = query.lower()
        matched = []

        # 1. Score each job in catalog by keyword relevance to query
        scored_jobs = []
        words = [w for w in q_lower.split() if w not in ["intern", "internship", "job", "hiring", "apply", "now"]]

        for item in job_catalog:
            score = 0
            # Role matches
            for r in item["roles"]:
                if r in q_lower:
                    score += 5
            # Skill matches
            for s in item["skills"]:
                if s.lower() in q_lower:
                    score += 4
            # Location matches
            if item["location"].lower() in q_lower:
                score += 3
            if item["work_mode"] == "Remote" and "remote" in q_lower:
                score += 3
            # Individual query word in title or company
            for w in words:
                if w in item["title"].lower():
                    score += 4
                if w in item["company"].lower():
                    score += 3

            if score > 0:
                scored_jobs.append((score, item))

        # Sort by relevance score descending
        scored_jobs.sort(key=lambda x: x[0], reverse=True)

        for _, item in scored_jobs[:6]:
            matched.append(
                RawJob(
                    title=item["title"],
                    company=item["company"],
                    raw_text=item["raw_text"],
                    source_url=item["source_url"],
                    location=item["location"],
                    employment_type=item["employment_type"]
                )
            )

        # Fallback if query was completely unmatched
        if not matched:
            for item in job_catalog[:5]:
                matched.append(
                    RawJob(
                        title=item["title"],
                        company=item["company"],
                        raw_text=item["raw_text"],
                        source_url=item["source_url"],
                        location=item["location"],
                        employment_type=item["employment_type"]
                    )
                )

        return matched[:6]

class RealWebSearchProvider(SearchProvider):
    """Real dynamic search provider that searches Google / Tavily for live active job postings."""
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
            
            # Avoid the simulated fallback loop
            if "verified career reports" in title.lower():
                continue

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
