import { createBrowserRouter } from 'react-router-dom';
import LandingPage from '../components/LandingPage';
import Login from '../pages/Login';
import CustomerRegistration from '../pages/customer/customerRegistration';
import CustomerLogin from '../pages/customer/customerLogin';
import CustomerDetails from '../pages/customer/CustomerDetails';
import Departments from '../pages/customer/Departments';
import ProblemType from '../pages/customer/ProblemType';
import ChatWithAgent from '../pages/customer/ChatWithAgent';

import AdminDashboardContent from '../pages/admin/AdminDashboard';
import AdminAgents from '../pages/admin/AdminAgents';
import AdminCustomers from '../pages/admin/AdminCustomers';
import AdminCases from '../pages/admin/AdminCases';
import AdminMessages from '../pages/admin/AdminMessages';
import AdminSettings from '../pages/admin/AdminSettings';

import AgentCases from '../pages/agent/AgentCases';
import AgentPending from '../pages/agent/AgentPending';
import AgentCustomers from '../pages/agent/AgentCustomers';
import AgentChat from '../pages/agent/AgentChat';
import AgentResolved from '../pages/agent/AgentResolved';
import AgentSettings from '../pages/agent/AgentSettings';

import { AuthWrapper } from '../config/authWrapper';
import DashboardLayout from '../layout/DashboardLayout';
import { adminMenuItems, agentMenuItems } from '../config/menuConfig';
import AgentActive from '../pages/agent/AgentActive';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup/customer',
    element: <CustomerRegistration />,
  },
  {
    path: '/signin/customer',
    element: <CustomerLogin />,
  },

  {
    path: '/customer',
    element: (
      <AuthWrapper
        redirectPath="/signin/customer"
        title="My Account"
        subtitle="Customer Portal"
        isCustomer={true}
      />
    ),
    children: [
      {
        index: true,
        element: <CustomerDetails />,
      },
      {
        path: 'department',
        element: <Departments />,
      },
      {
        path: 'problem-type',
        element: <ProblemType />,
      },
      {
        path: 'chat-with-agent',
        element: <ChatWithAgent />,
      },
    ],
  },

  {
    path: '/admin',
    element: (
      <AuthWrapper
        requiredRole="admin"
        redirectPath="/login"
        layout={DashboardLayout}
        menuItems={adminMenuItems}
        title="Admin Panel"
        subtitle="Management System"
      />
    ),
    children: [
      {
        index: true,
        element: <AdminDashboardContent />,
      },
      {
        path: 'agents',
        element: <AdminAgents />,
      },
      {
        path: 'customers',
        element: <AdminCustomers />,
      },
      {
        path: 'cases',
        element: <AdminCases />,
      },
      {
        path: 'messages',
        element: <AdminMessages />,
      },
      {
        path: 'settings',
        element: <AdminSettings />,
      },
    ],
  },

  {
    path: '/agent',
    element: (
      <AuthWrapper
        requiredRole="agent"
        redirectPath="/login"
        layout={DashboardLayout}
        menuItems={agentMenuItems}
        title="Agent Portal"
        subtitle="Support System"
      />
    ),
    children: [
      {
        index: true,
        element: <AgentCases />,
      },
      {
        path: 'active',
        element: <AgentActive />,
      },
      {
        path: 'pending',
        element: <AgentPending />,
      },
      {
        path: 'customers',
        element: <AgentCustomers />,
      },
      {
        path: 'chat',
        element: <AgentChat />,
      },
      {
        path: 'resolved',
        element: <AgentResolved />,
      },
      {
        path: 'settings',
        element: <AgentSettings />,
      },
    ],
  },
]);
