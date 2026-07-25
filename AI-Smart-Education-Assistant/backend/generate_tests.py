import os

test_dir = r'c:\Users\HP\OneDrive\Desktop\HAKETHON_TEAM\LearnFlow-AI\AI-Smart-Education-Assistant\backend\tests'

if not os.path.exists(test_dir):
    os.makedirs(test_dir)

conftest = """import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c
"""

test_main = """from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code in [200, 404]  # Depending on if root is defined
"""

test_auth = """def test_login_missing_fields(client):
    response = client.post("/api/v1/auth/login", data={"username": "test"})
    assert response.status_code == 422 # Validation error
"""

test_services = """import pytest
from app.services.subject import subject_service

@pytest.mark.asyncio
async def test_subject_service_methods():
    # Simple mock check for service existence
    assert hasattr(subject_service, 'create')
    assert hasattr(subject_service, 'get_by_id')
    assert hasattr(subject_service, 'get_by_user')
    assert hasattr(subject_service, 'update')
    assert hasattr(subject_service, 'delete')
"""

with open(os.path.join(test_dir, '__init__.py'), 'w') as f:
    f.write('')
    
with open(os.path.join(test_dir, 'conftest.py'), 'w') as f:
    f.write(conftest)

with open(os.path.join(test_dir, 'test_main.py'), 'w') as f:
    f.write(test_main)
    
with open(os.path.join(test_dir, 'test_auth.py'), 'w') as f:
    f.write(test_auth)
    
with open(os.path.join(test_dir, 'test_services.py'), 'w') as f:
    f.write(test_services)

print("Tests created.")
