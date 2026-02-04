import os
import sys
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
print(f"Testing connection to: {MONGO_URI}")

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    client.admin.command('ping')
    print("SUCCESS: MongoDB is reachable!")
    
    db = client.get_default_database()
    print(f"Database: {db.name}")
    print("Collections:", db.list_collection_names())
except Exception as e:
    print(f"FAILURE: Could not connect to MongoDB. Error: {e}")
    sys.exit(1)
