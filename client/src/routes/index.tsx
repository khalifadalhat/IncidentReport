import { createBrowserRouter } from "react-router-dom";
import CustomerRegistration from "../components/auth/customerRegistration";
import Departments from "../pages/customer/Departments";
import ProblemType from "../pages/customer/ProblemType";
import ChatWithAgent from "../pages/customer/ChatWithAgent";

import AdminDashboardContent from "../pages/admin/AdminDashboard";
import AdminAgents from "../pages/admin/AdminAgents";
import AdminCases from "../pages/admin/AdminCases";
import AgentPending from "../pages/agent/AgentPending";
import AgentChat from "../pages/agent/AgentChat";

import { adminMenuItems, agentMenuItems } from "../config/menuConfig";
import AgentActive from "../pages/agent/AgentActive";
import ProtectedRoute from "@/components/ProtectedRoutes";
import AgentCases from "@/pages/agent/AgentCases";
import CustomerDetails from "@/pages/customer/CustomerDetails";

import LandingPage from "@/pages/LandingPage";
import Login from "@/components/auth/Login";
import AdminCustomers from "@/pages/admin/AdminCustomers";
import AgentDashboard from "@/pages/agent/AgentDashboard";
import MyCases from "@/pages/customer/MyCases";
import RootLayout from "@/components/RootLayout";
import AgentSettings from "@/pages/agent/AgentSettings";
import AdminSettings from "@/pages/admin/AdminSettings";
import ForgotPassword from "@/components/auth/ForgotPassword";
import ChangePassword from "@/components/auth/ChangePassword";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <CustomerRegistration /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "change-password", element: <ChangePassword /> },

      {
        path: "customer",
        element: <ProtectedRoute allowedRoles={["customer"]} />,
        children: [
          { index: true, element: <CustomerDetails /> },
          { path: "cases", element: <MyCases /> },
          { path: "departments", element: <Departments /> },
          { path: "problem-type", element: <ProblemType /> },
          { path: "chat", element: <ChatWithAgent /> },
        ],
      },

      {
        path: "admin",
        element: (
          <ProtectedRoute
            allowedRoles={["admin"]}
            layout={true}
            menuItems={adminMenuItems}
            title="Admin Dashboard"
            subtitle="Incident Report"
          />
        ),
        children: [
          { index: true, element: <AdminDashboardContent /> },
          { path: "agents", element: <AdminAgents /> },
          { path: "cases", element: <AdminCases /> },
          { path: "customers", element: <AdminCustomers /> },
          { path: "settings", element: <AdminSettings /> },
        ],
      },

      {
        path: "agent",
        element: (
          <ProtectedRoute
            allowedRoles={["agent"]}
            layout={true}
            menuItems={agentMenuItems}
            title="Agent Dashboard"
            subtitle="Incident Report"
          />
        ),
        children: [
          { index: true, element: <AgentDashboard /> },
          { path: "cases", element: <AgentCases /> },
          { path: "pending", element: <AgentPending /> },
          { path: "active", element: <AgentActive /> },
          { path: "chat", element: <AgentChat /> },
          { path: "settings", element: <AgentSettings /> },
        ],
      },
    ],
  },
]);
