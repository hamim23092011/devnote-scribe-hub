
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Lock, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">DevNotes</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/public-notes')}
              className="flex items-center space-x-2"
            >
              <Globe className="w-4 h-4" />
              <span>Public Notes</span>
            </Button>
            
            {user ? (
              <Button onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
            ) : (
              <Button onClick={() => navigate('/auth')}>
                Get Started
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Your Digital Notebook for
            <span className="text-blue-600 block">Development Notes</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Capture ideas, document solutions, and organize your development knowledge 
            with powerful markdown support and seamless organization.
          </p>
          
          <div className="flex items-center justify-center space-x-4">
            {user ? (
              <Button 
                size="lg" 
                onClick={() => navigate('/dashboard')}
                className="text-lg px-8 py-3"
              >
                Open Your Notes
              </Button>
            ) : (
              <Button 
                size="lg" 
                onClick={() => navigate('/auth')}
                className="text-lg px-8 py-3"
              >
                Start Taking Notes
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/public-notes')}
              className="text-lg px-8 py-3"
            >
              Browse Public Notes
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Rich Markdown Editor</CardTitle>
              <CardDescription>
                Write beautiful notes with full markdown support, code syntax highlighting, and live preview
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Lock className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Private & Secure</CardTitle>
              <CardDescription>
                Your notes are private by default, with the option to make selected notes public for sharing
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Share Knowledge</CardTitle>
              <CardDescription>
                Make notes public to share knowledge with the community and help other developers
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <Card className="max-w-2xl mx-auto bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-3xl">Ready to get organized?</CardTitle>
              <CardDescription className="text-lg">
                Join thousands of developers who use DevNotes to keep their ideas and solutions organized.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user ? (
                <Button 
                  size="lg" 
                  onClick={() => navigate('/dashboard')}
                  className="text-lg px-8 py-3"
                >
                  Go to Your Dashboard
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  onClick={() => navigate('/auth')}
                  className="text-lg px-8 py-3"
                >
                  Create Your First Note
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
