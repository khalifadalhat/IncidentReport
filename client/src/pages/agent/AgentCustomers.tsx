import React, { useEffect, useState } from "react";
import { ICustomer } from "../interface/Icase";
import {
  FiUser,
  FiPhone,
  FiMail,
  FiMapPin,
  FiRefreshCw,
  FiAlertCircle,
  FiEye,
} from "react-icons/fi";
import api from "../../utils/api";

const AgentCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/customers");
      setCustomers(response.data.customers);
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError("Failed to load customers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (phone: string) => {
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">
          <FiAlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">{error}</h3>
          <div className="mt-6">
            <button
              onClick={fetchCustomers}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <FiRefreshCw className="mr-2" /> Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-xl font-semibold text-gray-900">
            Customer Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {customers.length} customers in the system
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={fetchCustomers}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <FiRefreshCw className="mr-2" /> Refresh
          </button>
        </div>
      </div>

      {customers.length === 0 ? (
        <div className="text-center py-12">
          <FiUser className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No customers found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            There are currently no customers in the system.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <TableHeader>Customer</TableHeader>
                <TableHeader>Contact</TableHeader>
                <TableHeader>Location</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Actions</TableHeader>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <TableRow key={customer._id}>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <FiUser className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {customer.fullname}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {customer._id.substring(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <FiMail className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <span className="truncate">{customer.email}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <FiPhone className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <span>{formatPhoneNumber(customer.email)}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <FiMapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        {customer.location}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                        customer.status || "active"
                      )}`}
                    >
                      {customer.status || "Active"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      <FiEye className="mr-1.5 h-4 w-4" /> View
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Reusable table components
const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <th
    scope="col"
    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
  >
    {children}
  </th>
);

const TableRow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <tr className="hover:bg-gray-50">{children}</tr>
);

const TableCell: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <td className={`px-6 py-4 whitespace-nowrap ${className}`}>{children}</td>
);

export default AgentCustomers;
