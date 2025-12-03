from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, JSON, Boolean, Text
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from db.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    role = Column(String, nullable=False) # requestor, reviewer, admin
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    intake_requests = relationship("IntakeRequest", back_populates="requestor")
    review_tasks = relationship("ReviewTask", back_populates="reviewer")
    comments = relationship("Comment", back_populates="commenter")

class IntakeRequest(Base):
    __tablename__ = "intake_requests"

    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, nullable=False)
    description = Column(Text)
    requestor_id = Column(String, ForeignKey("users.id"))
    status = Column(String, default="draft") # draft, submitted, reviewing, approved, denied
    details = Column(JSON)
    risk_score = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    requestor = relationship("User", back_populates="intake_requests")
    versions = relationship("IntakeRequestVersion", back_populates="request")
    review_tasks = relationship("ReviewTask", back_populates="request")
    risk_scores = relationship("RiskScore", back_populates="request")

class IntakeRequestVersion(Base):
    __tablename__ = "intake_request_versions"

    id = Column(String, primary_key=True, default=generate_uuid)
    request_id = Column(String, ForeignKey("intake_requests.id"))
    version = Column(Integer, nullable=False)
    json_data = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

    request = relationship("IntakeRequest", back_populates="versions")

class ReviewTask(Base):
    __tablename__ = "review_tasks"

    id = Column(String, primary_key=True, default=generate_uuid)
    request_id = Column(String, ForeignKey("intake_requests.id"))
    reviewer_id = Column(String, ForeignKey("users.id"), nullable=True)
    team = Column(String, nullable=False) # cybersecurity, legal, compliance, arch
    status = Column(String, default="pending") # pending, needs-info, approved, rejected
    comments = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    request = relationship("IntakeRequest", back_populates="review_tasks")
    reviewer = relationship("User", back_populates="review_tasks")
    task_comments = relationship("Comment", back_populates="task")

class Comment(Base):
    __tablename__ = "comments"

    id = Column(String, primary_key=True, default=generate_uuid)
    task_id = Column(String, ForeignKey("review_tasks.id"))
    commenter_id = Column(String, ForeignKey("users.id"))
    section = Column(String)
    text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    task = relationship("ReviewTask", back_populates="task_comments")
    commenter = relationship("User", back_populates="comments")

class RiskScore(Base):
    __tablename__ = "risk_scores"

    id = Column(String, primary_key=True, default=generate_uuid)
    request_id = Column(String, ForeignKey("intake_requests.id"))
    nist_score = Column(Integer)
    soc2_score = Column(Integer)
    sox_score = Column(Integer)
    owasp_score = Column(Integer)
    maestro_score = Column(Integer)
    total_score = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)

    request = relationship("IntakeRequest", back_populates="risk_scores")

class ComplianceChecklist(Base):
    __tablename__ = "compliance_checklists"

    id = Column(String, primary_key=True, default=generate_uuid)
    request_id = Column(String, ForeignKey("intake_requests.id"))
    framework = Column(String, nullable=False)  # NIST, SOC2, SOX, OWASP, MAESTRO
    questions = Column(JSON)  # Array of {category, question, answer, notes}
    completed = Column(Boolean, default=False)
    completed_by = Column(String, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    request = relationship("IntakeRequest", backref="checklists")
    completer = relationship("User", foreign_keys=[completed_by])

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, default=generate_uuid)
    request_id = Column(String, nullable=True)
    user_id = Column(String, nullable=True)
    action = Column(String, nullable=False)
    metadata_ = Column("metadata", JSON) # metadata is reserved in SQLAlchemy
    created_at = Column(DateTime, default=datetime.utcnow)
