import os

base_dir = r'c:\Users\HP\OneDrive\Desktop\HAKETHON_TEAM\LearnFlow-AI\AI-Smart-Education-Assistant\backend\app\services'

services = {
    'subject.py': 'subject_repo',
    'chat.py': 'chat_repo',
    'quiz.py': 'quiz_repo',
    'flashcard.py': 'flashcard_repo',
    'study_planner.py': 'study_planner_repo',
    'analytics.py': 'analytics_repo'
}

template = """from app.repositories.{repo_name} import {repo_instance}
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

class {class_name}:
    async def create(self, obj_in: BaseModel, user_id: str):
        return await {repo_instance}.create(obj_in, user_id)
        
    async def get_by_id(self, obj_id: str, user_id: str):
        obj = await {repo_instance}.get_by_id(obj_id)
        if obj and getattr(obj, "user_id", None) == user_id:
            return obj
        return None
        
    async def get_by_user(self, user_id: str, skip: int = 0, limit: int = 100):
        # Adding simple pagination to the service layer
        objs = await {repo_instance}.get_by_user(user_id)
        return objs[skip : skip + limit]
        
    async def update(self, obj_id: str, user_id: str, update_data: Dict[str, Any]):
        obj = await self.get_by_id(obj_id, user_id)
        if obj:
            return await {repo_instance}.update(obj_id, update_data)
        return None
        
    async def delete(self, obj_id: str, user_id: str):
        obj = await self.get_by_id(obj_id, user_id)
        if obj:
            return await {repo_instance}.delete(obj_id)
        return False

{instance_name} = {class_name}()
"""

for filename, repo_instance in services.items():
    repo_name = filename.replace('.py', '')
    if repo_name == 'study_plans':
        repo_name = 'study_planner'
        
    class_name = repo_name.replace('_', ' ').title().replace(' ', '') + 'Service'
    instance_name = repo_name + '_service'
    
    content = template.replace('{repo_name}', repo_name) \
                      .replace('{repo_instance}', repo_instance) \
                      .replace('{class_name}', class_name) \
                      .replace('{instance_name}', instance_name)
                      
    filepath = os.path.join(base_dir, filename)
    with open(filepath, 'w') as f:
        f.write(content)

# Search Service
search_service = """from typing import Dict, Any, List
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
"""
with open(os.path.join(base_dir, 'search.py'), 'w') as f:
    f.write(search_service)

print("Services created.")
