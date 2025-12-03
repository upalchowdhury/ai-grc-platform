import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import IntakeForm from './pages/IntakeForm';
import RequestList from './pages/RequestList';
import RequestDetail from './pages/RequestDetail';
import ReviewerDashboard from './pages/ReviewerDashboard';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<IntakeForm />} />
          <Route path="/requests" element={<RequestList />} />
          <Route path="/requests/:id" element={<RequestDetail />} />
          <Route path="/governance" element={<ReviewerDashboard />} />
          <Route path="/compliance" element={<div className="text-slate-600">Compliance (Coming Soon)</div>} />
          <Route path="/security" element={<div className="text-slate-600">Security (Coming Soon)</div>} />
          <Route path="/analytics" element={<div className="text-slate-600">Analytics (Coming Soon)</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
