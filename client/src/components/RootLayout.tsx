import { Outlet } from "react-router-dom";
import NotificationManager from "./NotificationManager";
import NotificationDropdown from "./NotificationContent";

const RootLayout = () => {
  return (
    <>
      <NotificationManager />
      <NotificationDropdown />
      <Outlet />
    </>
  );
};

export default RootLayout;
