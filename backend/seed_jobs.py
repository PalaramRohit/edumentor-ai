from services import db
import datetime

# Sample Job Data
jobs_data = [
    {
        "role": "Backend Developer",
        "skills": ["python", "flask", "django", "sql", "postgresql", "docker", "redis", "rest api", "git", "linux", "aws"],
        "weights": {"python": 2.0, "sql": 1.5, "flask": 1.5, "rest api": 1.5, "docker": 1.2},
        "cluster_id": 1,
        "created_at": datetime.datetime.utcnow()
    },
    {
        "role": "Backend Developer",
        "skills": ["java", "spring boot", "microservices", "sql", "hibernate", "kafka", "docker", "kubernetes", "aws"],
        "weights": {"java": 2.0, "spring boot": 1.5, "sql": 1.5},
        "cluster_id": 1,
        "created_at": datetime.datetime.utcnow()
    },
    {
        "role": "Backend Developer",
        "skills": ["nodejs", "express", "mongodb", "javascript", "typescript", "aws", "serverless", "graphql"],
        "weights": {"nodejs": 2.0, "typescript": 1.5, "mongodb": 1.5},
        "cluster_id": 2,
        "created_at": datetime.datetime.utcnow()
    },
    {
        "role": "Frontend Developer",
        "skills": ["javascript", "react", "html", "css", "typescript", "redux", "tailwind", "figma", "git"],
        "weights": {"react": 2.0, "javascript": 1.5, "css": 1.2},
        "cluster_id": 3,
        "created_at": datetime.datetime.utcnow()
    },
    {
        "role": "Data Scientist",
        "skills": ["python", "pandas", "numpy", "scikit-learn", "sql", "tensorflow", "pytorch", "jupyter", "visualization"],
        "weights": {"python": 2.0, "pandas": 1.5, "scikit-learn": 1.5},
        "cluster_id": 4,
        "created_at": datetime.datetime.utcnow()
    }
]

print("--- Seeding Jobs Collection ---")

# Clear existing jobs to avoid duplicates during dev
db.job_coll.delete_many({})
print("Cleared existing jobs.")

# Insert new jobs
result = db.job_coll.insert_many(jobs_data)
print(f"Inserted {len(result.inserted_ids)} job profiles.")
print("Done.")
