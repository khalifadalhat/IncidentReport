import React, { useEffect, useState } from "react";
import { ICase } from "../interface/Icase";
import api from "../../api";

interface AgentCasesProps {
  agentId: string;
}

const AgentCases: React.FC<AgentCasesProps> = ({ agentId }) => {
  const [pendingCases, setPendingCases] = useState<ICase[]>([]);
  const [closedCases, setClosedCases] = useState<ICase[]>([]);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await api.get("/cases");
      const casesWithAgents = await Promise.all(
        response.data.cases.map(async (singleCase: ICase) => {
          if (singleCase.assignedAgent) {
            const agentResponse = await api.get(
              `/cases/agent/${agentId}`
            );
            return { ...singleCase, agent: agentResponse.data.agent.fullname };
          } else {
            return { ...singleCase, agent: "Not Assigned" };
          }
        })
      );

      const pending = casesWithAgents.filter(
        (singleCase: ICase) => singleCase.status === "pending"
      );
      const closed = casesWithAgents.filter(
        (singleCase: ICase) => singleCase.status === "closed"
      );

      setPendingCases(pending);
      setClosedCases(closed);
    } catch (error) {
      console.error("Error fetching cases:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white">
      <h2 className="text-4xl px-20 py-10 font-semi-bold mb-4 text-black">
        Dashboard
      </h2>
      <hr className="h-px my-8 bg-black border-0 dark:bg-gray-700" />

      <div className="grid px-3">
        <div className="row-start-1 col-span-4">
          <div className="grid grid-cols-2">
            <div>
              <h2 className="text-black font-semibold">in-Mail Messages</h2>
              <p className="text-gray-500 text-sm">
                Monitor all messages and conversations.
              </p>
            </div>

            <div>
              <button className="bg-yellow-500 hover:bg-yellow-700 text-black font-bold py-2 px-4 rounded">
                Create New in-Mail
              </button>
              <button
                className="font-medium text-black hover:underline px-2"
                onClick={() => {
                  // Add your click handler logic here
                }}
              >
                View
              </button>
            </div>
          </div>
          <div className="bg-[#faeeb9] mt-5 p-2 w-full">
            <h1 className="text-xl text-black">Khalifa Dalhat</h1>
            <h2 className="text-2xl font-bold text-black">
              Follow-up on the customer with bad network!
            </h2>
            <p className="text-gray-500 text-sm">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Voluptatem nihil alias voluptatibus sint eos sed soluta facere!
              Nesciunt, dolor! Voluptatibus nam nihil architecto iste deserunt
              deleniti consectetur. Possimus, odit? Corporis?
            </p>
          </div>
        </div>
        <div className="row-start-1 col-span-1 mx-2 mb-7">
          <h2 className="text-black font-semibold mb-2">Pending Customers</h2>
          <table className="w-full table-auto text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">Customer Name</th>
                <th className="px-6 py-3">Issue</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Agent</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {pendingCases.map((singleCase) => (
                <tr
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  key={singleCase._id}
                >
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {singleCase.customerName}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 break-words whitespace-normal dark:text-white">
                    {singleCase.issue}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-rose-500">
                    {singleCase.status}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {singleCase.agent}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {formatDate(singleCase.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <h2 className="text-black font-semibold">Closed Customers</h2>
      <table className="w-full table-auto text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-3">Customer Name</th>
            <th className="px-6 py-3">Issue</th>
            <th className="px-6 py-3">Agent</th>
            <th className="px-6 py-3">Date</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {closedCases.map((singleCase) => (
            <tr
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              key={singleCase._id}
            >
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {singleCase.customerName}
              </td>
              <td className="px-6 py-4 font-medium text-gray-900 break-words whitespace-normal dark:text-white">
                {singleCase.issue}
              </td>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {singleCase.agent}
              </td>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {formatDate(singleCase.createdAt)}
              </td>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-green-300">
                {singleCase.status}
              </td>
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <button
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AgentCases;
