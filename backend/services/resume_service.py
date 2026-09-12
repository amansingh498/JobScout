import io
import re
from typing import List, Dict, Any, Optional

COMMON_TECH_SKILLS = [
    "python", "javascript", "typescript", "react", "next.js", "vue", "angular", "node.js",
    "express", "fastapi", "django", "flask", "spring boot", "java", "c++", "c#", ".net",
    "golang", "rust", "sql", "postgresql", "mysql", "mongodb", "redis", "elasticsearch",
    "docker", "kubernetes", "aws", "azure", "gcp", "terraform", "ci/cd", "git", "github",
    "html", "css", "tailwind css", "graphql", "rest api", "microservices", "kafka",
    "pytorch", "tensorflow", "scikit-learn", "deep learning", "machine learning", "nlp",
    "computer vision", "llm", "transformers", "langchain", "pandas", "numpy",
    "flutter", "react native", "swift", "kotlin", "android", "ios", "solidity", "web3"
]

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extracts raw text from PDF bytes using pypdf."""
    try:
        from pypdf import PdfReader
        reader = PdfReader(io.BytesIO(file_bytes))
        extracted_text = []
        for page in reader.pages:
            text = page.extract_text()
            if text:
                extracted_text.append(text)
        return "\n".join(extracted_text)
    except Exception as e:
        print(f"[ResumeService] PDF parsing error: {e}")
        # Fallback raw byte decode
        try:
            return file_bytes.decode('utf-8', errors='ignore')
        except Exception:
            return ""

def extract_skills_from_text(text: str) -> List[str]:
    """Deterministically extracts technical skills and tools from resume text."""
    lower_text = text.lower()
    found_skills = set()

    for skill in COMMON_TECH_SKILLS:
        # Match as word boundary or surrounded by punctuation/spaces
        escaped_skill = re.escape(skill)
        pattern = r'(?:\b|(?<=[^a-zA-Z0-9]))' + escaped_skill + r'(?:\b|(?=[^a-zA-Z0-9]))'
        if re.search(pattern, lower_text):
            found_skills.add(skill.title() if len(skill) > 3 and not skill.isupper() else skill.upper() if len(skill) <= 3 else skill)

    # Format properly for known acronyms / libraries
    formatted = []
    for s in sorted(list(found_skills)):
        s_low = s.lower()
        if s_low == "aws": formatted.append("AWS")
        elif s_low == "gcp": formatted.append("GCP")
        elif s_low == "sql": formatted.append("SQL")
        elif s_low == "html": formatted.append("HTML")
        elif s_low == "css": formatted.append("CSS")
        elif s_low == "nlp": formatted.append("NLP")
        elif s_low == "llm": formatted.append("LLM")
        elif s_low == "ci/cd": formatted.append("CI/CD")
        elif s_low == "react": formatted.append("React")
        elif s_low == "next.js": formatted.append("Next.js")
        elif s_low == "node.js": formatted.append("Node.js")
        elif s_low == "vue": formatted.append("Vue.js")
        elif s_low == "typescript": formatted.append("TypeScript")
        elif s_low == "javascript": formatted.append("JavaScript")
        elif s_low == "python": formatted.append("Python")
        elif s_low == "pytorch": formatted.append("PyTorch")
        elif s_low == "tensorflow": formatted.append("TensorFlow")
        elif s_low == "docker": formatted.append("Docker")
        elif s_low == "kubernetes": formatted.append("Kubernetes")
        elif s_low == "fastapi": formatted.append("FastAPI")
        elif s_low == "postgresql": formatted.append("PostgreSQL")
        elif s_low == "mongodb": formatted.append("MongoDB")
        elif s_low == "tailwind css": formatted.append("Tailwind CSS")
        else: formatted.append(s.title())

    return formatted

def suggest_roles_from_skills(skills: List[str]) -> List[str]:
    """Suggests relevant job titles based on extracted skills."""
    skills_lower = [s.lower() for s in skills]
    suggested = []

    if any(s in skills_lower for s in ["pytorch", "tensorflow", "deep learning", "machine learning", "nlp", "llm", "transformers"]):
        suggested.append("AI / Machine Learning Engineer")
        suggested.append("AI Research Intern")
    
    if any(s in skills_lower for s in ["react", "next.js", "vue", "javascript", "typescript", "html", "css"]):
        if any(s in skills_lower for s in ["node.js", "express", "fastapi", "django", "postgresql", "mongodb", "sql"]):
            suggested.append("Full Stack Developer")
            suggested.append("Software Engineering Intern")
        else:
            suggested.append("Frontend Developer")

    if any(s in skills_lower for s in ["docker", "kubernetes", "aws", "terraform", "ci/cd"]):
        suggested.append("DevOps & Cloud Engineer")

    if any(s in skills_lower for s in ["flutter", "react native", "swift", "kotlin", "android", "ios"]):
        suggested.append("Mobile App Developer")

    if not suggested:
        suggested.append("Software Engineer Intern")

    return list(dict.fromkeys(suggested))

def parse_resume_bytes(file_bytes: bytes, filename: str) -> Dict[str, Any]:
    """Parses resume file bytes and extracts text, skills, and suggested roles."""
    ext = filename.lower().split('.')[-1] if '.' in filename else ''
    
    if ext == 'pdf':
        text = extract_text_from_pdf(file_bytes)
    else:
        try:
            text = file_bytes.decode('utf-8', errors='ignore')
        except Exception:
            text = str(file_bytes)

    skills = extract_skills_from_text(text)
    suggested_roles = suggest_roles_from_skills(skills)

    return {
        "filename": filename,
        "resume_text": text[:10000],
        "skills": skills,
        "suggested_roles": suggested_roles,
        "word_count": len(text.split())
    }
