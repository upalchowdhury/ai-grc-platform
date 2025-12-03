from typing import Dict
from models.models import IntakeRequest, RiskScore
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
        
        # Get details dict, default to empty if None
        details = request.details or {}
        
        # Data sensitivity check (higher sensitivity = higher risk)
        data_types = details.get('data_types', [])
        if data_types:
            if 'PHI' in data_types or 'PII' in data_types:
                score += 40  # High risk
            elif 'Financial' in data_types:
                score += 25
            elif 'Intellectual Property' in data_types:
                score += 20
            else:
                score += 5  # Public data
        
        # Deployment type risk
        deployment_type = details.get('deployment_type', '')
        if deployment_type == 'Cloud':
            score += 15  # Moderate risk
        elif deployment_type == 'On-Premise':
            score += 5  # Lower risk
        elif deployment_type == 'Hybrid':
            score += 10
        
        # Model complexity (advanced models = more risk)
        model_used = details.get('model_used', '')
        if model_used:
            if 'GPT-4' in model_used or 'Claude' in model_used:
                score += 15  # Advanced models = more risk
            else:
                score += 10
        
        return min(score, max_score)
    
    def calculate_soc2_score(self, request: IntakeRequest) -> int:
        """SOC2 Trust Service Criteria scoring"""
        score = 0
        details = request.details or {}
        
        # Security considerations
        data_types = details.get('data_types', [])
        if data_types and len(data_types) > 0:
            score += 20
        
        # Availability concerns
        use_case = details.get('use_case', '')
        if use_case in ['Chatbot', 'Chatbot / Virtual Assistant', 'Automation', 'Process Automation']:
            score += 15  # Critical services
        
        # Confidentiality
        if 'PII' in data_types or 'PHI' in data_types:
            score += 30
        
        # Data volume considerations
        data_volume = details.get('data_volume', '')
        if 'Large' in data_volume or 'Very Large' in data_volume:
            score += 20
        
        return min(score, 100)
    
    def calculate_sox_score(self, request: IntakeRequest) -> int:
        """SOX compliance scoring"""
        score = 0
        details = request.details or {}
        data_types = details.get('data_types', [])
        
        # Financial data handling
        if 'Financial' in data_types:
            score += 50  # High impact
        
        # Change control considerations
        deployment_type = details.get('deployment_type', '')
        if deployment_type == 'Cloud':
            score += 20
        
        # Business impact assessment
        business_impact = details.get('business_impact', '')
        if business_impact:
            score += 15
        
        return min(score, 100)
    
    def calculate_owasp_score(self, request: IntakeRequest) -> int:
        """OWASP Top 10 for LLMs scoring"""
        score = 0
        details = request.details or {}
        
        # Prompt injection risk
        use_case = details.get('use_case', '')
        if 'Chatbot' in use_case or 'Virtual Assistant' in use_case:
            score += 25
        
        # Training data poisoning risk
        model_used = details.get('model_used', '')
        if model_used and 'Custom' in model_used:
            score += 20
        
        # Supply chain risk
        model_provider = details.get('model_provider', '')
        if model_provider in ['OpenAI', 'Anthropic', 'Google', 'Google (Vertex AI)']:
            score += 10  # Third-party dependency
        elif model_provider == 'Self-Hosted':
            score += 5  # Lower supply chain risk
        
        # Data leakage
        data_types = details.get('data_types', [])
        if 'PII' in data_types or 'PHI' in data_types:
            score += 30
        
        # Insecure output handling
        if data_types:
            score += 10
        
        return min(score, 100)
    
    def calculate_maestro_score(self, request: IntakeRequest) -> int:
        """MAESTRO framework scoring"""
        score = 0
        details = request.details or {}
        
        # Model risk modes
        model_used = details.get('model_used', '')
        if model_used:
            score += 20
        
        # Expected user base (larger = more risk)
        expected_user_base = details.get('expected_user_base', '')
        if 'Public' in expected_user_base:
            score += 25
        elif 'Partners' in expected_user_base:
            score += 15
        elif 'Internal' in expected_user_base:
            score += 10
        
        # Monitoring requirements
        use_case = details.get('use_case', '')
        if use_case in ['Chatbot', 'Chatbot / Virtual Assistant', 'Automation', 'Process Automation']:
            score += 20
        
        # Testability concerns
        deployment_type = details.get('deployment_type', '')
        if deployment_type:
            score += 15
        
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
