
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, FileText, Tags, Share, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Markdown Notes",
      description: "Write and organize your notes using powerful Markdown syntax with live preview"
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Code Highlighting",
      description: "Syntax highlighting for all popular programming languages and frameworks"
    },
    {
      icon: <Tags className="w-6 h-6" />,
      title: "Smart Tagging",
      description: "Organize your notes with tags and filter them easily to find what you need"
    },
    {
      icon: <Share className="w-6 h-6" />,
      title: "Public Sharing",
      description: "Share your notes publicly with unique URLs for collaboration and documentation"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Built with modern web technologies for instant loading and smooth editing"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "Your notes are secured with authentication and only you can access them"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900">DevNotes</h1>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <Link to="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button>Get Started</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-slate-900 mb-6">
            The Perfect Note-Taking App for{" "}
            <span className="text-blue-600">Developers</span>
          </h2>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Write, organize, and share your code documentation, project notes, and technical thoughts 
            with powerful Markdown support, syntax highlighting, and seamless collaboration features.
          </p>
          <div className="flex items-center justify-center space-x-4">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="text-lg px-8 py-3">
                  Open Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button size="lg" className="text-lg px-8 py-3">
                    Start Writing
                  </Button>
                </Link>
                <Link to="/public/demo">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                    View Demo
                  </Button>
                </Link>
              </>
            )}
          </div>
          <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-slate-500">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">Free</Badge>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">Open Source</Badge>
              <span>Built with modern tech</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-slate-900 mb-4">
            Everything You Need for Developer Notes
          </h3>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            DevNotes combines the simplicity of Markdown with powerful features 
            designed specifically for developers and technical writers.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="text-blue-600">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-16">
        <Card className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold mb-4">
              Ready to Transform Your Note-Taking?
            </CardTitle>
            <CardDescription className="text-blue-100 text-lg">
              Join developers who are already using DevNotes to organize their thoughts, 
              document their code, and share their knowledge.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                  Continue to Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                  Get Started for Free
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-slate-200">
        <div className="text-center text-slate-600">
          <p>&copy; 2024 DevNotes. Built with React, TypeScript, and Supabase.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
