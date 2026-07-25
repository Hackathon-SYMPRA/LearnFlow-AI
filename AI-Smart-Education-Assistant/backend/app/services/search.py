from typing import Dict, Any, List
from app.repositories.document import document_repo
from app.repositories.chat import chat_repo
from app.repositories.subject import subject_repo

class SearchService:
    async def global_search(self, user_id: str, keyword: str) -> Dict[str, List[Any]]:
        # A simple implementation of global search across repositories
        results = {"documents": [], "chats": [], "subjects": []}
        
        # In a real production system, this would use MongoDB Atlas Search or ChromaDB semantic search directly on all docs
        # Here we do a basic filter based on the fetched records (MVP approach)
        docs = await document_repo.get_by_user(user_id)
        results["documents"] = [d for d in docs if keyword.lower() in d.file_name.lower()]
        
        chats = await chat_repo.get_by_user(user_id)
        results["chats"] = [c for c in chats if keyword.lower() in c.title.lower()]
        
        subjects = await subject_repo.get_by_user(user_id)
        results["subjects"] = [s for s in subjects if keyword.lower() in s.subject_name.lower()]
        
        return results

search_service = SearchService()
