import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Search,
  RefreshCw,
  Menu,
  User,
  LogOut,
  ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import LearningSidebar from "@/components/LearningSidebar";
import { getCurrentUser, signOut } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SearchMonitoring = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading search monitoring...</p>
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
      
      <LearningSidebar 
        activeSection="admin"
        locked={sidebarLocked}
        onLockChange={handleSidebarLockChange}
      />
      <main className="flex-1 lg:ml-64">
        <header className="border-b bg-card shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                <Search className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Ethiopian SME LMS</h1>
                <p className="text-xs text-muted-foreground">Search Monitoring</p>
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
                      <DropdownMenuItem onClick={async () => {
                        await signOut();
                        navigate("/auth");
                      }}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Search & Embeddings Monitoring</h1>
              <p className="text-muted-foreground">Monitor vector database and semantic search performance</p>
            </div>
            <Button>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Search Monitoring</CardTitle>
              <CardDescription>System monitoring dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Search monitoring content would go here.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SearchMonitoring;