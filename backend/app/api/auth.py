from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.db import users_collection
from app.core.config import settings
import jwt, bcrypt

router = APIRouter()

class User(BaseModel):
    username: str
    password: str

@router.post("/register")
async def register(user: User):
    if users_collection.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="User exists")
    hashed_pw = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt())
    users_collection.insert_one({"username": user.username, "password": hashed_pw})
    return {"message": "User registered"}

@router.post("/login")
async def login(user: User):
    db_user = users_collection.find_one({"username": user.username})
    if not db_user or not bcrypt.checkpw(user.password.encode(), db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = jwt.encode({"username": user.username}, settings.JWT_SECRET, algorithm="HS256")
    return {"access_token": token}
