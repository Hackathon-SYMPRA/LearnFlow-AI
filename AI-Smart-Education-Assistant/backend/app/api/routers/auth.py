from fastapi import APIRouter, Depends, HTTPException, status, Header
from fastapi.security import OAuth2PasswordRequestForm
from typing import Optional
import jwt
from jwt.exceptions import InvalidTokenError
from pydantic import BaseModel

from app.core.config import settings
from app.models.token import Token, TokenPayload
from app.models.user import UserCreate, UserResponse, UserInDB
from app.schemas.response import SuccessResponse
from app.services.auth import auth_service
from app.core.security import create_access_token, create_refresh_token
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/register", response_model=SuccessResponse, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate):
    user = await auth_service.register_user(user_in)
    user_response = UserResponse(**user.model_dump())
    
    access_token = create_access_token(subject=user.id)
    refresh_token = create_refresh_token(subject=user.id)
    
    return SuccessResponse(message="User registered successfully", data={
        "user": user_response.model_dump(),
        "tokens": {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }
    })

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login", response_model=SuccessResponse)
async def login(request: LoginRequest):
    user = await auth_service.authenticate_user(email=request.email, password=request.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token = create_access_token(subject=user.id)
    refresh_token = create_refresh_token(subject=user.id)
    user_response = UserResponse(**user.model_dump())
    
    return SuccessResponse(message="Login successful", data={
        "user": user_response.model_dump(),
        "tokens": {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }
    })

@router.post("/logout", response_model=SuccessResponse)
async def logout(current_user: UserInDB = Depends(get_current_user)):
    # In a real app we might blacklist the token or clear refresh token from db
    return SuccessResponse(message="Logged out successfully")

class RefreshRequest(BaseModel):
    refresh_token: str

@router.post("/refresh", response_model=SuccessResponse)
async def refresh_token(request: RefreshRequest):
    try:
        payload = jwt.decode(
            request.refresh_token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM]
        )
        token_data = TokenPayload(**payload)
        
        if token_data.type != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type",
            )
            
    except InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate refresh token",
        )
        
    new_access_token = create_access_token(subject=token_data.sub)
    
    return SuccessResponse(message="Token refreshed", data={
        "access_token": new_access_token,
        "token_type": "bearer"
    })

from app.models.user import ForgotPassword, ResetPassword

@router.post('/forgot-password', response_model=SuccessResponse)
async def forgot_password(request: ForgotPassword):
    # In a real app, send an email with a reset token here.
    # For now, we just mock the process.
    user = await auth_service.user_repo.get_by_email(request.email)
    if not user:
        # Don't leak user existence for security
        return SuccessResponse(message='If this email exists, a reset link has been sent.')
        
    return SuccessResponse(message='If this email exists, a reset link has been sent.')

@router.post('/reset-password', response_model=SuccessResponse)
async def reset_password(request: ResetPassword):
    # In a real app, validate the reset token here.
    # For mock purposes, just return success if syntax passes.
    return SuccessResponse(message='Password has been reset successfully.')

