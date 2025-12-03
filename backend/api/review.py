from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from db.database import get_db
from models.models import ReviewTask, Comment, User, IntakeRequest
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class ReviewActionRequest(BaseModel):
    reviewer_id: str
    team: str
    comments: str = ""

class CommentRequest(BaseModel):
    commenter_id: str
    section: str
    text: str

class ReviewTaskResponse(BaseModel):
    id: str
    request_id: str
    team: str
    status: str
    comments: Optional[str]
    reviewer_id: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class CommentResponse(BaseModel):
    id: str
    task_id: str
    commenter_id: str
    section: str
    text: str
    created_at: datetime

    class Config:
        from_attributes = True

@router.post("/{request_id}/create-task", response_model=ReviewTaskResponse)
def create_review_task(
    request_id: str,
    action: ReviewActionRequest,
    db: Session = Depends(get_db)
):
    """Create a review task for a specific team"""
    # Verify request exists
    intake_request = db.query(IntakeRequest).filter(IntakeRequest.id == request_id).first()
    if not intake_request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    # Create review task
    task = ReviewTask(
        request_id=request_id,
        reviewer_id=action.reviewer_id,
        team=action.team,
        status='pending'
    )
    db.add(task)
    
    # Update request status
    intake_request.status = 'reviewing'
    
    db.commit()
    db.refresh(task)
    return task

@router.post("/{request_id}/approve", response_model=dict)
def approve_request(
    request_id: str,
    action: ReviewActionRequest,
    db: Session = Depends(get_db)
):
    """Approve a request"""
    # Find the review task
    task = db.query(ReviewTask).filter(
        ReviewTask.request_id == request_id,
        ReviewTask.team == action.team
    ).first()
    
    if not task:
        # Create a new task if it doesn't exist
        task = ReviewTask(
            request_id=request_id,
            reviewer_id=action.reviewer_id,
            team=action.team,
            status='approved',
            comments=action.comments
        )
        db.add(task)
    else:
        task.status = 'approved'
        task.comments = action.comments
        task.reviewer_id = action.reviewer_id
    
    # Check if all reviews are approved
    all_tasks = db.query(ReviewTask).filter(ReviewTask.request_id == request_id).all()
    if all(t.status == 'approved' for t in all_tasks):
        intake_request = db.query(IntakeRequest).filter(IntakeRequest.id == request_id).first()
        if intake_request:
            intake_request.status = 'approved'
    
    db.commit()
    return {"message": "Request approved", "task_id": task.id}

@router.post("/{request_id}/reject", response_model=dict)
def reject_request(
    request_id: str,
    action: ReviewActionRequest,
    db: Session = Depends(get_db)
):
    """Reject a request"""
    task = db.query(ReviewTask).filter(
        ReviewTask.request_id == request_id,
        ReviewTask.team == action.team
    ).first()
    
    if not task:
        # Create a new task if it doesn't exist
        task = ReviewTask(
            request_id=request_id,
            reviewer_id=action.reviewer_id,
            team=action.team,
            status='rejected',
            comments=action.comments
        )
        db.add(task)
    else:
        task.status = 'rejected'
        task.comments = action.comments
        task.reviewer_id = action.reviewer_id
    
    # Update request status
    intake_request = db.query(IntakeRequest).filter(IntakeRequest.id == request_id).first()
    if intake_request:
        intake_request.status = 'denied'
    
    db.commit()
    return {"message": "Request rejected", "task_id": task.id}

@router.post("/{request_id}/request-info", response_model=dict)
def request_more_info(
    request_id: str,
    action: ReviewActionRequest,
    db: Session = Depends(get_db)
):
    """Request more information"""
    task = db.query(ReviewTask).filter(
        ReviewTask.request_id == request_id,
        ReviewTask.team == action.team
    ).first()
    
    if not task:
        # Create a new task if it doesn't exist
        task = ReviewTask(
            request_id=request_id,
            reviewer_id=action.reviewer_id,
            team=action.team,
            status='needs-info',
            comments=action.comments
        )
        db.add(task)
    else:
        task.status = 'needs-info'
        task.comments = action.comments
        task.reviewer_id = action.reviewer_id
    
    db.commit()
    return {"message": "Information requested", "task_id": task.id}

@router.post("/{request_id}/comment", response_model=CommentResponse)
def add_comment(
    request_id: str,
    comment_req: CommentRequest,
    db: Session = Depends(get_db)
):
    """Add a comment to a review"""
    # Find or create task
    task = db.query(ReviewTask).filter(
        ReviewTask.request_id == request_id
    ).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Review task not found")
    
    comment = Comment(
        task_id=task.id,
        commenter_id=comment_req.commenter_id,
        section=comment_req.section,
        text=comment_req.text
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment

@router.get("/{request_id}/tasks", response_model=List[ReviewTaskResponse])
def get_review_tasks(
    request_id: str,
    db: Session = Depends(get_db)
):
    """Get all review tasks for a request"""
    tasks = db.query(ReviewTask).filter(ReviewTask.request_id == request_id).all()
    return tasks

@router.get("/pending", response_model=List[ReviewTaskResponse])
def list_pending_tasks(db: Session = Depends(get_db)):
    """List all pending review tasks"""
    return db.query(ReviewTask).filter(ReviewTask.status == "pending").all()
