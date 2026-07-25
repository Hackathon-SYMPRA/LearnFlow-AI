from fastapi import APIRouter, Depends, HTTPException, status
from app.models.user import UserResponse, UserUpdate, UserInDB
from app.schemas.response import SuccessResponse
from app.api.deps import get_current_user
from app.repositories.user import user_repo

router = APIRouter()

@router.get("/me", response_model=SuccessResponse)
async def read_user_me(current_user: UserInDB = Depends(get_current_user)):
    user_response = UserResponse(**current_user.model_dump())
    return SuccessResponse(message="User profile retrieved successfully", data=user_response)

@router.put("/update", response_model=SuccessResponse)
async def update_user(
    user_in: UserUpdate,
    current_user: UserInDB = Depends(get_current_user)
):
    update_data = user_in.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No valid fields provided to update",
        )
    
    updated_user = await user_repo.update(current_user.id, update_data)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    user_response = UserResponse(**updated_user.model_dump())
    return SuccessResponse(message="User profile updated successfully", data=user_response)

@router.delete("/me", response_model=SuccessResponse)
async def delete_account(current_user: UserInDB = Depends(get_current_user)):
    # Soft delete or hard delete depending on policy. Doing a soft delete by status update for now.
    updated_user = await user_repo.update(current_user.id, {"status": "Deleted"})
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return SuccessResponse(message="Account deleted successfully")

from app.models.user import ChangePassword
from app.core.security import verify_password, get_password_hash

@router.post('/change-password', response_model=SuccessResponse)
async def change_password(
    password_in: ChangePassword,
    current_user: UserInDB = Depends(get_current_user)
):
    if not verify_password(password_in.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail='Incorrect current password')
        
    hashed_password = get_password_hash(password_in.new_password)
    await user_repo.update(current_user.id, {'password': password_in.new_password})
    
    return SuccessResponse(message='Password updated successfully')

