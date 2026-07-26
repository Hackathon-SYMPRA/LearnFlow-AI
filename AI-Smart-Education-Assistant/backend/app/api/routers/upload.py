from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, BackgroundTasks
from typing import List
from app.api.deps import get_current_user
from app.models.user import UserInDB
from app.models.document import DocumentCreate, DocumentResponse
from app.schemas.response import SuccessResponse
from app.services.upload import upload_service
from app.repositories.document import document_repo
from app.api.routers.ai import background_process_document

router = APIRouter()

@router.post("/", response_model=SuccessResponse)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    current_user: UserInDB = Depends(get_current_user)
):
    upload_info = await upload_service.process_upload(file)
    
    doc_create = DocumentCreate(
        user_id=current_user.id,
        file_name=upload_info["file_name"],
        original_name=upload_info["original_name"],
        file_type=upload_info["file_type"],
        file_size=upload_info["file_size"],
        storage_path=upload_info["storage_path"]
    )
    
    doc = await document_repo.create(doc_create)
    doc_response = DocumentResponse(**doc.model_dump())
    
    metadata = {
        "document_id": str(doc.id),
        "user_id": str(current_user.id)
    }
    
    background_tasks.add_task(
        background_process_document,
        upload_info["storage_path"],
        upload_info["file_type"],
        metadata
    )
    
    return SuccessResponse(message="File uploaded successfully", data=doc_response.model_dump())

@router.get("/", response_model=SuccessResponse)
async def list_documents(current_user: UserInDB = Depends(get_current_user)):
    docs = await document_repo.get_by_user(current_user.id)
    return SuccessResponse(
        message="Documents retrieved successfully", 
        data=[DocumentResponse(**doc.model_dump()).model_dump() for doc in docs]
    )

@router.delete("/{id}", response_model=SuccessResponse)
async def delete_document(id: str, current_user: UserInDB = Depends(get_current_user)):
    success = await document_repo.delete(id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Document not found or delete failed")
    
    # Optional: We could also delete the physical file and ChromaDB vectors here.
    return SuccessResponse(message="Document deleted successfully")
