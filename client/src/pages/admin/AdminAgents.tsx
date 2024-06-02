import React, { useEffect, useState } from "react";
import axios from "axios";
import { IAgent } from "../interface/Icase";

const AdminAgents: React.FC = () => {
  const [agents, setAgents] = useState<IAgent[]>([]);
  const [newAgent, setNewAgent] = useState({
    fullname: "",
    email: "",
    department: "Funding Wallet",
    role: "agent",
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/agents")
      .then((response) => {
        setAgents(response.data.agents);
      })
      .catch((error) => {
        console.error("There was an error fetching the agents!", error);
      });
  }, []);

  const handleCreateAgent = async () => {
    await axios
      .post("http://localhost:5000/agents", newAgent)
      .then((response) => {
        setAgents([...agents, response.data.agent]);
        setNewAgent({
          fullname: "",
          email: "",
          department: "Funding Wallet",
          role: "agent",
        });
      })
      .catch((error) => {
        console.error("There was an error creating the agent!", error);
      });
  };

  const handleDeleteAgent = async (id: string) => {
    await axios
      .delete(`http://localhost:5000/agents/${id}`)
      .then(() => {
        setAgents(agents.filter((agent) => agent._id !== id));
      })
      .catch((error) => {
        console.error("There was an error deleting the agent!", error);
      });
  };

  return (
    <div className="bg-white">
      <h2 className="text-4xl px-20 py-10 font-semi-bold mb-4 text-black">Manage Agents</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Full Name"
          value={newAgent.fullname}
          onChange={(e) =>
            setNewAgent({ ...newAgent, fullname: e.target.value })
          }
          className="border p-2 mr-2 rounded text-black"
        />
        <input
          type="email"
          placeholder="Email"
          value={newAgent.email}
          onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
          className="border p-2 mr-2 rounded text-black"
        />
        <select
          value={newAgent.department}
          onChange={(e) =>
            setNewAgent({ ...newAgent, department: e.target.value })
          }
          className="border p-2 mr-2 rounded text-black"
        >
          <option value="Funding Wallet">Funding Wallet</option>
          <option value="Buying Airtime">Buying Airtime</option>
          <option value="Buying Internet Data">Buying Internet Data</option>
          <option value="E-commerce Section">E-commerce Section</option>
          <option value="Fraud Related Problems">Fraud Related Problems</option>
          <option value="General Services">General Services</option>
        </select>
        <select
          value={newAgent.role}
          onChange={(e) => setNewAgent({ ...newAgent, role: e.target.value })}
          className="border p-2 mr-2 rounded text-black"
        >
          <option value="agent">Agent</option>
          <option value="supervisor">Supervisor</option>
        </select>
        <button
          onClick={handleCreateAgent}
          className="bg-blue-500 text-white p-2 rounded w-20"
        >
          Add 
        </button>
      </div>
      <hr className="h-px my-8 bg-black border-0 dark:bg-gray-700" />
      <table className="w-full table-auto text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">Full Name</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">Department</th>
            <th className="px-6 py-3">Role</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent) => (
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={agent._id}>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{agent.fullname}</td>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{agent.email}</td>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{agent.department}</td>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{agent.role}</td>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <button
                  onClick={() => handleDeleteAgent(agent._id)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAgents;
