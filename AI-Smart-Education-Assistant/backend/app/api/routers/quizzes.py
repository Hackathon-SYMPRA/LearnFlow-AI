from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
from app.api.deps import get_current_user
from app.models.user import UserInDB
from app.schemas.response import SuccessResponse
from app.models.quiz import QuizBase, QuizInDB
from app.repositories.quiz import quiz_repo

router = APIRouter()

@router.post("/", response_model=SuccessResponse)
async def create_quiz(
    obj_in: QuizBase,
    current_user: UserInDB = Depends(get_current_user)
):
    obj = await quiz_repo.create(obj_in, current_user.id)
    return SuccessResponse(message="Quiz created successfully", data=obj.model_dump())

@router.get("/", response_model=SuccessResponse)
async def get_all_quizs(current_user: UserInDB = Depends(get_current_user)):
    objs = await quiz_repo.get_by_user(current_user.id)
    return SuccessResponse(message="Quizs retrieved successfully", data=[obj.model_dump() for obj in objs])

@router.get("/{id}", response_model=SuccessResponse)
async def get_quiz(id: str, current_user: UserInDB = Depends(get_current_user)):
    obj = await quiz_repo.get_by_id(id)
    if not obj or obj.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return SuccessResponse(message="Quiz retrieved successfully", data=obj.model_dump())

@router.put("/{id}", response_model=SuccessResponse)
async def update_quiz(
    id: str,
    update_data: Dict[str, Any],
    current_user: UserInDB = Depends(get_current_user)
):
    obj = await quiz_repo.get_by_id(id)
    if not obj or obj.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Quiz not found")
        
    updated_obj = await quiz_repo.update(id, update_data)
    return SuccessResponse(message="Quiz updated successfully", data=updated_obj.model_dump())

@router.delete("/{id}", response_model=SuccessResponse)
async def delete_quiz(id: str, current_user: UserInDB = Depends(get_current_user)):
    obj = await quiz_repo.get_by_id(id)
    if not obj or obj.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Quiz not found")
        
    await quiz_repo.delete(id)
    return SuccessResponse(message="Quiz deleted successfully")
