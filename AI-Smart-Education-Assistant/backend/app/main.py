from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from datetime import datetime

app = FastAPI(title="EduMind AI Backend Mock")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    email: str
    password: str

demo_user = {
    "id": "1",
    "name": "Demo Student",
    "email": "demo@edumind.ai",
    "role": "student",
    "createdAt": datetime.now().isoformat()
}

@app.post("/api/v1/auth/login")
async def login(req: LoginRequest):
    return {"user": demo_user, "token": "mock-jwt-token-123"}

@app.post("/api/v1/auth/register")
async def register(req: dict):
    return {"user": demo_user, "token": "mock-jwt-token-123"}

@app.get("/api/v1/auth/me")
async def get_me():
    return demo_user

@app.get("/api/v1/analytics/overview")
async def get_analytics_overview():
    return {
        "totalDocuments": 5,
        "totalQuizzesTaken": 2,
        "averageScore": 85,
        "studyTimeHours": 12,
        "recentActivity": []
    }

@app.get("/api/v1/documents")
async def get_documents():
    return []

@app.get("/api/v1/chat/sessions")
async def get_chat_sessions():
    return []

@app.post("/api/v1/chat/sessions")
async def create_chat_session(req: dict):
    return {"id": "mock-session-1", "title": req.get("title", "New Chat"), "messages": [], "createdAt": datetime.now().isoformat(), "updatedAt": datetime.now().isoformat()}

@app.post("/api/v1/chat/sessions/{session_id}/messages/stream")
async def stream_message(session_id: str, req: dict):
    from fastapi.responses import StreamingResponse
    async def generate():
        yield "This is a mock response from the AI."
    return StreamingResponse(generate(), media_type="text/event-stream")

@app.get("/api/v1/notifications/unread-count")
async def get_unread_count():
    return {"count": 2}

@app.get("/api/v1/subjects/recent")
async def get_recent_subjects():
    return []

@app.get("/api/v1/planner")
async def get_planner():
    return []

@app.get("/api/v1/flashcards")
async def get_flashcards():
    return []

@app.get("/api/v1/notifications")
async def get_notifications():
    return []

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
