from fastapi import APIRouter, HTTPException
from app.core.db import users_collection
from app.core.config import settings
from app.models.user import User, UserLogin, UserResponse
import jwt, bcrypt

router = APIRouter()

@router.post("/register")
async def register(user: User):
    if users_collection.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="User exists")

    hashed_pw = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt())
    user_data = {
        "username": user.username,
        "email": user.email,
        "full_name": user.full_name,
        "password": hashed_pw
    }
    users_collection.insert_one(user_data)
    return {"message": "User registered"}

@router.post("/login")
async def login(user: UserLogin):
    db_user = users_collection.find_one({"username": user.username})
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Handle password - ensure it's bytes for bcrypt
    stored_password = db_user["password"]
    if isinstance(stored_password, str):
        stored_password = stored_password.encode()

    if not bcrypt.checkpw(user.password.encode(), stored_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = jwt.encode({
        "username": user.username,
        "email": db_user["email"],
        "full_name": db_user["full_name"]
    }, settings.JWT_SECRET, algorithm="HS256")

    return {
        "access_token": token,
        "user": {
            "username": db_user["username"],
            "email": db_user["email"],
            "full_name": db_user["full_name"]
        }
    }