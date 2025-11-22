import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlertCircle, 
  Search, 
  User, 
  Clock, 
  CheckCircle,
  XCircle,
  MessageSquare,
  Calendar,
  Home,
  ChevronRight,
  Menu,
  LogOut,
  ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import LearningSidebar from "@/components/LearningSidebar";
import { getCurrentUser, signOut } from "@/lib/auth";
import { mysqlPool } from "@/config/database";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SupportTicket {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  assigned_to: string | null;
  assigned_to_name: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

const SupportManagement = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [admins, setAdmins] = useState<{id: string, full_name: string}[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const initUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    
    initUser();
    fetchTickets();
    fetchAdmins();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [tickets, searchTerm, statusFilter, priorityFilter]);

  const fetchAdmins = async () => {
    try {
      // Fetch users with admin or support roles
      const [adminUsersResult] = await mysqlPool.execute(`
        SELECT DISTINCT p.id, p.full_name
        FROM profiles p
        JOIN user_roles ur ON p.id = ur.user_id
        WHERE ur.role IN ('admin', 'super_admin', 'support')
      `);
      
      const adminUsers = adminUsersResult as any[];
      setAdmins(adminUsers || []);
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast.error("Failed to load admin users");
    }
  };

  const fetchTickets = async () => {
    try {
      setLoading(true);
      
      // Fetch support tickets with user information
      const [ticketsResult] = await mysqlPool.execute(`
        SELECT st.*, 
               p.full_name as user_name, 
               p.email as user_email,
               ap.full_name as assigned_to_name
        FROM support_tickets st
        LEFT JOIN profiles p ON st.user_id = p.id
        LEFT JOIN profiles ap ON st.assigned_to = ap.id
        ORDER BY st.created_at DESC
      `);
      
      const ticketsData = ticketsResult as any[];
      
      // Transform data to match our interface
      const transformedTickets = ticketsData?.map(ticket => ({
        id: ticket.id,
        user_id: ticket.user_id || '',
        user_name: ticket.user_name || 'Unknown User',
        user_email: ticket.user_email || 'unknown@example.com',
        subject: ticket.subject,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        assigned_to: ticket.assigned_to,
        assigned_to_name: ticket.assigned_to_name || null,
        created_at: ticket.created_at,
        updated_at: ticket.updated_at,
        resolved_at: ticket.resolved_at
      })) || [];
      
      setTickets(transformedTickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error("Failed to load support tickets");
    } finally {
      setLoading(false);
    }
  };

  const filterTickets = () => {
    let filtered = tickets;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(ticket => 
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.user_email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }
    
    // Apply priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }
    
    setFilteredTickets(filtered);
  };

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    try {
      const updateData: any = { status: newStatus };
      
      // If closing ticket, set resolved_at
      if (newStatus === 'closed') {
        updateData.resolved_at = new Date().toISOString();
      }
      
      await mysqlPool.execute(
        'UPDATE support_tickets SET status = ?, resolved_at = ? WHERE id = ?',
        [newStatus, updateData.resolved_at, ticketId]
      );
      
      toast.success(`Ticket ${newStatus} successfully`);
      fetchTickets(); // Refresh the list
    } catch (error) {
      console.error('Error updating ticket status:', error);
      toast.error("Failed to update ticket status");
    }
  };

  const handleAssignTicket = async (ticketId: string, adminId: string) => {
    try {
      await mysqlPool.execute(
        'UPDATE support_tickets SET assigned_to = ? WHERE id = ?',
        [adminId, ticketId]
      );
      
      toast.success("Ticket assigned successfully");
      fetchTickets(); // Refresh the list
    } catch (error) {
      console.error('Error assigning ticket:', error);
      toast.error("Failed to assign ticket");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/auth");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open': return <Badge variant="destructive">Open</Badge>;
      case 'in_progress': return <Badge variant="default">In Progress</Badge>;
      case 'closed': return <Badge variant="secondary">Closed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive">High</Badge>;
      case 'medium': return <Badge variant="default">Medium</Badge>;
      case 'low': return <Badge variant="secondary">Low</Badge>;
      default: return <Badge variant="outline">{priority}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading support tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu className="h-6 w-6" />
      </Button>
      
      {/* Sidebar */}
      <LearningSidebar 
        activeSection="support" 
        onSectionChange={() => setSidebarOpen(false)}
        locked={false}
        onLockChange={() => {}}
      />
      
      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="border-b bg-card shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Ethiopian SME LMS</h1>
                <p className="text-xs text-muted-foreground">Support Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{user?.full_name}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate("/profile")}>
                        <User className="h-4 w-4 mr-2" />
                        My Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex gap-1">
                  {user?.roles?.map(role => (
                    <Badge key={role} variant="secondary" className="text-xs">
                      {role.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Support Management</h1>
              <p className="text-muted-foreground">Manage support tickets and user inquiries</p>
            </div>
            <Button onClick={fetchTickets}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Refresh Tickets
            </Button>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filter Tickets</CardTitle>
              <CardDescription>Search and filter support tickets by various criteria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tickets..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setPriorityFilter("all");
                }}>
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tickets Table */}
          <Card>
            <CardHeader>
              <CardTitle>Support Tickets</CardTitle>
              <CardDescription>Manage all support tickets in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell>
                          <div className="font-medium">{ticket.subject}</div>
                          <div className="text-sm text-muted-foreground">
                            {ticket.description.substring(0, 50)}...
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{ticket.user_name}</div>
                          <div className="text-sm text-muted-foreground">{ticket.user_email}</div>
                        </TableCell>
                        <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                        <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                        <TableCell>
                          {ticket.assigned_to_name || (
                            <span className="text-muted-foreground">Unassigned</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(ticket.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Select onValueChange={(value) => handleStatusChange(ticket.id, value)}>
                              <SelectTrigger className="w-28">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="closed">Close</SelectItem>
                              </SelectContent>
                            </Select>
                            <Select onValueChange={(value) => handleAssignTicket(ticket.id, value)}>
                              <SelectTrigger className="w-28">
                                <SelectValue placeholder="Assign" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">Unassign</SelectItem>
                                {admins.map(admin => (
                                  <SelectItem key={admin.id} value={admin.id}>
                                    {admin.full_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {filteredTickets.length === 0 && (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No tickets found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SupportManagement;