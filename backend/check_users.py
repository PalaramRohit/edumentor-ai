from services import db
print("Listing all users:")
users = list(db.users_coll.find({}))
for u in users:
    print(f"ID: {u['_id']}, Name: {u.get('name')}")

if not users:
    print("No users found in database.")
