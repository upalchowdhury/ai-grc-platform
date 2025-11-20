from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from models.models import RiskScore, IntakeRequest
from pydantic import BaseModel
from datetime import datetime
import uuid
import random

router = APIRouter()

class RiskScoreResponse(BaseModel):
    id: uuid.UUID
    request_id: uuid.UUID
    nist_score: int
    soc2_score: int
    sox_score: int
    owasp_score: int
    maestro_score: int
    total_score: int
    created_at: datetime

    class Config:
        orm_mode = True

@router.post("/{request_id}/compute", response_model=RiskScoreResponse)
def compute_risk_score(request_id: uuid.UUID, db: Session = Depends(get_db)):
    request = db.query(IntakeRequest).filter(IntakeRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    # Mock scoring logic for now
    nist = random.randint(0, 100)
    soc2 = random.randint(0, 100)
    sox = random.randint(0, 100)
    owasp = random.randint(0, 100)
    maestro = random.randint(0, 100)
    total = (nist + soc2 + sox + owasp + maestro) // 5

    db_score = RiskScore(
        request_id=request_id,
        nist_score=nist,
        soc2_score=soc2,
        sox_score=sox,
        owasp_score=owasp,
        maestro_score=maestro,
        total_score=total
    )
    db.add(db_score)
    
    # Update request risk score
    request.risk_score = total
    
    db.commit()
    db.refresh(db_score)
    return db_score

@router.get("/{request_id}", response_model=RiskScoreResponse)
def get_risk_score(request_id: uuid.UUID, db: Session = Depends(get_db)):
    score = db.query(RiskScore).filter(RiskScore.request_id == request_id).order_by(RiskScore.created_at.desc()).first()
    if not score:
        raise HTTPException(status_code=404, detail="Score not found")
    return score
