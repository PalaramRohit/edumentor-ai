# Example document shapes; used for documentation and insertion helpers

USER_SCHEMA = {
    "_id": "",
    "name": "",
    "email": "",
    "branch": "Computer Science",
    "year": 3,
    "target_role": "Backend Engineer",
}

SYLLABUS_SKILLS_SCHEMA = {
    "user_id": "",
    "raw_text": "",
    "extracted_skills": ["list", "of", "skills"],
    "normalized_skills": ["mongodb", "flask"],
    "created_at": "ISODate",
}

JOB_SKILL_SCHEMA = {
    "role": "Backend Engineer",
    "source": "jobboard or url",
    "raw_text": "original job posting text",
    "skills": ["python", "flask", "sql"],
    "weights": {"python": 2.0, "flask": 1.0},
    "cluster_id": 0,
    "role_label": "Backend Engineer",
}

ANALYSIS_SCHEMA = {
    "user_id": "",
    "role": "Backend Engineer",
    "results": {},
    "per_skill_confidence": {},
    "role_cluster_used": None,
    "created_at": "ISODate",
}
