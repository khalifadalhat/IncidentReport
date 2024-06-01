export interface ICase {
  _id: string;
  customerName: string;
  issue: string;
  department: string;
  status: string;
  location: string;
  agent: string;
  assignedAgent: string;
  createdAt: string;
}

export interface ICustomer {
  _id: string;
  fullname: string;
  location: string;
  gender: string;
  phone: number;
  email: string;
}

export interface IAdmin {
    _id: string;
    customerName: string;
    issue: string;
    department: string;
    status: string;
    location: string;
    agent: string;
  }

  export interface IAgent {
    _id: string;
    fullname: string;
    email: string,
    department: string;
    role: string;
  }

  export interface DecodedToken {
    userId: string;
    role: string;
    exp: number;
  }
  
