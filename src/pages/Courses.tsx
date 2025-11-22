import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GraduationCap, 
  ArrowLeft, 
  Search, 
  BookOpen, 
  Clock, 
  Filter,
  FileText,
  Truck,
  User,
  ChevronDown,
  LogOut,
  Menu,
  CheckCircle,
  Play
} from "lucide-react";
// Add the LLM Engine client
import { fetchLLMCourses, fetchLLMCoursesByPlatform, searchLLMCourses } from "@/integrations/llm-engine/client";
// Add API client
import { getAllCourses, getCoursesByPlatform, searchCourses, getUserProgress } from "@/integrations/mysql/api-client";
import { getCurrentUser, signOut } from "@/lib/auth";
import { updateLearningStreak } from "@/lib/learning-tracker";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import LearningSidebar from "@/components/LearningSidebar";

interface Course {
  id: string;
  title: string;
  description: string;
  platform: string;
  thumbnail_url: string | null;
  duration_hours: number | null;
}

interface UserProgress {
  id: string;
  user_id: string;
  module_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress_percentage: number;
  time_spent_seconds: number;
  last_accessed: string;
  completed_at: string | null;
  quiz_score: number | null;
  module_title: string;
}

const platformIcons = {
  e_tax: FileText,
  customs: Truck,
  e_sw: Truck,
};

const platformLabels = {
  e_tax: "e-Tax Platform",
  customs: "Customs Portal",
  e_sw: "e-SW System",
};

const platformColors = {
  e_tax: "bg-primary/10 text-primary border-primary/20",
  customs: "bg-success/10 text-success border-success/20",
  e_sw: "bg-achievement/10 text-achievement border-achievement/20",
};

