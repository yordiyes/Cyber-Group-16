from pymongo import MongoClient
from app.core.config import settings

client = MongoClient(settings.DATABASE_URL)

db = client.get_database("Cyber16")

# Collections
reports_collection = db["reports"]
users_collection = db["users"]  
