from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
from app.api.deps import get_current_user
from app.models.user import UserInDB
from app.schemas.response import SuccessResponse
from app.models.analytics import AnalyticsBase, AnalyticsInDB
from app.repositories.analytics import analytics_repo

router = APIRouter()

@router.post("/", response_model=SuccessResponse)
async def create_analytics(
    obj_in: AnalyticsBase,
    current_user: UserInDB = Depends(get_current_user)
):
    obj = await analytics_repo.create(obj_in, current_user.id)
    return SuccessResponse(message="Analytics created successfully", data=obj.model_dump())

@router.get("/", response_model=SuccessResponse)
async def get_all_analyticss(current_user: UserInDB = Depends(get_current_user)):
    objs = await analytics_repo.get_by_user(current_user.id)
    return SuccessResponse(message="Analyticss retrieved successfully", data=[obj.model_dump() for obj in objs])

@router.get("/{id}", response_model=SuccessResponse)
async def get_analytics(id: str, current_user: UserInDB = Depends(get_current_user)):
    obj = await analytics_repo.get_by_id(id)
    if not obj or obj.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Analytics not found")
    return SuccessResponse(message="Analytics retrieved successfully", data=obj.model_dump())

@router.put("/{id}", response_model=SuccessResponse)
async def update_analytics(
    id: str,
    update_data: Dict[str, Any],
    current_user: UserInDB = Depends(get_current_user)
):
    obj = await analytics_repo.get_by_id(id)
    if not obj or obj.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Analytics not found")
        
    updated_obj = await analytics_repo.update(id, update_data)
    return SuccessResponse(message="Analytics updated successfully", data=updated_obj.model_dump())

@router.delete("/{id}", response_model=SuccessResponse)
async def delete_analytics(id: str, current_user: UserInDB = Depends(get_current_user)):
    obj = await analytics_repo.get_by_id(id)
    if not obj or obj.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Analytics not found")
        
    await analytics_repo.delete(id)
    return SuccessResponse(message="Analytics deleted successfully")
