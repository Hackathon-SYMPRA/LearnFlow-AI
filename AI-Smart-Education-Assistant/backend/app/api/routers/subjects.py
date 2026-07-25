from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
from app.api.deps import get_current_user
from app.models.user import UserInDB
from app.schemas.response import SuccessResponse
from app.models.subject import SubjectBase, SubjectInDB
from app.repositories.subject import subject_repo

router = APIRouter()

@router.post("/", response_model=SuccessResponse)
async def create_subject(
    obj_in: SubjectBase,
    current_user: UserInDB = Depends(get_current_user)
):
    obj = await subject_repo.create(obj_in, current_user.id)
    return SuccessResponse(message="Subject created successfully", data=obj.model_dump())

@router.get("/", response_model=SuccessResponse)
async def get_all_subjects(current_user: UserInDB = Depends(get_current_user)):
    objs = await subject_repo.get_by_user(current_user.id)
    return SuccessResponse(message="Subjects retrieved successfully", data=[obj.model_dump() for obj in objs])

@router.get("/{id}", response_model=SuccessResponse)
async def get_subject(id: str, current_user: UserInDB = Depends(get_current_user)):
    obj = await subject_repo.get_by_id(id)
    if not obj or obj.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Subject not found")
    return SuccessResponse(message="Subject retrieved successfully", data=obj.model_dump())

@router.put("/{id}", response_model=SuccessResponse)
async def update_subject(
    id: str,
    update_data: Dict[str, Any],
    current_user: UserInDB = Depends(get_current_user)
):
    obj = await subject_repo.get_by_id(id)
    if not obj or obj.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Subject not found")
        
    updated_obj = await subject_repo.update(id, update_data)
    return SuccessResponse(message="Subject updated successfully", data=updated_obj.model_dump())

@router.delete("/{id}", response_model=SuccessResponse)
async def delete_subject(id: str, current_user: UserInDB = Depends(get_current_user)):
    obj = await subject_repo.get_by_id(id)
    if not obj or obj.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Subject not found")
        
    await subject_repo.delete(id)
    return SuccessResponse(message="Subject deleted successfully")
