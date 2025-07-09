import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken, MenuItem, UserRole } from '../Types/Icase';

interface AuthWrapperProps {
  requiredRole?: UserRole;
  redirectPath: string;
  layout?: React.ComponentType<{
    menuItems: MenuItem[];
    title: string;
    subtitle: string;
    children?: React.ReactNode;
  }>;
  menuItems?: MenuItem[];
  title?: string;
  subtitle?: string;
  isCustomer?: boolean;
}

export const AuthWrapper = ({
  requiredRole,
  redirectPath,
  layout: Layout,
  menuItems,
  title,
  subtitle,
  isCustomer = false,
}: AuthWrapperProps) => {
  const token = Cookies.get('token');

  if (!token) {
    return <Navigate to={redirectPath} replace />;
  }

  try {
    const decodedToken = jwtDecode<DecodedToken>(token);

    if (isCustomer) {
      return Layout ? (
        <Layout menuItems={menuItems!} title={title!} subtitle={subtitle!}>
          <Outlet context={{ userId: decodedToken.userId }} />
        </Layout>
      ) : (
        <Outlet context={{ gentId: decodedToken.userId }} />
      );
    }

    if (decodedToken.role !== requiredRole) {
      return <Navigate to={redirectPath} replace />;
    }

    return Layout ? (
      <Layout menuItems={menuItems!} title={title!} subtitle={subtitle!}>
        <Outlet context={{ agentId: decodedToken.userId }} />
      </Layout>
    ) : (
      <Outlet context={{ agentId: decodedToken.userId }} />
    );
  } catch (error) {
    return <Navigate to={redirectPath} replace />;
  }
};
