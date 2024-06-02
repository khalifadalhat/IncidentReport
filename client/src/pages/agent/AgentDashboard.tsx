import React from "react";
import { Route, Routes } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import AgentCustomers from "./AgentCustomers";
import AgentPending from "./AgentPending";
import AgentResolved from "./AgentResolved";
import AgentChat from "./AgentChat";
import AgentSettings from "./AgentSettings";
import AgentCases from "./AgentCases";
import { DecodedToken } from "../interface/Icase";

const AgentDashboard: React.FC = () => {
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

  if (!agentId) {
    return <div>Error: Agent ID is missing.</div>;
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <nav className="h-[50vh] px-3 py-4 overflow-y-auto bg-black">
          <ul className="space-y-2 font-medium">
            <li>
              <a
                href="/agent/dashboard"
                className="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700 group"
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 text-white transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 18"
                >
                  <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Dashboard</span>
              </a>
            </li>
            <li>
              <a
                href="/agent/pending"
                className="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700 group"
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 text-white transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2a10 10 0 0 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>

                <span className="flex-1 ms-3 whitespace-nowrap">Pending</span>
              </a>
            </li>
            <li>
              <a
                href="/agent/customers"
                className="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700 group"
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 text-white transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm6 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm-12 0c-2.67 0-8 1.34-8 4v2h4v-2c0-1.1.9-2 2-2s2 .9 2 2v2h4v-2c0-2.66-5.33-4-8-4z" />
                </svg>

                <span className="flex-1 ms-3 whitespace-nowrap">Customers</span>
              </a>
            </li>
            <li>
              <a
                href="/agent/chat"
                className="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700 group"
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 text-white transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 4h16v10H5.17L4 15.17V4zm0-2c-1.1 0-2 .9-2 2v16l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H4zm6 8h8v2h-8v-2zm0-4h8v2h-8V6z" />
                </svg>

                <span className="flex-1 ms-3 whitespace-nowrap">Chat</span>
              </a>
            </li>
            <li>
              <a
                href="/agent/resolved"
                className="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700 group"
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 text-white transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C9.61 0 7.41.73 5.64 2.01L3.23 0l-1 1.97 2.4 2.01C2.14 6.33 1 9.05 1 12s1.14 5.67 3.63 7.01l-2.4 2.01 1 1.97 2.4-2.01C7.41 23.27 9.61 24 12 24s4.59-.73 6.36-2.01l2.4 2.01 1-1.97-2.4-2.01C21.86 17.67 23 14.95 23 12s-1.14-5.67-3.63-7.01l2.4-2.01-1-1.97-2.4 2.01C16.59.73 14.39 0 12 0zm0 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm-2.29-3.71L7 12.41l1.41-1.41L11 13.17l4.59-4.59L17 10l-7 7-2.29-2.29z" />
                </svg>

                <span className="flex-1 ms-3 whitespace-nowrap">Resolved</span>
              </a>
            </li>
            <li>
              <a
                href="/agent/settings"
                className="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700 group"
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 text-white transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C9.61 0 7.41.73 5.64 2.01L3.23 0l-1 1.97 2.4 2.01C2.14 6.33 1 9.05 1 12s1.14 5.67 3.63 7.01l-2.4 2.01 1 1.97 2.4-2.01C7.41 23.27 9.61 24 12 24s4.59-.73 6.36-2.01l2.4 2.01 1-1.97-2.4-2.01C21.86 17.67 23 14.95 23 12s-1.14-5.67-3.63-7.01l2.4-2.01-1-1.97-2.4 2.01C16.59.73 14.39 0 12 0zm0 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Settings</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-4">
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

export default AgentDashboard;
