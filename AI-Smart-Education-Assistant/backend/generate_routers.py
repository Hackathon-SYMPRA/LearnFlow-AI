import os

base_dir = r'c:\Users\HP\OneDrive\Desktop\HAKETHON_TEAM\LearnFlow-AI\AI-Smart-Education-Assistant\backend\app\api\routers'

routers = {
    'subjects.py': ('SubjectBase', 'SubjectInDB', 'subject_repo', 'Subject'),
    'chats.py': ('ChatBase', 'ChatInDB', 'chat_repo', 'Chat'),
    'quizzes.py': ('QuizBase', 'QuizInDB', 'quiz_repo', 'Quiz'),
    'flashcards.py': ('FlashcardBase', 'FlashcardInDB', 'flashcard_repo', 'Flashcard'),
    'study_plans.py': ('StudyPlannerBase', 'StudyPlannerInDB', 'study_planner_repo', 'Study Planner', 'study_planner'),
    'analytics.py': ('AnalyticsBase', 'AnalyticsInDB', 'analytics_repo', 'Analytics')
}

template = """from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
from app.api.deps import get_current_user
from app.models.user import UserInDB
from app.schemas.response import SuccessResponse
from app.models.{model_module} import {base_model}, {indb_model}
from app.repositories.{repo_module} import {repo_instance}

router = APIRouter()

@{model_module}_router_create
async def create_{func_name}(
    obj_in: {base_model},
    current_user: UserInDB = Depends(get_current_user)
):
    obj = await {repo_instance}.create(obj_in, current_user.id)
    return SuccessResponse(message="{entity_name} created successfully", data=obj.model_dump())

@{model_module}_router_get_all
async def get_all_{func_name}s(current_user: UserInDB = Depends(get_current_user)):
    objs = await {repo_instance}.get_by_user(current_user.id)
    return SuccessResponse(message="{entity_name}s retrieved successfully", data=[obj.model_dump() for obj in objs])

@{model_module}_router_get_one
async def get_{func_name}(id: str, current_user: UserInDB = Depends(get_current_user)):
    obj = await {repo_instance}.get_by_id(id)
    if not obj or obj.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="{entity_name} not found")
    return SuccessResponse(message="{entity_name} retrieved successfully", data=obj.model_dump())

@{model_module}_router_update
async def update_{func_name}(
    id: str,
    update_data: Dict[str, Any],
    current_user: UserInDB = Depends(get_current_user)
):
    obj = await {repo_instance}.get_by_id(id)
    if not obj or obj.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="{entity_name} not found")
        
    updated_obj = await {repo_instance}.update(id, update_data)
    return SuccessResponse(message="{entity_name} updated successfully", data=updated_obj.model_dump())

@{model_module}_router_delete
async def delete_{func_name}(id: str, current_user: UserInDB = Depends(get_current_user)):
    obj = await {repo_instance}.get_by_id(id)
    if not obj or obj.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="{entity_name} not found")
        
    await {repo_instance}.delete(id)
    return SuccessResponse(message="{entity_name} deleted successfully")
"""

for filename, item in routers.items():
    if len(item) == 5:
        base_model, indb_model, repo_instance, entity_name, model_module = item
        repo_module = model_module
    else:
        base_model, indb_model, repo_instance, entity_name = item
        model_module = filename.replace('s.py', '').replace('zes.py', 'z')
        if filename == 'analytics.py':
            model_module = 'analytics'
        if filename == 'study_plans.py':
            model_module = 'study_planner'
        if filename == 'subjects.py':
            model_module = 'subject'
        if filename == 'chats.py':
            model_module = 'chat'
        if filename == 'quizzes.py':
            model_module = 'quiz'
        if filename == 'flashcards.py':
            model_module = 'flashcard'
        repo_module = model_module

    func_name = model_module
    
    content = template.replace('{model_module}', model_module) \
                      .replace('{base_model}', base_model) \
                      .replace('{indb_model}', indb_model) \
                      .replace('{repo_instance}', repo_instance) \
                      .replace('{repo_module}', repo_module) \
                      .replace('{entity_name}', entity_name) \
                      .replace('{func_name}', func_name) \
                      .replace(f'@{model_module}_router_create', '@router.post("/", response_model=SuccessResponse)') \
                      .replace(f'@{model_module}_router_get_all', '@router.get("/", response_model=SuccessResponse)') \
                      .replace(f'@{model_module}_router_get_one', '@router.get("/{id}", response_model=SuccessResponse)') \
                      .replace(f'@{model_module}_router_update', '@router.put("/{id}", response_model=SuccessResponse)') \
                      .replace(f'@{model_module}_router_delete', '@router.delete("/{id}", response_model=SuccessResponse)')

    filepath = os.path.join(base_dir, filename)
    with open(filepath, 'w') as f:
        f.write(content)

print("Routers created.")
