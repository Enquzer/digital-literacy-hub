import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GraduationCap, 
  ArrowLeft, 
  Clock, 
  BookOpen,
  Search,
  FileText,
  Truck
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  platform: string;
  thumbnail_url: string | null;
  duration_hours: number | null;
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
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching courses:', error);
    } else {
      setCourses(data || []);
    }
    setLoading(false);
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = selectedPlatform === "all" || course.platform === selectedPlatform;
    return matchesSearch && matchesPlatform;
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Course Catalog</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Explore Training Courses</h2>
          <p className="text-muted-foreground">
            Comprehensive training for Ethiopian e-government platforms
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Platforms</TabsTrigger>
              <TabsTrigger value="e_tax">e-Tax</TabsTrigger>
              <TabsTrigger value="customs">Customs</TabsTrigger>
              <TabsTrigger value="e_sw">e-SW</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <Card className="py-12">
            <CardContent className="text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No courses found</h3>
              <p className="text-muted-foreground">
                {searchQuery || selectedPlatform !== "all"
                  ? "Try adjusting your search or filters"
                  : "Courses are being prepared. Check back soon!"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const PlatformIcon = platformIcons[course.platform as keyof typeof platformIcons];
              
              return (
                <Card 
                  key={course.id} 
                  className="hover:shadow-xl transition-all cursor-pointer group overflow-hidden"
                  onClick={() => navigate(`/course/${course.id}`)}
                >
                  <div className={`h-32 flex items-center justify-center ${platformColors[course.platform as keyof typeof platformColors]} border-b`}>
                    <PlatformIcon className="h-16 w-16 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline" className={platformColors[course.platform as keyof typeof platformColors]}>
                        {platformLabels[course.platform as keyof typeof platformLabels]}
                      </Badge>
                      {course.duration_hours && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {course.duration_hours}h
                        </div>
                      )}
                    </div>
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {course.description || "Comprehensive training for Ethiopian SMEs"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      Start Learning
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Courses;
