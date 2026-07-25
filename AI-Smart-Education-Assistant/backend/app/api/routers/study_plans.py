from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Dict, Any, Optional
from app.api.deps import get_current_user
from app.models.user import UserInDB
from app.schemas.response import SuccessResponse
from app.models.study_planner import StudyPlannerBase, StudyPlannerInDB
from app.services.study_planner import study_planner_service

router = APIRouter()

@router.post("/", response_model=SuccessResponse)
async def create_study_planner(
    obj_in: StudyPlannerBase,
    current_user: UserInDB = Depends(get_current_user)
):
    obj = await study_planner_service.create(obj_in, current_user.id)
    return SuccessResponse(message="Study Planner created successfully", data=obj.model_dump())

@router.get("/", response_model=SuccessResponse)
async def get_all_study_planners(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    sort_by: Optional[str] = Query(None, description="Field to sort by (e.g. created_at)"),
    order: Optional[int] = Query(-1, description="1 for ascending, -1 for descending"),
    # Generic filters can be passed as a JSON string or we can use specific query params
    # For MVP we just pass some common ones if they exist, or we can parse request.query_params
    current_user: UserInDB = Depends(get_current_user)
):
    # In a real app we'd parse all query params into a filters dict.
    filters = {{}}
    sort = [(sort_by, order)] if sort_by else None
    
    objs = await study_planner_service.get_by_user(current_user.id, skip=skip, limit=limit, filters=filters, sort=sort)
    return SuccessResponse(
        message="Study Planners retrieved successfully", 
        data=[obj.model_dump() for obj in objs]
    )

@router.get("/{id}", response_model=SuccessResponse)
async def get_study_planner(id: str, current_user: UserInDB = Depends(get_current_user)):
    obj = await study_planner_service.get_by_id(id, current_user.id)
    if not obj:
        raise HTTPException(status_code=404, detail="Study Planner not found")
    return SuccessResponse(message="Study Planner retrieved successfully", data=obj.model_dump())

@router.put("/{id}", response_model=SuccessResponse)
async def update_study_planner(
    id: str,
    update_data: Dict[str, Any],
    current_user: UserInDB = Depends(get_current_user)
):
    updated_obj = await study_planner_service.update(id, current_user.id, update_data)
    if not updated_obj:
        raise HTTPException(status_code=404, detail="Study Planner not found or update failed")
    return SuccessResponse(message="Study Planner updated successfully", data=updated_obj.model_dump())

@router.delete("/{id}", response_model=SuccessResponse)
async def delete_study_planner(id: str, current_user: UserInDB = Depends(get_current_user)):
    success = await study_planner_service.delete(id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Study Planner not found or delete failed")
    return SuccessResponse(message="Study Planner deleted successfully")

class PlannerGenerateRequest(PydanticBaseModel):
    topics: str
    days: int
    hours_per_day: int

@router.post("/generate", response_model=SuccessResponse)
async def generate_planner_endpoint(
    req: PlannerGenerateRequest,
    current_user: UserInDB = Depends(get_current_user)
):
    from app.services.ai.generator import ai_generator
    
    raw_response = await ai_generator.generate_study_plan(req.topics, req.days, req.hours_per_day)
    return SuccessResponse(message="Study plan generated", data=raw_response)
