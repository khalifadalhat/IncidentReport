import React from 'react';
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
} from 'lucide-react';
import { useAdminCustomersStore } from '../../store/admin/useadminCustomerCase';
import {
  useDeleteCustomer,
  useFetchCustomers,
  useUpdateCustomer,
} from '../../hook/admin/useadminCustomers';

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

  const filteredCustomers = customers.filter(
    customer =>
      customer.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.toString().includes(searchTerm)
  );

  const handleDeleteCustomer = (id: string) => {
    deleteCustomerMutation.mutate(id);
  };

  const handleUpdateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;
    updateCustomerMutation.mutate(editingCustomer);
  };

  const showDeleteConfirm = (customer: { fullname: string; _id: string }) => {
    if (window.confirm(`Are you sure you want to delete ${customer.fullname}?`)) {
      handleDeleteCustomer(customer._id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Manage Customers</h1>
          <p className="text-gray-600">View and manage customer information</p>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              messageType === 'success'
                ? 'border-green-200 bg-green-50 text-green-700'
                : 'border-red-200 bg-red-50 text-red-700'
            }`}>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {message}
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Search & Filter</h2>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers by name, email, or phone..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Customers ({filteredCustomers.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Full Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Phone</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Location</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500">
                        {loading
                          ? 'Loading customers...'
                          : searchTerm
                          ? 'No matching customers found'
                          : 'No customers found'}
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map(customer => (
                      <tr key={customer._id} className="hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <span className="font-medium text-gray-900">{customer.fullname}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-900">{customer.email}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-900">{customer.phone}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-900">{customer.location}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                              customer.status === 'active' || !customer.status
                                ? 'bg-green-100 text-green-800 border-green-200'
                                : 'bg-red-100 text-red-800 border-red-200'
                            }`}>
                            {customer.status === 'active' || !customer.status ? (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            ) : (
                              <AlertCircle className="w-3 h-3 mr-1" />
                            )}
                            {customer.status || 'active'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingCustomer(customer)}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit customer">
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => showDeleteConfirm(customer)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete customer">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Edit Customer Modal */}
        {editingCustomer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <UserPlus className="h-6 w-6 text-blue-600" />
                    Edit Customer
                  </h3>
                  <button
                    onClick={() => setEditingCustomer(null)}
                    className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={editingCustomer.fullname}
                        onChange={e =>
                          setEditingCustomer({
                            ...editingCustomer,
                            fullname: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="email"
                        value={editingCustomer.email}
                        onChange={e =>
                          setEditingCustomer({
                            ...editingCustomer,
                            email: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="tel"
                        value={editingCustomer.phone}
                        onChange={e =>
                          setEditingCustomer({
                            ...editingCustomer,
                            phone: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={editingCustomer.location || ''}
                        onChange={e =>
                          setEditingCustomer({
                            ...editingCustomer,
                            location: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="Enter location"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleUpdateCustomer}
                      disabled={updateCustomerMutation.isPending}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium">
                      {updateCustomerMutation.isPending ? 'Updating...' : 'Update Customer'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingCustomer(null)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition font-medium">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCustomers;
