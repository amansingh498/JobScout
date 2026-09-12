import hashlib
from backend.schemas.job import Job, InterviewBlueprint, InterviewRound, ApplicationPitch
from backend.schemas.preferences import UserPreferences

# Company-tailored interview intelligence repository
INTERVIEW_DATABASE = {
    "google": {
        "rounds": [
            InterviewRound(round_name="Round 1: Online Assessment", focus="2 LeetCode Medium/Hard algorithmic questions (Graphs, DP, Trees)", difficulty="Hard", tips="Focus on edge cases and optimal O(N) time complexity."),
            InterviewRound(round_name="Round 2: Data Structures & Live Coding", focus="Interactive problem solving, complexity analysis & clean code", difficulty="Hard", tips="Think out loud before coding; write clean production-style code."),
            InterviewRound(round_name="Round 3: Googliness & Leadership", focus="Collaboration, handling ambiguity, ethics & engineering passion", difficulty="Medium", tips="Use the STAR method with concrete personal project examples.")
        ],
        "questions": [
            "Implement an LRU Cache with O(1) get and put operations.",
            "Given a stream of words, design an autocomplete trie system.",
            "Explain how you would handle race conditions in distributed search indexing."
        ],
        "focus": "Strong foundational computer science fundamentals, scalability and clean maintainable code."
    },
    "microsoft": {
        "rounds": [
            InterviewRound(round_name="Round 1: Codility / OA Screening", focus="Arrays, Strings, Dynamic Programming & Bit Manipulation", difficulty="Medium", tips="Test edge cases thoroughly (null pointers, empty arrays)."),
            InterviewRound(round_name="Round 2: Technical Architecture & Problem Solving", focus="Low-level design (LLD), Object-Oriented Design & Algorithms", difficulty="Medium", tips="Clarify requirements and discuss trade-offs before implementation."),
            InterviewRound(round_name="Round 3: Hiring Manager & Fit", focus="Past projects, culture fit, resilience and learning velocity", difficulty="Easy", tips="Demonstrate growth mindset and customer empathy.")
        ],
        "questions": [
            "Design a thread-safe message queue in Python/C++.",
            "Find the lowest common ancestor in a Binary Tree with parent pointers.",
            "How do foundation models handle hallucination mitigation in RAG systems?"
        ],
        "focus": "Product empathy, robust object-oriented system architecture and collaborative growth mindset."
    },
    "razorpay": {
        "rounds": [
            InterviewRound(round_name="Round 1: Machine Coding / UI Round", focus="Build a live interactive component in React/Next.js with real-time state management", difficulty="Medium", tips="Write clean modular components with TypeScript and handle loading/error states."),
            InterviewRound(round_name="Round 2: Core JavaScript & System Design", focus="Event loop, closures, web performance, API integration & DOM optimization", difficulty="Hard", tips="Understand how the browser renders frames and minimizes bundle size."),
            InterviewRound(round_name="Round 3: Engineering Culture Round", focus="Fintech curiosity, merchant-first mentality & speed of execution", difficulty="Easy", tips="Show enthusiasm for building high-reliability payment infrastructure.")
        ],
        "questions": [
            "Build an infinite-scroll merchant transaction table with client-side debounced search.",
            "Explain how JavaScript handles asynchronous microtasks vs macrotasks.",
            "How would you optimize the Core Web Vitals (LCP, INP, CLS) on a high-traffic checkout page?"
        ],
        "focus": "Frontend mastery, web performance optimization and merchant-centric product polish."
    },
    "postman": {
        "rounds": [
            InterviewRound(round_name="Round 1: Take-home API & System Challenge", focus="Design a scalable REST/GraphQL service with authentication and rate limiting", difficulty="Medium", tips="Provide automated unit tests and a clear README in your submission."),
            InterviewRound(round_name="Round 2: Code Review & Deep Dive", focus="Walkthrough of your architecture, database schema, and concurrency handling", difficulty="Medium", tips="Be ready to explain why you chose specific data models and caching layers."),
            InterviewRound(round_name="Round 3: Values & Engineering Culture", focus="API-first mindset, developer tooling passion & cross-functional communication", difficulty="Easy", tips="Share developer tools or open-source projects you love.")
        ],
        "questions": [
            "Design a distributed rate limiter for millions of concurrent API calls.",
            "How would you debug a high memory leak in a Node.js asynchronous service?",
            "Explain the architectural differences between REST, gRPC, and GraphQL."
        ],
        "focus": "API architecture, developer experience (DX), and building scalable developer tools."
    }
}

