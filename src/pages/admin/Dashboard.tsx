import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  BookOpen, 
  Award, 
  Calendar, 
  User, 
  LogOut, 
  Menu, 
  ChevronDown,
  Activity
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import LearningSidebar from "@/components/LearningSidebar";
import { getCurrentUser, signOut } from "@/lib/auth";
import { toast } from "sonner";
import { getAdminStats } from "@/integrations/mysql/api-client";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalCertificates: 0,
    activeSessions: 0
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarLocked, setSidebarLocked] = useState(false);

  useEffect(() => {
    // Load sidebar locked state from localStorage
    const savedLockedState = localStorage.getItem('sidebarLocked');
    if (savedLockedState === 'true') {
      setSidebarLocked(true);
    }
  }, []);

  const handleSidebarLockChange = (locked: boolean) => {
    setSidebarLocked(locked);
    // Save to localStorage
    localStorage.setItem('sidebarLocked', locked.toString());
  };

  useEffect(() => {
    const initUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };
    
    initUser();
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch admin stats using API
      const statsData = await getAdminStats();
      
      setStats({
        totalUsers: statsData.totalUsers || 0,
        totalCourses: statsData.totalCourses || 0,
        totalCertificates: statsData.totalCertificates || 0,
        activeSessions: statsData.activeSessions || 0
      });

      // For recent activities, we'll create some mock data since there's no activities table
      setRecentActivities([
        { id: 1, action: 'User registered', user: 'John Doe', time: '2 hours ago' },
        { id: 2, action: 'Course completed', user: 'Jane Smith', time: '4 hours ago' },
        { id: 3, action: 'Certificate issued', user: 'Mike Johnson', time: '1 day ago' },
        { id: 4, action: 'New course added', user: 'Admin', time: '2 days ago' },
        { id: 5, action: 'Session scheduled', user: 'Admin', time: '3 days ago' }
      ]);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
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
        activeSection="admin" 
        onSectionChange={() => setSidebarOpen(false)}
        locked={sidebarLocked}
        onLockChange={handleSidebarLockChange}
      />
      
      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarLocked ? 'lg:ml-64' : ''}`}>
        {/* Header */}
        <header className="border-b bg-card shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                <Users className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Ethiopian SME LMS</h1>
                <p className="text-xs text-muted-foreground">Admin Dashboard</p>
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
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">System overview and analytics</p>
            </div>
            <Button onClick={() => navigate("/admin/settings")}>
              System Settings
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Users</CardDescription>
                <CardTitle className="text-3xl flex items-center gap-2">
                  {stats.totalUsers}
                  <Users className="h-5 w-5 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">All registered users</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Courses</CardDescription>
                <CardTitle className="text-3xl flex items-center gap-2">
                  {stats.totalCourses}
                  <BookOpen className="h-5 w-5 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Available courses</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Certificates</CardDescription>
                <CardTitle className="text-3xl flex items-center gap-2">
                  {stats.totalCertificates}
                  <Award className="h-5 w-5 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Certificates issued</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Active Sessions</CardDescription>
                <CardTitle className="text-3xl flex items-center gap-2">
                  {stats.activeSessions}
                  <Calendar className="h-5 w-5 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Upcoming sessions</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activities
              </CardTitle>
              <CardDescription>Latest system activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.user}</p>
                    </div>
                    <Badge variant="outline">{activity.time}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;