from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import databases
import jwt
import datetime
import os
from dotenv import load_dotenv
import hashlib

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
JWT_SECRET = os.getenv("JWT_SECRET")

database = databases.Database(DATABASE_URL)

class UserRegister(BaseModel):
    email: str
    username: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

router = APIRouter()

@router.on_event("startup")
async def startup():
    await database.connect()

@router.on_event("shutdown")
async def shutdown():
    await database.disconnect()

@router.post("/register")
async def register(user: UserRegister):
    # Check if email exists
    query = "SELECT id FROM users WHERE email = :email"
    existing = await database.fetch_one(query, {"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash password
    hashed = hashlib.sha256(user.password.encode()).hexdigest()

    # Insert
    query = "INSERT INTO users (email, username, password_hash) VALUES (:email, :username, :hash)"
    await database.execute(query, {"email": user.email, "username": user.username, "hash": hashed})

    return {"message": "User registered successfully"}

@router.post("/login")
async def login(user: UserLogin):
    # Get user by email OR username
    query = "SELECT id, email, username, password_hash FROM users WHERE email = :login OR username = :login"
    db_user = await database.fetch_one(query, {"login": user.email})
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid email/username or password")

    # Verify password
    hashed = hashlib.sha256(user.password.encode()).hexdigest()
    if hashed != db_user["password_hash"]:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Create JWT
    payload = {
        "user_id": db_user["id"],
        "email": db_user["email"],
        "username": db_user["username"],
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")

    return {"access_token": token, "token_type": "bearer"}