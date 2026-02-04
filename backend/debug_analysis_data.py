from services import db
from bson import ObjectId
import json

# Replace with the actual user ID you are testing with (from localStorage or logs)
USER_ID = "6981ff670d537d053907fcb1" 
TARGET_ROLE = "Backend Developer"

print(f"--- Debugging Analysis Data for User: {USER_ID} ---")

# 1. Check Syllabus
syl = db.syllabus_coll.find_one({'user_id': ObjectId(USER_ID)})
if syl:
    print(f"\n[Syllabus Found]")
    print(f"Skills: {syl.get('normalized_skills', [])}")
else:
    print("\n[ERROR] No Syllabus found for user!")

# 2. Check Jobs
jobs = list(db.job_coll.find({'role': TARGET_ROLE}))
print(f"\n[Jobs Found for '{TARGET_ROLE}']: {len(jobs)}")
for j in jobs:
    print(f" - Role: {j.get('role')}")
    print(f"   Skills: {j.get('skills', [])}")

if not jobs:
    print("\n[WARNING] No jobs found! Analysis will be empty.")
    # Check what roles ARE in the db
    all_roles = db.job_coll.distinct('role')
    print(f"Available Roles in DB: {all_roles}")
