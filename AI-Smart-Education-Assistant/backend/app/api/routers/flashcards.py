from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
from app.api.deps import get_current_user
from app.models.user import UserInDB
from app.schemas.response import SuccessResponse
from app.models.flashcard import FlashcardBase, FlashcardInDB
from app.repositories.flashcard import flashcard_repo

router = APIRouter()

@router.post("/", response_model=SuccessResponse)
async def create_flashcard(
    obj_in: FlashcardBase,
    current_user: UserInDB = Depends(get_current_user)
):
    obj = await flashcard_repo.create(obj_in, current_user.id)
    return SuccessResponse(message="Flashcard created successfully", data=obj.model_dump())

@router.get("/", response_model=SuccessResponse)
async def get_all_flashcards(current_user: UserInDB = Depends(get_current_user)):
    objs = await flashcard_repo.get_by_user(current_user.id)
    return SuccessResponse(message="Flashcards retrieved successfully", data=[obj.model_dump() for obj in objs])

@router.get("/{id}", response_model=SuccessResponse)
async def get_flashcard(id: str, current_user: UserInDB = Depends(get_current_user)):
    obj = await flashcard_repo.get_by_id(id)
    if not obj or obj.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Flashcard not found")
    return SuccessResponse(message="Flashcard retrieved successfully", data=obj.model_dump())

@router.put("/{id}", response_model=SuccessResponse)
async def update_flashcard(
    id: str,
    update_data: Dict[str, Any],
    current_user: UserInDB = Depends(get_current_user)
):
    obj = await flashcard_repo.get_by_id(id)
    if not obj or obj.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Flashcard not found")
        
    updated_obj = await flashcard_repo.update(id, update_data)
    return SuccessResponse(message="Flashcard updated successfully", data=updated_obj.model_dump())

@router.delete("/{id}", response_model=SuccessResponse)
async def delete_flashcard(id: str, current_user: UserInDB = Depends(get_current_user)):
    obj = await flashcard_repo.get_by_id(id)
    if not obj or obj.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Flashcard not found")
        
    await flashcard_repo.delete(id)
    return SuccessResponse(message="Flashcard deleted successfully")
