import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCamera,
  FiList,
  FiPlus,
} from "react-icons/fi";
import api from "@/utils/api";
import { useLiveAddress } from "@/hook/useLiveAddress";

interface FormData {
  fullname: string;
  phone: string;
  location: string;
  gender: string;
  profileImage: string;
}

interface InfoProps {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface User {
  _id: string;
  fullname: string;
  email: string;
  phone?: string;
  location?: string;
  gender?: string;
  profileImage?: string;
}

const CustomerDetails = () => {
  const { address, error } = useLiveAddress();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showEdit, setShowEdit] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [form, setForm] = useState<FormData>({
    fullname: "",
    phone: "",
    location: "",
    gender: "",
    profileImage: "",
  });

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const response = await api.get("/api/users/profile");
      return response.data.user;
    },
  });

  useEffect(() => {
    if (user) {
      setForm({
        fullname: user.fullname || "",
        phone: user.phone || "",
        location: user.location || "",
        gender: user.gender || "",
        profileImage: user.profileImage || "",
      });
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await api.patch("/api/users/profile", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      setShowEdit(false);
      setImageFile(null);
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const imgData = new FormData();
      imgData.append("image", file);
      const response = await api.post("/api/upload", imgData);
      return response.data;
    },
  });

  const handleUpdate = async () => {
    try {
      let imageUrl = form.profileImage;

      if (imageFile) {
        const uploadResult = await uploadImageMutation.mutateAsync(imageFile);
        if (uploadResult.url) {
          imageUrl = uploadResult.url;
        }
      }

      await updateProfileMutation.mutateAsync({
        ...form,
        profileImage: imageUrl,
      });
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (!user) return null;

  const isUpdating =
    updateProfileMutation.status === "pending" ||
    uploadImageMutation.status === "pending";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white text-center relative">
          <div className="w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white/30 relative group">
            <img
              src={user.profileImage || "https://placehold.co/150x150"}
              alt="profile"
              className="w-full h-full object-cover"
            />

            <button
              onClick={() => setShowEdit(true)}
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition rounded-full"
            >
              <FiCamera className="text-white text-2xl" />
            </button>
          </div>

          <h1 className="text-3xl font-bold">Welcome back, {user.fullname}!</h1>
          <p className="mt-2 opacity-90">How can we help you today?</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Info label="Full Name" value={user.fullname || ""} icon={FiUser} />

            <Info label="Email" value={user.email} icon={FiMail} />

            {user.phone && (
              <Info label="Phone" value={user.phone} icon={FiPhone} />
            )}

            {user.location && (
              <Info label="Address" value={user.location} icon={FiMapPin} />
            )}

            <Info
              label="Live Location"
              value={error ? "Location unavailable" : address}
              icon={FiMapPin}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <button
              onClick={() => navigate("/customer/cases")}
              className="bg-gradient-to-r from-purple-600 to-pink-700 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center space-x-3"
            >
              <FiList className="text-xl" />
              <span>View My Cases</span>
            </button>

            <button
              onClick={() => navigate("/customer/departments")}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center space-x-3"
            >
              <FiPlus className="text-xl" />
              <span>Create New Case</span>
            </button>
          </div>
        </div>
      </div>

      {showEdit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4">Update Profile</h2>

            <div className="flex items-center space-x-4 mb-4">
              <img
                src={
                  imageFile
                    ? URL.createObjectURL(imageFile)
                    : form.profileImage || "https://placehold.co/150x150"
                }
                alt="Profile preview"
                className="w-20 h-20 rounded-full object-cover border"
              />
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>

            <div className="space-y-3">
              <input
                className="input w-full px-4 py-2 border rounded-lg"
                placeholder="Full Name"
                value={form.fullname}
                onChange={(e) => handleInputChange("fullname", e.target.value)}
              />

              <input
                className="input w-full px-4 py-2 border rounded-lg"
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />

              <input
                className="input w-full px-4 py-2 border rounded-lg"
                placeholder="Address"
                value={form.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />

              <input
                className="input w-full px-4 py-2 border rounded-lg"
                placeholder="Gender"
                value={form.gender}
                onChange={(e) => handleInputChange("gender", e.target.value)}
              />
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setShowEdit(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                disabled={isUpdating}
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700"
              >
                {isUpdating ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Info = ({ label, value, icon: Icon }: InfoProps) => (
  <div className="flex items-center space-x-4">
    <div className="bg-blue-100 p-3 rounded-full">
      <Icon className="text-blue-600" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

export default CustomerDetails;
