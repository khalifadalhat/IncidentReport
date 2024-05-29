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
    <div>
      <h2 className="text-2xl mb-4">Manage Agents</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Full Name"
          value={newAgent.fullname}
          onChange={(e) =>
            setNewAgent({ ...newAgent, fullname: e.target.value })
          }
          className="border p-2 mr-2 rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={newAgent.email}
          onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
          className="border p-2 mr-2 rounded"
        />
        <select
          value={newAgent.department}
          onChange={(e) =>
            setNewAgent({ ...newAgent, department: e.target.value })
          }
          className="border p-2 mr-2 rounded"
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
          className="border p-2 mr-2 rounded"
        >
          <option value="agent">Agent</option>
          <option value="supervisor">Supervisor</option>
        </select>
        <button
          onClick={handleCreateAgent}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Agent
        </button>
      </div>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="py-2">Full Name</th>
            <th className="py-2">Email</th>
            <th className="py-2">Department</th>
            <th className="py-2">Role</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent) => (
            <tr key={agent._id}>
              <td className="border px-4 py-2">{agent.fullname}</td>
              <td className="border px-4 py-2">{agent.email}</td>
              <td className="border px-4 py-2">{agent.department}</td>
              <td className="border px-4 py-2">{agent.role}</td>
              <td className="border px-4 py-2">
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
