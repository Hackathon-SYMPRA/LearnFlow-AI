from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status
from pydantic import BaseModel
from typing import List, Optional
import json

from app.api.deps import get_current_user
from app.models.user import UserInDB
from app.schemas.response import SuccessResponse
from app.services.ai.document_processor import document_processor
from app.services.ai.chunking import chunker
from app.services.ai.rag_service import rag_service
from app.services.ai.generator import ai_generator

router = APIRouter()

class ProcessDocumentRequest(BaseModel):
    document_id: str
    file_path: str
    file_type: str
    subject_id: Optional[str] = None

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatQueryRequest(BaseModel):
    query: str
    chat_history: Optional[List[ChatMessage]] = None

class GenerateNotesRequest(BaseModel):
    document_id: str
    note_type: str = "Summary Notes"

class TeacherChatRequest(BaseModel):
    query: str
    mode: str = "Beginner"
    chat_history: Optional[List[ChatMessage]] = None

class GenerateQuizRequest(BaseModel):
    topic_query: str
    difficulty: str = "Medium"
    num_questions: int = 5

class GenerateFlashcardsRequest(BaseModel):
    topic_query: str = "main concepts"
    document_id: Optional[str] = None
    num_flashcards: int = 5

class GenerateStudyPlanRequest(BaseModel):
    topics: str
    days: int
    hours_per_day: int

import logging
logger = logging.getLogger(__name__)

def background_process_document(file_path: str, file_type: str, metadata: dict):
    try:
        # Extract Text
        text = document_processor.extract_text(file_path, file_type)
        # Clean text can be added here
        
        # Chunk Text
        chunks = chunker.create_chunks(text, metadata)
        
        # Embed and Store
        rag_service.store_documents(chunks)
        
        logger.info(f"Successfully processed document {metadata.get('document_id')}")
        # Update document status in DB could happen here (e.g., set status to "Processed")
    except Exception as e:
        logger.error(f"Error in background_process_document: {str(e)}", exc_info=True)
        print(f"Error in background_process_document: {str(e)}")

@router.post("/process-document", response_model=SuccessResponse)
async def process_document(
    request: ProcessDocumentRequest, 
    background_tasks: BackgroundTasks,
    current_user: UserInDB = Depends(get_current_user)
):
    metadata = {
        "document_id": request.document_id,
        "user_id": current_user.id,
        "subject_id": request.subject_id
    }
    
    background_tasks.add_task(
        background_process_document, 
        request.file_path, 
        request.file_type, 
        metadata
    )
    
    return SuccessResponse(message="Document processing started in the background")

@router.post("/chat", response_model=SuccessResponse)
async def chat(
    request: ChatQueryRequest,
    current_user: UserInDB = Depends(get_current_user)
):
    # Retrieve relevant context
    context_chunks = rag_service.similarity_search(request.query, current_user.id, top_k=5)
    
    # Convert chat_history to dicts if present
    history_dicts = [msg.model_dump() for msg in request.chat_history] if request.chat_history else None
    
    # Generate answer
    response_text = await ai_generator.generate_chat_response(request.query, context_chunks, history_dicts)
    
    return SuccessResponse(message="Chat response generated", data={"response": response_text, "context_used": len(context_chunks)})

@router.post("/generate/quiz", response_model=SuccessResponse)
async def generate_quiz(
    request: GenerateQuizRequest,
    current_user: UserInDB = Depends(get_current_user)
):
    context_chunks = rag_service.similarity_search(request.topic_query, current_user.id, top_k=10)
    
    if not context_chunks:
        raise HTTPException(status_code=400, detail="No relevant study material found for this topic.")
        
    quiz_json_str = await ai_generator.generate_quiz(context_chunks, request.difficulty, request.num_questions)
    
    try:
        # Attempt to parse json from string. Model might output raw JSON array.
        quiz_data = json.loads(quiz_json_str)
    except Exception:
        quiz_data = quiz_json_str # fallback to string if parsing fails
        
    return SuccessResponse(message="Quiz generated successfully", data={"quiz": quiz_data})

@router.post("/generate/flashcards", response_model=SuccessResponse)
async def generate_flashcards(
    request: GenerateFlashcardsRequest,
    current_user: UserInDB = Depends(get_current_user)
):
    query = request.topic_query if request.topic_query else "main concepts and definitions"
    context_chunks = rag_service.similarity_search(
        query, 
        current_user.id, 
        top_k=15, 
        document_ids=[request.document_id] if request.document_id else None
    )
    
    if not context_chunks:
        raise HTTPException(status_code=400, detail="No relevant study material found to generate flashcards.")
        
    flashcards_json_str = await ai_generator.generate_flashcards(context_chunks, request.num_flashcards)
    
    try:
        data = json.loads(flashcards_json_str)
        flashcards_data = data.get("flashcards", data)
    except Exception:
        flashcards_data = flashcards_json_str
        
    return SuccessResponse(message="Flashcards generated successfully", data={"flashcards": flashcards_data})

