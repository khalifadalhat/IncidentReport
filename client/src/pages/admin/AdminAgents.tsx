import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FiPlus, FiTrash2, FiMail, FiUser, FiBriefcase } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import api from "@/utils/api";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface FormData {
  phone: string;
  location: string;
  fullname: string;
  email: string;
  department: string;
  id?: string;
}

interface Agent extends FormData {
  id: string;
}

const departmentColors: Record<string, string> = {
  // Violent Crimes Division
  sexual_assault_unit: "bg-pink-100 text-pink-800 border-pink-200",
  physical_assault_unit: "bg-red-100 text-red-800 border-red-200",
  domestic_violence_unit: "bg-orange-100 text-orange-800 border-orange-200",
  homicide_unit: "bg-purple-100 text-purple-800 border-purple-200",

  // Property Crimes Division
  robbery_unit: "bg-amber-100 text-amber-800 border-amber-200",
  burglary_unit: "bg-yellow-100 text-yellow-800 border-yellow-200",
  theft_unit: "bg-lime-100 text-lime-800 border-lime-200",
  vandalism_arson_unit: "bg-emerald-100 text-emerald-800 border-emerald-200",

  // Special Victims Division
  child_abuse_unit: "bg-cyan-100 text-cyan-800 border-cyan-200",
  elder_abuse_unit: "bg-teal-100 text-teal-800 border-teal-200",
  missing_persons_unit: "bg-blue-100 text-blue-800 border-blue-200",

  // Cyber & Organized Crime Division
  cyber_crime_unit: "bg-indigo-100 text-indigo-800 border-indigo-200",
  drug_enforcement_unit: "bg-violet-100 text-violet-800 border-violet-200",

  // Public Safety Division
  public_disturbance_unit: "bg-sky-100 text-sky-800 border-sky-200",
  traffic_incident_unit: "bg-rose-100 text-rose-800 border-rose-200",
  hate_crimes_unit: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200",

  // Support & General Division
  emergency_response: "bg-red-100 text-red-800 border-red-200",
  investigations_support: "bg-gray-100 text-gray-800 border-gray-200",
  general_support: "bg-slate-100 text-slate-800 border-slate-200",
};

const departmentLabels: Record<string, string> = {
  sexual_assault_unit: "Sexual Assault Unit",
  physical_assault_unit: "Physical Assault Unit",
  domestic_violence_unit: "Domestic Violence Unit",
  homicide_unit: "Homicide Unit",
  robbery_unit: "Robbery Unit",
  burglary_unit: "Burglary Unit",
  theft_unit: "Theft Unit",
  vandalism_arson_unit: "Vandalism & Arson Unit",
  child_abuse_unit: "Child Abuse Unit",
  elder_abuse_unit: "Elder Abuse Unit",
  missing_persons_unit: "Missing Persons Unit",
  cyber_crime_unit: "Cyber Crime Unit",
  drug_enforcement_unit: "Drug Enforcement Unit",
  public_disturbance_unit: "Public Disturbance Unit",
  traffic_incident_unit: "Traffic Incident Unit",
  hate_crimes_unit: "Hate Crimes Unit",
  emergency_response: "Emergency Response",
  investigations_support: "Investigations Support",
  general_support: "General Support",
};

