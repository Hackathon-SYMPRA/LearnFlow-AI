from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, timezone

class DocumentBase(BaseModel):
    subject_id: Optional[str] = None
    file_name: str
    original_name: str
    file_type: str
    file_size: int
    storage_path: str

class DocumentCreate(DocumentBase):
    user_id: str

class DocumentInDB(DocumentBase):
    id: str = Field(alias="_id")
    user_id: str
    total_pages: Optional[int] = None
    upload_date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    processing_status: str = "Pending"
    ocr_status: str = "Pending"
    embedding_status: str = "Pending"

    class Config:
        populate_by_name = True

class DocumentResponse(DocumentBase):
    id: str
    total_pages: Optional[int] = None
    upload_date: datetime
    processing_status: str
    ocr_status: str
    embedding_status: str

    class Config:
        populate_by_name = True
