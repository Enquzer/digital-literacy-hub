import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  BookOpen, 
  FileText, 
  AlertCircle, 
  Image, 
  Play, 
  Menu,
  ChevronRight,
  Clock,
  Tag,
  Building,
  Edit3,
  Plus,
  Download,
  Check,
  ChevronDown,
  ChevronUp,
  Award
} from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import LearningSidebar from '@/components/LearningSidebar';
import { fetchLLMCourseById, generateQuizQuestions } from '@/integrations/llm-engine/client';

// Define TypeScript interfaces
interface Workflow {
  step: number;
  description: {
    en: string;
    am: string;
  };
  explanation?: string;
  completed?: boolean;
}

interface FAQ {
  question: {
    en: string;
    am: string;
  };
  answer: {
    en: string;
    am: string;
  };
}

interface Example {
  title: {
    en: string;
    am: string;
  };
  description: {
    en: string;
    am: string;
  };
}

interface GeneratedAssets {
  quiz?: any;
  video_script?: any;
  checklist_pdf?: string;
}

interface ModuleData {
  id: string;
  slug: string;
  title: string;
  source_url: string;
  language: 'en' | 'am';
  original_text: string;
  translated_text: string;
  content: string;
  source_body: string;
  category: string;
  tags: string[];
  sector_tags: string[];
  workflows: Workflow[];
  required_documents: string[];
  common_errors: string[];
  faqs: FAQ[];
  examples: Example[];
  screenshots: string[];
  generated_assets: GeneratedAssets;
  updated_at: string;
  version: string;
  legal_source: boolean;
}

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [moduleData, setModuleData] = useState<ModuleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showOriginal, setShowOriginal] = useState(true);
  const [quiz, setQuiz] = useState<any>(null);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({});
  const [workflowSteps, setWorkflowSteps] = useState<Workflow[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarLocked, setSidebarLocked] = useState(false);

  // Check if user has admin role
  const isUserAdmin = (user: any) => {
    if (!user || !user.roles) return false;
    return user.roles.includes('admin') || user.roles.includes('super_admin') || user.roles.includes('trainer');
  };

  const handleSidebarLockChange = (locked: boolean) => {
    setSidebarLocked(locked);
    // Save to localStorage
    localStorage.setItem('sidebarLocked', locked.toString());
  };

  useEffect(() => {
    // Load sidebar locked state from localStorage
    const savedLockedState = localStorage.getItem('sidebarLocked');
    if (savedLockedState === 'true') {
      setSidebarLocked(true);
    }
  }, []);

  useEffect(() => {
    const checkAuthAndFetchModule = async () => {
      if (!id) return;
      
      try {
        // Check if user is authenticated
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          // Redirect to login if not authenticated
          navigate("/auth");
          return;
        }
        
        setUser(currentUser);
        setLoading(true);
        
        // Use the LLM engine client
        const data = await fetchLLMCourseById(id);
        
        if (data) {
          setModuleData(data);
          
          // Initialize workflow steps with completion status
          // First, try to load existing progress from localStorage
          let initialSteps = data.workflows.map((step: Workflow) => ({
            ...step,
            completed: false
          }));
          
          if (user?.id && data.id) {
            try {
              // Try to load step completion status from localStorage
              const savedSteps = localStorage.getItem(`courseSteps_${user.id}_${data.id}`);
              if (savedSteps) {
                const parsedSteps = JSON.parse(savedSteps);
                // Merge saved steps with current workflow steps
                initialSteps = data.workflows.map((step: Workflow, index: number) => ({
                  ...step,
                  completed: parsedSteps[index] ? parsedSteps[index].completed : false
                }));
              } else {
                // If no localStorage data, try to load existing progress from backend
                const { getUserCourseProgress } = await import('@/lib/learning-tracker');
                const progress = await getUserCourseProgress(user.id, data.id);
                
                if (progress && progress.length > 0) {
                  const progressData = progress[0];
                  // Update steps based on saved progress
                  // For individual step tracking, we would need a more sophisticated approach
                  // For now, we'll mark steps as completed based on overall progress
                  const shouldMarkStepsComplete = progressData.status === 'completed' || 
                                                (progressData.status === 'in_progress' && progressData.progress_percentage > 0);
                  
                  initialSteps = data.workflows.map((step: Workflow) => ({
                    ...step,
                    completed: shouldMarkStepsComplete
                  }));
                }
              }
            } catch (err) {
              console.error('Error loading progress:', err);
            }
          }
          
          setWorkflowSteps(initialSteps);
        } else {
          setError('Failed to load module data');
        }
      } catch (err) {
        setError('Error fetching module data');
        console.error('Error fetching module:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchModule();
  }, [id, navigate]);

  const handleGenerateQuiz = async () => {
    // Only allow admins to generate quizzes
    if (!isUserAdmin(user)) {
      alert('Only administrators can generate quizzes.');
      return;
    }
    
    if (!moduleData?.id) return;
    
    try {
      setGeneratingQuiz(true);
      // Use the LLM engine client to generate quiz
      const generatedQuiz = await generateQuizQuestions(moduleData.id, 2);
      
      setQuiz(generatedQuiz);
    } catch (err) {
      console.error('Failed to generate quiz:', err);
    } finally {
      setGeneratingQuiz(false);
    }
  };

  // Function to format content based on language preference
  const formatContent = (content: string, isOriginal: boolean) => {
    if (!content) return '';
    
    // For original content, we want to remove Amharic parts
    if (isOriginal) {
      // Remove Amharic text in parentheses and workflow steps (since they're displayed separately)
      return content
        .replace(/\(Amharic: [^\)]+\)/g, '')
        .replace(/## Steps:[\s\S]*?(?=## Requirements:|## Validation:|$)/, '')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/## (.*?)(?=\n|$)/g, '<h2>$1</h2>')
        .replace(/# (.*?)(?=\n|$)/g, '<h1>$1</h1>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/^<p>/, '')
        .replace(/<\/p>$/, '');
    } else {
      // For translated content, we want to extract Amharic parts
      // Extract Amharic text from parentheses
      let amharicContent = content.replace(/.*\(Amharic: ([^\)]+)\).*/g, '$1');
      if (amharicContent === content) {
        // If no Amharic found, use the content as is
        amharicContent = content;
      }
      return amharicContent
        .replace(/## Steps:[\s\S]*?(?=## Requirements:|## Validation:|$)/, '')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/## (.*?)(?=\n|$)/g, '<h2>$1</h2>')
        .replace(/# (.*?)(?=\n|$)/g, '<h1>$1</h1>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/^<p>/, '')
        .replace(/<\/p>$/, '');
    }
  };
  
  // Function to generate executive summary using LLM
  const generateExecutiveSummary = () => {
    // In a real implementation, this would call the LLM to generate an executive summary
    // For now, we'll create a sample executive summary based on the module data
    if (!moduleData) return '';
    
    const summaries: Record<string, string> = {
      'customs-e-single-window-system-1763664673929': `
        <h2>Executive Summary</h2>
        <p>The Ethiopian Customs Commission's e-Single Window System streamlines import and export procedures by providing a unified digital platform for traders to submit required documentation and receive clearances from multiple government agencies in a single transaction.</p>
        <h3>Key Benefits:</h3>
        <ul>
          <li>Reduced processing time from days to hours</li>
          <li>Elimination of redundant data entry</li>
          <li>Improved transparency and predictability</li>
          <li>Enhanced trade facilitation for businesses</li>
        </ul>
        <h3>Target Users:</h3>
        <p>Importers, exporters, freight forwarders, and customs brokers operating in Ethiopia.</p>
      `,
      'trade-etrade-portal-1763664673930': `
        <h2>Executive Summary</h2>
        <p>The Ethiopian Customs Trade Portal (eTrade) provides comprehensive trade statistics, market analysis, and regulatory information to support informed business decisions for traders and investors.</p>
        <h3>Key Features:</h3>
        <ul>
          <li>Real-time trade data and analytics</li>
          <li>Market trend analysis and forecasting</li>
          <li>Regulatory compliance guidance</li>
          <li>Trade facilitation resources</li>
        </ul>
        <h3>Target Users:</h3>
        <p>Trade professionals, business analysts, researchers, and policy makers.</p>
      `,
      'etax-income-tax-1': `
        <h2>Executive Summary</h2>
        <p>Ethiopia's Income Tax Filing System enables businesses and individuals to efficiently calculate, report, and pay their income tax obligations through a digital platform integrated with the Ministry of Revenue's systems.</p>
        <h3>Key Components:</h3>
        <ul>
          <li>Progressive tax rate structure</li>
          <li>Automated calculation tools</li>
          <li>Secure payment processing</li>
          <li>Compliance tracking and reporting</li>
        </ul>
        <h3>Target Users:</h3>
        <p>Business entities, self-employed individuals, and tax professionals.</p>
      `
    };
    
    return summaries[moduleData.id] || `
      <h2>Executive Summary</h2>
      <p>This course provides comprehensive guidance on ${moduleData.title} to help you navigate the system effectively.</p>
      <h3>What You'll Learn:</h3>
      <ul>
        <li>System registration and setup</li>
        <li>Key workflows and processes</li>
        <li>Required documentation</li>
        <li>Common pitfalls to avoid</li>
      </ul>
    `;
  };

  // Function to get content based on language preference
  const getContentByLanguage = () => {
    const content = moduleData?.source_body || moduleData?.original_text || moduleData?.content || '';
    return formatContent(content, showOriginal);
  };

  // Toggle step expansion
  const toggleStep = (stepNumber: number) => {
    setExpandedSteps(prev => {
      const newExpandedState = !prev[stepNumber];
      
      // If we're expanding the step, generate explanation if it doesn't exist
      if (newExpandedState) {
        const step = workflowSteps.find(s => s.step === stepNumber);
        if (step && !step.explanation) {
          generateAndSetExplanation(step);
        }
      }
      
      return {
        ...prev,
        [stepNumber]: newExpandedState
      };
    });
  };

  // Toggle step completion
  const toggleStepCompletion = (stepNumber: number) => {
    // Update the workflow steps state
    const updatedSteps = workflowSteps.map(step => 
      step.step === stepNumber ? { ...step, completed: !step.completed } : step
    );
    
    setWorkflowSteps(updatedSteps);
    
    // Save step completion status to localStorage
    if (user?.id && moduleData?.id) {
      try {
        localStorage.setItem(`courseSteps_${user.id}_${moduleData.id}`, JSON.stringify(updatedSteps));
      } catch (err) {
        console.error('Error saving step completion to localStorage:', err);
      }
    }
    
    // Calculate overall progress
    const totalSteps = updatedSteps.length;
    const completedSteps = updatedSteps.filter(step => step.completed).length;
    const progressPercentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
    
    // Save progress to backend
    if (user?.id && moduleData?.id) {
      saveProgressToBackend(user.id, moduleData.id, progressPercentage, completedSteps === totalSteps);
    }
  };

  // Save progress to backend
  const saveProgressToBackend = async (userId: string, moduleId: string, progressPercentage: number, isCompleted: boolean) => {
    try {
      const status = isCompleted ? 'completed' : (progressPercentage > 0 ? 'in_progress' : 'not_started');
      
      // Format progress data to match backend API expectations
      const progressData = {
        status,
        progress_percentage: progressPercentage,
        time_spent_seconds: Math.floor(Math.random() * 3600), // Random time for demo purposes (in seconds)
        quiz_score: null // We don't have quiz score here
      };
      
      // Prepare the request body to match backend expectations
      const requestBody = {
        userId,
        moduleId,
        progressData
      };
      
      // Import and use the updateUserProgress function from learning-tracker
      const { updateUserProgress } = await import('@/lib/learning-tracker');
      await updateUserProgress(requestBody);
      
      console.log('Progress saved successfully:', requestBody);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  // Check if all steps are completed
  const areAllStepsCompleted = () => {
    return workflowSteps.length > 0 && workflowSteps.every(step => step.completed);
  };

  // Function to generate step explanation using LLM
  const generateStepExplanation = async (step: Workflow) => {
    // In a real implementation, this would call the LLM to generate an explanation
    // For now, we'll simulate with a sample explanation
    const explanations: Record<number, string> = {
      1: "To register on the e-Single Window system, visit singlewindow.gov.et and create an account using your business details. You'll need to provide your business registration number and contact information.",
      2: "After registration, create your business profile by providing detailed information about your company, including business type, size, and primary activities. This profile will be used for all future transactions.",
      3: "Link your existing customs account with your new e-SW profile to ensure seamless integration of your import/export activities across different government systems.",
      4: "Submit your import or export declarations through the unified platform. The system will automatically route your declaration to the appropriate government agencies for processing.",
      5: "Upload all required documents as specified by the system. Common documents include commercial invoices, packing lists, bills of lading, and certificates of origin.",
      6: "Monitor the status of your declaration in real-time. You'll receive notifications at each stage of the process, from initial submission to final clearance."
    };
    
    return explanations[step.step] || "This step involves completing the required actions in the e-Single Window system.";
  };
  
  // Function to generate and set step explanation when step is expanded
  const generateAndSetExplanation = async (step: Workflow) => {
    // Only generate if explanation doesn't already exist
    if (!step.explanation) {
      const explanation = await generateStepExplanation(step);
      // Update the workflow step with the generated explanation
      const updatedSteps = workflowSteps.map(s => 
        s.step === step.step ? { ...s, explanation } : s
      );
      setWorkflowSteps(updatedSteps);
    }
  };

  // Function to actually take the quiz
  const handleTakeQuiz = async () => {
    if (!moduleData?.id) return;
    
    try {
      // Generate quiz questions for this module
      const quizQuestions = await generateQuizQuestions(moduleData.id, 5);
      
      if (quizQuestions) {
        // Navigate to the quiz page with the generated questions
        // In a real implementation, you might want to store the quiz in state or context
        // For now, we'll navigate to a quiz route
        navigate(`/quiz/${moduleData.id}`, { 
          state: { 
            questions: quizQuestions,
            moduleId: moduleData.id,
            moduleTitle: moduleData.title
          } 
        });
      } else {
        alert('Failed to generate quiz. Please try again.');
      }
    } catch (err) {
      console.error('Failed to generate quiz:', err);
      alert('Failed to generate quiz. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!moduleData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Module not found
      </div>
    );
  }

  return (
    <div className="flex">
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
        activeSection="courses"
        locked={sidebarLocked}
        onLockChange={handleSidebarLockChange}
        onSectionChange={() => setSidebarOpen(false)}
      />
      <div className="container mx-auto py-8 flex-1 lg:ml-64">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => navigate('/courses')}
          >
            <ChevronRight className="h-4 w-4 rotate-180 mr-2" />
            Back to Courses
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{moduleData.title}</h1>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary">
                  <Building className="h-3 w-3 mr-1" />
                  {moduleData.category}
                </Badge>
                <Badge variant="outline">
                  <Tag className="h-3 w-3 mr-1" />
                  {moduleData.language === 'en' ? 'English' : 'Amharic'}
                </Badge>
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  v{moduleData.version}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Label htmlFor="language-toggle">Show Original</Label>
              <Switch
                id="language-toggle"
                checked={showOriginal}
                onCheckedChange={setShowOriginal}
              />
              <Label htmlFor="language-toggle">Show Translation</Label>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Overview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Course Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: generateExecutiveSummary()
                    }} 
                  />
                </div>
              </CardContent>
            </Card>

            {/* Workflows */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Play className="h-5 w-5 mr-2" />
                  Workflow Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workflowSteps && workflowSteps.length > 0 ? (
                    workflowSteps.map((workflow, index) => (
                      <div key={index} className="border rounded-lg overflow-hidden">
                        <div 
                          className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${
                            workflow.completed ? 'bg-green-50 hover:bg-green-100' : 'bg-white hover:bg-gray-50'
                          }`}
                          onClick={() => toggleStep(workflow.step)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                              workflow.completed ? 'bg-green-500' : 'bg-primary'
                            }`}>
                              {workflow.completed ? (
                                <Check className="h-5 w-5 text-white" />
                              ) : (
                                <span className="text-white font-bold">{workflow.step}</span>
                              )}
                            </div>
                            <span className="font-medium">
                              {showOriginal ? workflow.description.en : workflow.description.am}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-1 h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleStepCompletion(workflow.step);
                              }}
                            >
                              <Check className={`h-4 w-4 ${workflow.completed ? 'text-green-500' : 'text-gray-400'}`} />
                            </Button>
                            {expandedSteps[workflow.step] ? (
                              <ChevronUp className="h-5 w-5 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-500" />
                            )}
                          </div>
                        </div>
                        
                        {expandedSteps[workflow.step] && (
                          <div className="p-4 bg-gray-50 border-t">
                            <p className="text-sm text-gray-700">
                              {workflow.explanation || "Loading explanation..."}
                            </p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No workflow steps available</p>
                  )}
                </div>
                
                {/* Quiz button appears when all steps are completed */}
                {areAllStepsCompleted() && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-5 w-5 text-blue-500" />
                      <h3 className="font-medium text-blue-900">Ready for Assessment</h3>
                    </div>
                    <p className="text-sm text-blue-800 mb-3">
                      You've completed all workflow steps. Take the quiz to earn your certificate!
                    </p>
                    <Button 
                      className="w-full"
                      onClick={handleTakeQuiz}
                    >
                      Take Quiz
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Course Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Course Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Source</h4>
                  <p className="text-sm">{moduleData.source_url}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Last Updated</h4>
                  <p className="text-sm">{moduleData.updated_at ? new Date(moduleData.updated_at).toLocaleDateString() : 'Invalid Date'}</p>
                </div>
                
                {moduleData.sector_tags && moduleData.sector_tags.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Sectors</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {moduleData.sector_tags.map((sector, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {sector}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {moduleData.tags && moduleData.tags.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Tags</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {moduleData.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Required Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Required Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                {moduleData.required_documents && moduleData.required_documents.length > 0 ? (
                  <ul className="space-y-2">
                    {moduleData.required_documents.map((doc, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{doc}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-sm">No required documents specified</p>
                )}
              </CardContent>
            </Card>

            {/* Common Errors - only show if there are common errors */}
            {moduleData.common_errors && moduleData.common_errors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Common Errors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {moduleData.common_errors.map((errorItem, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{errorItem}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Quiz Section - Only visible to admins */}
            {isUserAdmin(user) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Play className="h-5 w-5 mr-2" />
                    Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full"
                    onClick={handleGenerateQuiz}
                    disabled={generatingQuiz}
                  >
                    {generatingQuiz ? 'Generating Quiz...' : 'Generate Quiz'}
                  </Button>
                  
                  {quiz && (
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <h4 className="font-medium">Quiz Generated</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {quiz.length} questions created for this module
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;