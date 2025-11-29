import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCamera,
  FiLock,
  FiLogOut,
  FiBriefcase,
  FiSettings,
} from "react-icons/fi";
import api from "@/utils/api";
import { useAuthStore } from "@/store/useAuthStore";

interface Agent {
  _id: string;
  fullname: string;
  email: string;
  phone?: string;
  location?: string;
  department?: string;
  profileImage?: string;
}

interface ProfileFormData {
  fullname: string;
  phone: string;
  location: string;
  department: string;
  profileImage: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const AgentSettings = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();

  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showPasswordEdit, setShowPasswordEdit] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    fullname: "",
    phone: "",
    location: "",
    department: "",
    profileImage: "",
  });

  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");

  // Fetch agent profile
  const { data: user, isLoading } = useQuery<Agent>({
    queryKey: ["agentProfile"],
    queryFn: async () => {
      const response = await api.get("/api/users/profile");
      return response.data.user;
    },
  });

  // Update form when agent data is loaded
  useEffect(() => {
    if (user) {
      setProfileForm({
        fullname: user.fullname || "",
        phone: user.phone || "",
        location: user.location || "",
        department: user.department || "",
        profileImage: user.profileImage || "",
      });
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const response = await api.patch("/api/users/profile", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agentProfile"] });
      setShowProfileEdit(false);
      setImageFile(null);
    },
  });

  // Upload image mutation
  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const imgData = new FormData();
      imgData.append("image", file);
      const response = await api.post("/api/upload", imgData);
      return response.data;
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const response = await api.put("/api/agents/change-password", data);
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
      let imageUrl = profileForm.profileImage;

      if (imageFile) {
        const uploadResult = await uploadImageMutation.mutateAsync(imageFile);
        if (uploadResult.url) {
          imageUrl = uploadResult.url;
        }
      }

      await updateProfileMutation.mutateAsync({
        ...profileForm,
        profileImage: imageUrl,
      });
    } catch (err) {
      console.error("Update error:", err);
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
      setPasswordError(err.response?.data?.message || "Failed to change password");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  const handleProfileInputChange = (field: keyof ProfileFormData, value: string) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordInputChange = (field: keyof PasswordFormData, value: string) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading settings...</div>
      </div>
    );
  }

  if (!user) return null;

  const isUpdating = updateProfileMutation.status === "pending" || uploadImageMutation.status === "pending";
  const isChangingPassword = changePasswordMutation.status === "pending";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <FiSettings className="text-3xl text-black" />
          <h1 className="text-3xl font-bold text-gray-800">Agent Settings</h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border overflow-hidden mb-6">
          <div className="bg-black p-6 text-white">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/30 relative group">
                <img
                  src={user.profileImage || "https://placehold.co/150x150"}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setShowProfileEdit(true)}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition rounded-full"
                >
                  <FiCamera className="text-white text-2xl" />
                </button>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user.fullname}</h2>
                <p className="text-blue-100 mt-1">{user.email}</p>
                {user.department && (
                  <div className="flex items-center gap-2 mt-2">
                    <FiBriefcase className="text-sm" />
                    <span className="text-sm">{user.department}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem label="Full Name" value={user.fullname} icon={FiUser} />
              <InfoItem label="Email" value={user.email} icon={FiMail} />
              {user.phone && <InfoItem label="Phone" value={user.phone} icon={FiPhone} />}
              {user.location && <InfoItem label="Location" value={user.location} icon={FiMapPin} />}
              {user.department && <InfoItem label="Department" value={user.department} icon={FiBriefcase} />}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setShowProfileEdit(true)}
            className="bg-white hover:bg-gray-50 border-2 border-black text-black py-4 px-6 rounded-xl font-semibold transition flex items-center justify-center gap-3 shadow-md"
          >
            <FiUser className="text-xl" />
            <span>Update Profile</span>
          </button>

          <button
            onClick={() => setShowPasswordEdit(true)}
            className="bg-white hover:bg-gray-50 border-2 border-orange-500 text-orange-500 py-4 px-6 rounded-xl font-semibold transition flex items-center justify-center gap-3 shadow-md"
          >
            <FiLock className="text-xl" />
            <span>Change Password</span>
          </button>

          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 px-6 rounded-xl font-semibold transition flex items-center justify-center gap-3 shadow-md"
          >
            <FiLogOut className="text-xl" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Profile Edit Modal */}
      {showProfileEdit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold">Update Profile</h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={
                    imageFile
                      ? URL.createObjectURL(imageFile)
                      : profileForm.profileImage || "https://placehold.co/150x150"
                  }
                  alt="Profile preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Full Name"
                  value={profileForm.fullname}
                  onChange={(e) => handleProfileInputChange("fullname", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Phone Number"
                  value={profileForm.phone}
                  onChange={(e) => handleProfileInputChange("phone", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Location"
                  value={profileForm.location}
                  onChange={(e) => handleProfileInputChange("location", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Department"
                  value={profileForm.department}
                  onChange={(e) => handleProfileInputChange("department", e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3 p-6 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setShowProfileEdit(false)}
                className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                onClick={handleProfileUpdate}
                disabled={isUpdating}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 transition"
              >
                {isUpdating ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordEdit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold">Change Password</h2>
            </div>

            <div className="p-6 space-y-4">
              {passwordError && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                  {passwordError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter current password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => handlePasswordInputChange("currentPassword", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter new password"
                  value={passwordForm.newPassword}
                  onChange={(e) => handlePasswordInputChange("newPassword", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Confirm new password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => handlePasswordInputChange("confirmPassword", e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3 p-6 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => {
                  setShowPasswordEdit(false);
                  setPasswordError("");
                }}
                className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition"
                disabled={isChangingPassword}
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                disabled={isChangingPassword}
                className="flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium disabled:opacity-50 transition"
              >
                {isChangingPassword ? "Changing..." : "Change Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoItem = ({ 
  label, 
  value, 
  icon: Icon 
}: { 
  label: string; 
  value: string; 
  icon: React.ComponentType<{ className?: string }> 
}) => (
  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
    <div className="bg-gray-300 p-3 rounded-full">
      <Icon className="text-black" />
    </div>
    <div>
      <p className="text-xs text-gray-500 uppercase font-medium">{label}</p>
      <p className="font-semibold text-gray-800 mt-1">{value}</p>
    </div>
  </div>
);

export default AgentSettings;