/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FiUser,
  FiLock,
  FiLogOut,
  FiSettings,
  FiEdit,
  FiUserPlus,
  FiSearch,
  FiUsers,
  FiShield,
} from "react-icons/fi";
import api from "@/utils/api";
import { useAuthStore } from "@/store/useAuthStore";

interface User {
  _id: string;
  fullname: string;
  email: string;
  phone?: string;
  location?: string;
  gender?: string;
  department?: string;
  role: "admin" | "supervisor" | "agent" | "customer";
  profileImage?: string;
  isActive?: boolean;
}

interface ProfileFormData {
  fullname: string;
  phone: string;
  location: string;
  department: string;
  profileImage: string;
}

interface UserEditFormData {
  fullname: string;
  phone: string;
  location: string;
  department: string;
  role: string;
  isActive: boolean;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface CreateAgentFormData {
  fullname: string;
  email: string;
  department: string;
}

const DEPARTMENTS = [
  "sexual_assault_unit",
  "physical_assault_unit",
  "domestic_violence_unit",
  "homicide_unit",

  "robbery_unit",
  "burglary_unit",
  "theft_unit",
  "vandalism_arson_unit",

  "child_abuse_unit",
  "elder_abuse_unit",
  "missing_persons_unit",

  "cyber_crime_unit",
  "drug_enforcement_unit",

  "public_disturbance_unit",
  "traffic_incident_unit",
  "hate_crimes_unit",

  "emergency_response",
  "investigations_support",
  "general_support",
];

const AdminSettings = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();

  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showPasswordEdit, setShowPasswordEdit] = useState(false);
  const [showUserEdit, setShowUserEdit] = useState(false);
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");

  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    fullname: "",
    phone: "",
    location: "",
    department: "",
    profileImage: "",
  });

  const [userEditForm, setUserEditForm] = useState<UserEditFormData>({
    fullname: "",
    phone: "",
    location: "",
    department: "",
    role: "",
    isActive: true,
  });

  const [createAgentForm, setCreateAgentForm] = useState<CreateAgentFormData>({
    fullname: "",
    email: "",
    department: "",
  });

  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");

  const { data: admin } = useQuery<User>({
    queryKey: ["adminProfile"],
    queryFn: async () => {
      const response = await api.get("/api/users/profile");
      return response.data.user;
    },
  });

  const { data: agents = [], isLoading: loadingAgents } = useQuery<User[]>({
    queryKey: ["allAgents"],
    queryFn: async () => {
      const response = await api.get("/api/users/agents");
      return response.data.agents;
    },
  });

  const { data: allUsers = [], isLoading: loadingUsers } = useQuery<User[]>({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const response = await api.get("/api/users/agents");
      return response.data.agents;
    },
  });

  useEffect(() => {
    if (admin) {
      setProfileForm({
        fullname: admin.fullname || "",
        phone: admin.phone || "",
        location: admin.location || "",
        department: admin.department || "",
        profileImage: admin.profileImage || "",
      });
    }
  }, [admin]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const response = await api.patch("/api/users/profile", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProfile"] });
      setShowProfileEdit(false);
    },
  });

  // Update user mutation (for editing other users)
  const updateUserMutation = useMutation({
    mutationFn: async ({
      userId,
      data,
    }: {
      userId: string;
      data: Partial<UserEditFormData>;
    }) => {
      const response = await api.patch(`/api/users/profile/${userId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      queryClient.invalidateQueries({ queryKey: ["allAgents"] });
      setShowUserEdit(false);
      setSelectedUser(null);
    },
  });

  // Create agent mutation
  const createAgentMutation = useMutation({
    mutationFn: async (data: CreateAgentFormData) => {
      const response = await api.post("/api/users/agents", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allAgents"] });
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      setShowCreateAgent(false);
      setCreateAgentForm({ fullname: "", email: "", department: "" });
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: {
      currentPassword: string;
      newPassword: string;
    }) => {
      const response = await api.put("/api/users/change-password", data);
      return response.data;
    },
    onSuccess: () => {
      setShowPasswordEdit(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordError("");
    },
  });

  const handleProfileUpdate = async () => {
    try {
      await updateProfileMutation.mutateAsync(profileForm);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleUserUpdate = async () => {
    if (!selectedUser) return;
    try {
      await updateUserMutation.mutateAsync({
        userId: selectedUser._id,
        data: userEditForm,
      });
    } catch (err) {
      console.error("Update user error:", err);
    }
  };

  const handleCreateAgent = async () => {
    try {
      await createAgentMutation.mutateAsync(createAgentForm);
    } catch (err) {
      console.error("Create agent error:", err);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setPasswordError(
        err.response?.data?.message || "Failed to change password"
      );
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const openEditUser = (user: User) => {
    setSelectedUser(user);
    setUserEditForm({
      fullname: user.fullname || "",
      phone: user.phone || "",
      location: user.location || "",
      department: user.department || "",
      role: user.role || "",
      isActive: user.isActive ?? true,
    });
    setShowUserEdit(true);
  };

  // Filter users based on search and role
  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch =
      user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const isUpdating = updateProfileMutation.status === "pending";
  const isChangingPassword = changePasswordMutation.status === "pending";
  const isUpdatingUser = updateUserMutation.status === "pending";
  const isCreatingAgent = createAgentMutation.status === "pending";

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <FiSettings className="text-3xl text-black" />
            <h1 className="text-3xl font-bold text-gray-800">Admin Settings</h1>
          </div>
          <button
            onClick={() => setShowCreateAgent(true)}
            className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition flex items-center gap-2"
          >
            <FiUserPlus className="text-xl" />
            Create Agent
          </button>
        </div>

        {/* Admin Profile Card */}
        <div className="bg-white rounded-2xl border overflow-hidden mb-8">
          <div className="bg-black p-6 text-white">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/30">
                <img
                  src={admin.profileImage || "https://placehold.co/150x150"}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{admin.fullname}</h2>
                <p className="text-gray-300 mt-1">{admin.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <FiShield className="text-sm" />
                  <span className="text-sm uppercase">{admin.role}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex gap-4">
              <button
                onClick={() => setShowProfileEdit(true)}
                className="flex-1 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2"
              >
                <FiUser />
                Update Profile
              </button>
              <button
                onClick={() => setShowPasswordEdit(true)}
                className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition flex items-center justify-center gap-2"
              >
                <FiLock />
                Change Password
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
              >
                <FiLogOut />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* User Management Section */}
        <div className="bg-white rounded-2xl border p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FiUsers className="text-2xl text-black" />
              <h2 className="text-2xl font-bold">User Management</h2>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="agent">Agents</option>
              <option value="supervisor">Supervisors</option>
              <option value="customer">Customers</option>
            </select>
          </div>

          {/* Users Table */}
          {loadingUsers || loadingAgents ? (
            <div className="text-center py-12 text-gray-500">
              Loading users...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No users found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={
                              user.profileImage || "https://placehold.co/40x40"
                            }
                            alt=""
                            className="w-10 h-10 rounded-full mr-3"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.fullname}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : user.role === "supervisor"
                              ? "bg-blue-100 text-blue-800"
                              : user.role === "agent"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.department || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.phone || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.isActive !== false
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.isActive !== false ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openEditUser(user)}
                          className="text-black hover:text-gray-700 flex items-center gap-1 ml-auto"
                        >
                          <FiEdit />
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Profile Edit Modal */}
      {showProfileEdit && (
        <Modal onClose={() => setShowProfileEdit(false)} title="Update Profile">
          <div className="space-y-4">
            <InputField
              label="Full Name"
              value={profileForm.fullname}
              onChange={(val) =>
                setProfileForm({ ...profileForm, fullname: val })
              }
            />
            <InputField
              label="Phone"
              value={profileForm.phone}
              onChange={(val) => setProfileForm({ ...profileForm, phone: val })}
            />
            <InputField
              label="Location"
              value={profileForm.location}
              onChange={(val) =>
                setProfileForm({ ...profileForm, location: val })
              }
            />
            <InputField
              label="Department"
              value={profileForm.department}
              onChange={(val) =>
                setProfileForm({ ...profileForm, department: val })
              }
            />
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setShowProfileEdit(false)}
              className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
              disabled={isUpdating}
            >
              Cancel
            </button>
            <button
              onClick={handleProfileUpdate}
              disabled={isUpdating}
              className="flex-1 px-4 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
            >
              {isUpdating ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </Modal>
      )}

      {/* User Edit Modal */}
      {showUserEdit && selectedUser && (
        <Modal
          onClose={() => setShowUserEdit(false)}
          title={`Edit ${selectedUser.fullname}`}
        >
          <div className="space-y-4">
            <InputField
              label="Full Name"
              value={userEditForm.fullname}
              onChange={(val) =>
                setUserEditForm({ ...userEditForm, fullname: val })
              }
            />
            <InputField
              label="Phone"
              value={userEditForm.phone}
              onChange={(val) =>
                setUserEditForm({ ...userEditForm, phone: val })
              }
            />
            <InputField
              label="Location"
              value={userEditForm.location}
              onChange={(val) =>
                setUserEditForm({ ...userEditForm, location: val })
              }
            />
            <SelectField
              label="Department"
              value={userEditForm.department}
              onChange={(val) =>
                setUserEditForm({ ...userEditForm, department: val })
              }
              options={DEPARTMENTS}
            />
            <SelectField
              label="Role"
              value={userEditForm.role}
              onChange={(val) =>
                setUserEditForm({ ...userEditForm, role: val })
              }
              options={["agent", "supervisor", "customer"]}
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={userEditForm.isActive}
                onChange={(e) =>
                  setUserEditForm({
                    ...userEditForm,
                    isActive: e.target.checked,
                  })
                }
                className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
              />
              <label
                htmlFor="isActive"
                className="text-sm font-medium text-gray-700"
              >
                Active Account
              </label>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setShowUserEdit(false)}
              className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
              disabled={isUpdatingUser}
            >
              Cancel
            </button>
            <button
              onClick={handleUserUpdate}
              disabled={isUpdatingUser}
              className="flex-1 px-4 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
            >
              {isUpdatingUser ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </Modal>
      )}

      {/* Create Agent Modal */}
      {showCreateAgent && (
        <Modal
          onClose={() => setShowCreateAgent(false)}
          title="Create New Agent"
        >
          <div className="space-y-4">
            <InputField
              label="Full Name"
              value={createAgentForm.fullname}
              onChange={(val) =>
                setCreateAgentForm({ ...createAgentForm, fullname: val })
              }
              placeholder="John Doe"
            />
            <InputField
              label="Email"
              type="email"
              value={createAgentForm.email}
              onChange={(val) =>
                setCreateAgentForm({ ...createAgentForm, email: val })
              }
              placeholder="agent@example.com"
            />
            <SelectField
              label="Department"
              value={createAgentForm.department}
              onChange={(val) =>
                setCreateAgentForm({ ...createAgentForm, department: val })
              }
              options={DEPARTMENTS}
            />
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setShowCreateAgent(false)}
              className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
              disabled={isCreatingAgent}
            >
              Cancel
            </button>
            <button
              onClick={handleCreateAgent}
              disabled={isCreatingAgent}
              className="flex-1 px-4 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
            >
              {isCreatingAgent ? "Creating..." : "Create Agent"}
            </button>
          </div>
        </Modal>
      )}

      {/* Password Change Modal */}
      {showPasswordEdit && (
        <Modal
          onClose={() => setShowPasswordEdit(false)}
          title="Change Password"
          color="orange"
        >
          <div className="space-y-4">
            {passwordError && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                {passwordError}
              </div>
            )}
            <InputField
              label="Current Password"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(val) =>
                setPasswordForm({ ...passwordForm, currentPassword: val })
              }
            />
            <InputField
              label="New Password"
              type="password"
              value={passwordForm.newPassword}
              onChange={(val) =>
                setPasswordForm({ ...passwordForm, newPassword: val })
              }
            />
            <InputField
              label="Confirm New Password"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(val) =>
                setPasswordForm({ ...passwordForm, confirmPassword: val })
              }
            />
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setShowPasswordEdit(false)}
              className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
              disabled={isChangingPassword}
            >
              Cancel
            </button>
            <button
              onClick={handlePasswordChange}
              disabled={isChangingPassword}
              className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50"
            >
              {isChangingPassword ? "Changing..." : "Change Password"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

const Modal = ({
  children,
  onClose,
  title,
  color = "black",
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
  color?: string;
}) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
      <div
        className={`sticky top-0 ${
          color === "orange" ? "bg-orange-500" : "bg-black"
        } text-white p-6 rounded-t-2xl`}
      >
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  placeholder?: string;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
    />
  </div>
);

const SelectField = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default AdminSettings;
