import { useEffect, useState } from "react";

export const useLiveAddress = () => {
  const [address, setAddress] = useState<string>("Fetching location...");
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        setCoords({ lat, lon });

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
          );
          const data = await res.json();

          setAddress(data.display_name || "Unknown address");
        } catch (err) {
          setAddress("Unable to get address");
        }
      },
      (err) => {
        setError(err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 1000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { address, coords, error };
};
