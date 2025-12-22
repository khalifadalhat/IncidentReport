import { Outlet } from "react-router-dom";
import NotificationManager from "./NotificationManager";

const RootLayout = () => {
  return (
    <>
      <NotificationManager />
      <Outlet />
    </>
  );
};

export default RootLayout;
