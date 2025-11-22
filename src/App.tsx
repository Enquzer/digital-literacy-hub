import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Profile from "./pages/Profile";
import Certificates from "./pages/Certificates";
import Sessions from "./pages/Sessions";
import Quiz from "./pages/Quiz";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/Users";
import ModuleManagement from "./pages/admin/Modules";
import Analytics from "./pages/admin/Analytics";
import SupportManagement from "./pages/admin/Support";
import SettingsPage from "./pages/admin/Settings";
import SearchMonitoring from "./pages/admin/SearchMonitoring";
import SchedulerLogs from "./pages/admin/SchedulerLogs";
import QuizManagement from "./pages/admin/QuizManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/quiz/:id" element={<Quiz />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/sessions" element={<Sessions />} />
          {/* Admin routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/modules" element={<ModuleManagement />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/support" element={<SupportManagement />} />
          <Route path="/admin/settings" element={<SettingsPage />} />
          <Route path="/admin/search-monitoring" element={<SearchMonitoring />} />
          <Route path="/admin/scheduler-logs" element={<SchedulerLogs />} />
          <Route path="/admin/quizzes" element={<QuizManagement />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;