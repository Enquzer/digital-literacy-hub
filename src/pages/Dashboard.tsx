import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser, signOut, AuthUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  LogOut, 
  BookOpen, 
  Award, 
  TrendingUp,
  Users,
  Settings,
  FileText,
  Calendar
} from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    coursesEnrolled: 0,
    coursesCompleted: 0,
    certificatesEarned: 0,
    totalProgress: 0
  });

  useEffect(() => {
    const initUser = async () => {
      const currentUser = await getCurrentUser();
      
      if (!currentUser) {
        navigate("/auth");
        return;
      }
      
      setUser(currentUser);
      
      // Fetch user stats
      const { data: progress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', currentUser.id);
      
      const { data: certificates } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', currentUser.id);
      
      const completed = progress?.filter(p => p.completed).length || 0;
      const avgProgress = progress?.reduce((acc, p) => acc + (p.progress_percentage || 0), 0) / (progress?.length || 1) || 0;
      
      setStats({
        coursesEnrolled: progress?.length || 0,
        coursesCompleted: completed,
        certificatesEarned: certificates?.length || 0,
        totalProgress: Math.round(avgProgress)
      });
      
      setLoading(false);
    };

    initUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
  };

  const isAdmin = user?.roles?.includes('admin') || user?.roles?.includes('super_admin');
  const isTrainer = user?.roles?.includes('trainer');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="h-12 w-12 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Ethiopian SME LMS</h1>
              <p className="text-xs text-muted-foreground">Digital Training Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user?.full_name}</p>
              <div className="flex gap-1 justify-end">
                {user?.roles?.map(role => (
                  <Badge key={role} variant="secondary" className="text-xs">
                    {role.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.full_name.split(' ')[0]}! 👋</h2>
          <p className="text-muted-foreground">
            Continue your journey to master Ethiopia's digital tax and customs platforms
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Courses Enrolled</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                {stats.coursesEnrolled}
                <BookOpen className="h-5 w-5 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Active learning paths</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Courses Completed</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                {stats.coursesCompleted}
                <Award className="h-5 w-5 text-success" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Successfully finished</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Overall Progress</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                {stats.totalProgress}%
                <TrendingUp className="h-5 w-5 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={stats.totalProgress} className="h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Certificates Earned</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                {stats.certificatesEarned}
                <Award className="h-5 w-5 text-achievement" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Achievements unlocked</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/courses")}>
            <CardHeader>
              <BookOpen className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Browse Courses</CardTitle>
              <CardDescription>
                Explore e-Tax and Customs training modules
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/certificates")}>
            <CardHeader>
              <Award className="h-8 w-8 text-achievement mb-2" />
              <CardTitle>My Certificates</CardTitle>
              <CardDescription>
                View and download your earned certificates
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/sessions")}>
            <CardHeader>
              <Calendar className="h-8 w-8 text-success mb-2" />
              <CardTitle>Training Sessions</CardTitle>
              <CardDescription>
                Register for live training events
              </CardDescription>
            </CardHeader>
          </Card>

          {(isAdmin || isTrainer) && (
            <>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/admin")}>
                <CardHeader>
                  <Settings className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Admin Panel</CardTitle>
                  <CardDescription>
                    Manage courses, users, and content
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/reports")}>
                <CardHeader>
                  <FileText className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Reports & Analytics</CardTitle>
                  <CardDescription>
                    View training metrics and insights
                  </CardDescription>
                </CardHeader>
              </Card>
            </>
          )}

          {(isAdmin || user?.roles?.includes('support')) && (
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/support")}>
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Support Center</CardTitle>
                <CardDescription>
                  Help users and manage tickets
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
