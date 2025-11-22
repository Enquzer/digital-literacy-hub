import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Award, 
  Calendar,
  Menu,
  X,
  Home,
  User,
  LogOut,
  Settings,
  FileText,
  Users,
  BarChart3,
  HelpCircle,
  Lock,
  Unlock
} from "lucide-react";
import { getCurrentUser, signOut } from "@/lib/auth";
import { toast } from "sonner";

interface LearningSidebarProps {
  activeSection: 'courses' | 'certificates' | 'sessions' | 'dashboard' | 'admin' | 'reports' | 'support';
  onSectionChange?: (section: 'courses' | 'certificates' | 'sessions' | 'dashboard' | 'admin' | 'reports' | 'support') => void;
  locked?: boolean;
  onLockChange?: (locked: boolean) => void;
}

const LearningSidebar = ({ activeSection, onSectionChange, locked = false, onLockChange }: LearningSidebarProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      
      // Check if user is admin
      const isAdminUser = currentUser?.roles?.includes('admin') || 
                          currentUser?.roles?.includes('super_admin') || 
                          currentUser?.email === 'admin@gmail.com';
      setIsAdmin(isAdminUser);
    };
    
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  const traineeMenuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      onClick: () => {
        navigate("/dashboard");
        onSectionChange?.('dashboard');
      }
    },
    {
      id: 'courses',
      label: 'Browse Courses',
      icon: BookOpen,
      onClick: () => {
        navigate("/courses");
        onSectionChange?.('courses');
      }
    },
    {
      id: 'certificates',
      label: 'My Certificates',
      icon: Award,
      onClick: () => {
        navigate("/certificates");
        onSectionChange?.('certificates');
      }
    },
    {
      id: 'sessions',
      label: 'Training Sessions',
      icon: Calendar,
      onClick: () => {
        navigate("/sessions");
        onSectionChange?.('sessions');
      }
    }
  ];

  const adminMenuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      onClick: () => {
        navigate("/admin/dashboard");
        onSectionChange?.('dashboard');
      }
    },
    {
      id: 'courses',
      label: 'Browse Courses',
      icon: BookOpen,
      onClick: () => {
        navigate("/courses");
        onSectionChange?.('courses');
      }
    },
    {
      id: 'certificates',
      label: 'My Certificates',
      icon: Award,
      onClick: () => {
        navigate("/certificates");
        onSectionChange?.('certificates');
      }
    },
    {
      id: 'sessions',
      label: 'Training Sessions',
      icon: Calendar,
      onClick: () => {
        navigate("/sessions");
        onSectionChange?.('sessions');
      }
    },
    {
      id: 'admin',
      label: 'Admin Panel',
      icon: Settings,
      onClick: () => {
        navigate("/admin");
        onSectionChange?.('admin');
      }
    },
    {
      id: 'quizzes',
      label: 'Quiz Management',
      icon: HelpCircle,
      onClick: () => {
        navigate("/admin/quizzes");
        onSectionChange?.('admin');
      }
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      icon: BarChart3,
      onClick: () => {
        navigate("/admin/analytics");
        onSectionChange?.('reports');
      }
    },
    {
      id: 'support',
      label: 'Support Center',
      icon: HelpCircle,
      onClick: () => {
        navigate("/admin/support");
        onSectionChange?.('support');
      }
    }
  ];

  const menuItems = isAdmin ? adminMenuItems : traineeMenuItems;

  return (
    <>
      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-card border-r shadow-lg transform transition-transform duration-300 ease-in-out
        ${locked ? 'lg:translate-x-0' : ''}
        ${isOpen || locked ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Learning Hub</h2>
                <p className="text-sm text-muted-foreground">Ethiopian SME LMS</p>
              </div>
              {/* Lock button for desktop */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden lg:flex h-6 w-6"
                onClick={() => onLockChange?.(!locked)}
              >
                {locked ? (
                  <Lock className="h-4 w-4 text-blue-500" />
                ) : (
                  <Unlock className="h-4 w-4" />
                )}
              </Button>

            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <li key={item.id}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className="w-full justify-start gap-3"
                      onClick={item.onClick}
                    >
                      <Icon className="h-5 w-5" />
                      <div className="text-left">
                        <div>{item.label}</div>
                      </div>
                    </Button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User section */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">{user?.full_name || 'User'}</p>
                <p className="text-xs text-muted-foreground">
                  {isAdmin ? 'Administrator' : 'Learning Portal'}
                </p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && !locked && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default LearningSidebar;