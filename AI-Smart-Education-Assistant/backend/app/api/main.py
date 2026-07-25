from fastapi import APIRouter
from app.api.routers import auth, users, upload, ai, subjects, chats, quizzes, flashcards, study_plans, analytics, search, monitoring

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(upload.router, prefix='/upload', tags=['upload'])
api_router.include_router(ai.router, prefix='/ai', tags=['ai'])
api_router.include_router(subjects.router, prefix='/subjects', tags=['subjects'])
api_router.include_router(chats.router, prefix='/chats', tags=['chats'])
api_router.include_router(quizzes.router, prefix='/quizzes', tags=['quizzes'])
api_router.include_router(flashcards.router, prefix='/flashcards', tags=['flashcards'])
api_router.include_router(study_plans.router, prefix='/study-plans', tags=['study_plans'])
api_router.include_router(analytics.router, prefix='/analytics', tags=['analytics'])
api_router.include_router(search.router, prefix='/search', tags=['search'])
api_router.include_router(monitoring.router, prefix='/monitoring', tags=['monitoring'])
