from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import intake, review, scoring, ai
from db.database import engine, Base

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Intake Governance Platform", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(intake.router, prefix="/intake", tags=["intake"])
app.include_router(review.router, prefix="/review", tags=["review"])
app.include_router(scoring.router, prefix="/scoring", tags=["scoring"])
app.include_router(ai.router, prefix="/ai", tags=["ai"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Intake Governance Platform API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
