from app.repositories.subject import subject_repo
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

class SubjectService:
    async def create(self, obj_in: BaseModel, user_id: str):
        return await subject_repo.create(obj_in, user_id)
        
    async def get_by_id(self, obj_id: str, user_id: str):
        obj = await subject_repo.get_by_id(obj_id)
        if obj and getattr(obj, "user_id", None) == user_id:
            return obj
        return None
        
    async def get_by_user(self, user_id: str, skip: int = 0, limit: int = 100, filters: Optional[Dict[str, Any]] = None, sort: Optional[List[tuple]] = None):
        # Adding simple pagination to the service layer
        objs = await subject_repo.get_by_user(user_id, skip=skip, limit=limit, filters=filters, sort=sort)
        return objs
        
    async def update(self, obj_id: str, user_id: str, update_data: Dict[str, Any]):
        obj = await self.get_by_id(obj_id, user_id)
        if obj:
            return await subject_repo.update(obj_id, update_data)
        return None
        
    async def delete(self, obj_id: str, user_id: str):
        obj = await self.get_by_id(obj_id, user_id)
        if obj:
            return await subject_repo.delete(obj_id)
        return False

subject_service = SubjectService()
