
import { Navigate, Outlet } from 'react-router-dom';
import DashboardLayout from '@/layout/DashboardLayout';
import { ReactNode } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { MenuItem } from '@/Types/Icase';

interface ProtectedRouteProps {
  children?: ReactNode;
  allowedRoles: string[];
  layout?: boolean; 
  menuItems?: MenuItem[];
  title?: string;
  subtitle?: string;
}

const ProtectedRoute = ({
  children,
  allowedRoles,
  layout = false,
  menuItems,
  title,
  subtitle,
}: ProtectedRouteProps) => {
  const { user, token } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user?.role || '')) {
    return <Navigate to="/" replace />;
  }

  if (layout) {
    // When layout is true, menuItems, title, and subtitle are required
    if (!menuItems || !title || !subtitle) {
      return <Navigate to="/" replace />;
    }
    // DashboardLayout uses <Outlet /> internally, so we don't pass children
    return (
      <DashboardLayout menuItems={menuItems} title={title} subtitle={subtitle} />
    );
  }

  // When layout is false, render children or Outlet directly
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;