from typing import Optional
from app.repositories.user import user_repo
from app.models.user import UserInDB, UserCreate
from app.core.security import verify_password
from fastapi import HTTPException, status
from datetime import datetime, timezone

class AuthService:
    async def authenticate_user(self, email: str, password: str) -> Optional[UserInDB]:
        user = await user_repo.get_by_email(email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
            
        # Update last login
        now = datetime.now(timezone.utc)
        updated_user = await user_repo.update(user.id, {"last_login": now})
        return updated_user
        
    async def register_user(self, user_in: UserCreate) -> UserInDB:
        user = await user_repo.get_by_email(user_in.email)
        if user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )
        return await user_repo.create(user_in)

auth_service = AuthService()
