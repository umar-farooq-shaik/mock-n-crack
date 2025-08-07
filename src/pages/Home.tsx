import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Users, Code, Briefcase, ArrowRight, CheckCircle, Star, Clock } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-6">
            Voice-Powered Mock Interviews
          </Badge>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            Crack Interviews with{" "}
            <span className="text-primary">Voice-Powered</span>{" "}
            Mock Sessions
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground/70 mb-8 max-w-2xl mx-auto">
            Just speak. Get better. Practice HR, Technical, and Managerial interviews.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/interview" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-xl">
                <Mic className="w-5 h-5 mr-2" />
                Start Session
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            
            <Link to="/how-it-works" className="w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto text-lg px-8 py-6 rounded-xl border-2"
              >
                How It Works
              </Button>
            </Link>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8 text-sm text-foreground/60">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent-green" />
              <span>5 Questions Per Session</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-accent-green" />
              <span>Voice-Based Feedback</span>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="mt-12">
            <img 
              src={heroImage} 
              alt="MockNCrack - Voice-powered interview practice platform" 
              className="w-full max-w-4xl mx-auto rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Interview Types Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Choose Your Interview Type
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Practice different interview scenarios with our voice-powered platform. Each session includes 5 carefully crafted questions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Technical Interview */}
          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Technical Interview</CardTitle>
              <CardDescription>
                Topic-based questions with pre-added content and AI-generated questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-foreground/70">
                  <CheckCircle className="w-4 h-4 text-accent-green mr-2" />
                  <span>ReactJS, JavaScript, Python, and more</span>
                </div>
                <div className="flex items-center text-sm text-foreground/70">
                  <CheckCircle className="w-4 h-4 text-accent-green mr-2" />
                  <span>AI-generated questions via Gemini</span>
                </div>
                <div className="flex items-center text-sm text-foreground/70">
                  <CheckCircle className="w-4 h-4 text-accent-green mr-2" />
                  <span>Custom topic input</span>
                </div>
              </div>
              
              <Link to="/interview?type=technical">
                <Button className="w-full rounded-xl">
                  Start Technical Interview
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* HR Interview */}
          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-accent-green/10 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-accent-green" />
              </div>
              <CardTitle className="text-xl">HR Interview</CardTitle>
              <CardDescription>
                Common HR questions to help you prepare for behavioral interviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-foreground/70">
                  <CheckCircle className="w-4 h-4 text-accent-green mr-2" />
                  <span>"Tell me about yourself"</span>
                </div>
                <div className="flex items-center text-sm text-foreground/70">
                  <CheckCircle className="w-4 h-4 text-accent-green mr-2" />
                  <span>Strengths and weaknesses</span>
                </div>
                <div className="flex items-center text-sm text-foreground/70">
                  <CheckCircle className="w-4 h-4 text-accent-green mr-2" />
                  <span>Behavioral questions</span>
                </div>
              </div>
              
              <Link to="/interview?type=hr">
                <Button 
                  className="w-full rounded-xl bg-accent-green hover:bg-accent-green/90 text-accent-green-foreground"
                >
                  Start HR Interview
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Managerial Interview */}
          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-orange-500" />
              </div>
              <CardTitle className="text-xl">Managerial Interview</CardTitle>
              <CardDescription>
                Leadership and management scenarios for senior positions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-foreground/70">
                  <CheckCircle className="w-4 h-4 text-accent-green mr-2" />
                  <span>Leadership style questions</span>
                </div>
                <div className="flex items-center text-sm text-foreground/70">
                  <CheckCircle className="w-4 h-4 text-accent-green mr-2" />
                  <span>Team management scenarios</span>
                </div>
                <div className="flex items-center text-sm text-foreground/70">
                  <CheckCircle className="w-4 h-4 text-accent-green mr-2" />
                  <span>Conflict resolution</span>
                </div>
              </div>
              
              <Link to="/interview?type=managerial">
                <Button 
                  variant="outline" 
                  className="w-full rounded-xl bg-orange-500 text-white border-orange-500 hover:bg-orange-600"
                >
                  Start Managerial Interview
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Preview */}
      <section className="container mx-auto px-4 py-16 bg-muted/30">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-foreground/70">
            Simple 3-step process to improve your interview skills
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-foreground">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Select Interview Type</h3>
            <p className="text-foreground/70">Choose from Technical, HR, or Managerial interviews</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-accent-green rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-accent-green-foreground">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Speak Your Answers</h3>
            <p className="text-foreground/70">Use voice recognition to answer questions naturally</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Complete Session</h3>
            <p className="text-foreground/70">Finish 5 questions and review your performance</p>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link to="/how-it-works">
            <Button variant="outline" size="lg" className="rounded-xl">
              Learn More
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}