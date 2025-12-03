from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from models.models import IntakeRequest, RiskScore
from services.risk_scoring import RiskScoringEngine
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

router = APIRouter()

class RiskScoreResponse(BaseModel):
    id: str
    request_id: str
    nist_score: int
    soc2_score: int
    sox_score: int
    owasp_score: int
    maestro_score: int
    total_score: int
    created_at: datetime

    class Config:
        from_attributes = True

@router.post("/{request_id}/compute", response_model=RiskScoreResponse)
def compute_risk_score(
    request_id: str,
    db: Session = Depends(get_db)
):
    """Compute risk scores for a request"""
    request = db.query(IntakeRequest).filter(IntakeRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    engine = RiskScoringEngine()
    risk_score = engine.calculate_total_score(request, db)
    
    return risk_score

@router.get("/{request_id}", response_model=RiskScoreResponse)
def get_risk_score(
    request_id: str,
    db: Session = Depends(get_db)
):
    """Get risk scores for a request"""
    risk_score = db.query(RiskScore).filter(
        RiskScore.request_id == request_id
    ).first()
    
    if not risk_score:
        raise HTTPException(status_code=404, detail="Risk score not found. Compute it first using POST /{request_id}/compute")
    
    return risk_score
