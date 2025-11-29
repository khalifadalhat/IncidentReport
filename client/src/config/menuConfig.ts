import {
  LayoutDashboard,
  Users,
  UserCheck,
  Briefcase,
  Settings,
} from 'lucide-react';
import {
  FiHome,
  FiClock,
  FiMessageSquare,
  FiSettings,
} from 'react-icons/fi';
import { FaRegCirclePlay } from 'react-icons/fa6';
import { MenuItem } from '../Types/Icase';

export const adminMenuItems: MenuItem[] = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Agents', href: '/admin/agents', icon: UserCheck },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Cases', href: '/admin/cases', icon: Briefcase },
  // { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export const agentMenuItems: MenuItem[] = [
  { name: 'Dashboard', href: '/agent', icon: FiHome },
  { name: 'Active', href: '/agent/active', icon: FaRegCirclePlay },
  { name: 'Pending', href: '/agent/pending', icon: FiClock },
  // { name: 'Customers', href: '/agent/customers', icon: FiUsers },
  { name: 'Chat', href: '/agent/chat', icon: FiMessageSquare },
  // { name: 'Resolved', href: '/agent/resolved', icon: FiCheckCircle },
  { name: 'Settings', href: '/agent/settings', icon: FiSettings },
];
