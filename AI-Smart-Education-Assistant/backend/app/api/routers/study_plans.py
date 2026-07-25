from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
from app.api.deps import get_current_user
from app.models.user import UserInDB
from app.schemas.response import SuccessResponse
from app.models.study_planner import StudyPlannerBase, StudyPlannerInDB
from app.repositories.study_planner import study_planner_repo

router = APIRouter()

@router.post("/", response_model=SuccessResponse)
async def create_study_planner(
    obj_in: StudyPlannerBase,
    current_user: UserInDB = Depends(get_current_user)
):
    obj = await study_planner_repo.create(obj_in, current_user.id)
    return SuccessResponse(message="Study Planner created successfully", data=obj.model_dump())

@router.get("/", response_model=SuccessResponse)
async def get_all_study_planners(current_user: UserInDB = Depends(get_current_user)):
    objs = await study_planner_repo.get_by_user(current_user.id)
    return SuccessResponse(message="Study Planners retrieved successfully", data=[obj.model_dump() for obj in objs])

@router.get("/{id}", response_model=SuccessResponse)
async def get_study_planner(id: str, current_user: UserInDB = Depends(get_current_user)):
    obj = await study_planner_repo.get_by_id(id)
    if not obj or obj.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Study Planner not found")
    return SuccessResponse(message="Study Planner retrieved successfully", data=obj.model_dump())

@router.put("/{id}", response_model=SuccessResponse)
async def update_study_planner(
    id: str,
    update_data: Dict[str, Any],
    current_user: UserInDB = Depends(get_current_user)
):
    obj = await study_planner_repo.get_by_id(id)
    if not obj or obj.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Study Planner not found")
        
    updated_obj = await study_planner_repo.update(id, update_data)
    return SuccessResponse(message="Study Planner updated successfully", data=updated_obj.model_dump())

@router.delete("/{id}", response_model=SuccessResponse)
async def delete_study_planner(id: str, current_user: UserInDB = Depends(get_current_user)):
    obj = await study_planner_repo.get_by_id(id)
    if not obj or obj.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Study Planner not found")
        
    await study_planner_repo.delete(id)
    return SuccessResponse(message="Study Planner deleted successfully")
