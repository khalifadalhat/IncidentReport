import React, { useEffect, useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { MenuItem } from "../Types/Icase";
import Logo from "../assets/support.png";
import { useAuthStore } from "@/store/useAuthStore";
import { canSeeNotifications } from "@/utils/roleUtils";
import NotificationDropdown from "@/components/NotificationContent";

interface DashboardLayoutProps {
  menuItems: MenuItem[];
  title: string;
  subtitle: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  menuItems,
  title,
  subtitle,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuthStore();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const showNotifications = canSeeNotifications(user?.role);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Mobile header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-gray-800 text-white">
        <h1 className="text-xl font-semibold">{title}</h1>

        <div className="flex items-center gap-3">
          {showNotifications && <NotificationDropdown />}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-white border-r">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
              <img
                src={Logo}
                className="w-6 h-6 brightness-0 invert"
                alt="logo"
              />
            </div>
            <div>
              <h2 className="text-gray-700 font-bold text-lg">{title}</h2>
              <p className="text-slate-400 text-sm">{subtitle}</p>
            </div>
          </div>
        </div>

        <nav className="px-4 pb-4 h-[calc(100vh-120px)] overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <NavItem key={index} item={item} />
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative p-2 overflow-x-hidden">
        {/* Desktop notifications */}
        {showNotifications && (
          <div className="hidden md:block absolute top-4 right-6 z-50">
            <NotificationDropdown />
          </div>
        )}

        <Outlet />
      </main>
    </div>
  );
};

const NavItem: React.FC<{ item: MenuItem }> = ({ item }) => {
  const location = useLocation();
  const isActive = location.pathname === item.href;
  const IconComponent = item.icon;

  return (
    <li>
      <Link
        to={item.href}
        className={`flex items-center px-4 py-3 rounded-xl transition-all ${
          isActive
            ? "bg-gray-900 text-white"
            : "text-gray-900 hover:bg-slate-700/50 hover:text-white"
        }`}
      >
        <IconComponent className="w-5 h-5 mr-3" />
        <span className="font-medium">{item.name}</span>
      </Link>
    </li>
  );
};

export default DashboardLayout;
