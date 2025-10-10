from fastapi import APIRouter, HTTPException, Depends
from app.core.db import users_collection
from app.core.config import settings
from app.models.user import User, UserLogin
import jwt, bcrypt

router = APIRouter()

# ---------------- Register -----------------
@router.post("/register")
async def register(user: User):
    if users_collection.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="User exists")

    hashed_pw = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt())
    user_data = {
        "username": user.username,
        "email": user.email,
        "full_name": user.full_name,
        "password": hashed_pw,
    }
    users_collection.insert_one(user_data)
    return {"message": "User registered"}


# ---------------- Login -----------------
@router.post("/login")
async def login(user: UserLogin):
    db_user = users_collection.find_one({"username": user.username})
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    stored_password = db_user["password"]
    if isinstance(stored_password, str):
        stored_password = stored_password.encode()

    if not bcrypt.checkpw(user.password.encode(), stored_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = jwt.encode(
        {
            "username": db_user["username"],
            "email": db_user["email"],
            "full_name": db_user["full_name"],
        },
        settings.JWT_SECRET,
        algorithm="HS256",
    )

    return {
        "access_token": token,
        "user": {
            "username": db_user["username"],
            "email": db_user["email"],
            "full_name": db_user["full_name"],
        },
    }


# ---------------- Get Current User -----------------
def get_current_user(token: str = Depends(lambda: None)):
    """Extract user data from JWT manually."""
    import fastapi
    from fastapi import Header

    async def _get_current_user(Authorization: str = Header(None)):
        if not Authorization:
            raise fastapi.HTTPException(status_code=401, detail="Missing Authorization header")

        try:
            token = Authorization.split(" ")[1]
            payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
            return payload  # this contains username, email, full_name
        except Exception as e:
            raise fastapi.HTTPException(status_code=401, detail="Invalid token")

    return _get_current_user


@router.get("/me")
async def get_user_info(current_user: dict = Depends(get_current_user())):
    return {
        "full_name": current_user["full_name"],
        "email": current_user["email"],
        "username": current_user["username"],
    }
