import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminDashboard from './pages/admin/AdminDashboard';
import AgentDashboard from './pages/agent/AgentDashboard';
import SupervisorDashboard from './pages/supervisor/SupervisorDashboard';
import Login from './pages/Login';
import SignupForm from './pages/SignUp';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerRegistration from './pages/customer/customerRegistration';
import CustomerLogin from './pages/customer/customerLogin';
import LandingPage from './components/LandingPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/signup/customer" element={<CustomerRegistration />} />
      <Route path="/signin/customer" element={<CustomerLogin />} />
      <Route path="/customer/*" element={<CustomerDashboard />} />
      <Route path="/admin/*" element={<AdminDashboard />} />
      <Route path="/agent/*" element={<AgentDashboard />} />
      <Route path="/supervisor/*" element={<SupervisorDashboard />} />
    </Routes>
  );
};

export default App;
