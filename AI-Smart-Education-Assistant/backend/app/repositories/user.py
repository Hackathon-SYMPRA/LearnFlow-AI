from typing import Optional, Dict, Any
from app.db.mongodb import get_database
from app.models.user import UserInDB, UserCreate
from app.core.security import get_password_hash
from datetime import datetime, timezone
import uuid

class UserRepository:
    def __init__(self):
        self.collection_name = "users"

    def _get_collection(self):
        db = get_database()
        return db[self.collection_name]

    async def get_by_email(self, email: str) -> Optional[UserInDB]:
        collection = self._get_collection()
        user_dict = await collection.find_one({"email": email})
        if user_dict:
            return UserInDB(**user_dict)
        return None

    async def get_by_id(self, user_id: str) -> Optional[UserInDB]:
        collection = self._get_collection()
        user_dict = await collection.find_one({"_id": user_id})
        if user_dict:
            return UserInDB(**user_dict)
        return None

    async def create(self, user_in: UserCreate) -> UserInDB:
        collection = self._get_collection()
        now = datetime.now(timezone.utc)
        
        user_dict = {
            "_id": str(uuid.uuid4()),
            "email": user_in.email,
            "full_name": user_in.full_name,
            "hashed_password": get_password_hash(user_in.password),
            "created_at": now,
            "updated_at": now
        }
        await collection.insert_one(user_dict)
        return UserInDB(**user_dict)

    async def update(self, user_id: str, update_data: Dict[str, Any]) -> Optional[UserInDB]:
        collection = self._get_collection()
        update_data["updated_at"] = datetime.now(timezone.utc)
        
        if "password" in update_data:
            update_data["hashed_password"] = get_password_hash(update_data.pop("password"))

        await collection.update_one(
            {"_id": user_id},
            {"$set": update_data}
        )
        return await self.get_by_id(user_id)

user_repo = UserRepository()
