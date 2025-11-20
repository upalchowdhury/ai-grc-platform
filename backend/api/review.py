from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from db.database import get_db
from models.models import ReviewTask, Comment, User, IntakeRequest
from pydantic import BaseModel
from datetime import datetime
import uuid

router = APIRouter()

class ReviewTaskCreate(BaseModel):
    request_id: uuid.UUID
    team: str
    reviewer_id: Optional[uuid.UUID] = None

class ReviewTaskUpdate(BaseModel):
    status: str
    comments: Optional[str] = None

class ReviewTaskResponse(BaseModel):
    id: uuid.UUID
    request_id: uuid.UUID
    team: str
    status: str
    comments: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

@router.post("/", response_model=ReviewTaskResponse)
def create_review_task(task: ReviewTaskCreate, db: Session = Depends(get_db)):
    db_task = ReviewTask(
        request_id=task.request_id,
        team=task.team,
        reviewer_id=task.reviewer_id,
        status="pending"
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.put("/{task_id}", response_model=ReviewTaskResponse)
def update_review_task(task_id: uuid.UUID, update: ReviewTaskUpdate, db: Session = Depends(get_db)):
    task = db.query(ReviewTask).filter(ReviewTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task.status = update.status
    if update.comments:
        task.comments = update.comments
    
    db.commit()
    db.refresh(task)
    return task

@router.get("/pending", response_model=List[ReviewTaskResponse])
def list_pending_tasks(db: Session = Depends(get_db)):
    return db.query(ReviewTask).filter(ReviewTask.status == "pending").all()
