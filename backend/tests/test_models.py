import unittest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from ..models.models import Base, User, IntakeRequest
from ..db.database import Base

class TestModels(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine('sqlite:///:memory:')
        Base.metadata.create_all(self.engine)
        self.Session = sessionmaker(bind=self.engine)
        self.session = self.Session()

    def tearDown(self):
        self.session.close()
        Base.metadata.drop_all(self.engine)

    def test_create_user(self):
        user = User(name="Test User", email="test@example.com", role="requestor")
        self.session.add(user)
        self.session.commit()
        
        retrieved = self.session.query(User).filter_by(email="test@example.com").first()
        self.assertEqual(retrieved.name, "Test User")

    def test_create_request(self):
        user = User(name="Test User", email="test@example.com", role="requestor")
        self.session.add(user)
        self.session.commit()

        request = IntakeRequest(title="New AI Tool", description="A generic AI tool", requestor_id=user.id)
        self.session.add(request)
        self.session.commit()

        retrieved = self.session.query(IntakeRequest).first()
        self.assertEqual(retrieved.title, "New AI Tool")
        self.assertEqual(retrieved.status, "draft")

if __name__ == '__main__':
    unittest.main()
