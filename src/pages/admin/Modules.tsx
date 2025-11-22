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
import { 
  BookOpen, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Activity,
  Home,
  ChevronRight,
  Play,
  FileText,
  Youtube,
  FileQuestion,
  Users,
  Menu,
  LogOut,
  User,
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

interface Module {
  id: string;
  title: string;
  description: string;
  module_type: string;
  course_id: string;
  course_title: string;
  platform: string;
  language: string;
  version: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  order_index: number;
  duration_minutes: number;
  source: 'supabase' | 'llm';
}

interface LLMModule {
  id: string;
  topic: string;
  module: string;
  language: string;
  steps: any[];
  metadata: {
    version: string;
    lastUpdated: string;
  };
}

const ModuleManagement = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [filteredModules, setFilteredModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const initUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    
    initUser();
    fetchModules();
  }, []);

  useEffect(() => {
    filterModules();
  }, [modules, searchTerm, sourceFilter, platformFilter]);

  const fetchModules = async () => {
    try {
      setLoading(true);
      
      // Fetch modules with course information
      const [modulesResult] = await mysqlPool.execute(`
        SELECT m.*, c.title as course_title, c.platform
        FROM modules m
        LEFT JOIN courses c ON m.course_id = c.id
      `);
      
      const modulesData = modulesResult as any[];
      
      // Transform data to match our interface
      const supabaseModules = modulesData?.map(module => ({
        id: module.id,
        title: module.title,
        description: module.description,
        module_type: module.module_type,
        course_id: module.course_id || '',
        course_title: module.course_title || 'Unknown Course',
        platform: module.platform || 'unknown',
        language: 'en', // In a real implementation, this would come from module metadata
        version: 1, // In a real implementation, this would come from version tracking
        is_published: module.is_published,
        created_at: module.created_at,
        updated_at: module.updated_at,
        order_index: module.order_index,
        duration_minutes: module.duration_minutes || 0,
        source: 'supabase' as const
      })) || [];
      
      // Fetch LLM modules
      try {
        const llmResponse = await fetch('http://localhost:3001/admin/modules');
        const llmData: LLMModule[] = await llmResponse.json();
        
        // Transform LLM data to match our interface
        const llmModules = llmData?.map(module => ({
          id: module.id,
          title: module.topic,
          description: `Learn about ${module.topic} in the ${module.module} system`,
          module_type: 'document', // Default type for LLM modules
          course_id: '',
          course_title: module.module,
          platform: module.module.toLowerCase().includes('tax') ? 'e_tax' : 'customs',
          language: module.language,
          version: parseInt(module.metadata.version) || 1,
          is_published: true, // LLM modules are always considered published
          created_at: module.metadata.lastUpdated,
          updated_at: module.metadata.lastUpdated,
          order_index: 0,
          duration_minutes: module.steps.length * 30, // Estimate 30 mins per step
          source: 'llm' as const
        })) || [];
        
        // Combine both sources
        const allModules = [...supabaseModules, ...llmModules];
        setModules(allModules);
      } catch (llmError) {
        console.warn('Failed to fetch LLM modules:', llmError);
        // Use only Supabase modules if LLM fetch fails
        setModules(supabaseModules);
      }
    } catch (error) {
      console.error('Error fetching modules:', error);
      toast.error("Failed to load modules");
    } finally {
      setLoading(false);
    }
  };

  const filterModules = () => {
    let filtered = modules;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(module => 
        module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.course_title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply source filter
    if (sourceFilter !== "all") {
      filtered = filtered.filter(module => module.source === sourceFilter);
    }
    
    // Apply platform filter
    if (platformFilter !== "all") {
      filtered = filtered.filter(module => module.platform === platformFilter);
    }
    
    setFilteredModules(filtered);
  };

  const handleDeleteModule = async (moduleId: string, source: 'supabase' | 'llm') => {
    if (!confirm("Are you sure you want to delete this module? This action cannot be undone.")) {
      return;
    }
    
    try {
      if (source === 'supabase') {
        await mysqlPool.execute(
          'DELETE FROM modules WHERE id = ?',
          [moduleId]
        );
        
        toast.success("Module deleted successfully");
        fetchModules(); // Refresh the list
      } else {
        // For LLM modules, we would need to call the LLM API
        toast.error("Deleting LLM modules is not supported in this interface");
      }
    } catch (error) {
      console.error('Error deleting module:', error);
      toast.error("Failed to delete module");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/auth");
  };

  const getModuleTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Youtube className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      case 'quiz': return <FileQuestion className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getSourceBadge = (source: 'supabase' | 'llm') => {
    return (
      <Badge variant={source === 'supabase' ? 'default' : 'secondary'}>
        {source === 'supabase' ? 'Database' : 'AI Generated'}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading modules...</p>
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
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Ethiopian SME LMS</h1>
                <p className="text-xs text-muted-foreground">Module Management</p>
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
              <h1 className="text-3xl font-bold">Module Management</h1>
              <p className="text-muted-foreground">Manage learning modules and content</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Module
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Module</DialogTitle>
                  <DialogDescription>
                    Create a new learning module for your courses.
                  </DialogDescription>
                </DialogHeader>
                {/* Add module form would go here */}
                <div className="py-4">
                  <p>Module creation form would be implemented here.</p>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filter Modules</CardTitle>
              <CardDescription>Search and filter modules by various criteria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search modules..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="supabase">Database</SelectItem>
                    <SelectItem value="llm">AI Generated</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={platformFilter} onValueChange={setPlatformFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="e_tax">E-Tax</SelectItem>
                    <SelectItem value="customs">Customs</SelectItem>
                    <SelectItem value="e_sw">E-SW</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => {
                  setSearchTerm("");
                  setSourceFilter("all");
                  setPlatformFilter("all");
                }}>
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Modules Table */}
          <Card>
            <CardHeader>
              <CardTitle>Modules</CardTitle>
              <CardDescription>Manage all learning modules in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredModules.map((module) => (
                      <TableRow key={module.id}>
                        <TableCell>
                          <div className="font-medium">{module.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {module.description?.substring(0, 50)}...
                          </div>
                        </TableCell>
                        <TableCell>{module.course_title}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getModuleTypeIcon(module.module_type)}
                            <span className="capitalize">{module.module_type}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{module.platform.replace('_', ' ')}</Badge>
                        </TableCell>
                        <TableCell>{getSourceBadge(module.source)}</TableCell>
                        <TableCell>
                          <Badge variant={module.is_published ? "default" : "secondary"}>
                            {module.is_published ? "Published" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteModule(module.id, module.source)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {filteredModules.length === 0 && (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No modules found</h3>
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

export default ModuleManagement;