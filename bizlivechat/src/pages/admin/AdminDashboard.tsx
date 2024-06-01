import { Route, Routes } from "react-router-dom";
import axios from "axios";
import { PieChart, Pie, Cell, Legend } from "recharts";
import { useEffect, useState } from "react";
import AdminAgents from "./AdminAgents";
import AdminCustomers from "./AdminCustomers";
import AdminCases from "./AdminCases";
import AdminMessages from "./AdminMessages";
import AdminSettings from "./AdminSettings";

const AdminDashboard: React.FC = () => {
  const [pendingCases, setPendingCases] = useState<number>(0);
  const [closedCases, setClosedCases] = useState<number>(0);
  const [activeCases, setActiveCases] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/cases");
        const cases = response.data.cases;
        
        let pendingCount = 0;
        let closedCount = 0;
        let activeCount = 0;
        
        for (const singleCase of cases) {
          if (singleCase.status === "pending") {
            pendingCount++;
          } else if (singleCase.status === "closed") {
            closedCount++;
          } else {
            activeCount++;
          }
  
          if (singleCase.assignedAgent) {
            const agentResponse = await axios.get(`http://localhost:5000/agents/${singleCase.assignedAgent}`);
            singleCase.agent = agentResponse.data.agent.fullname;
          } else {
            singleCase.agent = "Not Assigned";
          }
        }
  
        setPendingCases(pendingCount);
        setClosedCases(closedCount);
        setActiveCases(activeCount);
      } catch (error) {
        console.error("Error fetching cases:", error);
      }
    };
  
    fetchData();
  }, []);
  

  const data = [
    { name: "Active", value: activeCases },
    { name: "Closed", value: closedCases },
    { name: "Pending", value: pendingCases },
  ];

  return (
    <div className="flex min-h-screen bg-white">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <nav className="h-[50vh] px-3 py-4 overflow-y-auto bg-black">
          <ul className="space-y-2 font-medium">
            <li>
              <a
                href="/admin/dashboard"
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
                href="/admin/agents"
                className="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700 group"
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 text-white transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0 5c-3.31 0-6 2.69-6 6h12c0-3.31-2.69-6-6-6z" />
                </svg>

                <span className="flex-1 ms-3 whitespace-nowrap">Agents</span>
              </a>
            </li>
            <li>
              <a
                href="/admin/customers"
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
                href="/admin/cases"
                className="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700 group"
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 text-white transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M10.07 2c.12-.37.36-.67.65-.88.29-.21.63-.32.98-.32h.02c.35 0 .69.11.98.32.29.21.52.51.65.88l6.35 19.07c.09.27.04.56-.13.8-.17.25-.45.42-.77.47l-2.88.58a1.57 1.57 0 0 1-.63.03c-.18-.04-.35-.09-.5-.19-.15-.1-.29-.23-.41-.38L12 17.21l-4.6 13.47c-.12.37-.31.69-.57.96-.26.27-.57.49-.93.65a2.1 2.1 0 0 1-1.11.21 2.06 2.06 0 0 1-1.09-.42 1.85 1.85 0 0 1-.64-.94l-6.35-19.07c-.09-.27-.04-.56.13-.8s.45-.42.77-.47l2.88-.58c.27-.05.54 0 .79.14.26.14.48.35.64.6L12 15.79l4.59-13.47c.13-.37.34-.68.6-.92zm2.96 2.68c.27-.24.56-.4.87-.49l-.02.02h.02c.31-.08.63-.08.94 0 .31.08.6.24.87.49.27.25.47.56.57.92l3.13 9.4h-7.52l3.14-9.4z" />
                </svg>

                <span className="flex-1 ms-3 whitespace-nowrap">Cases</span>
              </a>
            </li>
            <li>
              <a
                href="/admin/messages"
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

                <span className="flex-1 ms-3 whitespace-nowrap">Messages</span>
              </a>
            </li>
            <li>
              <a
                href="/admin/settings"
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
          <Route
            path="/dashboard"
            element={<AdminDashboardContent data={data} />}
          />
          <Route path="/agents" element={<AdminAgents />} />
          <Route path="/customers" element={<AdminCustomers />} />
          <Route path="/cases" element={<AdminCases />} />
          <Route path="/messages" element={<AdminMessages />} />
          <Route path="/settings" element={<AdminSettings />} />
        </Routes>
      </main>
    </div>
  );
};

const AdminDashboardContent: React.FC<{
  data: { name: string; value: number }[];
}> = ({ data }) => {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];
  
  return (
    <div className="bg-white">
      <h1 className="text-4xl px-20 py-10 font-semi-bold mb-4 text-black">Admin Dashboard</h1>
      <hr className="h-px my-8 bg-black border-0 dark:bg-gray-700" />
      <div className="flex">
        {data.map((item, index) => (
          <div key={index} className="w-1/3">
            <h2 className="text-lg">{item.name} Cases</h2>
            <PieChart width={300} height={300}>
              <Pie
                data={[item, { name: "Total", value: 100 - item.value }]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {data.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
