from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.db import users_collection
from app.core.config import settings
import jwt, bcrypt

router = APIRouter()

class User(BaseModel):
    username: str
    password: str

@router.post("/login")
async def login(user: User):
    try:
        db_user = users_collection.find_one({"username": user.username})
        if not db_user:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        # Ensure stored password is bytes
        stored_password = db_user["password"]
        if isinstance(stored_password, str):
            stored_password = stored_password.encode()

        if not bcrypt.checkpw(user.password.encode(), stored_password):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        if not settings.JWT_SECRET:
            raise HTTPException(status_code=500, detail="Server misconfiguration")

        token = jwt.encode({"username": user.username}, settings.JWT_SECRET, algorithm="HS256")
        return {"access_token": token}

    except HTTPException:
        raise  # re-raise known HTTP errors
    except Exception as e:
        print("Login error:", e)  # log the error for debugging
        raise HTTPException(status_code=500, detail="Internal server error")
