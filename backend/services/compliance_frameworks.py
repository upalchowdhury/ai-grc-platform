"""
Compliance framework question sets for different standards
"""

NIST_AI_RMF_CHECKLIST = [
    {
        "category": "Govern",
        "questions": [
            "Has AI governance structure been defined?",
            "Are roles and responsibilities documented?",
            "Is there executive oversight for AI initiatives?",
            "Have AI risk policies been established?",
            "Is there a process for AI risk identification?"
        ]
    },
    {
        "category": "Map",
        "questions": [
            "Has the AI system context been documented?",
            "Are potential impacts identified?",
            "Have stakeholders been identified?",
            "Is the intended use clearly defined?",
            "Are limitations and boundaries documented?"
        ]
    },
    {
        "category": "Measure",
        "questions": [
            "Are AI system metrics defined?",
            "Is performance monitoring in place?",
            "Are bias and fairness evaluated?",
            "Is model accuracy tracked?",
            "Are impact assessments conducted regularly?"
        ]
    },
    {
        "category": "Manage",
        "questions": [
            "Are risk mitigation strategies documented?",
            "Is incident response plan in place?",
            "Are regular audits scheduled?",
            "Is continuous monitoring implemented?",
            "Are remediation procedures established?"
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
            "Are security logs maintained?",
            "Is vulnerability scanning performed regularly?"
        ]
    },
    {
        "category": "Availability",
        "questions": [
            "Is system uptime monitored?",
            "Is disaster recovery plan documented?",
            "Are backups performed regularly?",
            "Is redundancy implemented?",
            "Are SLAs defined and monitored?"
        ]
    },
    {
        "category": "Confidentiality",
        "questions": [
            "Are confidentiality agreements in place?",
            "Is data classification implemented?",
            "Are confidential data access logs maintained?",
            "Is data sharing documented?",
            "Are encryption keys managed properly?"
        ]
    },
    {
        "category": "Processing Integrity",
        "questions": [
            "Is data processing accurate and complete?",
            "Are processing errors logged and monitored?",
            "Is data validation implemented?",
            "Are processing controls documented?",
            "Is system performance monitored?"
        ]
    },
    {
        "category": "Privacy",
        "questions": [
            "Is personal information collected with consent?",
            "Are privacy notices provided?",
            "Is data retention policy defined?",
            "Are data deletion requests handled?",
            "Is privacy training provided to staff?"
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
            "Are rate limits configured?",
            "Is content filtering applied?"
        ]
    },
    {
        "category": "Data Security",
        "questions": [
            "Is training data vetted and secured?",
            "Are data leakage risks assessed?",
            "Is sensitive data filtered from outputs?",
            "Are data retention policies defined?",
            "Is PII redaction implemented?"
        ]
    },
    {
        "category": "Model Security",
        "questions": [
            "Is the model supply chain secured?",
            "Are model versions tracked?",
            "Is model access controlled?",
            "Are model vulnerabilities monitored?",
            "Is model behavior audited?"
        ]
    },
    {
        "category": "Output Handling",
        "questions": [
            "Are outputs validated before use?",
            "Is output sanitization implemented?",
            "Are harmful outputs filtered?",
            "Is output logging in place?",
            "Are output quality checks automated?"
        ]
    }
]

SOX_CHECKLIST = [
    {
        "category": "Internal Controls",
        "questions": [
            "Are financial reporting controls documented?",
            "Is segregation of duties enforced?",
            "Are control deficiencies tracked?",
            "Is management review process in place?",
            "Are control activities monitored?"
        ]
    },
    {
        "category": "Audit Trail",
        "questions": [
            "Are all changes to financial data logged?",
            "Is audit trail tamper-proof?",
            "Are logs retained for required period?",
            "Is log access restricted?",
            "Are logs regularly reviewed?"
        ]
    },
    {
        "category": "Access Control",
        "questions": [
            "Is access to financial systems restricted?",
            "Are access privileges regularly reviewed?",
            "Is privileged access monitored?",
            "Are terminated users removed promptly?",
            "Is least privilege principle applied?"
        ]
    }
]

MAESTRO_CHECKLIST = [
    {
        "category": "Model Evaluation",
        "questions": [
            "Are model performance metrics defined?",
            "Is model testing comprehensive?",
            "Are edge cases identified and tested?",
            "Is model bias evaluated?",
            "Are failure modes documented?"
        ]
    },
    {
        "category": "Monitoring",
        "questions": [
            "Is real-time monitoring implemented?",
            "Are anomalies detected automatically?",
            "Is model drift monitored?",
            "Are performance degradation alerts set?",
            "Is user feedback collected?"
        ]
    },
    {
        "category": "Explainability",
        "questions": [
            "Are model decisions explainable?",
            "Is reasoning transparency provided?",
            "Are stakeholders able to understand outputs?",
            "Is documentation maintained?",
            "Are explanation methods validated?"
        ]
    }
]

def get_checklist_for_framework(framework: str):
    """Get checklist questions for a specific framework"""
    frameworks = {
        'NIST': NIST_AI_RMF_CHECKLIST,
        'SOC2': SOC2_CHECKLIST,
        'OWASP': OWASP_LLM_CHECKLIST,
        'SOX': SOX_CHECKLIST,
        'MAESTRO': MAESTRO_CHECKLIST,
    }
    return frameworks.get(framework, [])

def get_all_frameworks():
    """Get list of all available frameworks"""
    return [
        {"id": "NIST", "name": "NIST AI Risk Management Framework", "description": "Comprehensive AI risk management framework"},
        {"id": "SOC2", "name": "SOC 2", "description": "Trust Service Criteria for service organizations"},
        {"id": "OWASP", "name": "OWASP Top 10 for LLMs", "description": "Security risks specific to Large Language Models"},
        {"id": "SOX", "name": "Sarbanes-Oxley", "description": "Financial compliance and internal controls"},
        {"id": "MAESTRO", "name": "MAESTRO", "description": "ML model monitoring and explainability framework"}
    ]