class ActionCenterService:
    @staticmethod
    def generate_intelligence(job: Job, prefs: UserPreferences):
        company_key = job.company.lower().strip()
        matched_data = None
        for k, v in INTERVIEW_DATABASE.items():
            if k in company_key:
                matched_data = v
                break

        if not matched_data:
            # High-fidelity role-based blueprint
            matched_data = {
                "rounds": [
                    InterviewRound(round_name="Round 1: Technical Online Screening", focus="Core data structures, problem solving and language proficiency", difficulty="Medium", tips="Practice standard LeetCode mediums and review core CS fundamentals."),
                    InterviewRound(round_name="Round 2: Technical Deep Dive & Coding", focus=f"Live coding and practical architecture for {job.title}", difficulty="Medium", tips="Explain your thought process aloud before writing code."),
                    InterviewRound(round_name="Round 3: Managerial & Fit Round", focus="Past projects, team collaboration, problem solving approaches", difficulty="Easy", tips="Highlight impact and learnings from your top projects.")
                ],
                "questions": [
                    f"Walk us through the most technically challenging project you built using {', '.join(job.skills[:2]) or 'your tech stack'}.",
                    "How do you approach debugging a critical bug under tight deadlines?",
                    "What strategies do you use to ensure code quality and maintainability in a team setting?"
                ],
                "focus": f"Strong ownership, high learning velocity, and practical competence with {', '.join(job.skills[:3])}."
            }

        job.interview_blueprint = InterviewBlueprint(
            rounds=matched_data["rounds"],
            top_technical_questions=matched_data["questions"],
            hiring_manager_focus=matched_data["focus"]
        )

        # Generate Application Pitch Kit
        top_skills = ", ".join(prefs.skills[:3]) if prefs.skills else "modern software engineering"
        target_role = job.title
        comp = job.company

        cold_email = f"""Subject: {target_role} Application | {', '.join(prefs.skills[:2]) or 'Software Engineer'}

Hi {comp} Recruiting Team,

I recently came across the {target_role} opening at {comp} and wanted to reach out directly. 

With strong experience in {top_skills} and a passion for building high-impact software, I've built projects focused on scalable engineering and clean architecture. I would love the opportunity to contribute to {comp}'s upcoming technical milestones.

I've attached my resume and portfolio for your review: [Portfolio/GitHub Link]
Looking forward to connecting!

Best regards,
[Your Name]"""

        linkedin_dm = f"Hi! I noticed the {target_role} opening at {comp}. Having built multiple projects with {top_skills}, I'd love to connect and share how my background aligns with your engineering team's current goals!"

        elevator_pitch = f"I am a software engineer specializing in {top_skills}. I build reliable, high-performance systems and am excited about {comp}'s mission in {job.location or 'tech'}."

        job.application_pitch = ApplicationPitch(
            cold_email=cold_email.strip(),
            linkedin_dm=linkedin_dm.strip(),
            elevator_pitch_30s=elevator_pitch.strip(),
            skills_to_highlight=list(set(prefs.skills) & set(job.skills)) or job.skills[:3],
            quick_prep_plan=[
                f"Review core design patterns for {job.skills[0] if job.skills else 'Software Design'}",
                f"Practice top interview questions for {job.company}",
                "Prepare 2 concrete stories about overcoming technical challenges"
            ]
        )
