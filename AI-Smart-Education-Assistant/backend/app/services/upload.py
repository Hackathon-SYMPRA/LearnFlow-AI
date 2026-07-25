import os
import uuid
import aiofiles
from fastapi import UploadFile, HTTPException
from typing import List

UPLOAD_DIRECTORY = "uploads"
ALLOWED_EXTENSIONS = {"pdf", "docx", "txt", "png", "jpg", "jpeg"}
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB

if not os.path.exists(UPLOAD_DIRECTORY):
    os.makedirs(UPLOAD_DIRECTORY)

def validate_file(file: UploadFile) -> None:
    ext = file.filename.split('.')[-1].lower() if '.' in file.filename else ''
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Unsupported file type. Allowed: {ALLOWED_EXTENSIONS}")

async def save_upload_file(upload_file: UploadFile, destination: str) -> int:
    try:
        size = 0
        async with aiofiles.open(destination, 'wb') as out_file:
            while content := await upload_file.read(1024 * 1024):  # async read chunk
                size += len(content)
                if size > MAX_FILE_SIZE:
                    raise HTTPException(status_code=400, detail="File too large")
                await out_file.write(content)
        return size
    finally:
        await upload_file.seek(0)

class UploadService:
    async def process_upload(self, file: UploadFile) -> dict:
        validate_file(file)
        
        ext = file.filename.split('.')[-1].lower()
        unique_filename = f"{uuid.uuid4()}.{ext}"
        storage_path = os.path.join(UPLOAD_DIRECTORY, unique_filename)
        
        size = await save_upload_file(file, storage_path)
        
        return {
            "file_name": unique_filename,
            "original_name": file.filename,
            "file_type": ext,
            "file_size": size,
            "storage_path": storage_path
        }

upload_service = UploadService()
