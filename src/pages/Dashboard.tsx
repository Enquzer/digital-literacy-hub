﻿import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Award, 
  Target, 
  Clock, 
  User, 
  LogOut, 
  Menu,
  ChevronDown,
  GraduationCap,
  CheckCircle,
  TrendingUp
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import LearningSidebar from "@/components/LearningSidebar";
import { getUserProgressStats } from "@/lib/learning-tracker";
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Scatter
} from "recharts";

interface User {
  id: string;
  email: string;
  full_name: string;
  roles: string[];
}

interface ProgressStats {
  coursesEnrolled: number;
  coursesCompleted: number;
  certificatesEarned: number;
  totalProgress: number;
  hoursLearned: number;
}

interface CourseProgress {
  id: string;
  module_id: string;
  module_title: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress_percentage: number;
  time_spent_seconds: number;
  last_accessed: string;
  completed_at: string | null;
  quiz_score: number | null;
}

interface Certificate {
  id: string;
  module_id: string;
  course_name: string;
  issued_at: string;
  expires_at: string | null;
}

const API_BASE_URL = 'http://localhost:3001';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [courses, setCourses] = useState<CourseProgress[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
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
      try {
        const currentUser = await getCurrentUser();
        
        if (!currentUser) {
          navigate("/auth");
          return;
        }
        
        // Check if user is admin and redirect to admin dashboard
        const isAdmin = currentUser.roles && currentUser.roles.some((role: string) => 
          role.includes('admin') || role.includes('super_admin')
        );
        
        if (isAdmin) {
          navigate("/admin/dashboard");
          return;
        }
        
        setUser(currentUser);
        
        // Fetch user stats
        try {
          const userStats = await getUserProgressStats(currentUser.id);
          setStats(userStats);
        } catch (error) {
          console.error("Error fetching user stats:", error);
        }
        
        // Fetch user courses and progress
        try {
          const progressResponse = await axios.get(`${API_BASE_URL}/api/progress/${currentUser.id}`);
          setCourses(progressResponse.data as CourseProgress[] || []);
        } catch (error) {
          console.error("Error fetching user courses:", error);
        }
        
        // Fetch user certificates
        try {
          const certResponse = await axios.get(`${API_BASE_URL}/api/certificates/${currentUser.id}`);
          setCertificates(certResponse.data as Certificate[] || []);
        } catch (error) {
          console.error("Error fetching user certificates:", error);
        }
      } catch (error) {
        console.error("Error initializing user:", error);
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };

    initUser();
  }, [navigate]);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/auth");
  };

  // Format time spent in hours
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="h-12 w-12 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate courses in progress
  const coursesInProgress = courses.filter(course => course.status === 'in_progress').length;
  
  // Prepare data for progress chart (simplified for this example)
  const progressData = courses.map(course => ({
    date: course.last_accessed ? new Date(course.last_accessed).toLocaleDateString() : 'N/A',
    progress: course.progress_percentage,
    courseName: course.module_title,
    completed: course.status === 'completed'
  }));

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
        activeSection="dashboard"
        locked={sidebarLocked}
        onLockChange={handleSidebarLockChange}
      />
      
      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        <header className="border-b">
          <div className="flex h-16 items-center px-4 lg:px-6">
            <div className="ml-auto flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden md:inline">{user?.full_name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        
        <main className="p-4 lg:p-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>
            
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Courses Enrolled</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{courses.length || 0}</div>
                  <p className="text-xs text-muted-foreground">Total enrolled courses</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{coursesInProgress || 0}</div>
                  <p className="text-xs text-muted-foreground">Courses in progress</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Courses Completed</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.coursesCompleted || 0}</div>
                  <p className="text-xs text-muted-foreground">Total completed</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Certificates</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{certificates.length || 0}</div>
                  <p className="text-xs text-muted-foreground">Earned certificates</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Hours Learned</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {courses.reduce((total, course) => total + Math.floor((course.time_spent_seconds || 0) / 3600), 0) || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Total learning time</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Courses Progress Table */}
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>My Courses</CardTitle>
                  <CardDescription>
                    Track your progress across all enrolled courses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {courses.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Course</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Progress</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {courses.map((course) => (
                          <TableRow key={course.module_id}>
                            <TableCell className="font-medium">{course.module_title}</TableCell>
                            <TableCell>
                              <Badge 
                                variant="secondary" 
                                className={
                                  course.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  course.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                                }
                              >
                                {course.status === 'completed' ? 'Completed' : 
                                 course.status === 'in_progress' ? 'In Progress' : 'Not Started'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {course.status === 'not_started' ? (
                                <span className="text-muted-foreground">Not started</span>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <Progress value={course.progress_percentage} className="w-24" />
                                  <span className="text-sm text-muted-foreground">
                                    {course.progress_percentage}%
                                  </span>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>You haven't enrolled in any courses yet.</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => navigate('/courses')}
                      >
                        Browse Courses
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Progress Visualization */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Learning Progress</CardTitle>
                  <CardDescription>
                    Your course progress over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {courses.length > 0 ? (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={progressData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="date" 
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => {
                              // Format date to show only month/day
                              const date = new Date(value);
                              return isNaN(date.getTime()) ? value : `${date.getMonth() + 1}/${date.getDate()}`;
                            }}
                          />
                          <YAxis 
                            domain={[0, 100]} 
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => `${value}%`}
                          />
                          <Tooltip 
                            formatter={(value) => [`${value}%`, 'Progress']}
                            labelFormatter={(label) => `Date: ${label}`}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="progress" 
                            name="Progress %" 
                            stroke="#8884d8" 
                            activeDot={{ r: 8 }} 
                            strokeWidth={2}
                          />
                          {/* Stars for completed courses */}
                          <Scatter 
                            data={progressData.filter(d => d.completed)} 
                            fill="#ffc107" 
                            name="Completed"
                          >
                            {progressData.filter(d => d.completed).map((entry, index) => (
                              <text 
                                key={`star-${index}`}
                                x={entry.date}
                                y={entry.progress}
                                dy={-15}
                                dx={-8}
                                fill="#ffc107"
                                fontSize={16}
                                textAnchor="middle"
                              >
                                ★
                              </text>
                            ))}
                          </Scatter>
                        </LineChart>
                      </ResponsiveContainer>
                      <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded-full bg-[#8884d8]"></div>
                          <span>Progress %</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span>Certificate earned</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Your progress will appear here once you start learning.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Welcome Section */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Welcome back, {user?.full_name}!</CardTitle>
                  <CardDescription>
                    Continue your learning journey with our latest courses.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="grid flex-1 gap-1">
                      <p className="text-sm text-muted-foreground">
                        You're making great progress! Keep up the good work.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Jump to different sections of the platform.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/courses')}>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Browse Courses
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/certificates')}>
                      <Award className="h-4 w-4 mr-2" />
                      View Certificates
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/profile')}>
                      <User className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* User Roles */}
            {user?.roles && user.roles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Roles</CardTitle>
                  <CardDescription>
                    Access levels and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.roles.map((role) => (
                      <Badge key={role} variant="secondary">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Account Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences and security
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Two-factor Authentication</h3>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => toast.info('Two-factor authentication setup would be implemented in a full version')}>Enable</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-muted-foreground">Receive email updates about your learning progress</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => toast.info('Email notification preferences would be managed in a full version')}>Manage</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Privacy Settings</h3>
                      <p className="text-sm text-muted-foreground">Control who can see your profile information</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => navigate('/profile')}>Manage</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;