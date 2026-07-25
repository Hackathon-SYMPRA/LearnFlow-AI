from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
from app.api.deps import get_current_user
from app.models.user import UserInDB
from app.schemas.response import SuccessResponse
from app.models.chat import ChatBase, ChatInDB
from app.repositories.chat import chat_repo

router = APIRouter()

@router.post("/", response_model=SuccessResponse)
async def create_chat(
    obj_in: ChatBase,
    current_user: UserInDB = Depends(get_current_user)
):
    obj = await chat_repo.create(obj_in, current_user.id)
    return SuccessResponse(message="Chat created successfully", data=obj.model_dump())

@router.get("/", response_model=SuccessResponse)
async def get_all_chats(current_user: UserInDB = Depends(get_current_user)):
    objs = await chat_repo.get_by_user(current_user.id)
    return SuccessResponse(message="Chats retrieved successfully", data=[obj.model_dump() for obj in objs])

@router.get("/{id}", response_model=SuccessResponse)
async def get_chat(id: str, current_user: UserInDB = Depends(get_current_user)):
    obj = await chat_repo.get_by_id(id)
    if not obj or obj.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Chat not found")
    return SuccessResponse(message="Chat retrieved successfully", data=obj.model_dump())

@router.put("/{id}", response_model=SuccessResponse)
async def update_chat(
    id: str,
    update_data: Dict[str, Any],
    current_user: UserInDB = Depends(get_current_user)
):
    obj = await chat_repo.get_by_id(id)
    if not obj or obj.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Chat not found")
        
    updated_obj = await chat_repo.update(id, update_data)
    return SuccessResponse(message="Chat updated successfully", data=updated_obj.model_dump())

@router.delete("/{id}", response_model=SuccessResponse)
async def delete_chat(id: str, current_user: UserInDB = Depends(get_current_user)):
    obj = await chat_repo.get_by_id(id)
    if not obj or obj.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Chat not found")
        
    await chat_repo.delete(id)
    return SuccessResponse(message="Chat deleted successfully")
