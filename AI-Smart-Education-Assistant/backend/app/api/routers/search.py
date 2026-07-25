from fastapi import APIRouter, Depends
from app.api.deps import get_current_user
from app.models.user import UserInDB
from app.schemas.response import SuccessResponse
from app.services.search import search_service

router = APIRouter()

@router.get("/", response_model=SuccessResponse)
async def global_search(keyword: str, current_user: UserInDB = Depends(get_current_user)):
    results = await search_service.global_search(current_user.id, keyword)
    # Serialize pydantic models before returning
    serialized_results = {
        k: [v.model_dump() for v in val] for k, val in results.items()
    }
    return SuccessResponse(message="Search completed", data=serialized_results)
