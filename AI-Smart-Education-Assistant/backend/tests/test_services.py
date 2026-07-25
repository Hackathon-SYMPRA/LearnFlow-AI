import pytest
from app.services.subject import subject_service

@pytest.mark.asyncio
async def test_subject_service_methods():
    # Simple mock check for service existence
    assert hasattr(subject_service, 'create')
    assert hasattr(subject_service, 'get_by_id')
    assert hasattr(subject_service, 'get_by_user')
    assert hasattr(subject_service, 'update')
    assert hasattr(subject_service, 'delete')
