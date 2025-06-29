import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CustomerDetails from './CustomerDetails';
import Departments from './Departments';
import ProblemType from './ProblemType';
import ChatWithAgent from './ChatWithAgent';

const CustomerDashboard: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<CustomerDetails />} />
      <Route path="/departments" element={<Departments />} />
      <Route path="/problem-type" element={<ProblemType />} />
      <Route path="/chat-with-agent" element={<ChatWithAgent />} />
    </Routes>
  );
};

export default CustomerDashboard;
