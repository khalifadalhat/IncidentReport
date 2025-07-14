import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiClock } from 'react-icons/fi';
import { FaUserTie } from 'react-icons/fa';

// --- Interfaces for your data structure ---
interface Agent {
  _id: string;
  fullname: string;
  department: string;
}

interface Customer {
  _id: string;
  fullname: string;
  email: string;
  phone: string;
}

interface Case {
  _id: string;
  assignedAgent?: Agent;
  createdAt: string;
  customer: Customer;
  customerName: string;
  department: string;
  issue: string;
  location: string;
  status: 'active' | 'resolved' | 'pending' | string;
  updatedAt: string;
  __v: number;
}

interface CaseDetailsPageProps {
  caseData?: Case;
  onResolveCase?: (caseId: string) => void;
  isResolving?: boolean;
}

const AgentCaseDetails: React.FC<CaseDetailsPageProps> = ({
  caseData: propsCaseData,
  onResolveCase,
  isResolving,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const caseData = propsCaseData || location.state?.caseData;

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'destructive';
      case 'resolved':
        return 'default';
      case 'pending':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  if (!caseData) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <p className="text-lg text-gray-700 mb-4">Case not found or loading...</p>
        <Button variant="outline" onClick={() => navigate('/agent/active')} className="mb-2">
          Back to Active Cases
        </Button>
        <p className="text-sm text-gray-500">
          The case data might not have been passed correctly from the previous page.
        </p>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-2 md:p-2  mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 mb-6">
          <div className="flex flex-col">
            <CardTitle className="text-2xl font-bold">Case Details</CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Details for Case ID: <span className="font-semibold">{caseData._id}</span>
            </CardDescription>
          </div>
          <Badge variant={getStatusVariant(caseData.status)} className="text-base px-3 py-1">
            {caseData.status.charAt(0).toUpperCase() + caseData.status.slice(1)}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Customer Information */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <FiUser className="mr-2 h-5 w-5 text-gray-600" /> Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex space-x-2">
                <h3 className="font-semibold text-gray-900">Full Name:</h3>
                <p className="text-gray-500">
                  {caseData.customer?.fullname || caseData.customerName}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <FiMail className="mr-1.5" />{' '}
                <span className="font-semibold text-gray-900">Email:</span>
                <p className="text-gray-500">{caseData.customer?.email || 'N/A'}</p>
              </div>
              <div className="flex items-center">
                <FiPhone className="mr-1.5" />{' '}
                <span className="font-semibold text-gray-900">Phone:</span>
                <p className="text-gray-500">{caseData.customer?.phone || 'N/A'}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Case Specific Details */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Case Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex space-x-2">
                <h3 className="font-semibold text-gray-900">Issue:</h3>
                <p className="text-gray-500">{caseData.issue}</p>
              </div>
              <div className="flex space-x-2">
                <h3 className="font-semibold text-gray-900">Department:</h3>
                <p className="text-gray-500">{caseData.department}</p>
              </div>
              <div className="flex items-center">
                <FiMapPin className="mr-1.5" />
                <span className="font-semibold text-gray-900">Location:</span>
                <p className="text-gray-500">{caseData.location}</p>
              </div>
              <div className="flex items-center">
                <FiCalendar className="mr-1.5" />
                <span className="font-semibold text-gray-900">Created At:</span>
                <p className="text-gray-500">{formatDate(caseData.createdAt)}</p>
              </div>
              <div className="flex items-center">
                <FiClock className="mr-1.5" />{' '}
                <span className="font-semibold text-gray-900">Last Updated:</span>
                <p className="text-gray-500">{formatDate(caseData.updatedAt)}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Assigned Agent Information */}
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <FaUserTie className="mr-2 h-5 w-5 text-gray-600" /> Assigned Agent
            </h3>
            {caseData.assignedAgent ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex space-x-2">
                  <span className="font-semibold text-gray-900">Full Name:</span>
                  <p className="text-gray-500">{caseData.assignedAgent.fullname}</p>
                </div>
                <div className="flex space-x-2">
                  <span className="font-semibold text-gray-900">Department:</span>
                  <p className="text-gray-500">{caseData.assignedAgent.department}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No agent currently assigned.</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between mt-6">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Go Back
          </Button>
          {caseData.status.toLowerCase() !== 'resolved' && onResolveCase && (
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => onResolveCase(caseData._id)}
              disabled={isResolving}>
              {isResolving ? 'Resolving...' : 'Mark as Resolved'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default AgentCaseDetails;
