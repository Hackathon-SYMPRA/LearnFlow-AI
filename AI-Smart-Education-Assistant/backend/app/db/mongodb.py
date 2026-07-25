import urllib.parse
import re
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

def get_escaped_uri(uri: str) -> str:
    # Match mongodb:// or mongodb+srv:// followed by username:password@host...
    match = re.match(r'^(mongodb(?:\+srv)?://)(.*)@(.*)$', uri)
    if match:
        prefix = match.group(1)
        user_pass = match.group(2)
        suffix = match.group(3)
        if ':' in user_pass:
            username, password = user_pass.split(':', 1)
            username = urllib.parse.quote_plus(urllib.parse.unquote_plus(username))
            password = urllib.parse.quote_plus(urllib.parse.unquote_plus(password))
            return f"{prefix}{username}:{password}@{suffix}"
    return uri

class MongoDB:
    client: AsyncIOMotorClient = None

db = MongoDB()

async def connect_to_mongo():
    # Automatically escape username and password if they contain special characters
    safe_uri = get_escaped_uri(settings.MONGODB_URI)
    db.client = AsyncIOMotorClient(safe_uri)
    print("Connected to MongoDB")

async def close_mongo_connection():
    if db.client:
        db.client.close()
        print("Closed MongoDB connection")

def get_database():
    return db.client[settings.DATABASE_NAME]
