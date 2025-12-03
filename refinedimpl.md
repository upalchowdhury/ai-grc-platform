# AI Governance Platform - Step-by-Step Implementation Guide
## For AI Code Editors (Cursor, Windsurf, Cline, etc.)

---

## 📋 **Table of Contents**
- [Phase 0: Project Setup](#phase-0-project-setup)
- [Phase 1: Basic Intake Form](#phase-1-basic-intake-form-mvp)
- [Phase 2: Request Management](#phase-2-request-management)
- [Phase 3: Reviewer Workflow](#phase-3-reviewer-workflow)
- [Phase 4: Risk Scoring Engine](#phase-4-risk-scoring-engine)
- [Phase 5: Compliance Frameworks](#phase-5-compliance-frameworks)
- [Phase 6: AI Automation](#phase-6-ai-automation)
- [Phase 7: Analytics Dashboard](#phase-7-analytics-dashboard)
- [Phase 8: Production Deployment](#phase-8-production-deployment)

---

## 🎯 **How to Use This Guide**

1. **Copy each phase prompt** into your AI code editor
2. **Wait for completion** before moving to the next phase
3. **Test thoroughly** after each phase
4. **Fix issues** before proceeding
5. Each phase builds on the previous one

---

# Phase 0: Project Setup

## Prompt 0.1 - Initial Project Structure

```
Create a new full-stack application with the following structure and configuration:

PROJECT NAME: ai-governance-platform

TECH STACK:
- Frontend: React 18 + Vite + TailwindCSS 3
- Backend: Python FastAPI
- Database: PostgreSQL 15
- Development: Docker Compose

FOLDER STRUCTURE:
ai-governance-platform/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── routes/
│   │       └── __init__.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── components/
│   │   │   └── .gitkeep
│   │   ├── pages/
│   │   │   └── .gitkeep
│   │   └── utils/
│   │       └── api.js
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md

REQUIREMENTS:

1. Backend (requirements.txt):
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
pydantic==2.5.0
python-dotenv==1.0.0
alembic==1.12.1
python-multipart==0.0.6

2. Frontend (package.json dependencies):
- react: ^18.2.0
- react-dom: ^18.2.0
- react-router-dom: ^6.20.0
- axios: ^1.6.2
- lucide-react: ^0.294.0

3. Frontend (package.json devDependencies):
- vite: ^5.0.0
- tailwindcss: ^3.3.5
- postcss: ^8.4.32
- autoprefixer: ^10.4.16

4. Docker Compose (docker-compose.yml):
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ai_governance
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/ai_governance
    depends_on:
      - postgres
    volumes:
      - ./backend:/app
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    command: npm run dev -- --host

volumes:
  postgres_data:

5. Environment Variables (.env.example):
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ai_governance
OPENAI_API_KEY=your_openai_key_here
SECRET_KEY=your_secret_key_here

6. TailwindCSS Config (tailwind.config.js):
Use the design system from my requirements:
- Primary colors: indigo-600, violet-500
- Neutral colors: slate-50, slate-900, slate-800, slate-700
- Functional colors: emerald-500, amber-500, rose-500, sky-500
- Font family: Inter or system sans-serif

7. README.md should include:
- Project description
- Prerequisites (Docker, Node.js, Python)
- Setup instructions
- How to run locally
- API documentation link

GENERATE ALL FILES WITH PROPER CONFIGURATION.
DO NOT implement any features yet - just the project skeleton.
```

### ✅ Validation Steps:
```bash
# After AI generates files, run:
cd ai-governance-platform
docker-compose up -d postgres
cd backend && pip install -r requirements.txt
cd ../frontend && npm install
docker-compose up
```

Expected: Frontend at http://localhost:5173, Backend at http://localhost:8000/docs

---

# Phase 1: Basic Intake Form (MVP)

## Prompt 1.1 - Database Schema & Models

```
Implement the core database schema for intake requests.

CREATE THESE FILES:

1. backend/app/models.py:

from sqlalchemy import Column, String, Text, DateTime, JSON, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from .database import Base

class IntakeRequest(Base):
    __tablename__ = "intake_requests"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    requestor_name = Column(String(255), nullable=False)
    requestor_email = Column(String(255), nullable=False)
    
    # AI Project Details
    model_used = Column(String(100))  # GPT-4, Claude, Gemini, etc.
    model_provider = Column(String(100))  # OpenAI, Anthropic, Google, etc.
    use_case = Column(String(100))  # Chatbot, Analysis, Automation, etc.
    deployment_type = Column(String(100))  # Cloud, On-Premise, Hybrid
    
    # Data Handling
    data_types = Column(JSON)  # Array of: PII, PHI, Financial, Public
    data_volume = Column(String(50))  # Small, Medium, Large, Very Large
    
    # Risk & Compliance (to be populated later)
    risk_score = Column(Integer, default=0)
    status = Column(String(50), default='draft')  # draft, submitted, reviewing, approved, denied
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

2. backend/app/database.py:

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

3. backend/app/schemas.py:

from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class IntakeRequestCreate(BaseModel):
    title: str
    description: Optional[str] = None
    requestor_name: str
    requestor_email: EmailStr
    model_used: Optional[str] = None
    model_provider: Optional[str] = None
    use_case: Optional[str] = None
    deployment_type: Optional[str] = None
    data_types: Optional[List[str]] = []
    data_volume: Optional[str] = None

class IntakeRequestResponse(BaseModel):
    id: UUID
    title: str
    description: Optional[str]
    requestor_name: str
    requestor_email: str
    model_used: Optional[str]
    model_provider: Optional[str]
    use_case: Optional[str]
    deployment_type: Optional[str]
    data_types: Optional[List[str]]
    data_volume: Optional[str]
    risk_score: int
    status: str
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

4. Create Alembic migration to initialize database:

# Run these commands in backend directory:
alembic init alembic
# Then update alembic.ini and create initial migration

5. Update backend/app/main.py to create tables on startup:

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .models import IntakeRequest

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Governance Platform API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "AI Governance Platform API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
```

### ✅ Validation:
```bash
docker-compose restart backend
curl http://localhost:8000/health
```

---

## Prompt 1.2 - Backend API Endpoints

```
Create CRUD API endpoints for intake requests.

CREATE FILE: backend/app/routes/intake.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from ..database import get_db
from ..models import IntakeRequest
from ..schemas import IntakeRequestCreate, IntakeRequestResponse

router = APIRouter(prefix="/api/intake", tags=["Intake"])

@router.post("", response_model=IntakeRequestResponse, status_code=201)
def create_intake_request(
    request: IntakeRequestCreate,
    db: Session = Depends(get_db)
):
    """Create a new intake request"""
    db_request = IntakeRequest(**request.dict())
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

@router.get("", response_model=List[IntakeRequestResponse])
def list_intake_requests(
    status: str = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """List all intake requests with optional status filter"""
    query = db.query(IntakeRequest)
    if status:
        query = query.filter(IntakeRequest.status == status)
    requests = query.offset(skip).limit(limit).all()
    return requests

@router.get("/{request_id}", response_model=IntakeRequestResponse)
def get_intake_request(
    request_id: UUID,
    db: Session = Depends(get_db)
):
    """Get a single intake request by ID"""
    request = db.query(IntakeRequest).filter(IntakeRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    return request

@router.put("/{request_id}", response_model=IntakeRequestResponse)
def update_intake_request(
    request_id: UUID,
    request_update: IntakeRequestCreate,
    db: Session = Depends(get_db)
):
    """Update an intake request"""
    db_request = db.query(IntakeRequest).filter(IntakeRequest.id == request_id).first()
    if not db_request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    for key, value in request_update.dict(exclude_unset=True).items():
        setattr(db_request, key, value)
    
    db.commit()
    db.refresh(db_request)
    return db_request

@router.delete("/{request_id}", status_code=204)
def delete_intake_request(
    request_id: UUID,
    db: Session = Depends(get_db)
):
    """Delete an intake request"""
    db_request = db.query(IntakeRequest).filter(IntakeRequest.id == request_id).first()
    if not db_request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    db.delete(db_request)
    db.commit()
    return None

UPDATE backend/app/main.py to include the router:

from .routes import intake

app.include_router(intake.router)
```

### ✅ Validation:
Visit http://localhost:8000/docs and test all endpoints

---

## Prompt 1.3 - Frontend Layout & Sidebar

```
Create the main layout with sidebar navigation using the modern design system.

CREATE FILE: frontend/src/components/Sidebar.jsx

import { FileText, ShieldCheck, Lock, Scale, ClipboardCheck, BarChart3 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { name: 'New Request', path: '/', icon: FileText },
  { name: 'My Requests', path: '/requests', icon: ClipboardCheck },
  { name: 'Compliance', path: '/compliance', icon: ShieldCheck },
  { name: 'Security', path: '/security', icon: Lock },
  { name: 'Governance', path: '/governance', icon: Scale },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0 border-r border-slate-800 shadow-2xl z-50">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
          AI GRC Platform
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 group relative ${
                isActive
                  ? 'text-white bg-white/10 border-r-4 border-indigo-500'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-white'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-slate-800">
        <p className="text-xs text-slate-500">Version 1.0.0</p>
      </div>
    </div>
  );
}

CREATE FILE: frontend/src/components/Layout.jsx

import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <main className="ml-64 flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

UPDATE frontend/src/App.jsx:

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<div>Home - Intake Form</div>} />
          <Route path="/requests" element={<div>My Requests</div>} />
          <Route path="/compliance" element={<div>Compliance (Coming Soon)</div>} />
          <Route path="/security" element={<div>Security (Coming Soon)</div>} />
          <Route path="/governance" element={<div>Governance (Coming Soon)</div>} />
          <Route path="/analytics" element={<div>Analytics (Coming Soon)</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

UPDATE frontend/src/index.css:

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply font-sans antialiased;
  }
}
```

### ✅ Validation:
Frontend should show sidebar with navigation working

---

## Prompt 1.4 - API Utility & Axios Setup

```
Create API utility for frontend-backend communication.

CREATE FILE: frontend/src/utils/api.js

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token (future)
api.interceptors.request.use(
  (config) => {
    // Add auth token here later
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.data);
    }
    return Promise.reject(error);
  }
);

// Intake Request APIs
export const intakeAPI = {
  create: (data) => api.post('/api/intake', data),
  list: (params) => api.get('/api/intake', { params }),
  get: (id) => api.get(`/api/intake/${id}`),
  update: (id, data) => api.put(`/api/intake/${id}`, data),
  delete: (id) => api.delete(`/api/intake/${id}`),
};

export default api;

CREATE FILE: frontend/.env

VITE_API_URL=http://localhost:8000
```

---

## Prompt 1.5 - Intake Form Component

```
Create the main intake form component with proper styling and validation.

CREATE FILE: frontend/src/pages/IntakeForm.jsx

import { useState } from 'react';
import { intakeAPI } from '../utils/api';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function IntakeForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requestor_name: '',
    requestor_email: '',
    model_used: '',
    model_provider: '',
    use_case: '',
    deployment_type: '',
    data_types: [],
    data_volume: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        data_types: checked
          ? [...prev.data_types, value]
          : prev.data_types.filter(t => t !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await intakeAPI.create(formData);
      setSuccess(true);
      // Reset form
      setFormData({
        title: '',
        description: '',
        requestor_name: '',
        requestor_email: '',
        model_used: '',
        model_provider: '',
        use_case: '',
        deployment_type: '',
        data_types: [],
        data_volume: '',
      });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">New AI Project Intake</h1>
        <p className="mt-2 text-slate-600">Submit a new AI/ML project for governance review</p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <p className="text-emerald-800 font-medium">Request submitted successfully!</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600" />
          <p className="text-rose-800">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Section 1: Basic Information */}
        <div className="bg-slate-50 px-8 py-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-700 uppercase text-xs tracking-wider">Basic Information</h2>
        </div>
        <div className="p-8 grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Project Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 px-3 transition-shadow"
              placeholder="e.g., Customer Support Chatbot"
            />
          </div>

          <div className="col-span-12">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 px-3 transition-shadow resize-y"
              placeholder="Describe the purpose and functionality of this AI project..."
            />
          </div>

          <div className="col-span-6">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Your Name *</label>
            <input
              type="text"
              name="requestor_name"
              value={formData.requestor_name}
              onChange={handleChange}
              required
              className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 px-3"
            />
          </div>

          <div className="col-span-6">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Your Email *</label>
            <input
              type="email"
              name="requestor_email"
              value={formData.requestor_email}
              onChange={handleChange}
              required
              className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 px-3"
            />
          </div>
        </div>

        {/* Section 2: AI Model Details */}
        <div className="bg-slate-50 px-8 py-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-700 uppercase text-xs tracking-wider">AI Model Details</h2>
        </div>
        <div className="p-8 grid grid-cols-12 gap-6">
          <div className="col-span-6">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Model Used</label>
            <select
              name="model_used"
              value={formData.model_used}
              onChange={handleChange}
              className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 px-3"
            >
              <option value="">Select a model</option>
              <option value="GPT-4">GPT-4</option>
              <option value="GPT-3.5">GPT-3.5</option>
              <option value="Claude 3 Opus">Claude 3 Opus</option>
              <option value="Claude 3 Sonnet">Claude 3 Sonnet</option>
              <option value="Gemini Pro">Gemini Pro</option>
              <option value="Custom Model">Custom Model</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="col-span-6">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Model Provider</label>
            <select
              name="model_provider"
              value={formData.model_provider}
              onChange={handleChange}
              className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 px-3"
            >
              <option value="">Select a provider</option>
              <option value="OpenAI">OpenAI</option>
              <option value="Anthropic">Anthropic</option>
              <option value="Google">Google (Vertex AI)</option>
              <option value="AWS Bedrock">AWS Bedrock</option>
              <option value="Azure OpenAI">Azure OpenAI</option>
              <option value="Self-Hosted">Self-Hosted</option>
            </select>
          </div>

          <div className="col-span-6">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Use Case</label>
            <select
              name="use_case"
              value={formData.use_case}
              onChange={handleChange}
              className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 px-3"
            >
              <option value="">Select use case</option>
              <option value="Chatbot">Chatbot / Virtual Assistant</option>
              <option value="Content Generation">Content Generation</option>
              <option value="Data Analysis">Data Analysis</option>
              <option value="Code Generation">Code Generation</option>
              <option value="Translation">Translation</option>
              <option value="Automation">Process Automation</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="col-span-6">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Deployment Type</label>
            <select
              name="deployment_type"
              value={formData.deployment_type}
              onChange={handleChange}
              className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 px-3"
            >
              <option value="">Select deployment type</option>
              <option value="Cloud">Cloud</option>
              <option value="On-Premise">On-Premise</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        {/* Section 3: Data Handling */}
        <div className="bg-slate-50 px-8 py-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-700 uppercase text-xs tracking-wider">Data Handling</h2>
        </div>
        <div className="p-8 grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <label className="block text-sm font-medium text-slate-700 mb-3">Data Types (Check all that apply)</label>
            <div className="space-y-2">
              {['PII', 'PHI', 'Financial', 'Intellectual Property', 'Public Data'].map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    value={type}
                    checked={formData.data_types.includes(type)}
                    onChange={handleChange}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                  <span className="ml-2 text-sm text-slate-700">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="col-span-6">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Expected Data Volume</label>
            <select
              name="data_volume"
              value={formData.data_volume}
              onChange={handleChange}
              className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 px-3"
            >
              <option value="">Select volume</option>
              <option value="Small">Small (&lt; 1GB)</option>
              <option value="Medium">Medium (1-10GB)</option>
              <option value="Large">Large (10-100GB)</option>
              <option value="Very Large">Very Large (&gt; 100GB)</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="px-8 py-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button
            type="button"
            className="px-5 py-2.5 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors"
          >
            Save Draft
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Request'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

UPDATE frontend/src/App.jsx to use IntakeForm:

import IntakeForm from './pages/IntakeForm';

// In Routes:
<Route path="/" element={<IntakeForm />} />
```

### ✅ Validation:
1. Fill out the form
2. Submit it
3. Check if data appears in PostgreSQL
4. Verify success message appears

---

# Phase 2: Request Management

## Prompt 2.1 - Request List Page

```
Create a page to display all submitted intake requests with filtering.

CREATE FILE: frontend/src/pages/RequestList.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { intakeAPI } from '../utils/api';
import { Eye, Filter, Loader2 } from 'lucide-react';

const STATUS_COLORS = {
  draft: 'bg-slate-100 text-slate-800',
  submitted: 'bg-sky-100 text-sky-800',
  reviewing: 'bg-amber-100 text-amber-800',
  approved: 'bg-emerald-100 text-emerald-800',
  denied: 'bg-rose-100 text-rose-800',
};

export default function RequestList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = statusFilter ? { status: statusFilter } : {};
      const response = await intakeAPI.list(params);
      setRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Requests</h1>
          <p className="mt-2 text-slate-600">View and manage your AI project intake requests</p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          New Request
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <label className="text-sm font-medium text-slate-700">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border-slate-300 text-sm py-1.5 px-3 focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">All</option>
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
            <option value="reviewing">Reviewing</option>
            <option value="approved">Approved</option>
            <option value="denied">Denied</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <p className="text-slate-600">No requests found</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Model
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Risk Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">{request.title}</div>
                    <div className="text-sm text-slate-500">{request.requestor_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{request.model_used || 'N/A'}</div>
                    <div className="text-sm text-slate-500">{request.model_provider || ''}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[request.status]}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{request.risk_score}/100</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {formatDate(request.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link
                      to={`/requests/${request.id}`}
                      className="text-indigo-600 hover:text-indigo-900 inline-flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

UPDATE frontend/src/App.jsx:

import RequestList from './pages/RequestList';

// In Routes:
<Route path="/requests" element={<RequestList />} />
```

---

## Prompt 2.2 - Request Detail Page

```
Create a detailed view page for individual requests.

CREATE FILE: frontend/src/pages/RequestDetail.jsx

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { intakeAPI } from '../utils/api';
import { ArrowLeft, Loader2, CheckCircle, XCircle } from 'lucide-react';

const STATUS_COLORS = {
  draft: 'bg-slate-100 text-slate-800',
  submitted: 'bg-sky-100 text-sky-800',
  reviewing: 'bg-amber-100 text-amber-800',
  approved: 'bg-emerald-100 text-emerald-800',
  denied: 'bg-rose-100 text-rose-800',
};

export default function RequestDetail() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const fetchRequest = async () => {
    try {
      const response = await intakeAPI.get(id);
      setRequest(response.data);
    } catch (error) {
      console.error('Failed to fetch request:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Request not found</p>
        <Link to="/requests" className="text-indigo-600 hover:text-indigo-900 mt-4 inline-block">
          ← Back to Requests
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back Button */}
      <Link
        to="/requests"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Requests
      </Link>

      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{request.title}</h1>
          <p className="mt-2 text-slate-600">Submitted by {request.requestor_name}</p>
        </div>
        <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${STATUS_COLORS[request.status]}`}>
          {request.status}
        </span>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h2>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-slate-500">Description</dt>
              <dd className="mt-1 text-sm text-slate-900">{request.description || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Requestor Email</dt>
              <dd className="mt-1 text-sm text-slate-900">{request.requestor_email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Created At</dt>
              <dd className="mt-1 text-sm text-slate-900">
                {new Date(request.created_at).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Risk Score</dt>
              <dd className="mt-1 text-sm font-semibold text-slate-900">{request.risk_score}/100</dd>
            </div>
          </dl>
        </div>

        {/* AI Model Details */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">AI Model Details</h2>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-slate-500">Model Used</dt>
              <dd className="mt-1 text-sm text-slate-900">{request.model_used || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Model Provider</dt>
              <dd className="mt-1 text-sm text-slate-900">{request.model_provider || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Use Case</dt>
              <dd className="mt-1 text-sm text-slate-900">{request.use_case || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Deployment Type</dt>
              <dd className="mt-1 text-sm text-slate-900">{request.deployment_type || 'N/A'}</dd>
            </div>
          </dl>
        </div>

        {/* Data Handling */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Data Handling</h2>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-slate-500">Data Types</dt>
              <dd className="mt-1">
                {request.data_types && request.data_types.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {request.data_types.map((type) => (
                      <span
                        key={type}
                        className="inline-flex px-2 py-1 text-xs font-medium rounded bg-slate-100 text-slate-800"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-slate-900">N/A</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Data Volume</dt>
              <dd className="mt-1 text-sm text-slate-900">{request.data_volume || 'N/A'}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

UPDATE frontend/src/App.jsx:

import RequestDetail from './pages/RequestDetail';

// In Routes:
<Route path="/requests/:id" element={<RequestDetail />} />
```

### ✅ Phase 2 Complete
Test: Create request → View in list → Click to see details

---

# Phase 3: Reviewer Workflow

## Prompt 3.1 - Add Review Tables to Database

```
Add database models for reviewers and review workflow.

UPDATE backend/app/models.py - ADD these new models:

from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    role = Column(String(50), default='requestor')  # requestor, reviewer, admin
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class ReviewTask(Base):
    __tablename__ = "review_tasks"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    request_id = Column(UUID(as_uuid=True), ForeignKey('intake_requests.id'), nullable=False)
    reviewer_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    team = Column(String(50))  # cybersecurity, legal, compliance, architecture
    status = Column(String(50), default='pending')  # pending, needs-info, approved, rejected
    comments = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    request = relationship("IntakeRequest", backref="review_tasks")
    reviewer = relationship("User", backref="review_tasks")

class Comment(Base):
    __tablename__ = "comments"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    task_id = Column(UUID(as_uuid=True), ForeignKey('review_tasks.id'), nullable=False)
    commenter_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    section = Column(String(100))  # Which form section this comment is about
    text = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    task = relationship("ReviewTask", backref="comments")
    commenter = relationship("User", backref="comments")

UPDATE backend/app/main.py to create all tables:

from .models import IntakeRequest, User, ReviewTask, Comment
Base.metadata.create_all(bind=engine)
```

---

## Prompt 3.2 - Review API Endpoints

```
Create API endpoints for reviewer actions.

CREATE FILE: backend/app/routes/review.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from pydantic import BaseModel
from ..database import get_db
from ..models import ReviewTask, Comment, IntakeRequest

router = APIRouter(prefix="/api/review", tags=["Review"])

class ReviewActionRequest(BaseModel):
    reviewer_id: UUID
    team: str
    comments: str = ""

class CommentRequest(BaseModel):
    commenter_id: UUID
    section: str
    text: str

@router.post("/{request_id}/create-task")
def create_review_task(
    request_id: UUID,
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

@router.post("/{request_id}/approve")
def approve_request(
    request_id: UUID,
    action: ReviewActionRequest,
    db: Session = Depends(get_db)
):
    """Approve a request"""
    # Find the review task
    task = db.query(ReviewTask).filter(
        ReviewTask.request_id == request_id,
        ReviewTask.reviewer_id == action.reviewer_id
    ).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Review task not found")
    
    task.status = 'approved'
    task.comments = action.comments
    
    # Check if all reviews are approved
    all_tasks = db.query(ReviewTask).filter(ReviewTask.request_id == request_id).all()
    if all(t.status == 'approved' for t in all_tasks):
        intake_request = db.query(IntakeRequest).filter(IntakeRequest.id == request_id).first()
        intake_request.status = 'approved'
    
    db.commit()
    return {"message": "Request approved"}

@router.post("/{request_id}/reject")
def reject_request(
    request_id: UUID,
    action: ReviewActionRequest,
    db: Session = Depends(get_db)
):
    """Reject a request"""
    task = db.query(ReviewTask).filter(
        ReviewTask.request_id == request_id,
        ReviewTask.reviewer_id == action.reviewer_id
    ).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Review task not found")
    
    task.status = 'rejected'
    task.comments = action.comments
    
    # Update request status
    intake_request = db.query(IntakeRequest).filter(IntakeRequest.id == request_id).first()
    intake_request.status = 'denied'
    
    db.commit()
    return {"message": "Request rejected"}

@router.post("/{request_id}/request-info")
def request_more_info(
    request_id: UUID,
    action: ReviewActionRequest,
    db: Session = Depends(get_db)
):
    """Request more information"""
    task = db.query(ReviewTask).filter(
        ReviewTask.request_id == request_id,
        ReviewTask.reviewer_id == action.reviewer_id
    ).first()
    
    if not task:
        raise HTTPException(status_code=404, detail="Review task not found")
    
    task.status = 'needs-info'
    task.comments = action.comments
    
    db.commit()
    return {"message": "Information requested"}

@router.post("/{request_id}/comment")
def add_comment(
    request_id: UUID,
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

@router.get("/{request_id}/tasks")
def get_review_tasks(
    request_id: UUID,
    db: Session = Depends(get_db)
):
    """Get all review tasks for a request"""
    tasks = db.query(ReviewTask).filter(ReviewTask.request_id == request_id).all()
    return tasks

UPDATE backend/app/main.py:

from .routes import intake, review

app.include_router(intake.router)
app.include_router(review.router)
```

### ✅ Phase 3 Complete
Test review endpoints in FastAPI docs

---

# Phase 4: Risk Scoring Engine

## Prompt 4.1 - Risk Score Model & Calculation

```
Implement the risk scoring engine with multiple compliance frameworks.

CREATE FILE: backend/app/models.py - ADD RiskScore model:

class RiskScore(Base):
    __tablename__ = "risk_scores"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    request_id = Column(UUID(as_uuid=True), ForeignKey('intake_requests.id'), nullable=False)
    nist_score = Column(Integer, default=0)
    soc2_score = Column(Integer, default=0)
    sox_score = Column(Integer, default=0)
    owasp_score = Column(Integer, default=0)
    maestro_score = Column(Integer, default=0)
    total_score = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship
    request = relationship("IntakeRequest", backref="risk_scores")

CREATE FILE: backend/app/services/risk_scoring.py

from typing import Dict
from ..models import IntakeRequest, RiskScore
from sqlalchemy.orm import Session

class RiskScoringEngine:
    """
    Risk scoring engine that calculates scores based on:
    - NIST AI Risk Management Framework
    - SOC2
    - SOX
    - OWASP Top 10 for LLMs
    - MAESTRO
    """
    
    def __init__(self):
        # Configurable weights for each framework
        self.weights = {
            'nist': 0.25,
            'soc2': 0.20,
            'sox': 0.15,
            'owasp': 0.25,
            'maestro': 0.15
        }
    
    def calculate_nist_score(self, request: IntakeRequest) -> int:
        """
        NIST AI RMF scoring based on:
        - Govern: Oversight and accountability
        - Map: Understanding AI risks
        - Measure: Assessing impacts
        - Manage: Mitigating risks
        """
        score = 0
        max_score = 100
        
        # Data sensitivity check (higher sensitivity = higher risk)
        if request.data_types:
            if 'PHI' in request.data_types or 'PII' in request.data_types:
                score += 40  # High risk
            elif 'Financial' in request.data_types:
                score += 25
            elif 'Intellectual Property' in request.data_types:
                score += 20
            else:
                score += 5  # Public data
        
        # Deployment type risk
        if request.deployment_type == 'Cloud':
            score += 15  # Moderate risk
        elif request.deployment_type == 'On-Premise':
            score += 5  # Lower risk
        elif request.deployment_type == 'Hybrid':
            score += 10
        
        # Model complexity (placeholder - can be expanded)
        if request.model_used:
            if 'GPT-4' in request.model_used or 'Claude' in request.model_used:
                score += 15  # Advanced models = more risk
            else:
                score += 10
        
        return min(score, max_score)
    
    def calculate_soc2_score(self, request: IntakeRequest) -> int:
        """SOC2 Trust Service Criteria scoring"""
        score = 0
        
        # Security considerations
        if request.data_types and len(request.data_types) > 0:
            score += 20
        
        # Availability concerns
        if request.use_case in ['Chatbot', 'Automation']:
            score += 15  # Critical services
        
        # Confidentiality
        if 'PII' in (request.data_types or []) or 'PHI' in (request.data_types or []):
            score += 30
        
        return min(score, 100)
    
    def calculate_sox_score(self, request: IntakeRequest) -> int:
        """SOX compliance scoring"""
        score = 0
        
        # Financial data handling
        if 'Financial' in (request.data_types or []):
            score += 50  # High impact
        
        # Change control considerations
        if request.deployment_type == 'Cloud':
            score += 20
        
        return min(score, 100)
    
    def calculate_owasp_score(self, request: IntakeRequest) -> int:
        """OWASP Top 10 for LLMs scoring"""
        score = 0
        
        # Prompt injection risk
        if request.use_case == 'Chatbot':
            score += 25
        
        # Training data poisoning risk
        if request.model_used and 'Custom' in request.model_used:
            score += 20
        
        # Supply chain risk
        if request.model_provider in ['OpenAI', 'Anthropic', 'Google']:
            score += 10  # Third-party dependency
        elif request.model_provider == 'Self-Hosted':
            score += 5  # Lower supply chain risk
        
        # Data leakage
        if 'PII' in (request.data_types or []) or 'PHI' in (request.data_types or []):
            score += 30
        
        return min(score, 100)
    
    def calculate_maestro_score(self, request: IntakeRequest) -> int:
        """MAESTRO framework scoring"""
        score = 0
        
        # Model risk modes
        if request.model_used:
            score += 20
        
        # Testability concerns
        if request.deployment_type == 'Production':
            score += 25
        
        # Monitoring requirements
        if request.use_case in ['Chatbot', 'Automation']:
            score += 20
        
        return min(score, 100)
    
    def calculate_total_score(self, request: IntakeRequest, db: Session) -> RiskScore:
        """Calculate comprehensive risk score"""
        
        nist = self.calculate_nist_score(request)
        soc2 = self.calculate_soc2_score(request)
        sox = self.calculate_sox_score(request)
        owasp = self.calculate_owasp_score(request)
        maestro = self.calculate_maestro_score(request)
        
        # Weighted total
        total = int(
            nist * self.weights['nist'] +
            soc2 * self.weights['soc2'] +
            sox * self.weights['sox'] +
            owasp * self.weights['owasp'] +
            maestro * self.weights['maestro']
        )
        
        # Create or update risk score
        existing_score = db.query(RiskScore).filter(
            RiskScore.request_id == request.id
        ).first()
        
        if existing_score:
            existing_score.nist_score = nist
            existing_score.soc2_score = soc2
            existing_score.sox_score = sox
            existing_score.owasp_score = owasp
            existing_score.maestro_score = maestro
            existing_score.total_score = total
            risk_score = existing_score
        else:
            risk_score = RiskScore(
                request_id=request.id,
                nist_score=nist,
                soc2_score=soc2,
                sox_score=sox,
                owasp_score=owasp,
                maestro_score=maestro,
                total_score=total
            )
            db.add(risk_score)
        
        # Update request risk score
        request.risk_score = total
        
        db.commit()
        db.refresh(risk_score)
        
        return risk_score

CREATE FILE: backend/app/routes/scoring.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID
from ..database import get_db
from ..models import IntakeRequest, RiskScore
from ..services.risk_scoring import RiskScoringEngine

router = APIRouter(prefix="/api/risk-score", tags=["Risk Scoring"])

@router.post("/{request_id}/compute")
def compute_risk_score(
    request_id: UUID,
    db: Session = Depends(get_db)
):
    """Compute risk scores for a request"""
    request = db.query(IntakeRequest).filter(IntakeRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    engine = RiskScoringEngine()
    risk_score = engine.calculate_total_score(request, db)
    
    return risk_score

@router.get("/{request_id}")
def get_risk_score(
    request_id: UUID,
    db: Session = Depends(get_db)
):
    """Get risk scores for a request"""
    risk_score = db.query(RiskScore).filter(
        RiskScore.request_id == request_id
    ).first()
    
    if not risk_score:
        raise HTTPException(status_code=404, detail="Risk score not found")
    
    return risk_score

UPDATE backend/app/main.py:

from .routes import intake, review, scoring

app.include_router(scoring.router)
```

### ✅ Phase 4 Complete
Test: Submit request → Call /api/risk-score/{id}/compute → View scores

---

# Phase 5: Compliance Frameworks

## Prompt 5.1 - NIST AI RMF Checklist

```
Add detailed compliance checklists to the intake form and database.

UPDATE backend/app/models.py - ADD compliance tracking:

class ComplianceChecklist(Base):
    __tablename__ = "compliance_checklists"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    request_id = Column(UUID(as_uuid=True), ForeignKey('intake_requests.id'), nullable=False)
    framework = Column(String(50))  # NIST, SOC2, SOX, OWASP, MAESTRO
    questions = Column(JSON)  # Array of {question: str, answer: bool, notes: str}
    completed = Column(Boolean, default=False)
    completed_by = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    request = relationship("IntakeRequest", backref="checklists")

CREATE FILE: backend/app/services/compliance_frameworks.py

NIST_AI_RMF_CHECKLIST = [
    {
        "category": "Govern",
        "questions": [
            "Has AI governance structure been defined?",
            "Are roles and responsibilities documented?",
            "Is there executive oversight for AI initiatives?",
            "Have AI risk policies been established?"
        ]
    },
    {
        "category": "Map",
        "questions": [
            "Has the AI system context been documented?",
            "Are potential impacts identified?",
            "Have stakeholders been identified?",
            "Is the intended use clearly defined?"
        ]
    },
    {
        "category": "Measure",
        "questions": [
            "Are AI system metrics defined?",
            "Is performance monitoring in place?",
            "Are bias and fairness evaluated?",
            "Is model accuracy tracked?"
        ]
    },
    {
        "category": "Manage",
        "questions": [
            "Are risk mitigation strategies documented?",
            "Is incident response plan in place?",
            "Are regular audits scheduled?",
            "Is continuous monitoring implemented?"
        ]
    }
]

SOC2_CHECKLIST = [
    {
        "category": "Security",
        "questions": [
            "Is data encrypted at rest and in transit?",
            "Are access controls implemented?",
            "Is multi-factor authentication enabled?",
            "Are security logs maintained?"
        ]
    },
    {
        "category": "Availability",
        "questions": [
            "Is system uptime monitored?",
            "Is disaster recovery plan documented?",
            "Are backups performed regularly?",
            "Is redundancy implemented?"
        ]
    },
    {
        "category": "Confidentiality",
        "questions": [
            "Are confidentiality agreements in place?",
            "Is data classification implemented?",
            "Are confidential data access logs maintained?",
            "Is data sharing documented?"
        ]
    }
]

OWASP_LLM_CHECKLIST = [
    {
        "category": "Input Validation",
        "questions": [
            "Is prompt injection protection implemented?",
            "Are user inputs validated?",
            "Is input sanitization in place?",
            "Are rate limits configured?"
        ]
    },
    {
        "category": "Data Security",
        "questions": [
            "Is training data vetted?",
            "Are data leakage risks assessed?",
            "Is sensitive data filtered from outputs?",
            "Are data retention policies defined?"
        ]
    },
    {
        "category": "Model Security",
        "questions": [
            "Is the model supply chain secured?",
            "Are model versions tracked?",
            "Is model access controlled?",
            "Are model vulnerabilities monitored?"
        ]
    }
]

def get_checklist_for_framework(framework: str):
    """Get checklist questions for a specific framework"""
    frameworks = {
        'NIST': NIST_AI_RMF_CHECKLIST,
        'SOC2': SOC2_CHECKLIST,
        'OWASP': OWASP_LLM_CHECKLIST,
    }
    return frameworks.get(framework, [])

CREATE FILE: backend/app/routes/compliance.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from pydantic import BaseModel
from typing import List, Dict
from ..database import get_db
from ..models import ComplianceChecklist, IntakeRequest
from ..services.compliance_frameworks import get_checklist_for_framework

router = APIRouter(prefix="/api/compliance", tags=["Compliance"])

class ChecklistAnswer(BaseModel):
    question: str
    answer: bool
    notes: str = ""

class ChecklistSubmission(BaseModel):
    framework: str
    answers: List[ChecklistAnswer]
    completed_by: UUID

@router.get("/frameworks")
def list_frameworks():
    """List available compliance frameworks"""
    return {
        "frameworks": ["NIST", "SOC2", "SOX", "OWASP", "MAESTRO"]
    }

@router.get("/checklist/{framework}")
def get_framework_checklist(framework: str):
    """Get checklist for a specific framework"""
    checklist = get_checklist_for_framework(framework)
    if not checklist:
        raise HTTPException(status_code=404, detail="Framework not found")
    return {"framework": framework, "checklist": checklist}

@router.post("/{request_id}/checklist")
def submit_checklist(
    request_id: UUID,
    submission: ChecklistSubmission,
    db: Session = Depends(get_db)
):
    """Submit a completed compliance checklist"""
    request = db.query(IntakeRequest).filter(IntakeRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    checklist = ComplianceChecklist(
        request_id=request_id,
        framework=submission.framework,
        questions=[answer.dict() for answer in submission.answers],
        completed=True,
        completed_by=submission.completed_by
    )
    db.add(checklist)
    db.commit()
    db.refresh(checklist)
    
    return checklist

@router.get("/{request_id}/checklists")
def get_request_checklists(
    request_id: UUID,
    db: Session = Depends(get_db)
):
    """Get all compliance checklists for a request"""
    checklists = db.query(ComplianceChecklist).filter(
        ComplianceChecklist.request_id == request_id
    ).all()
    return checklists

UPDATE backend/app/main.py:

from .routes import intake, review, scoring, compliance

app.include_router(compliance.router)
```

### ✅ Phase 5 Complete
Test compliance checklist endpoints

---

# Phase 6: AI Automation

## Prompt 6.1 - OpenAI Integration for Missing Fields & Summaries

```
Integrate OpenAI for AI-powered assistance features.

CREATE FILE: backend/app/services/ai_assistant.py

import openai
import os
from typing import Dict, List
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

class AIAssistant:
    """AI-powered assistant for intake form analysis"""
    
    def __init__(self):
        self.model = "gpt-4"
    
    def check_missing_fields(self, form_data: Dict) -> Dict:
        """Analyze form and suggest missing information"""
        prompt = f"""
        Analyze this AI project intake form and identify missing or incomplete information:
        
        Form Data:
        {form_data}
        
        Provide a structured response with:
        1. Critical missing fields
        2. Recommended additional information
        3. Potential risks based on provided data
        
        Format as JSON.
        """
        
        try:
            response = openai.ChatCompletion.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an AI governance expert analyzing project intake forms."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3
            )
            
            return {
                "analysis": response.choices[0].message.content,
                "suggestions": []
            }
        except Exception as e:
            return {"error": str(e)}
    
    def generate_risk_summary(self, form_data: Dict, risk_scores: Dict) -> str:
        """Generate human-readable risk summary"""
        prompt = f"""
        Generate a concise risk summary for this AI project:
        
        Project Details:
        {form_data}
        
        Risk Scores:
        {risk_scores}
        
        Provide a 3-4 paragraph executive summary highlighting:
        1. Overall risk level
        2. Key concerns
        3. Recommended mitigations
        """
        
        try:
            response = openai.ChatCompletion.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an AI risk assessment expert."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.5
            )
            
            return response.choices[0].message.content
        except Exception as e:
            return f"Error generating summary: {str(e)}"
    
    def suggest_remediation(self, risk_scores: Dict) -> List[str]:
        """Suggest remediation steps based on risk scores"""
        remediations = []
        
        if risk_scores.get('owasp_score', 0) > 50:
            remediations.append("Implement prompt injection protection and input validation")
        
        if risk_scores.get('nist_score', 0) > 60:
            remediations.append("Enhance AI governance documentation and oversight mechanisms")
        
        if risk_scores.get('soc2_score', 0) > 50:
            remediations.append("Strengthen access controls and encryption for sensitive data")
        
        if risk_scores.get('sox_score', 0) > 50:
            remediations.append("Implement financial data handling controls and audit logging")
        
        return remediations
    
    def generate_reviewer_brief(self, form_data: Dict, risk_scores: Dict) -> str:
        """Generate a brief for reviewers"""
        prompt = f"""
        Create a concise reviewer brief (2-3 paragraphs) for this AI project intake:
        
        Project: {form_data.get('title')}
        Description: {form_data.get('description')}
        Model: {form_data.get('model_used')} ({form_data.get('model_provider')})
        Data Types: {form_data.get('data_types')}
        
        Risk Scores:
        - NIST: {risk_scores.get('nist_score')}/100
        - OWASP: {risk_scores.get('owasp_score')}/100
        - SOC2: {risk_scores.get('soc2_score')}/100
        
        Focus on what reviewers need to know to make an informed decision.
        """
        
        try:
            response = openai.ChatCompletion.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an AI governance reviewer preparing a brief."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.4
            )
            
            return response.choices[0].message.content
        except Exception as e:
            return f"Error generating brief: {str(e)}"

CREATE FILE: backend/app/routes/ai_assist.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from pydantic import BaseModel
from ..database import get_db
from ..models import IntakeRequest, RiskScore
from ..services.ai_assistant import AIAssistant

router = APIRouter(prefix="/api/ai", tags=["AI Assistance"])

class FormAnalysisRequest(BaseModel):
    form_data: dict

@router.post("/check-missing-fields")
def check_missing_fields(request: FormAnalysisRequest):
    """Analyze form for missing fields"""
    assistant = AIAssistant()
    analysis = assistant.check_missing_fields(request.form_data)
    return analysis

@router.post("/generate-summary/{request_id}")
def generate_risk_summary(
    request_id: UUID,
    db: Session = Depends(get_db)
):
    """Generate AI-powered risk summary"""
    intake_request = db.query(IntakeRequest).filter(IntakeRequest.id == request_id).first()
    if not intake_request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    risk_score = db.query(RiskScore).filter(RiskScore.request_id == request_id).first()
    if not risk_score:
        raise HTTPException(status_code=404, detail="Risk score not found. Compute it first.")
    
    form_data = {
        "title": intake_request.title,
        "description": intake_request.description,
        "model_used": intake_request.model_used,
        "data_types": intake_request.data_types
    }
    
    risk_scores = {
        "nist_score": risk_score.nist_score,
        "soc2_score": risk_score.soc2_score,
        "owasp_score": risk_score.owasp_score
    }
    
    assistant = AIAssistant()
    summary = assistant.generate_risk_summary(form_data, risk_scores)
    
    return {"summary": summary}

@router.post("/suggest-remediation/{request_id}")
def suggest_remediation(
    request_id: UUID,
    db: Session = Depends(get_db)
):
    """Get AI-suggested remediation steps"""
    risk_score = db.query(RiskScore).filter(RiskScore.request_id == request_id).first()
    if not risk_score:
        raise HTTPException(status_code=404, detail="Risk score not found")
    
    risk_scores = {
        "nist_score": risk_score.nist_score,
        "soc2_score": risk_score.soc2_score,
        "sox_score": risk_score.sox_score,
        "owasp_score": risk_score.owasp_score,
        "maestro_score": risk_score.maestro_score
    }
    
    assistant = AIAssistant()
    remediations = assistant.suggest_remediation(risk_scores)
    
    return {"remediations": remediations}

@router.post("/generate-reviewer-brief/{request_id}")
def generate_reviewer_brief(
    request_id: UUID,
    db: Session = Depends(get_db)
):
    """Generate brief for reviewers"""
    intake_request = db.query(IntakeRequest).filter(IntakeRequest.id == request_id).first()
    risk_score = db.query(RiskScore).filter(RiskScore.request_id == request_id).first()
    
    if not intake_request or not risk_score:
        raise HTTPException(status_code=404, detail="Request or risk score not found")
    
    form_data = {
        "title": intake_request.title,
        "description": intake_request.description,
        "model_used": intake_request.model_used,
        "model_provider": intake_request.model_provider,
        "data_types": intake_request.data_types
    }
    
    risk_scores = {
        "nist_score": risk_score.nist_score,
        "owasp_score": risk_score.owasp_score,
        "soc2_score": risk_score.soc2_score
    }
    
    assistant = AIAssistant()
    brief = assistant.generate_reviewer_brief(form_data, risk_scores)
    
    return {"brief": brief}

UPDATE backend/app/main.py:

from .routes import intake, review, scoring, compliance, ai_assist

app.include_router(ai_assist.router)

UPDATE backend/requirements.txt - ADD:
openai==1.3.0
```

### ✅ Phase 6 Complete
Test AI endpoints (requires OPENAI_API_KEY in .env)

---

# Phase 7: Analytics Dashboard

## Prompt 7.1 - Analytics Dashboard Component

```
Create an analytics dashboard with charts showing request metrics.

INSTALL FRONTEND DEPENDENCIES:
npm install recharts date-fns

CREATE FILE: frontend/src/pages/Analytics.jsx

import { useState, useEffect } from 'react';
import { intakeAPI } from '../utils/api';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Loader2, TrendingUp, CheckCircle, XCircle, Clock } from 'lucide-react';

const COLORS = {
  draft: '#64748b',
  submitted: '#0ea5e9',
  reviewing: '#f59e0b',
  approved: '#10b981',
  denied: '#ef4444',
};

export default function Analytics() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    denied: 0,
    reviewing: 0,
    avgRiskScore: 0,
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await intakeAPI.list();
      const data = response.data;
      setRequests(data);
      
      // Calculate statistics
      const approved = data.filter(r => r.status === 'approved').length;
      const denied = data.filter(r => r.status === 'denied').length;
      const reviewing = data.filter(r => r.status === 'reviewing').length;
      const avgRisk = data.reduce((sum, r) => sum + r.risk_score, 0) / (data.length || 1);
      
      setStats({
        total: data.length,
        approved,
        denied,
        reviewing,
        avgRiskScore: Math.round(avgRisk),
      });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for charts
  const statusDistribution = [
    { name: 'Draft', value: requests.filter(r => r.status === 'draft').length },
    { name: 'Submitted', value: requests.filter(r => r.status === 'submitted').length },
    { name: 'Reviewing', value: requests.filter(r => r.status === 'reviewing').length },
    { name: 'Approved', value: requests.filter(r => r.status === 'approved').length },
    { name: 'Denied', value: requests.filter(r => r.status === 'denied').length },
  ].filter(item => item.value > 0);

  const riskDistribution = [
    { range: 'Low (0-30)', count: requests.filter(r => r.risk_score < 30).length },
    { range: 'Medium (30-60)', count: requests.filter(r => r.risk_score >= 30 && r.risk_score < 60).length },
    { range: 'High (60-100)', count: requests.filter(r => r.risk_score >= 60).length },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Analytics Dashboard</h1>
        <p className="mt-2 text-slate-600">Overview of AI project intake metrics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Requests</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.total}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Approved</p>
              <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.approved}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Denied</p>
              <p className="text-3xl font-bold text-rose-600 mt-2">{stats.denied}</p>
            </div>
            <XCircle className="w-8 h-8 text-rose-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Avg Risk Score</p>
              <p className="text-3xl font-bold text-amber-600 mt-2">{stats.avgRiskScore}</p>
            </div>
            <Clock className="w-8 h-8 text-amber-600" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Request Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase()]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Risk Score Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={riskDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

UPDATE frontend/src/App.jsx:

import Analytics from './pages/Analytics';

<Route path="/analytics" element={<Analytics />} />
```

### ✅ Phase 7 Complete
View analytics dashboard with real data

---

# Phase 8: Production Deployment

## Prompt 8.1 - Kubernetes Manifests

```
Create Kubernetes deployment manifests for production.

CREATE FOLDER: infra/k8s/

CREATE FILE: infra/k8s/namespace.yaml

apiVersion: v1
kind: Namespace
metadata:
  name: ai-governance

CREATE FILE: infra/k8s/postgres.yaml

apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
  namespace: ai-governance
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  namespace: ai-governance
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        env:
        - name: POSTGRES_DB
          value: ai_governance
        - name: POSTGRES_USER
          value: postgres
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: password
        ports:
        - containerPort: 5432
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
      volumes:
      - name: postgres-storage
        persistentVolumeClaim:
          claimName: postgres-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: postgres
  namespace: ai-governance
spec:
  selector:
    app: postgres
  ports:
  - port: 5432
    targetPort: 5432

CREATE FILE: infra/k8s/backend.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: ai-governance
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: your-registry/ai-governance-backend:latest
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: backend-secret
              key: database_url
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: backend-secret
              key: openai_api_key
        ports:
        - containerPort: 8000
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 10
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: backend
  namespace: ai-governance
spec:
  selector:
    app: backend
  ports:
  - port: 8000
    targetPort: 8000

CREATE FILE: infra/k8s/frontend.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: ai-governance
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: your-registry/ai-governance-frontend:latest
        env:
        - name: VITE_API_URL
          value: "https://api.yourdomain.com"
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: frontend
  namespace: ai-governance
spec:
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 80

CREATE FILE: infra/k8s/ingress.yaml

apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ai-governance-ingress
  namespace: ai-governance
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - yourdomain.com
    - api.yourdomain.com
    secretName: ai-governance-tls
  rules:
  - host: yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend
            port:
              number: 80
  - host: api.yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: backend
            port:
              number: 8000

CREATE FILE: infra/k8s/secrets.yaml (Template - DO NOT commit real secrets)

apiVersion: v1
kind: Secret
metadata:
  name: postgres-secret
  namespace: ai-governance
type: Opaque
stringData:
  password: CHANGE_ME

---
apiVersion: v1
kind: Secret
metadata:
  name: backend-secret
  namespace: ai-governance
type: Opaque
stringData:
  database_url: postgresql://postgres:CHANGE_ME@postgres:5432/ai_governance
  openai_api_key: CHANGE_ME

CREATE FILE: infra/k8s/README.md

# Kubernetes Deployment

## Prerequisites
- Kubernetes cluster (GKE, EKS, AKS, or local)
- kubectl configured
- Docker images built and pushed to registry

## Deployment Steps

1. Create namespace:
   kubectl apply -f namespace.yaml

2. Create secrets (UPDATE WITH REAL VALUES):
   kubectl apply -f secrets.yaml

3. Deploy PostgreSQL:
   kubectl apply -f postgres.yaml

4. Deploy Backend:
   kubectl apply -f backend.yaml

5. Deploy Frontend:
   kubectl apply -f frontend.yaml

6. Deploy Ingress:
   kubectl apply -f ingress.yaml

## Verify Deployment

kubectl get pods -n ai-governance
kubectl get services -n ai-governance
kubectl get ingress -n ai-governance

## Access Logs

kubectl logs -f deployment/backend -n ai-governance
kubectl logs -f deployment/frontend -n ai-governance
```

---

## Prompt 8.2 - Docker Production Files

```
Create production-ready Dockerfiles.

UPDATE backend/Dockerfile:

FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY app /app/app

# Create non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"

# Run application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

UPDATE frontend/Dockerfile:

# Build stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

CREATE FILE: frontend/nginx.conf

server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}

CREATE FILE: docker-compose.prod.yml

version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ai_governance
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql://postgres:${POSTGRES_PASSWORD}@postgres:5432/ai_governance
      OPENAI_API_KEY: ${OPENAI_API_KEY}
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
```

### ✅ Phase 8 Complete

---

# 🎉 FINAL DELIVERABLE SUMMARY

## What You've Built

✅ **Phase 1**: Basic intake form with PostgreSQL
✅ **Phase 2**: Request list and detail views
✅ **Phase 3**: Multi-team reviewer workflow
✅ **Phase 4**: Risk scoring engine (NIST, SOC2, SOX, OWASP, MAESTRO)
✅ **Phase 5**: Compliance framework checklists
✅ **Phase 6**: AI-powered assistance (OpenAI integration)
✅ **Phase 7**: Analytics dashboard with charts
✅ **Phase 8**: Production Kubernetes deployment

## Architecture

```
┌─────────────┐         ┌──────────────┐         ┌────────────┐
│   React     │────────>│   FastAPI    │────────>│ PostgreSQL │
│  Frontend   │         │   Backend    │         │            │
└─────────────┘         └──────────────┘         └────────────┘
                               │
                               │
                               v
                        ┌──────────────┐
                        │   OpenAI     │
                        │     API      │
                        └──────────────┘
```

## Local Development Commands

```bash
# Start all services
docker-compose up -d

# Frontend: http://localhost:5173
# Backend: http://localhost:8000
# API Docs: http://localhost:8000/docs

# Stop services
docker-compose down
```

## Production Deployment

```bash
# Build images
docker build -t your-registry/ai-governance-backend:latest ./backend
docker build -t your-registry/ai-governance-frontend:latest ./frontend

# Push to registry
docker push your-registry/ai-governance-backend:latest
docker push your-registry/ai-governance-frontend:latest

# Deploy to Kubernetes
kubectl apply -f infra/k8s/
```

## Next Steps / Future Enhancements

1. **Authentication**: Add JWT-based auth or SSO (OIDC)
2. **Email Notifications**: Integrate SendGrid or AWS SES
3. **File Uploads**: Add S3 integration for architecture diagrams
4. **Audit Logging**: Add detailed audit trail table
5. **Advanced Analytics**: Time-series analysis, custom reports
6. **Mobile App**: React Native version
7. **Slack/Teams Integration**: Webhook notifications
8. **Advanced AI Features**: Auto-recommendations, predictive risk scoring

---

**CONGRATULATIONS!** 🎊

You now have a **production-ready AI Governance Platform** ready to deploy!