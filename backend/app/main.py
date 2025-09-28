from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import scan, auth, reports

app = FastAPI()

# Include routers
app.include_router(scan.router, prefix="/api/scan", tags=["Scan"])
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])

# Allow your frontend or all origins
origins = [
    "http://localhost:5173",  # if using Vite frontend
    "http://127.0.0.1:5173",
    "http://localhost:3000",  # React default
    "http://127.0.0.1:3000",
    "*",  # allow all origins (for testing only)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
