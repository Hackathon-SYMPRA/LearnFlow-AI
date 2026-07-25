import os

routers_dir = r'c:\Users\HP\OneDrive\Desktop\HAKETHON_TEAM\LearnFlow-AI\AI-Smart-Education-Assistant\backend\app\api\routers'

quiz_addition = """
from pydantic import BaseModel as PydanticBaseModel
class QuizGenerateRequest(PydanticBaseModel):
    difficulty: str = "Medium"
    num_questions: int = 5
    document_ids: Optional[List[str]] = None

@router.post("/generate", response_model=SuccessResponse)
async def generate_quiz_endpoint(
    req: QuizGenerateRequest,
    current_user: UserInDB = Depends(get_current_user)
):
    from app.services.ai.rag_service import rag_service
    from app.services.ai.generator import ai_generator
    
    # Simple semantic search to get context if docs not provided
    context_chunks = await rag_service.similarity_search("Generate quiz", user_id=current_user.id, k=5)
    raw_response = await ai_generator.generate_quiz(context_chunks, req.difficulty, req.num_questions)
    
    return SuccessResponse(message="Quiz generated", data=raw_response)
"""

with open(os.path.join(routers_dir, 'quizzes.py'), 'a') as f:
    f.write(quiz_addition)

flashcard_addition = """
class FlashcardGenerateRequest(PydanticBaseModel):
    num_flashcards: int = 5
    document_ids: Optional[List[str]] = None

@router.post("/generate", response_model=SuccessResponse)
async def generate_flashcards_endpoint(
    req: FlashcardGenerateRequest,
    current_user: UserInDB = Depends(get_current_user)
):
    from app.services.ai.rag_service import rag_service
    from app.services.ai.generator import ai_generator
    
    context_chunks = await rag_service.similarity_search("Generate flashcards", user_id=current_user.id, k=5)
    raw_response = await ai_generator.generate_flashcards(context_chunks, req.num_flashcards)
    
    return SuccessResponse(message="Flashcards generated", data=raw_response)
"""

with open(os.path.join(routers_dir, 'flashcards.py'), 'a') as f:
    f.write(flashcard_addition)

planner_addition = """
class PlannerGenerateRequest(PydanticBaseModel):
    topics: str
    days: int
    hours_per_day: int

@router.post("/generate", response_model=SuccessResponse)
async def generate_planner_endpoint(
    req: PlannerGenerateRequest,
    current_user: UserInDB = Depends(get_current_user)
):
    from app.services.ai.generator import ai_generator
    
    raw_response = await ai_generator.generate_study_plan(req.topics, req.days, req.hours_per_day)
    return SuccessResponse(message="Study plan generated", data=raw_response)
"""

with open(os.path.join(routers_dir, 'study_plans.py'), 'a') as f:
    f.write(planner_addition)

print("AI endpoints appended.")
