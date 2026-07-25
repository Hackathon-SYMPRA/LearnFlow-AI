from typing import TypeVar, Generic, Optional, List, Dict, Any, Type
from app.db.mongodb import get_database
from pydantic import BaseModel
from datetime import datetime, timezone
import uuid

ModelType = TypeVar("ModelType", bound=BaseModel)

class BaseRepository(Generic[ModelType]):
    def __init__(self, model: Type[ModelType], collection_name: str):
        self.model = model
        self.collection_name = collection_name

    def _get_collection(self):
        db = get_database()
        return db[self.collection_name]

    async def get_by_id(self, id: str) -> Optional[ModelType]:
        collection = self._get_collection()
        doc = await collection.find_one({"_id": id})
        if doc:
            return self.model(**doc)
        return None

    async def get_by_user(self, user_id: str) -> List[ModelType]:
        collection = self._get_collection()
        docs = await collection.find({"user_id": user_id}).to_list(length=100)
        return [self.model(**doc) for doc in docs]

    async def create(self, obj_in: BaseModel, user_id: str) -> ModelType:
        collection = self._get_collection()
        now = datetime.now(timezone.utc)
        
        obj_dict = obj_in.model_dump(exclude_unset=True)
        obj_dict["_id"] = str(uuid.uuid4())
        obj_dict["user_id"] = user_id
        
        # Remove any existing ID to prevent overriding
        if "id" in obj_dict:
            obj_dict.pop("id")
            
        obj_dict["created_at"] = now
        obj_dict["updated_at"] = now
        
        # Also handle specific fields from PRDs like 'created_date'
        if not "created_date" in obj_dict:
            obj_dict["created_date"] = now
            
        await collection.insert_one(obj_dict)
        return self.model(**obj_dict)

    async def update(self, id: str, obj_in: Dict[str, Any]) -> Optional[ModelType]:
        collection = self._get_collection()
        
        update_data = obj_in.copy()
        if not update_data:
            return await self.get_by_id(id)
            
        update_data["updated_at"] = datetime.now(timezone.utc)
        
        await collection.update_one(
            {"_id": id},
            {"$set": update_data}
        )
        return await self.get_by_id(id)

    async def delete(self, id: str) -> bool:
        collection = self._get_collection()
        result = await collection.delete_one({"_id": id})
        return result.deleted_count > 0
