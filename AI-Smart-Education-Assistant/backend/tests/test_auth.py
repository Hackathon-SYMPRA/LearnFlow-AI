def test_login_missing_fields(client):
    response = client.post("/api/v1/auth/login", data={"username": "test"})
    assert response.status_code == 422 # Validation error
