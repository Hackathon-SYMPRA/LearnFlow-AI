from typing import Optional, List
from app.db.mongodb import get_database
from app.models.document import DocumentInDB, DocumentCreate
from datetime import datetime, timezone
import uuid

class DocumentRepository:
    def __init__(self):
        self.collection_name = "documents"

    def _get_collection(self):
        db = get_database()
        return db[self.collection_name]

    async def create(self, doc_in: DocumentCreate) -> DocumentInDB:
        collection = self._get_collection()
        now = datetime.now(timezone.utc)
        
        doc_dict = doc_in.model_dump()
        doc_dict["_id"] = str(uuid.uuid4())
        doc_dict["upload_date"] = now
        doc_dict["processing_status"] = "Pending"
        doc_dict["ocr_status"] = "Pending"
        doc_dict["embedding_status"] = "Pending"
        
        await collection.insert_one(doc_dict)
        return DocumentInDB(**doc_dict)

    async def get_by_id(self, doc_id: str) -> Optional[DocumentInDB]:
        collection = self._get_collection()
        doc = await collection.find_one({"_id": doc_id})
        if doc:
            return DocumentInDB(**doc)
        return None

    async def get_by_user(self, user_id: str) -> List[DocumentInDB]:
        collection = self._get_collection()
        cursor = collection.find({"user_id": user_id})
        return [DocumentInDB(**doc) async for doc in cursor]

    async def delete(self, doc_id: str, user_id: str) -> bool:
        collection = self._get_collection()
        result = await collection.delete_one({"_id": doc_id, "user_id": user_id})
        return result.deleted_count > 0

document_repo = DocumentRepository()
