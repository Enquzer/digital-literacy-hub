import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Users, BookOpen, Menu, User, LogOut, ChevronDown, Plus, Edit, Trash2, MoreHorizontal, Bot, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";
import LearningSidebar from "@/components/LearningSidebar";
import { getCurrentUser, signOut } from "@/lib/auth";
import { fetchLLMCourses, generateQuizQuestions } from "@/integrations/llm-engine/client";
import { mysqlPool } from "@/config/database";
import { generateUUID } from "@/utils/uuid";

const QuizManagement = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarLocked, setSidebarLocked] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);

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

  // Load courses and quizzes
  useEffect(() => {
    const loadData = async () => {
      try {
        const courseData = await fetchLLMCourses();
        setCourses(courseData);
        
        // For now, we'll simulate some quizzes
        // In a real implementation, we would fetch actual quizzes from a database
        const sampleQuizzes = courseData.slice(0, 3).map((course: any, index: number) => ({
          id: `quiz-${index + 1}`,
          title: `Quiz for ${course.title}`,
          courseId: course.id,
          courseTitle: course.title,
          questionCount: 5 + index,
          createdAt: new Date(Date.now() - index * 86400000).toISOString(),
          status: index === 0 ? 'published' : 'draft'
        }));
        setQuizzes(sampleQuizzes);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load data');
      }
    };
    
    if (!loading) {
      loadData();
    }
  }, [loading]);

  const handleCreateQuiz = async () => {
    if (!selectedCourse) {
      toast.error('Please select a course');
      return;
    }
    
    setGeneratingQuiz(true);
    try {
      const questions = await generateQuizQuestions(selectedCourse, 5);
      if (questions && questions.length > 0) {
        toast.success('Quiz generated successfully!');
        setIsCreateDialogOpen(false);
        
        // Add the new quiz to our list
        const course = courses.find(c => c.id === selectedCourse);
        if (course) {
          const newQuiz = {
            id: `quiz-${Date.now()}`,
            title: `Quiz for ${course.title}`,
            courseId: course.id,
            courseTitle: course.title,
            questionCount: questions.length,
            createdAt: new Date().toISOString(),
            status: 'draft',
            questions
          };
          
          setQuizzes(prev => [newQuiz, ...prev]);
          setSelectedCourse("");
        }
      } else {
        toast.error('Failed to generate quiz questions');
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast.error('Failed to generate quiz');
    } finally {
      setGeneratingQuiz(false);
    }
  };

  const handleViewQuiz = (quiz: any) => {
    setSelectedQuiz(quiz);
    setIsViewDialogOpen(true);
  };

  const handleDeleteQuiz = (quizId: string) => {
    setQuizzes(prev => prev.filter(quiz => quiz.id !== quizId));
    toast.success('Quiz deleted successfully');
  };

  const filteredQuizzes = quizzes.filter(quiz => 
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quiz.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading quiz management...</p>
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
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Ethiopian SME LMS</h1>
                <p className="text-xs text-muted-foreground">Quiz Management</p>
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
              <h1 className="text-3xl font-bold">Quiz Management</h1>
              <p className="text-muted-foreground">Manage quizzes for learning modules</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Quiz
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Quiz</DialogTitle>
                  <DialogDescription>
                    Generate a quiz based on a learning module
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="course">Select Course</Label>
                    <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateQuiz} disabled={generatingQuiz || !selectedCourse}>
                      {generatingQuiz ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Bot className="h-4 w-4 mr-2" />
                          Generate Quiz
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="mb-6 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search quizzes..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Quizzes
              </CardTitle>
              <CardDescription>Quiz management dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredQuizzes.length > 0 ? (
                <div className="grid gap-4">
                  {filteredQuizzes.map((quiz) => (
                    <div key={quiz.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{quiz.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            For: {quiz.courseTitle}
                          </p>
                          <div className="flex gap-4 mt-2 text-sm">
                            <span>{quiz.questionCount} questions</span>
                            <span className="capitalize">{quiz.status}</span>
                            <span>{new Date(quiz.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewQuiz(quiz)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteQuiz(quiz.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No quizzes found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm ? 'No quizzes match your search.' : 'Get started by creating a new quiz.'}
                  </p>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Quiz
                    </Button>
                  </DialogTrigger>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* View Quiz Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            {selectedQuiz && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedQuiz.title}</DialogTitle>
                  <DialogDescription>
                    Course: {selectedQuiz.courseTitle}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm font-medium">{selectedQuiz.questionCount} questions</span>
                      <span className="mx-2">•</span>
                      <span className="text-sm capitalize">{selectedQuiz.status}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Created: {new Date(selectedQuiz.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {selectedQuiz.questions ? (
                    <div className="grid gap-6">
                      {selectedQuiz.questions.map((question: any, index: number) => (
                        <div key={question.id} className="border rounded-lg p-4">
                          <div className="font-medium mb-3">
                            Question {index + 1}: {question.question_text}
                          </div>
                          <div className="grid gap-2 ml-4">
                            {question.options.map((option: string, optIndex: number) => (
                              <div 
                                key={optIndex} 
                                className={`p-2 rounded ${optIndex === question.correct_answer_index ? 'bg-green-100 border border-green-300' : 'bg-muted'}`}
                              >
                                <span className="font-medium mr-2">
                                  {String.fromCharCode(65 + optIndex)}.
                                </span>
                                {option}
                                {optIndex === question.correct_answer_index && (
                                  <span className="ml-2 text-xs bg-green-500 text-white px-1.5 py-0.5 rounded">
                                    Correct
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                          {question.explanation && (
                            <div className="mt-3 text-sm text-muted-foreground italic">
                              Explanation: {question.explanation}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p>Quiz questions not available.</p>
                    </div>
                  )}
                  
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                      Close
                    </Button>
                    <Button>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Quiz
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default QuizManagement;