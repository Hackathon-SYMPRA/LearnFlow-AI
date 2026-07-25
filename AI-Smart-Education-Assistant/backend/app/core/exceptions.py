from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.schemas.response import ErrorResponse

async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    error_response = ErrorResponse(
        status="error",
        error=exc.__class__.__name__,
        message=str(exc.detail),
        request_id=getattr(request.state, "request_id", None)
    )
    return JSONResponse(
        status_code=exc.status_code,
        content=error_response.model_dump(mode="json")
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    error_response = ErrorResponse(
        status="error",
        error="ValidationError",
        message="Invalid request parameters",
        validation_details={"errors": exc.errors()},
        request_id=getattr(request.state, "request_id", None)
    )
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=error_response.model_dump(mode="json")
    )

async def global_exception_handler(request: Request, exc: Exception):
    error_response = ErrorResponse(
        status="error",
        error="InternalServerError",
        message="An unexpected error occurred.",
        request_id=getattr(request.state, "request_id", None)
    )
    # In production, log the full exception here.
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=error_response.model_dump(mode="json")
    )
