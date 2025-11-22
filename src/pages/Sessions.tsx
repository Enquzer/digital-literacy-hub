import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Users, 
  Menu, 
  User, 
  ChevronDown,
  ArrowLeft,
  CheckCircle
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import LearningSidebar from "@/components/LearningSidebar";

import { getUserSessions, registerForSession } from "@/integrations/mysql/api-client";

interface User {
  id: string;
  email: string;
  full_name: string;
  roles: string[];
}

interface TrainingSession {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  session_type: string;
  start_time: string;
  end_time: string;
  location: string | null;
  meeting_url: string | null;
  max_participants: number | null;
  trainer_id: string | null;
  created_at: string;
  course_title?: string;
  trainer_name?: string;
  registered?: boolean;
  attended?: boolean;
}

const Sessions = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
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
        
        setUser(currentUser);
        await fetchSessions(currentUser.id);
      } catch (error) {
        console.error("Error initializing user:", error);
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };

    initUser();
  }, [navigate]);

  const fetchSessions = async (userId: string) => {
    try {
      // Fetch sessions using API
      const sessionsData = await getUserSessions(userId);
      setSessions(sessionsData as TrainingSession[]);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      toast.error("Failed to load training sessions");
    }
  };

  const handleRegister = async (sessionId: string) => {
    try {
      if (!user) return;
      
      // Register for session using API
      await registerForSession(sessionId, user.id);
      
      toast.success("Successfully registered for the session");
      await fetchSessions(user.id);
    } catch (error) {
      console.error("Error registering for session:", error);
      toast.error("Failed to register for session");
    }
  };

  // Simple UUID generator for demo purposes
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Calendar className="h-12 w-12 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading sessions...</p>
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
        activeSection="sessions"
        locked={sidebarLocked}
        onLockChange={handleSidebarLockChange}
      />
      
      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        <header className="border-b">
          <div className="flex h-16 items-center px-4 lg:px-6">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
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
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        
        <main className="p-4 lg:p-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Training Sessions</h2>
            </div>
            
            {sessions.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Upcoming Sessions</h3>
                  <p className="text-muted-foreground mb-4">
                    There are no upcoming training sessions at the moment.
                  </p>
                  <Button onClick={() => navigate('/courses')}>
                    Browse Courses
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sessions.map((session) => {
                  const startTime = new Date(session.start_time);
                  const endTime = new Date(session.end_time);
                  const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60));
                  
                  return (
                    <Card key={session.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-primary" />
                            {session.title}
                          </CardTitle>
                          <Badge variant="secondary">
                            {session.session_type === 'virtual' ? (
                              <Video className="h-3 w-3 mr-1" />
                            ) : (
                              <MapPin className="h-3 w-3 mr-1" />
                            )}
                            {session.session_type}
                          </Badge>
                        </div>
                        <CardDescription>
                          {session.course_title || 'Course Title'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {startTime.toLocaleDateString()} at {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {duration} hour{duration !== 1 ? 's' : ''}
                            </span>
                          </div>
                          
                          {session.trainer_name && (
                            <div className="flex items-center gap-2 text-sm">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {session.trainer_name}
                              </span>
                            </div>
                          )}
                          
                          {session.location && (
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {session.location}
                              </span>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {session.max_participants ? `${session.max_participants} max` : 'Unlimited'}
                              </span>
                            </div>
                            
                            {session.registered && (
                              <Badge variant="default" className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Registered
                              </Badge>
                            )}
                          </div>
                          
                          <Button 
                            className="w-full"
                            disabled={!!session.registered}
                            onClick={() => handleRegister(session.id)}
                          >
                            {session.registered ? "Registered" : "Register"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Sessions;