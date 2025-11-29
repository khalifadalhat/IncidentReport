import { useQuery } from "@tanstack/react-query";
import { FiMessageSquare, FiClock, FiCheckCircle } from "react-icons/fi";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import api from "@/utils/api";
import { useCustomerStore } from "@/store/useCustomerStore";

interface Case {
  _id: string;
  issue: string;
  department: string;
  status: "pending" | "active" | "resolved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

const MyCases = () => {
  const navigate = useNavigate();
  const { setCaseId } = useCustomerStore();
  const { data: cases = [], isLoading } = useQuery<Case[]>({
    queryKey: ["myCases"],
    queryFn: () => api.get("/cases/my").then((res) => res.data.cases),
  });

  const handleCaseClick = (caseId: string) => {
    setCaseId(caseId);

    navigate("/customer/chat");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <FiClock className="text-orange-500" />;
      case "active":
        return <FiMessageSquare className="text-blue-500" />;
      case "resolved":
        return <FiCheckCircle className="text-green-500" />;
      default:
        return <FiMessageSquare className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading your cases...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">My Support Cases</h1>

      {cases.length === 0 ? (
        <div className="text-center py-20">
          <FiMessageSquare className="mx-auto text-6xl text-gray-300 mb-4" />
          <p className="text-xl text-gray-600">No cases yet</p>
          <Link
            to="/customer/departments"
            className="mt-6 inline-block bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700"
          >
            Create Your First Case
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {cases.map((c) => (
            <div
              key={c._id}
              onClick={() => handleCaseClick(c._id)}
              className="block bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{c.department}</h3>
                  <p className="text-gray-600 mt-2 line-clamp-2">{c.issue}</p>
                  <div className="flex gap-6 mt-4 text-sm text-gray-500">
                    <span>
                      Created {format(new Date(c.createdAt), "MMM d, yyyy")}
                    </span>
                    {c.updatedAt && c.updatedAt !== c.createdAt && (
                      <span>
                        Last update{" "}
                        {format(new Date(c.updatedAt), "MMM d, yyyy")}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                      c.status
                    )}`}
                  >
                    {getStatusIcon(c.status)}
                    {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCases;
