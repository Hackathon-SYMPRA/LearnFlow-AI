import os
os.environ["CHROMA_TELEMETRY_ANONYMIZED"] = "False"
os.environ["ANONYMIZED_TELEMETRY"] = "False"

from fastapi import FastAPI
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.core.limiter import limiter

from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from contextlib import asynccontextmanager

from app.core.config import settings
from app.db.mongodb import connect_to_mongo, close_mongo_connection
# from app.db.chromadb import chroma_db
from app.core.ai import ai_provider
from app.core.middleware import RequestLoggingMiddleware, SecurityHeadersMiddleware
from app.core.exceptions import http_exception_handler, validation_exception_handler, global_exception_handler

import os

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    os.makedirs(settings.UPLOAD_DIRECTORY, exist_ok=True)
    os.makedirs(settings.CHROMADB_PATH, exist_ok=True)
    await connect_to_mongo()
    # chroma_db.connect()
    ai_provider.initialize()
    yield
    # Shutdown logic
    await close_mongo_connection()


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# Exception Handlers
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, global_exception_handler)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


# Middlewares
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RequestLoggingMiddleware)

# Set up CORS middleware
if settings.ALLOWED_ORIGINS:
    origins = [str(origin) for origin in settings.ALLOWED_ORIGINS]
    # If wildcard is used, we cannot use allow_credentials=True with allow_origins=["*"]
    # So we use allow_origin_regex=".*" to safely echo the origin back, bypassing the browser restriction.
    if "*" in origins:
        app.add_middleware(
            CORSMiddleware,
            allow_origin_regex=".*",
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
    else:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=origins,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

from app.api.main import api_router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {"message": "Welcome to EduMind AI Backend API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
