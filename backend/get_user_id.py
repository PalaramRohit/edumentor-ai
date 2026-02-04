import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
client = MongoClient(os.getenv("MONGO_URI"))
db = client.get_default_database()

users = list(db.users.find({}, {"_id": 1, "name": 1, "email": 1}))

if users:
    print("FOUND USERS:")
    for u in users:
        print(f"ID: {u['_id']} | Name: {u.get('name')} | Email: {u.get('email')}")
else:
    print("NO USERS FOUND. Creating one...")
    new_user = {
        "name": "Rohit",
        "email": "rohit@example.com",
        "branch": "CSE",
        "year": "3",
        "target_role": "Backend Developer",
        "readiness_score": 65
    }
    res = db.users.insert_one(new_user)
    print(f"CREATED USER: ID: {res.inserted_id}")
