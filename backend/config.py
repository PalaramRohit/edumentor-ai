import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/edumentorai")
CEREBRAS_API_KEY = os.getenv("CEREBRAS_API_KEY")
CEREBRAS_MODEL = os.getenv("CEREBRAS_MODEL", "LLaMA-3.x-70B")
FLASK_ENV = os.getenv("FLASK_ENV", "development")
HOURS_PER_WEEK = int(os.getenv("HOURS_PER_WEEK", "10"))
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-secret-key")
