from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import scan, auth, reports

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Vulnerability Scanner Backend is running"}

# Include routers
app.include_router(scan.router, prefix="/api/scan", tags=["Scan"])
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])

# Allowed origins
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://cyber-group-16.vercel.app",  # added Vercel frontend
]

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,    # no "*", explicitly listed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
