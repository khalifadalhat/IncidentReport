import React from "react";
import {
  Search,
  Edit2,
  Trash2,
  User,
  Mail,
  Phone,
  MapPin,
  X,
  AlertCircle,
  CheckCircle,
  UserPlus,
  Shield,
  Users,
  Briefcase,
  Filter,
} from "lucide-react";
import { useAdminCustomersStore } from "../../store/admin/useadminCustomerCase";
import {
  useDeleteCustomer,
  useFetchCustomers,
  useUpdateCustomer,
} from "../../hook/admin/useadminCustomers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface User {
  _id: string;
  fullname: string;
  email: string;
  phone: string;
  location?: string;
  status?: string;
  role: "customer" | "agent" | "admin";
  department?: string;
}

const AdminCustomers: React.FC = () => {
  const {
    customers,
    loading,
    message,
    messageType,
    searchTerm,
    editingCustomer,
    setSearchTerm,
    setEditingCustomer,
  } = useAdminCustomersStore();

  // Fetch data
  useFetchCustomers();

  // Mutations
  const deleteCustomerMutation = useDeleteCustomer();
  const updateCustomerMutation = useUpdateCustomer();

  const filteredCustomers = (customers || []).filter((customer) => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = (customer.fullname || "")
      .toLowerCase()
      .includes(searchLower);
    const emailMatch = (customer.email || "")
      .toLowerCase()
      .includes(searchLower);
    const phoneMatch = (customer.phone || "").toString().includes(searchLower);
    const roleMatch = (customer.role || "").toLowerCase().includes(searchLower);

    return nameMatch || emailMatch || phoneMatch || roleMatch;
  });

  const handleDeleteCustomer = (id: string) => {
    deleteCustomerMutation.mutate(id);
  };

  const handleUpdateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;
    updateCustomerMutation.mutate(editingCustomer);
  };

  const showDeleteConfirm = (user: User) => {
    if (window.confirm(`Are you sure you want to delete ${user.fullname}?`)) {
      handleDeleteCustomer(user._id);
    }
  };

  const getRoleStyles = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "agent":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "customer":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="w-3 h-3 mr-1" />;
      case "agent":
        return <Briefcase className="w-3 h-3 mr-1" />;
      case "customer":
        return <User className="w-3 h-3 mr-1" />;
      default:
        return <User className="w-3 h-3 mr-1" />;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-gradient-to-br from-purple-500 to-purple-600";
      case "agent":
        return "bg-gradient-to-br from-blue-500 to-blue-600";
      case "customer":
        return "bg-gradient-to-br from-green-500 to-green-600";
      default:
        return "bg-gradient-to-br from-gray-500 to-gray-600";
    }
  };

  const roleCounts = {
    admin: filteredCustomers.filter((user) => user.role === "admin").length,
    agent: filteredCustomers.filter((user) => user.role === "agent").length,
    customer: filteredCustomers.filter((user) => user.role === "customer")
      .length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
                User Management
              </h1>
              <p className="text-gray-600 text-lg">
                Manage all users across your platform
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border shadow-sm">
              <Users className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                {filteredCustomers.length} users
              </span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 ">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Customers</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {roleCounts.customer}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <User className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 ">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Agents</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {roleCounts.agent}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 ">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admins</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {roleCounts.admin}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-2xl border-2 ${
              messageType === "success"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            } shadow-sm`}
          >
            <div className="flex items-center gap-2">
              {messageType === "success" ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              {message}
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                Search & Filter
              </h2>
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name, email, phone, or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900">
                All Users
                <span className="text-gray-500 font-normal ml-2">
                  ({filteredCustomers.length})
                </span>
              </h2>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? "No matching users found" : "No users found"}
                </p>
                <p className="text-gray-500">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "Get started by adding your first user"}
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredCustomers.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl  transition-all duration-200"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold ${getAvatarColor(
                          user.role
                        )}`}
                      >
                        {getInitials(user.fullname)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {user.fullname}
                          </h3>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleStyles(
                              user.role
                            )}`}
                          >
                            {getRoleIcon(user.role)}
                            {user.role}
                          </span>
                          {user.department && user.role === "agent" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                              <Briefcase className="w-3 h-3 mr-1" />
                              {user.department}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            <span className="truncate">{user.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            <span>{user.phone}</span>
                          </div>
                          {user.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{user.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingCustomer(user)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        title="Edit user"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => showDeleteConfirm(user)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Delete user"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Edit User Modal */}
        {editingCustomer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full ">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <UserPlus className="h-6 w-6 text-blue-600" />
                    Edit User
                  </h3>
                  <button
                    onClick={() => setEditingCustomer(null)}
                    className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleUpdateCustomer} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={editingCustomer.fullname}
                        onChange={(e) =>
                          setEditingCustomer({
                            ...editingCustomer,
                            fullname: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={editingCustomer.email}
                        onChange={(e) =>
                          setEditingCustomer({
                            ...editingCustomer,
                            email: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        value={editingCustomer.phone}
                        onChange={(e) =>
                          setEditingCustomer({
                            ...editingCustomer,
                            phone: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={editingCustomer.location || ""}
                        onChange={(e) =>
                          setEditingCustomer({
                            ...editingCustomer,
                            location: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="Enter location"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <Select
                      value={editingCustomer.role}
                      onValueChange={(value) =>
                        setEditingCustomer({
                          ...editingCustomer,
                          role: value as "customer" | "agent" | "admin",
                        })
                      }
                    >
                      <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-0 focus:outline-none">
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-300">
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="agent">Agent</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {editingCustomer.role === "agent" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department
                      </label>
                      <Select
                        value={editingCustomer.department || "general"}
                        onValueChange={(value) =>
                          setEditingCustomer({
                            ...editingCustomer,
                            department: value,
                          })
                        }
                      >
                        <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-0 focus:outline-none transition">
                          <SelectValue placeholder="Select Department" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-300">
                          <SelectItem value="technical">
                            Technical Support
                          </SelectItem>
                          <SelectItem value="billing">
                            Billing Department
                          </SelectItem>
                          <SelectItem value="general">
                            General Services
                          </SelectItem>
                          <SelectItem value="sales">Sales Team</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={updateCustomerMutation.isPending}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium shadow-lg shadow-blue-500/25"
                    >
                      {updateCustomerMutation.isPending
                        ? "Updating..."
                        : "Update User"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingCustomer(null)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCustomers;