const Courses = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all"); // all, recently_opened, newly_added
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarLocked, setSidebarLocked] = useState(false);
  const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>({});

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
        // Check if user is authenticated
        const currentUser = await getCurrentUser();
        
        if (!currentUser) {
          navigate("/auth");
          return;
        }
        
        setUser(currentUser);
        await fetchCourses();
      } catch (error) {
        console.error("Error initializing user:", error);
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };

    initUser();
  }, [navigate]);

  // Refresh progress when component mounts or when user changes
  useEffect(() => {
    if (user?.id && courses.length > 0) {
      fetchUserProgress(courses);
    }
  }, [user, courses]);

  // Refresh progress when window gains focus
  useEffect(() => {
    const handleFocus = () => {
      if (user?.id && courses.length > 0) {
        fetchUserProgress(courses);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [user, courses]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      
      // Update learning streak when user browses courses
      if (user?.id) {
        await updateLearningStreak(user.id);
      }
      
      // Try to fetch from LLM Engine first
      let llmCourses: any[] = [];
      
      if (searchTerm) {
        llmCourses = await searchLLMCourses(searchTerm);
        console.log("LLM Search courses result:", llmCourses);
      } else if (selectedPlatform !== "all") {
        llmCourses = await fetchLLMCoursesByPlatform(selectedPlatform);
        console.log("LLM Platform courses result:", llmCourses);
      } else {
        llmCourses = await fetchLLMCourses();
        console.log("LLM All courses result:", llmCourses);
      }
      
      // If no LLM courses found, fallback to API
      let allCourses = llmCourses;
      if (llmCourses.length === 0) {
        let apiCourses: any[] = [];
        
        if (searchTerm) {
          apiCourses = await searchCourses(searchTerm);
        } else if (selectedPlatform !== "all") {
          apiCourses = await getCoursesByPlatform(selectedPlatform);
        } else {
          apiCourses = await getAllCourses();
        }
        
        allCourses = apiCourses;
        console.log("API courses result:", apiCourses);
      }
      
      console.log("All courses:", allCourses);
      
      // If no courses found, show a message
      if (allCourses.length === 0) {
        console.log("No courses found, checking if this is initial load");
        // Only show error if this isn't initial load with no search/platform filter
        if (!searchTerm && selectedPlatform === "all") {
          toast.info("No courses available at the moment. Please check back later.");
        }
      }
      
      setCourses(allCourses);
      
      // Fetch user progress for all courses
      if (user?.id && allCourses.length > 0) {
        await fetchUserProgress(allCourses);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
      // Show error to user
      toast.error("Failed to load courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async (courses: any[]) => {
    try {
      const progressMap: Record<string, UserProgress> = {};
      
      // Fetch progress for each course
      for (const course of courses) {
        try {
          // Log that we're checking progress for this course
          console.log(`Checking progress for user ${user.id} on course ${course.id}`);
          
          const progress = await getUserProgress(user.id, course.id);
          
          // Log the progress result
          console.log(`Progress for course ${course.id}:`, progress);
          
          if (progress) {
            // The API returns an array, so we need to get the first item
            if (Array.isArray(progress) && progress.length > 0) {
              progressMap[course.id] = progress[0];
            } else if (!Array.isArray(progress)) {
              progressMap[course.id] = progress;
            }
          }
        } catch (err) {
          console.error(`Error fetching progress for course ${course.id}:`, err);
          // Continue with other courses even if one fails
        }
      }
      
      setUserProgress(progressMap);
    } catch (err) {
      console.error("Error fetching user progress:", err);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/auth");
  };

  const filteredCourses = courses
    .filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPlatform = selectedPlatform === "all" || 
                           course.platform === selectedPlatform ||
                           (selectedPlatform === "e_tax" && course.platform === "e_tax") ||
                           (selectedPlatform === "customs" && (course.platform === "customs" || course.platform === "e_sw"));
      return matchesSearch && matchesPlatform;
    })
    .sort((a, b) => {
      // Apply sorting based on filterType
      if (filterType === "recently_opened") {
        // Sort by last accessed date (most recent first)
        const progressA = userProgress[a.id];
        const progressB = userProgress[b.id];
        
        const dateA = progressA?.last_accessed ? new Date(progressA.last_accessed).getTime() : 0;
        const dateB = progressB?.last_accessed ? new Date(progressB.last_accessed).getTime() : 0;
        
        return dateB - dateA; // Descending order (most recent first)
      } else if (filterType === "newly_added") {
        // Sort by creation date (newest first)
        // Assuming courses have a created_at field or similar
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        
        return dateB - dateA; // Descending order (newest first)
      }
      
      // Default sorting (no specific order)
      return 0;
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="h-12 w-12 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading courses...</p>
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
        activeSection="courses" 
        onSectionChange={() => setSidebarOpen(false)}
        locked={sidebarLocked}
        onLockChange={handleSidebarLockChange}
      />
      
      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Ethiopian SME LMS</h1>
                <p className="text-xs text-muted-foreground">Browse Courses</p>
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
                      <DropdownMenuSeparator />
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
              <h1 className="text-3xl font-bold">Courses</h1>
              <p className="text-muted-foreground">Browse and enroll in training modules</p>
            </div>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedPlatform === "all" ? "default" : "outline"}
                onClick={() => setSelectedPlatform("all")}
              >
                All Platforms
              </Button>
              <Button
                variant={selectedPlatform === "e_tax" ? "default" : "outline"}
                onClick={() => setSelectedPlatform("e_tax")}
              >
                <FileText className="h-4 w-4 mr-2" />
                e-Tax
              </Button>
              <Button
                variant={selectedPlatform === "customs" ? "default" : "outline"}
                onClick={() => setSelectedPlatform("customs")}
              >
                <Truck className="h-4 w-4 mr-2" />
                Customs
              </Button>
            </div>
          </div>
          
          {/* Sorting Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={filterType === "all" ? "default" : "outline"}
              onClick={() => setFilterType("all")}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              All Courses
            </Button>
            <Button
              variant={filterType === "recently_opened" ? "default" : "outline"}
              onClick={() => setFilterType("recently_opened")}
              className="flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              Recently Opened
            </Button>
            <Button
              variant={filterType === "newly_added" ? "default" : "outline"}
              onClick={() => setFilterType("newly_added")}
              className="flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Newly Added
            </Button>
          </div>

          {/* Courses Grid */}
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => {
                const IconComponent = platformIcons[course.platform as keyof typeof platformIcons] || BookOpen;
                const platformLabel = platformLabels[course.platform as keyof typeof platformLabels] || course.platform;
                const platformColor = platformColors[course.platform as keyof typeof platformColors] || "bg-muted";
                
                // Get progress for this course
                const progress = userProgress[course.id];
                const isCompleted = progress?.status === 'completed';
                const isInProgress = progress?.status === 'in_progress';
                
                return (
                  <Card 
                    key={course.id} 
                    className="hover:shadow-lg transition-shadow cursor-pointer relative"
                    onClick={() => navigate(`/course/${course.id}`)}
                  >
                    {/* Progress indicator */}
                    {isCompleted && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                    )}
                    {isInProgress && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                        <Play className="h-4 w-4" />
                      </div>
                    )}
                    
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${platformColor}`}>
                          <IconComponent className="h-3 w-3 inline mr-1" />
                          {platformLabel}
                        </div>
                      </div>
                      <CardDescription>{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {course.duration_hours ? `${course.duration_hours} hours` : 'Self-paced'}
                        </div>
                      </div>
                      
                      {progress && (
                        <div className="flex flex-col gap-2 w-full mb-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              Last accessed: {new Date(progress.last_accessed).toLocaleDateString()}
                            </span>
                            <Badge variant="secondary" className={`${isCompleted ? 'bg-green-100 text-green-800' : isInProgress ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                              {isCompleted ? 'Completed' : isInProgress ? `In Progress (${progress.progress_percentage}%)` : 'Not Started'}
                            </Badge>
                          </div>
                          {(isInProgress || isCompleted) && (
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`} 
                                style={{ width: `${progress.progress_percentage}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <Button size="sm" onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/course/${course.id}`);
                        }}>
                          {isCompleted ? 'Review Course' : isInProgress ? 'Continue Learning' : 'Start Learning'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No courses found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms' : 'No courses available at the moment'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Courses;