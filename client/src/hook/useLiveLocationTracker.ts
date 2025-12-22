import { useEffect } from "react";
import api from "@/utils/api";

export const useLiveLocationTracker = () => {
  const sendLocation = async (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;
    try {
      await api.post("/users/live-location", { latitude, longitude });
    } catch (err) {
      console.error("Failed to send live location:", err);
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(sendLocation);

    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(sendLocation, (err) => {
        console.error("Geolocation error:", err);
      });
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);
};