@router.post("/generate/study-plan", response_model=SuccessResponse)
async def generate_study_plan(
    request: GenerateStudyPlanRequest,
    current_user: UserInDB = Depends(get_current_user)
):
    plan_text = await ai_generator.generate_study_plan(request.topics, request.days, request.hours_per_day)
    return SuccessResponse(message="Study plan generated successfully", data={"study_plan": plan_text})

@router.post("/generate/notes", response_model=SuccessResponse)
async def generate_notes(
    request: GenerateNotesRequest,
    current_user: UserInDB = Depends(get_current_user)
):
    context_chunks = rag_service.similarity_search(
        "main concepts and topics", 
        current_user.id, 
        top_k=15,
        document_ids=[request.document_id] if request.document_id else None
    )
    
    if not context_chunks:
        raise HTTPException(status_code=400, detail="No relevant study material found for this topic.")
        
    notes_text = await ai_generator.generate_notes(context_chunks, request.note_type)
    return SuccessResponse(message="Notes generated successfully", data={"notes": notes_text})

class GenerateMindMapRequest(BaseModel):
    document_id: str

@router.post("/generate/mindmap", response_model=SuccessResponse)
async def generate_mindmap(
    request: GenerateMindMapRequest,
    current_user: UserInDB = Depends(get_current_user)
):
    # Here we can search for the specific document or a broad query.
    # Since we want to use the uploaded file, we should fetch context using the document_id
    # We can pass the document's name or a broad query to get its chunks, or fetch all chunks for this doc.
    context_chunks = rag_service.similarity_search(
        "main concepts and topics", 
        current_user.id, 
        top_k=15, 
        document_ids=[request.document_id] if request.document_id else None
    )
    # Let's just use it as is, or we can fetch chunks directly from MongoDB if we had a method.
    
    if not context_chunks:
        raise HTTPException(status_code=400, detail="No relevant study material found for this document.")
        
    mindmap_json_str = await ai_generator.generate_mindmap(context_chunks)
    
    try:
        mindmap_data = json.loads(mindmap_json_str)
    except Exception:
        mindmap_data = mindmap_json_str
        
    return SuccessResponse(message="Mind Map generated successfully", data={"mindmap": mindmap_data})

@router.post("/chat/teacher", response_model=SuccessResponse)
async def chat_teacher(
    request: TeacherChatRequest,
    current_user: UserInDB = Depends(get_current_user)
):
    context_chunks = rag_service.similarity_search(request.query, current_user.id, top_k=5)
    
    history_dicts = [msg.model_dump() for msg in request.chat_history] if request.chat_history else None
    
    response_text = await ai_generator.generate_teacher_response(request.query, context_chunks, request.mode, history_dicts)
    return SuccessResponse(message="Teacher response generated successfully", data={"response": response_text})

class MockTestRequest(BaseModel):
    document_id: str
    language: str = "English"
    chat_history: Optional[List[ChatMessage]] = None

class MockTestEvaluateRequest(BaseModel):
    document_id: str
    language: str = "English"
    user_answer: str
    chat_history: Optional[List[ChatMessage]] = None

@router.post("/mock-test/question", response_model=SuccessResponse)
async def generate_mock_test_question(
    request: MockTestRequest,
    current_user: UserInDB = Depends(get_current_user)
):
    context_chunks = rag_service.similarity_search("main concepts and topics", current_user.id, top_k=15, document_ids=[request.document_id] if request.document_id else None)
    if not context_chunks:
        raise HTTPException(status_code=400, detail="No relevant study material found for this document.")
        
    history_dicts = [msg.model_dump() for msg in request.chat_history] if request.chat_history else None
    
    question = await ai_generator.generate_mock_test_question(context_chunks, request.language, history_dicts)
    return SuccessResponse(message="Question generated successfully", data={"response": question})

@router.post("/mock-test/evaluate", response_model=SuccessResponse)
async def evaluate_mock_test_answer(
    request: MockTestEvaluateRequest,
    current_user: UserInDB = Depends(get_current_user)
):
    context_chunks = rag_service.similarity_search(request.user_answer, current_user.id, top_k=10, document_ids=[request.document_id] if request.document_id else None)
    
    history_dicts = [msg.model_dump() for msg in request.chat_history] if request.chat_history else None
    
    evaluation = await ai_generator.evaluate_mock_test_answer(request.user_answer, context_chunks, request.language, history_dicts)
    return SuccessResponse(message="Answer evaluated successfully", data={"response": evaluation})
