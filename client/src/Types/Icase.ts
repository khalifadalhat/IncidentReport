import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";

export interface AssignedAgent {
  _id: string;
  fullname: string;
  email: string;
  status: string;
  department: string;
  role: string;
}

export interface Customer {
  _id: string;
  fullname: string;
  location: string;
  gender: string;
  phone: number;
  email: string;
  department: string;
  status: string;
}


export interface Case {
  _id: string;
  customer?: {
    _id: string;
    fullname: string;
    email: string;
  };
  customerName: string;
  issue: string;
  department: string;
  location: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  assignedAgent?: string | {
    _id: string;
    fullname: string;
    email?: string;
  };
  resolvedAt?: string;
  agent?: string; // Computed property for agent name
  imageUrl?: string;
  priority?: "low" | "medium" | "high" | "urgent";
}

// Export alias for backward compatibility
export type ICase = Case;


export interface ICustomer {
  _id: string;
  fullname: string;
  location: string;
  gender: string;
  phone: string;
  email: string;
  department: string;
  status: string;
  role: UserRole;
}

export interface IAdmin {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  description: string;
  issue: string;
  department: string;
  status: string;
  location: string;
  agent: string;
}

export interface IAgent {
  _id: string;
  fullname: string;
  email: string;
  status: string;
  department: string;
  role: string;
}

export interface Recipient {
  _id: string;
  fullname: string;
  email: string;
  phone: number;
}

export interface IMessage {
  _id: string;
  sender: string;
  senderModel: string;
  text: string;
  caseId: string;
  recipient: Recipient;
  timestamp?: Date;
  read: boolean;
}

export type UserRole = "admin" | "agent" | "customer";
export interface DecodedToken {
  userId: string;
  role: UserRole;
  exp: number;
}

type MenuIcon = LucideIcon | IconType;

export interface MenuItem {
  name: string;
  href: string;
  icon: MenuIcon;
  badge?: number;
  disabled?: boolean;
  submenu?: Omit<MenuItem, "submenu">[];
}

export interface AdminMenuItem extends MenuItem {
  adminOnly?: boolean;
}

export interface AgentMenuItem extends MenuItem {
  requiresApproval?: boolean;
}
