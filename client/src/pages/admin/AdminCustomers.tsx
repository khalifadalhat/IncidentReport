import React from 'react';
import { FiSearch, FiEdit2, FiTrash2, FiUser, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
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
    // error,
    message,
    messageType,
    searchTerm,
    editingCustomer,
    setSearchTerm,
    setEditingCustomer,
    // setMessage
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
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    deleteCustomerMutation.mutate(id);
  };

  const handleUpdateCustomer = () => {
    if (!editingCustomer) return;
    updateCustomerMutation.mutate(editingCustomer);
  };

  return (
    <div className="bg-white min-h-screen">
      <h2 className="text-4xl px-20 py-10 font-semibold mb-4 text-black">Manage Customers</h2>

      {/* Message Display */}
      {message && (
        <div
          className={`mx-20 mb-4 p-4 rounded ${
            messageType === 'success'
              ? 'bg-green-100 border border-green-400 text-green-700'
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
          {message}
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="px-20 mb-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
          </div>
        </div>
      </div>

      <hr className="mx-20 h-px my-8 bg-gray-300 border-0" />

      {/* Customers Table */}
      <div className="px-20">
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="w-full table-auto text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="px-6 py-4">Full Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    {loading
                      ? 'Loading customers...'
                      : searchTerm
                      ? 'No matching customers found'
                      : 'No customers found'}
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(customer => (
                  <tr className="bg-white border-b hover:bg-gray-50" key={customer._id}>
                    <td className="px-6 py-4 font-medium text-gray-900">{customer.fullname}</td>
                    <td className="px-6 py-4 text-gray-900">{customer.email}</td>
                    <td className="px-6 py-4 text-gray-900">{customer.phone}</td>
                    <td className="px-6 py-4 text-gray-900">{customer.location}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          customer.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                        {customer.status || 'active'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingCustomer(customer)}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors">
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(customer._id)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors">
                          <FiTrash2 className="w-4 h-4" />
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

      {/* Edit Customer Modal */}
      {editingCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FiUser className="text-blue-600" />
                Edit Customer
              </h3>
              <button
                onClick={() => setEditingCustomer(null)}
                className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                handleUpdateCustomer();
              }}>
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={editingCustomer.fullname}
                    onChange={e =>
                      setEditingCustomer({
                        ...editingCustomer,
                        fullname: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Full Name"
                    required
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={editingCustomer.email}
                    onChange={e =>
                      setEditingCustomer({
                        ...editingCustomer,
                        email: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Email"
                    required
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    value={editingCustomer.phone}
                    onChange={e =>
                      setEditingCustomer({
                        ...editingCustomer,
                        phone: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Phone Number"
                    required
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMapPin className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={editingCustomer.location || ''}
                    onChange={e =>
                      setEditingCustomer({
                        ...editingCustomer,
                        location: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Location"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={updateCustomerMutation.isPending}
                    className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition">
                    {updateCustomerMutation.isPending ? 'Updating...' : 'Update Customer'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
