import React, { useEffect, useState } from "react";
import { IAdmin, IAgent } from "../interface/Icase";
import api from "../../api";

const AdminCases: React.FC = () => {
  const [cases, setCases] = useState<IAdmin[]>([]);
  const [agents, setAgents] = useState<IAgent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  useEffect(() => {
    fetchCases();
    fetchAgents();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await api.get("/cases");
      setCases(response.data.cases);
    } catch (error) {
      console.error("Error fetching cases:", error);
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await api.get("/agents");
      setAgents(response.data.agents);
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  };

  const handleAssignAgent = async (caseId: string, agentId?: string) => {
    const selectedAgentId = agentId ?? selectedAgent;
    if (!selectedAgentId) {
      alert("Please select an agent.");
      return;
    }

    try {
      await api.put(`/cases/assign`, {
        caseId,
        agentId: selectedAgentId,
      });

      setCases((prevCases) =>
        prevCases.map((singleCase) => {
          if (singleCase._id === caseId) {
            return { ...singleCase, agent: selectedAgentId };
          }
          return singleCase;
        })
      );
      setSelectedAgent(null);
    } catch (error) {
      console.error("Error assigning agent:", error);
      alert("Failed to assign agent. Please try again.");
    }
  };

  const handleChangeStatus = async (caseId: string, status: string) => {
    try {
      await api.put(`/cases/status/:caseId`, {
        status,
      });
      setCases((prevCases) =>
        prevCases.map((singleCase) => {
          if (singleCase._id === caseId) {
            return { ...singleCase, status };
          }
          return singleCase;
        })
      );
    } catch (error) {
      console.error("Error changing status:", error);
      alert("Failed to change status. Please try again.");
    }
  };

  return (
    <div className="bg-white">
      <h2 className="text-4xl px-20 py-10 font-semi-bold mb-4 text-black">
        Manage Cases
      </h2>
      <hr className="h-px my-8 bg-black border-0 dark:bg-gray-700" />
      <table className="w-full table-auto text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">Customer Name</th>
            <th className="px-6 py-3">Issue</th>
            <th className="px-6 py-3">Department</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Location</th>
            <th className="px-6 py-3">Agent</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((singleCase) => (
            <tr
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              key={singleCase._id}
            >
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white max-w-xs overflow-hidden overflow-ellipsis">
                {singleCase.customerName}
              </td>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white max-w-xs overflow-hidden overflow-ellipsis">
                {singleCase.issue}
              </td>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white max-w-xs overflow-hidden overflow-ellipsis">
                {singleCase.department}
              </td>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white max-w-xs overflow-hidden overflow-ellipsis">
                <select
                  value={singleCase.status}
                  onChange={(e) =>
                    handleChangeStatus(singleCase._id, e.target.value)
                  }
                >
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                  <option value="pending">Pending</option>
                </select>
              </td>
              <td className="border px-4 py-2 max-w-xs overflow-hidden overflow-ellipsis">
                {singleCase.location}
              </td>
              <td className="border px-4 py-2 max-w-xs overflow-hidden overflow-ellipsis">
                {singleCase.agent}
              </td>
              <td className="border px-4 py-2 max-w-xs overflow-hidden overflow-ellipsis">
                <select
                  value={singleCase.agent || ""}
                  onChange={(e) =>
                    handleAssignAgent(singleCase._id, e.target.value)
                  }
                >
                  <option value="">Select Agent</option>
                  {agents.map((agent) => (
                    <option key={agent._id} value={agent._id}>
                      {agent.fullname}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCases;
