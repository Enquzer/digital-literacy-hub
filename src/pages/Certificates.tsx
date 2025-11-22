import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Award, 
  Download, 
  LogOut,
  Home,
  ChevronRight,
  Menu,
  Lock,
  Unlock
} from "lucide-react";
import { toast } from "sonner";
import LearningSidebar from "@/components/LearningSidebar";
import axios from 'axios';

// Define certificate type
interface Certificate {
  id: string;
  module_id: string;
  course_name: string;
  issued_at: string;
  expires_at: string | null;
}

const Certificates = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarLocked, setSidebarLocked] = useState(false);

  useEffect(() => {
    const initUser = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        navigate("/auth");
        return;
      }
      setUser(currentUser);
    };
    
    initUser();
    fetchCertificates();
  }, [navigate]);

  // Add sidebar lock state management according to project specifications
  useEffect(() => {
    const savedLockState = localStorage.getItem('sidebarLocked');
    if (savedLockState) {
      setSidebarLocked(JSON.parse(savedLockState));
    }
  }, []);

  const handleSidebarLockChange = (locked: boolean) => {
    setSidebarLocked(locked);
    localStorage.setItem('sidebarLocked', JSON.stringify(locked));
  };

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      
      if (!user?.id) {
        // If user is not loaded yet, we can't fetch certificates
        return;
      }
      
      // Fetch certificates from the backend
      const response = await axios.get(`http://localhost:3001/certificates/${user.id}`);
      setCertificates(response.data as Certificate[]);
    } catch (error: any) {
      console.error("Error fetching certificates:", error);
      toast.error("Failed to load certificates.");
      
      // Fallback to mock data on error
      const mockCertificates: Certificate[] = [
        {
          id: "cert-1",
          module_id: "module-1",
          course_name: "Sample Course Completion",
          issued_at: new Date().toISOString(),
          expires_at: null
        }
      ];
      
      setCertificates(mockCertificates);
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = (certificateId: string) => {
    toast.success("Certificate download started");
    // In a real implementation, this would download the actual certificate file
  };

  const handleSignOut = () => {
    signOut();
    toast.success("Signed out successfully");
    navigate("/auth");
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu className="h-6 w-6" />
      </Button>
      
      <div className="flex items-center justify-between p-4 bg-slate-100 border-b">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <Home className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => handleSignOut()}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex flex-1">
        <LearningSidebar
          activeSection="certificates"
          locked={sidebarLocked}
          onLockChange={handleSidebarLockChange}
        />
        <div className="flex flex-col flex-1 p-4 lg:ml-64">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Certificates</h1>
          </div>
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Date Issued</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : certificates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      No certificates found
                    </TableCell>
                  </TableRow>
                ) : (
                  certificates.map((certificate) => (
                    <TableRow key={certificate.id}>
                      <TableCell>{certificate.course_name}</TableCell>
                      <TableCell>{new Date(certificate.issued_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => downloadCertificate(certificate.id)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificates;