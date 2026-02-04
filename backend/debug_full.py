import sys
import os
import traceback

# Ensure backend dir is in path
sys.path.append(os.getcwd())

print("--- 1. Testing Imports ---")
try:
    from services.ml_core import MLCore
    print("SUCCESS: Imported MLCore")
except Exception:
    print("FAIL: Could not import MLCore")
    traceback.print_exc()

print("\n--- 2. Testing MLCore Initialization ---")
try:
    ml = MLCore()
    print("SUCCESS: Initialized MLCore")
except Exception:
    print("FAIL: Could not initialize MLCore")
    traceback.print_exc()

print("\n--- 3. Testing Flask Route ---")
try:
    from app import create_app
    app = create_app()
    print("SUCCESS: Imported and created Flask app")
    
    with app.test_client() as client:
        # User ID from previous context
        user_id = "6981ff670d537d053907fcb1"
        target_role = "Backend Developer"
        
        print(f"Sending POST to /analysis/run with user_id={user_id}, target_role={target_role}")
        resp = client.post('/analysis/run', json={
            'user_id': user_id,
            'target_role': target_role
        })
        
        print(f"Response Status: {resp.status_code}")
        if resp.status_code == 500:
            print("Response Body (Error):")
            print(resp.get_data(as_text=True))
        else:
            print("Response JSON:")
            print(resp.get_json())

        print("\n--- 4. Testing Chat Endpoint ---")
        chat_resp = client.post('/explain/chat', json={'message': 'Hello, who are you?'})
        print(f"Chat Response Status: {chat_resp.status_code}")
        print("Chat Response JSON:")
        print(chat_resp.get_json())

except Exception:
    print("FAIL: Flask Route Test Crashed")
    traceback.print_exc()
