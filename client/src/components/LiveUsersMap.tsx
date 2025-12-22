import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon, divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { renderToStaticMarkup } from "react-dom/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface UserWithLocation {
  _id: string;
  fullname: string;
  role: "agent" | "customer";
  liveLocation?: {
    coordinates: [number, number]; 
    lastUpdated: string;
  };
}

interface LiveUsersMapProps {
  users: UserWithLocation[];
}

const LiveUsersMap = ({ users }: LiveUsersMapProps) => {
  const defaultCenter: [number, number] = [9.082, 8.6753];

  const validUsers = users.filter(
    (u) => u.liveLocation?.coordinates && u.liveLocation.coordinates.length === 2
  );

  const createCustomIcon = (role: "agent" | "customer", name: string) => {
    const color = role === "agent" ? "blue" : "red";
    const shortName = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

    const iconMarkup = renderToStaticMarkup(
      <div
        style={{
          backgroundColor: color,
          width: "36px",
          height: "36px",
          borderRadius: "50% 50% 50% 0",
          transform: "rotate(-45deg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "bold",
          fontSize: "12px",
          border: "3px solid white",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        }}
      >
        <span style={{ transform: "rotate(45deg)" }}>{shortName}</span>
      </div>
    );

    return divIcon({
      html: iconMarkup,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36],
      className: "custom-div-icon",
    });
  };

  return (
    <div className="h-96 md:h-screen w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer center={defaultCenter} zoom={6} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
        />

        {validUsers.map((user) => (
          <Marker
            key={user._id}
            position={[
              user.liveLocation!.coordinates[1], // latitude
              user.liveLocation!.coordinates[0], // longitude
            ]}
            icon={createCustomIcon(user.role, user.fullname)}
          >
            <Popup>
              <div className="text-sm">
                <strong>{user.fullname}</strong>
                <br />
                <span className="capitalize font-medium">{user.role}</span>
                <br />
                Last updated:{" "}
                {new Date(user.liveLocation!.lastUpdated).toLocaleString()}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-10 flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-blue-600 rounded-full"></div>
          <span>Agents</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-red-600 rounded-full"></div>
          <span>Customers</span>
        </div>
      </div>
    </div>
  );
};

export default LiveUsersMap;