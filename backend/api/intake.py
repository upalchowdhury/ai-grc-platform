from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from db.database import get_db
from models.models import IntakeRequest, IntakeRequestVersion, User
from pydantic import BaseModel
from datetime import datetime
import uuid

router = APIRouter()

class IntakeRequestCreate(BaseModel):
    title: str
    description: str
    requestor_id: str # Changed from uuid.UUID to str to match frontend mock ID
    
    class Config:
        extra = "allow"

class IntakeRequestResponse(BaseModel):
    id: str # Changed from uuid.UUID to str
    title: str
    description: str
    status: str
    requestor_id: str
    details: Optional[dict] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

@router.post("/", response_model=IntakeRequestResponse)
def create_intake_request(request: IntakeRequestCreate, db: Session = Depends(get_db)):
    # Extract known fields
    request_data = request.model_dump()
    title = request_data.pop("title")
    description = request_data.pop("description")
    requestor_id = request_data.pop("requestor_id")
    
    # The rest goes into details
    details = request_data

    db_request = IntakeRequest(
        title=title,
        description=description,
        requestor_id=requestor_id,
        status="draft",
        details=details
    )
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

@router.get("/{request_id}", response_model=IntakeRequestResponse)
def get_intake_request(request_id: uuid.UUID, db: Session = Depends(get_db)):
    request = db.query(IntakeRequest).filter(IntakeRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    return request

@router.get("/", response_model=List[IntakeRequestResponse])
def list_intake_requests(db: Session = Depends(get_db)):
    return db.query(IntakeRequest).all()
