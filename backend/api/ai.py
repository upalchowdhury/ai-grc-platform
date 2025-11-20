from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter()

class MissingFieldCheck(BaseModel):
    fields_present: List[str]

class MissingFieldResponse(BaseModel):
    missing_fields: List[str]
    suggestions: List[str]

@router.post("/check-missing-fields", response_model=MissingFieldResponse)
def check_missing_fields(check: MissingFieldCheck):
    # Mock AI logic
    required_fields = ["title", "description", "data_classification", "vendor"]
    missing = [f for f in required_fields if f not in check.fields_present]
    return {
        "missing_fields": missing,
        "suggestions": [f"Please provide {f}" for f in missing]
    }

@router.post("/generate-summary")
def generate_summary(description: str):
    # Mock AI summary
    return {"summary": f"AI Generated Summary for: {description[:50]}..."}
