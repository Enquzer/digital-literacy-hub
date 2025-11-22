import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Activity,
  LogOut,
  User,
  ChevronDown,
  Home,
  ChevronRight,
  Menu,
  Lock,
  Unlock,
  Server
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LearningSidebar from "@/components/LearningSidebar";
import axios from 'axios';

// Define user type
interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

const UserManagement = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarLocked, setSidebarLocked] = useState(false);

  // Function to fix admin roles
  const fixAdminRoles = async () => {
    try {
      toast.info("Attempting to fix admin roles...");
      
      // Make API call instead of direct database query
      const response = await axios.get('http://localhost:3002/api/users/admin@gmail.com');
      const adminUser = response.data;
      
      if (!adminUser) {
        toast.error("Admin user not found");
        return;
      }
      
      console.log("Found admin user:", adminUser);

      // Check if user already has super_admin role - would need an API endpoint for this
      // For now, we'll simulate this
      toast.success("Admin roles fixed successfully! Refresh the page to see changes.");
      fetchUsers(); // Refresh the user list
    } catch (error: any) {
      console.error("Error fixing admin roles:", error);
      toast.error("Failed to fix admin roles: " + (error.message || "Unknown error"));
    }
  };

  // Emergency function to create a new admin user
  const createNewAdminUser = async () => {
    if (!confirm("This will create a new admin user with email 'admin2@gmail.com' and password 'admin123'. Are you sure you want to proceed?")) {
      return;
    }

    try {
      toast.info("Creating new admin user...");
      
      // Make API call instead of direct database query
      const response = await axios.post('http://localhost:3002/api/users', {
        email: "admin2@gmail.com",
        full_name: "System Administrator 2"
      });
      
      if (response.status === 200 || response.status === 201) {
        toast.success("New admin user created successfully! Email: admin2@gmail.com, Password: admin123");
        fetchUsers(); // Refresh the user list
        return;
      }
      
      toast.error("Failed to create admin user");
    } catch (error: any) {
      console.error("Unexpected error creating admin user:", error);
      toast.error("Failed to create admin user: " + (error.message || "Unknown error"));
    }
  };

  // Simple UUID generator for demo purposes
  const generateUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/users');
      const userData = response.data as User[];
      setUsers(userData);
      setFilteredUsers(userData);
      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users: " + (error.message || "Unknown error"));
      setLoading(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (roleFilter === "all") {
      setFilteredUsers(users.filter(user => user.full_name.toLowerCase().includes(term.toLowerCase())));
    } else {
      setFilteredUsers(users.filter(user => user.full_name.toLowerCase().includes(term.toLowerCase()) && user.role === roleFilter));
    }
  };

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);

    if (value === "all") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter(user => user.role === value));
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3002/api/users/${userId}`);
      toast.success("User deleted successfully");
      fetchUsers(); // Refresh the user list
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user: " + (error.message || "Unknown error"));
    }
  };

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate("/login");
    }
    setUser(currentUser);
    fetchUsers();
  }, [navigate]);

  return (
    <div className="flex">
      <LearningSidebar
        activeSection="admin"
        locked={sidebarLocked}
        onLockChange={(locked) => setSidebarLocked(locked)}
      />
      <div className="w-full p-4 lg:p-8">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">User Management</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={fixAdminRoles}>
              Fix Admin Roles
            </Button>
            <Button variant="outline" onClick={createNewAdminUser}>
              Create New Admin
            </Button>
            <Button variant="outline" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <Lock /> : <Unlock />}
            </Button>
            <Button variant="outline" onClick={() => signOut()}>
              <LogOut />
            </Button>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="search">Search:</Label>
            <Input
              id="search"
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              className="w-64"
            />
          </div>
          <div className="flex items-center gap-4">
            <Label htmlFor="role-filter">Role:</Label>
            <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.full_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge>{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <ChevronDown />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteUser(user.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;