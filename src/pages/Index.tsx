import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  GraduationCap, 
  BookOpen, 
  Award,
  Users,
  TrendingUp,
  FileText,
  Truck,
  ArrowRight,
  CheckCircle
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: BookOpen,
      title: "Structured Learning Modules",
      description: "Step-by-step courses with videos, documents, and interactive content"
    },
    {
      icon: Users,
      title: "Expert-Led Training",
      description: "Learn from experienced trainers and industry professionals"
    },
    {
      icon: Award,
      title: "Earn Certificates",
      description: "Get recognized for your achievements with official certificates"
    },
    {
      icon: TrendingUp,
      title: "Track Your Progress",
      description: "Monitor your learning journey with detailed analytics"
    }
  ];

  const platforms = [
    {
      icon: FileText,
      name: "e-Tax Platform",
      description: "Master tax filing, VAT, income tax, and digital payments",
      color: "text-primary"
    },
    {
      icon: Truck,
      name: "Customs Trade Portal",
      description: "Learn import/export declarations and shipment tracking",
      color: "text-success"
    },
    {
      icon: Truck,
      name: "e-SW System",
      description: "Navigate clearance processing and documentation",
      color: "text-achievement"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-glow to-achievement">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-8">
              <GraduationCap className="h-10 w-10" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Master Ethiopia's Digital Government Platforms
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Comprehensive training for SMEs on e-Tax and Customs systems
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate("/auth")}
                className="text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/courses")}
                className="text-lg bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm"
              >
                Explore Courses
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Training Platforms</h2>
            <p className="text-xl text-muted-foreground">
              Specialized courses for Ethiopia's e-government systems
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {platforms.map((platform, index) => {
              const Icon = platform.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Icon className={`h-12 w-12 ${platform.color} mb-4`} />
                    <CardTitle>{platform.name}</CardTitle>
                    <CardDescription className="text-base">
                      {platform.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Our LMS?</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to succeed in digital government platforms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              What You'll Learn
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Tax filing and VAT management",
                "Import/export declarations",
                "Digital payment systems",
                "Customs clearance procedures",
                "Compliance requirements",
                "Document management",
                "Shipment tracking",
                "Portal navigation"
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 flex-shrink-0" />
                  <span className="text-lg">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground border-0 shadow-2xl">
            <CardContent className="py-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join hundreds of Ethiopian SMEs improving their digital literacy
              </p>
              <Button 
                size="lg"
                variant="secondary"
                onClick={() => navigate("/auth")}
                className="text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                Create Your Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-card">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 Ethiopian SME Digital Literacy Program. All rights reserved.</p>
          <p className="mt-2 text-sm">Powered by Lovable Cloud</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
