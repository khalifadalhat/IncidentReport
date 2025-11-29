import { useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiAlertTriangle,
  FiZap,
  FiLock,
  FiUserX,
  FiCpu,
  FiHelpCircle,
  FiShoppingCart,
} from "react-icons/fi";
import { useCustomerStore } from "@/store/useCustomerStore";

const departments = [
  {
    name: "sexual_assault",
    displayName: "Sexual Assault",
    icon: FiUsers,
    color: "pink",
  },
  {
    name: "physical_assault",
    displayName: "Physical Assault",
    icon: FiZap,
    color: "red",
  },
  {
    name: "homicide",
    displayName: "Homicide / Death Investigation",
    icon: FiAlertTriangle,
    color: "red",
  },
  {
    name: "domestic_violence",
    displayName: "Domestic Violence",
    icon: FiUsers,
    color: "purple",
  },

  {
    name: "robbery",
    displayName: "Robbery (Person)",
    icon: FiLock,
    color: "gray",
  },
  {
    name: "burglary",
    displayName: "Burglary (Property)",
    icon: FiLock,
    color: "indigo",
  },
  {
    name: "theft",
    displayName: "Theft",
    icon: FiShoppingCart,
    color: "yellow",
  },
  {
    name: "vandalism",
    displayName: "Vandalism / Arson",
    icon: FiAlertTriangle,
    color: "orange",
  },

  {
    name: "missing_person",
    displayName: "Missing Person",
    icon: FiUserX,
    color: "blue",
  },
  {
    name: "child_abuse",
    displayName: "Child or Elder Abuse",
    icon: FiUserX,
    color: "teal",
  },
  {
    name: "cyber_crime",
    displayName: "Cyber Crime / Fraud",
    icon: FiCpu,
    color: "green",
  },

  {
    name: "traffic_incident",
    displayName: "Traffic / Public Incident",
    icon: FiAlertTriangle,
    color: "cyan",
  },
  {
    name: "other",
    displayName: "Other Incident",
    icon: FiHelpCircle,
    color: "gray",
  },
];

const Departments = () => {
  const { setDepartment } = useCustomerStore();
  const navigate = useNavigate();

  const handleSelect = (dept: string) => {
    setDepartment(dept);
    navigate("/customer/problem-type");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
          What type of incident are you reporting?
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {departments.map((dept) => {
            const Icon = dept.icon;
            return (
              <button
                key={dept.name}
                onClick={() => handleSelect(dept.name)}
                className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl transition transform hover:-translate-y-1 border border-gray-100"
              >
                <div
                  className={`w-14 h-14 bg-${dept.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <Icon className={`text-2xl text-${dept.color}-600`} />
                </div>
                <h3 className="text-base font-semibold text-gray-800">
                  {dept.displayName}
                </h3>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Departments;
