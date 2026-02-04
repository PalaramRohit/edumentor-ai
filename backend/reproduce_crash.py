from app import app
from services import db
from bson import ObjectId
import json
import traceback

# ID from previous logs
USER_ID = "6981ff670d537d053907fcb1"
TARGET_ROLE = "Backend Developer"

print(f"Testing /analysis/run for user {USER_ID} role {TARGET_ROLE}...")

with app.test_client() as client:
    try:
        resp = client.post('/analysis/run', json={
            'user_id': USER_ID,
            'target_role': TARGET_ROLE
        })
        print(f"Status Code: {resp.status_code}")
        if resp.status_code == 500:
            print("Server returned 500. Unfortunately test_client usually catches the exception internally unless propagated.")
            print(resp.get_data(as_text=True))
    except Exception:
        traceback.print_exc()

print("\n--- Direct Function Call Test (if needed) ---")
# If the above doesn't show traceback, we can try importing the blueprint function directly if context allows,
# but usually checking db state or manual call is better.

# Let's try to manually invoke the logic if we can mock the request
from api.analysis import run_analysis
from flask import Flask

# Minimal mock app context
with app.app_context():
    # We can't easily invoke the route function without a request context.
    pass
