from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Dict, Any, Optional
from app.api.deps import get_current_user
from app.models.user import UserInDB
from app.schemas.response import SuccessResponse
from app.models.chat import ChatBase, ChatInDB
from app.services.chat import chat_service
from app.services.ai.generator import ai_generator
from app.services.ai.rag_service import rag_service
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import json
router = APIRouter()

class ChatCreateRequest(BaseModel):
    title: Optional[str] = "New Chat"
    documentIds: Optional[List[str]] = []

@router.post("/", response_model=SuccessResponse)
async def create_chat(
    obj_in: ChatCreateRequest,
    current_user: UserInDB = Depends(get_current_user)
):
    chat_base = ChatBase(user_id=current_user.id, title=obj_in.title)
    obj = await chat_service.create(chat_base, current_user.id)
    return SuccessResponse(message="Chat created successfully", data=obj.model_dump())

@router.get("/", response_model=SuccessResponse)
async def get_all_chats(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    sort_by: Optional[str] = Query(None, description="Field to sort by (e.g. created_at)"),
    order: Optional[int] = Query(-1, description="1 for ascending, -1 for descending"),
    # Generic filters can be passed as a JSON string or we can use specific query params
    # For MVP we just pass some common ones if they exist, or we can parse request.query_params
    current_user: UserInDB = Depends(get_current_user)
):
    # In a real app we'd parse all query params into a filters dict.
    filters = {}
    sort = [(sort_by, order)] if sort_by else None
    
    objs = await chat_service.get_by_user(current_user.id, skip=skip, limit=limit, filters=filters, sort=sort)
    return SuccessResponse(
        message="Chats retrieved successfully", 
        data=[obj.model_dump() for obj in objs]
    )

@router.get("/{id}", response_model=SuccessResponse)
async def get_chat(id: str, current_user: UserInDB = Depends(get_current_user)):
    obj = await chat_service.get_by_id(id, current_user.id)
    if not obj:
        raise HTTPException(status_code=404, detail="Chat not found")
    return SuccessResponse(message="Chat retrieved successfully", data=obj.model_dump())

@router.patch("/{id}", response_model=SuccessResponse)
async def update_chat_partial(
    id: str,
    update_data: Dict[str, Any],
    current_user: UserInDB = Depends(get_current_user)
):
    updated_obj = await chat_service.update(id, current_user.id, update_data)
    if not updated_obj:
        raise HTTPException(status_code=404, detail="Chat not found or update failed")
    return SuccessResponse(message="Chat updated successfully", data=updated_obj.model_dump())

class MessageRequest(BaseModel):
    message: str
    language: Optional[str] = "English"
    images: Optional[List[str]] = None

@router.post("/{id}/messages", response_model=SuccessResponse)
async def send_message(
    id: str,
    request: MessageRequest,
    current_user: UserInDB = Depends(get_current_user)
):
    chat = await chat_service.get_by_id(id, current_user.id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    # Process message with AI
    context_chunks = rag_service.similarity_search(request.message, current_user.id, top_k=5)
    history = chat.messages
    response_text = await ai_generator.generate_chat_response(
        query=request.message, 
        context_chunks=context_chunks, 
        chat_history=history,
        language=request.language,
        images=request.images
    )
    
    # Append to chat
    new_messages = history + [
        {"role": "user", "content": request.message},
        {"role": "assistant", "content": response_text}
    ]
    await chat_service.update(id, current_user.id, {"messages": new_messages})
    
    return SuccessResponse(message="Message processed", data={"response": response_text})

@router.post("/{id}/messages/stream")
async def send_message_stream(
    id: str,
    request: MessageRequest,
    current_user: UserInDB = Depends(get_current_user)
):
    chat = await chat_service.get_by_id(id, current_user.id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    context_chunks = rag_service.similarity_search(request.message, current_user.id, top_k=5)
    history = chat.messages
    
    # Save user message immediately
    user_msgs = history + [{"role": "user", "content": request.message}]
    await chat_service.update(id, current_user.id, {"messages": user_msgs})

    async def event_generator():
        full_response = ""
        async for chunk in ai_generator.generate_chat_stream(
            query=request.message, 
            context_chunks=context_chunks, 
            chat_history=history,
            language=request.language,
            images=request.images
        ):
            if chunk:
                full_response += chunk
                yield chunk
        # Save AI response after stream completes
        final_msgs = user_msgs + [{"role": "assistant", "content": full_response}]
        await chat_service.update(id, current_user.id, {"messages": final_msgs})

    return StreamingResponse(event_generator(), media_type="text/plain")

@router.delete("/{id}", response_model=SuccessResponse)
async def delete_chat(id: str, current_user: UserInDB = Depends(get_current_user)):
    success = await chat_service.delete(id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Chat not found or delete failed")
    return SuccessResponse(message="Chat deleted successfully")