const AdminAgents = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormData>({
    fullname: "",
    email: "",
    department: "general_support",
    phone: "",
    location: "",
  });

  const { data: agents = [], isLoading } = useQuery<Agent[]>({
    queryKey: ["agents"],
    queryFn: () => api.get("/api/users/agents").then((res) => res.data.agents),
  });

  const createMutation = useMutation({
    mutationFn: (data: FormData) => api.post("/api/users/agents", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      toast.success("Agent created successfully! Welcome email sent.");
      setForm({
        fullname: "",
        email: "",
        department: "general_support",
        phone: "",
        location: "",
      });
    },
    onError: () => {
      toast.error("Failed to create agent. Please try again.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/admin/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      toast.success("Agent deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete agent. Please try again.");
    },
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Law Enforcement Agents
            </h1>
            <p className="text-gray-600 mt-2">
              Manage law enforcement agents and their specialized units
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-full border">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            {agents.length} active agents
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Create Agent Card */}
          <Card className="lg:col-span-1 border">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiPlus className="w-5 h-5 text-blue-600" />
                </div>
                Add New Agent
              </CardTitle>
              <CardDescription>
                Create a new law enforcement agent account with specialized unit
                assignment.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="relative">
                  <FiUser className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Full Name"
                    value={form.fullname}
                    onChange={(e) =>
                      setForm({ ...form, fullname: e.target.value })
                    }
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <FiUser className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Phone"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <FiUser className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Location"
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                    className="pl-10"
                  />
                </div>

                <div className="relative">
                  <FiMail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Email Address"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="pl-10"
                  />
                </div>

                <div className="relative">
                  <FiBriefcase className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  <select
                    value={form.department}
                    onChange={(e) =>
                      setForm({ ...form, department: e.target.value })
                    }
                    className="w-full px-10 py-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  >
                    <optgroup label="Violent Crimes Division">
                      <option value="sexual_assault_unit">
                        Sexual Assault Unit
                      </option>
                      <option value="physical_assault_unit">
                        Physical Assault Unit
                      </option>
                      <option value="domestic_violence_unit">
                        Domestic Violence Unit
                      </option>
                      <option value="homicide_unit">Homicide Unit</option>
                    </optgroup>

                    <optgroup label="Property Crimes Division">
                      <option value="robbery_unit">Robbery Unit</option>
                      <option value="burglary_unit">Burglary Unit</option>
                      <option value="theft_unit">Theft Unit</option>
                      <option value="vandalism_arson_unit">
                        Vandalism & Arson Unit
                      </option>
                    </optgroup>

                    <optgroup label="Special Victims Division">
                      <option value="child_abuse_unit">Child Abuse Unit</option>
                      <option value="elder_abuse_unit">Elder Abuse Unit</option>
                      <option value="missing_persons_unit">
                        Missing Persons Unit
                      </option>
                    </optgroup>

                    <optgroup label="Cyber & Organized Crime">
                      <option value="cyber_crime_unit">Cyber Crime Unit</option>
                      <option value="drug_enforcement_unit">
                        Drug Enforcement Unit
                      </option>
                    </optgroup>

                    <optgroup label="Public Safety Division">
                      <option value="public_disturbance_unit">
                        Public Disturbance Unit
                      </option>
                      <option value="traffic_incident_unit">
                        Traffic Incident Unit
                      </option>
                      <option value="hate_crimes_unit">Hate Crimes Unit</option>
                    </optgroup>

                    <optgroup label="Support & General">
                      <option value="emergency_response">
                        Emergency Response
                      </option>
                      <option value="investigations_support">
                        Investigations Support
                      </option>
                      <option value="general_support">General Support</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              <Button
                onClick={() => createMutation.mutate(form)}
                disabled={
                  createMutation.isPending || !form.fullname || !form.email
                }
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-500/25"
              >
                {createMutation.isPending ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FiPlus className="w-4 h-4 mr-2" />
                )}
                {createMutation.isPending ? "Creating..." : "Create Agent"}
              </Button>
            </CardContent>
          </Card>

          {/* Agents List */}
          <Card className="lg:col-span-2 border">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <span>Law Enforcement Agents</span>
                <Badge variant="secondary" className="px-3 py-1">
                  {agents.length} agents
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : agents.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FiUser className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-lg font-medium">No agents yet</p>
                  <p className="text-sm">
                    Create your first law enforcement agent to get started
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {agents.map((agent) => (
                    <div
                      key={agent.id}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-medium">
                            {getInitials(agent.fullname)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-gray-900 truncate">
                              {agent.fullname}
                            </p>
                            <Badge
                              variant="outline"
                              className={`text-xs font-medium ${
                                departmentColors[agent.department] ||
                                "bg-gray-100 text-gray-800 border-gray-200"
                              }`}
                            >
                              {departmentLabels[agent.department] ||
                                agent.department}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 truncate flex items-center gap-1">
                            <FiMail className="w-3 h-3" />
                            {agent.email}
                          </p>
                          {agent.phone && (
                            <p className="text-sm text-gray-500 truncate">
                              📞 {agent.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMutation.mutate(agent.id!)}
                        disabled={deleteMutation.isPending}
                        className="text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        {deleteMutation.isPending ? (
                          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <FiTrash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminAgents;
