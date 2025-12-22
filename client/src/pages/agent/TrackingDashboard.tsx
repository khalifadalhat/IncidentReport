/* eslint-disable @typescript-eslint/no-explicit-any */
import LiveUsersMap from "@/components/LiveUsersMap";
import api from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

const TrackingDashboard = () => {
    const { data: agents } = useQuery({
      queryKey: ["agentsLive"],
      queryFn: () => api.get("/users/agents/live").then(res => res.data.agents),
      refetchInterval: 60000, 
    });
  
    const { data: customers } = useQuery({
      queryKey: ["customersLive"],
      queryFn: () => api.get("/users/customers/live").then(res => res.data.customers),
      refetchInterval: 60000,
    });
  
    const allUsers = [
      ...(agents || []).map((a: any) => ({ ...a, role: "agent" as const })),
      ...(customers || []).map((c: any) => ({ ...c, role: "customer" as const })),
    ];
  
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Live Tracking Map</h1>
        <LiveUsersMap users={allUsers} />
      </div>
    );
  };

  export default TrackingDashboard