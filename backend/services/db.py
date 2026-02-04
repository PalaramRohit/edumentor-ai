from pymongo import MongoClient
from config import MONGO_URI

client = MongoClient(MONGO_URI)
db = client.get_default_database()

users_coll = db["users"]
syllabus_coll = db["syllabus_skills"]
job_coll = db["job_skills"]
job_clusters = db["job_clusters"]
analysis_coll = db["analysis_results"]
roadmap_coll = db["roadmap"]
