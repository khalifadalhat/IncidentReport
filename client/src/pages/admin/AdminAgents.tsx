import React, { useEffect, useState } from 'react';
import { IAgent } from '../../Types/Icase';
import api from '../../utils/api';
import { Plus, RotateCcw, Trash2, AlertCircle, CheckCircle } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AdminAgents: React.FC = () => {
  const [agents, setAgents] = useState<IAgent[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newAgent, setNewAgent] = useState({
    fullname: '',
    email: '',
    department: 'Funding Wallet',
    role: 'agent',
  });

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await api.get('/agents');
      setAgents(response.data.agents);
    } catch (error) {
      console.error('There was an error fetching the agents!', error);
      showMessage('Error fetching agents', 'error');
    }
  };

  const showMessage = (msg: string, type: 'success' | 'error') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const handleCreateAgent = async () => {
    // Basic validation
    if (!newAgent.fullname || !newAgent.email) {
      showMessage('Please fill in all required fields', 'error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newAgent.email)) {
      showMessage('Please enter a valid email address', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/agents', newAgent);
      setAgents([...agents, response.data.agent]);
      setNewAgent({
        fullname: '',
        email: '',
        department: 'Funding Wallet',
        role: 'agent',
      });
      setDialogOpen(false);
      showMessage(
        `Agent created successfully! Credentials have been sent to ${newAgent.email}`,
        'success'
      );
    } catch (error: any) {
      console.error('There was an error creating the agent!', error);
      const errorMessage = error.response?.data?.error || 'Error creating agent';
      showMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAgent = async (id: string) => {
    try {
      await api.delete(`/agents/${id}`);
      setAgents(agents.filter(agent => agent._id !== id));
      showMessage('Agent deleted successfully', 'success');
    } catch (error) {
      console.error('There was an error deleting the agent!', error);
      showMessage('Error deleting agent', 'error');
    }
  };

  const handleResetPassword = async (id: string, email: string) => {
    try {
      await api.post(`/agents/${id}/reset-password`);
      showMessage('Password reset successfully and sent via email', 'success');
    } catch (error) {
      console.error('There was an error resetting password!', error);
      showMessage('Error resetting password', 'error');
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">
          Active
        </Badge>
      );
    }
    return <Badge variant="destructive">Inactive</Badge>;
  };

  const getRoleBadge = (role: string) => {
    if (role === 'supervisor') {
      return (
        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
          Supervisor
        </Badge>
      );
    }
    return <Badge variant="outline">Agent</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Manage Agents</h2>
            <p className="text-gray-600 mt-1">Create and manage support agents</p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Agent
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Agent</DialogTitle>
                <DialogDescription>
                  Add a new agent to your support team. A secure password will be generated and sent
                  to their email.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="fullname">Full Name *</Label>
                  <Input
                    id="fullname"
                    placeholder="Enter full name"
                    value={newAgent.fullname}
                    onChange={e => setNewAgent({ ...newAgent, fullname: e.target.value })}
                    disabled={loading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={newAgent.email}
                    onChange={e => setNewAgent({ ...newAgent, email: e.target.value })}
                    disabled={loading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={newAgent.department}
                    onValueChange={value => setNewAgent({ ...newAgent, department: value })}
                    disabled={loading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Funding Wallet">Funding Wallet</SelectItem>
                      <SelectItem value="Buying Airtime">Buying Airtime</SelectItem>
                      <SelectItem value="Buying Internet Data">Buying Internet Data</SelectItem>
                      <SelectItem value="E-commerce Section">E-commerce Section</SelectItem>
                      <SelectItem value="Fraud Related Problems">Fraud Related Problems</SelectItem>
                      <SelectItem value="General Services">General Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={newAgent.role}
                    onValueChange={value => setNewAgent({ ...newAgent, role: value })}
                    disabled={loading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agent">Agent</SelectItem>
                      <SelectItem value="supervisor">Supervisor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={loading}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateAgent}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700">
                  {loading ? 'Creating...' : 'Create Agent'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Message Display */}
        {message && (
          <Alert
            className={
              messageType === 'success'
                ? 'border-green-200 bg-green-50'
                : 'border-red-200 bg-red-50'
            }>
            {messageType === 'success' ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription
              className={messageType === 'success' ? 'text-green-800' : 'text-red-800'}>
              {message}
            </AlertDescription>
          </Alert>
        )}

        {/* Agents Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Agents</CardTitle>
            <CardDescription>
              Manage your support team members and their permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No agents found. Create your first agent above.
                      </TableCell>
                    </TableRow>
                  ) : (
                    agents.map(agent => (
                      <TableRow key={agent._id}>
                        <TableCell className="font-medium">{agent.fullname}</TableCell>
                        <TableCell className="text-gray-600">{agent.email}</TableCell>
                        <TableCell className="text-gray-600">{agent.department}</TableCell>
                        <TableCell>{getRoleBadge(agent.role)}</TableCell>
                        <TableCell>{getStatusBadge(agent.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <RotateCcw className="h-4 w-4 mr-1" />
                                  Reset
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Reset Password</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to reset the password for{' '}
                                    <strong>{agent.email}</strong>? A new password will be generated
                                    and sent to their email.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleResetPassword(agent._id, agent.email)}
                                    className="bg-yellow-600 hover:bg-yellow-700">
                                    Reset Password
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700">
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Agent</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete{' '}
                                    <strong>{agent.fullname}</strong>? This action cannot be undone
                                    and will remove all associated data.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteAgent(agent._id)}
                                    className="bg-red-600 hover:bg-red-700">
                                    Delete Agent
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAgents;
