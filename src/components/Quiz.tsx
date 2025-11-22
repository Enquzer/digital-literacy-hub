import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle, 
  XCircle, 
  RotateCw, 
  Bot
} from "lucide-react";
import { toast } from "sonner";
import { getCurrentUser } from "@/lib/auth";
import { generateQuizQuestions, evaluateQuizAnswers, QuizEvaluation } from "@/integrations/llm-engine/client";
import axios from 'axios';

interface QuizQuestion {
  id: string;
  question_text: string;
  expected_answer: string;
  points: number;
  order_index: number;
}

interface Quiz {
  id: string;
  title: string;
  passing_score: number;
  max_attempts: number;
  questions: QuizQuestion[];
}

interface QuizAttempt {
  id: string;
  score: number;
  passed: boolean;
  attempt_number: number;
  answers: Record<string, string>;
  started_at: string;
  completed_at: string;
}

const Quiz = ({ moduleId, courseId, courseTitle, onQuizComplete }: { 
  moduleId?: string; 
  courseId: string;
  courseTitle: string;
  onQuizComplete: (passed: boolean, score: number) => void;
}) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [currentAttempt, setCurrentAttempt] = useState(0);

  useEffect(() => {
    fetchQuiz();
    fetchAttempts();
  }, [moduleId]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      
      // Make API call instead of direct database query
      const response = await axios.get<{data: Quiz}>(`http://localhost:3001/api/courses/${courseId}/quiz`);
      setQuiz(response.data.data || null);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      toast.error("Failed to load quiz");
    } finally {
      setLoading(false);
    }
  };

  const generateQuizWithLLM = async () => {
    try {
      setGenerating(true);
      
      // Make API call to generate quiz with LLM
      const response = await axios.post('http://localhost:3001/api/quizzes/generate', {
        courseId,
        courseTitle,
        numQuestions: 2
      });
      
      if (response.status === 200 || response.status === 201) {
        toast.success("Quiz generated successfully!");
        await fetchQuiz(); // Refresh quiz data
      } else {
        throw new Error('Failed to generate quiz');
      }
    } catch (error: any) {
      console.error('Error generating quiz:', error);
      toast.error("Failed to generate quiz: " + (error.message || "Unknown error"));
    } finally {
      setGenerating(false);
    }
  };

  const fetchAttempts = async () => {
    try {
      // Make API call to fetch quiz attempts
      const response = await axios.get<{data: QuizAttempt[]}>(`http://localhost:3001/api/quiz-attempts/${courseId}`);
      const fetchedAttempts = response.data.data || [];
      
      // Sort by most recent first
      fetchedAttempts.sort((a, b) => 
        new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
      );
      
      setAttempts(fetchedAttempts);
      if (fetchedAttempts.length > 0) {
        setCurrentAttempt(fetchedAttempts[0].attempt_number);
      }
    } catch (error) {
      console.error('Error fetching attempts:', error);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    
    try {
      const user = await getCurrentUser();
      if (!user) {
        toast.error("You must be logged in to submit a quiz");
        return;
      }
      
      // Evaluate answers using LLM
      const scores: any = await evaluateQuizAnswers(quiz.id, quiz.questions, userAnswers);
      
      if (!scores) {
        throw new Error('Failed to evaluate quiz');
      }
      
      const attempt: QuizAttempt = {
        id: `attempt-${Date.now()}`,
        score: scores.score || 0,
        passed: scores.passed || false,
        attempt_number: currentAttempt + 1,
        answers: userAnswers,
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString()
      };
      
      setScore(attempt.score);
      setPassed(attempt.passed);
      setSubmitted(true);
      
      // Save attempt to backend
      await axios.post('http://localhost:3001/api/quiz-attempts', {
        ...attempt,
        quiz_id: quiz.id,
        user_id: user.id
      });
      
      // Notify parent component
      onQuizComplete(attempt.passed, attempt.score);
      
      toast.success(attempt.passed ? "Congratulations! You passed the quiz." : "You did not pass. Try again.");
    } catch (error: any) {
      console.error('Error submitting quiz:', error);
      toast.error("Failed to submit quiz: " + (error.message || "Unknown error"));
    }
  };

  const handleRetry = () => {
    setUserAnswers({});
    setSubmitted(false);
    setCurrentAttempt(prev => prev + 1);
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
      <div className="flex items-center justify-center p-8">
        <RotateCw className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading quiz...</span>
      </div>
    );
  }

  if (!quiz) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz for {courseTitle}</CardTitle>
          <CardDescription>
            No quiz available for this course yet. Generate one using AI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <Bot className="h-12 w-12 text-muted-foreground" />
            <p className="text-center text-muted-foreground">
              This course doesn't have a quiz yet. Click the button below to generate one using AI.
            </p>
            <Button 
              onClick={generateQuizWithLLM} 
              disabled={generating}
              className="mt-2"
            >
              {generating ? (
                <>
                  <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Bot className="mr-2 h-4 w-4" />
                  Generate Quiz with AI
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{quiz.title}</CardTitle>
        <CardDescription>
          Passing score: {quiz.passing_score}%. Attempt {currentAttempt + 1} of {quiz.max_attempts}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div className="space-y-4">
            <Alert variant={passed ? "default" : "destructive"}>
              <AlertDescription className="flex items-center">
                {passed ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Congratulations! You passed the quiz with a score of {score}%.
                  </>
                ) : (
                  <>
                    <XCircle className="mr-2 h-4 w-4" />
                    You did not pass. You scored {score}%. You need {quiz.passing_score}% to pass.
                  </>
                )}
              </AlertDescription>
            </Alert>
            <div className="flex justify-center gap-2">
              {!passed && currentAttempt < quiz.max_attempts - 1 && (
                <Button onClick={handleRetry}>
                  Try Again
                </Button>
              )}
              <Button variant="outline" onClick={() => window.location.reload()}>
                Review Course
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {quiz.questions.map((question) => (
              <div key={question.id} className="space-y-2">
                <label className="text-sm font-medium">
                  {question.order_index}. {question.question_text}
                </label>
                <Textarea
                  value={userAnswers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  placeholder="Enter your answer..."
                  className="min-h-[100px]"
                />
              </div>
            ))}
            <div className="flex justify-end">
              <Button onClick={handleSubmit} disabled={Object.keys(userAnswers).length === 0}>
                Submit Quiz
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Quiz;