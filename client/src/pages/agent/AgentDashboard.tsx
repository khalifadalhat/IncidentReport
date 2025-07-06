import React, { useEffect } from "react";
import { Route, Routes, useLocation, Link } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { FiMenu, FiX, FiHome, FiClock, FiUsers, FiMessageSquare, FiCheckCircle, FiSettings } from "react-icons/fi";
import AgentCustomers from "./AgentCustomers";
import AgentPending from "./AgentPending";
import AgentResolved from "./AgentResolved";
import AgentChat from "./AgentChat";
import AgentSettings from "./AgentSettings";
import AgentCases from "./AgentCases";
import logo from "../../assets/react.svg"; 

type DecodedToken = {
  userId: string;
};

const AgentDashboard: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const token = Cookies.get("token");
  let agentId: string | null = null;

  if (token) {
    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      agentId = decodedToken.userId;
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  }

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  if (!agentId) {
    return <div className="p-4 text-red-500">Error: Agent ID is missing.</div>;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Mobile header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-gray-800 text-white">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold">Agent Portal</h1>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md focus:outline-none"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </header>

      {/* Sidebar - Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-gray-800 bg-opacity-75">
          <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <img src={logo} alt="Logo" className="h-8 mr-2" />
                <h1 className="text-xl font-semibold">Agent Portal</h1>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-md hover:bg-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>
            <nav>
              <ul className="space-y-2">
                <NavItem to="/agent/dashboard" icon={<FiHome />} text="Dashboard" />
                <NavItem to="/agent/pending" icon={<FiClock />} text="Pending" />
                <NavItem to="/agent/customers" icon={<FiUsers />} text="Customers" />
                <NavItem to="/agent/chat" icon={<FiMessageSquare />} text="Chat" />
                <NavItem to="/agent/resolved" icon={<FiCheckCircle />} text="Resolved" />
                <NavItem to="/agent/settings" icon={<FiSettings />} text="Settings" />
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Sidebar - Desktop */}
      <aside className="hidden md:block w-64 bg-gray-900 text-white p-4">
        <div className="flex items-center mb-8">
          <img src={logo} alt="Logo" className="h-8 mr-2" />
          <h1 className="text-xl font-semibold">Agent Portal</h1>
        </div>
        <nav className="h-[calc(100vh-120px)] overflow-y-auto">
          <ul className="space-y-2">
            <NavItem to="/agent/dashboard" icon={<FiHome />} text="Dashboard" />
            <NavItem to="/agent/pending" icon={<FiClock />} text="Pending" />
            <NavItem to="/agent/customers" icon={<FiUsers />} text="Customers" />
            <NavItem to="/agent/chat" icon={<FiMessageSquare />} text="Chat" />
            <NavItem to="/agent/resolved" icon={<FiCheckCircle />} text="Resolved" />
            <NavItem to="/agent/settings" icon={<FiSettings />} text="Settings" />
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
        <Routes>
          <Route path="/dashboard" element={<AgentCases agentId={agentId} />} />
          <Route path="/pending" element={<AgentPending />} />
          <Route path="/customers" element={<AgentCustomers />} />
          <Route path="/chat" element={<AgentChat />} />
          <Route path="/resolved" element={<AgentResolved />} />
          <Route path="/settings" element={<AgentSettings />} />
        </Routes>
      </main>
    </div>
  );
};

// Reusable NavItem component
const NavItem: React.FC<{ to: string; icon: React.ReactNode; text: string }> = ({ to, icon, text }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <li>
      <Link
        to={to}
        className={`flex items-center p-3 rounded-lg transition-colors ${
          isActive
            ? "bg-blue-600 text-white"
            : "text-gray-300 hover:bg-gray-800 hover:text-white"
        }`}
      >
        <span className="mr-3">{icon}</span>
        <span className="font-medium">{text}</span>
      </Link>
    </li>
  );
};

export default AgentDashboard;