import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MessageSquare, CheckCircle, ArrowRight, Play, Volume2, Users, Code, Briefcase } from "lucide-react";
export default function HowItWorks() {
  return <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge variant="secondary" className="mb-6">
          Voice-Powered Interview Practice
        </Badge>
        
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          How MockNCrack Works
        </h1>
        
        <p className="text-xl text-foreground/70 mb-8 max-w-3xl mx-auto">
          Our simple 3-step process helps you practice interviews naturally using voice technology. 
          No typing required - just speak your way to success.
        </p>
      </section>

      {/* Main Steps */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Step 1 */}
            <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-foreground">1</span>
                </div>
                <CardTitle className="text-xl">Choose Interview Type</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-foreground/70 mb-6">
                  Select from three interview categories based on your goals
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Code className="w-5 h-5 text-primary" />
                    <span className="font-medium">Technical</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Users className="w-5 h-5 text-accent-green" />
                    <span className="font-medium">HR & Behavioral</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Briefcase className="w-5 h-5 text-orange-500" />
                    <span className="font-medium">Managerial</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="relative overflow-hidden border-2 hover:border-accent-green/50 transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-accent-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-accent-green-foreground">2</span>
                </div>
                <CardTitle className="text-xl">Speak Your Answers</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-foreground/70 mb-6">
                  Use voice recognition to answer questions naturally and conversationally
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Volume2 className="w-5 h-5 text-primary" />
                    <span className="font-medium">AI reads questions</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Mic className="w-5 h-5 text-accent-green" />
                    <span className="font-medium">You speak answers</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <MessageSquare className="w-5 h-5 text-orange-500" />
                    <span className="font-medium">Speech to text</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="relative overflow-hidden border-2 hover:border-orange-500/50 transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <CardTitle className="text-xl">Complete Session</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-foreground/70 mb-6">
                  Answer 5 questions and review your responses for improvement
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <CheckCircle className="w-5 h-5 text-accent-green" />
                    <span className="font-medium">5 questions total</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <CheckCircle className="w-5 h-5 text-accent-green" />
                    <span className="font-medium">Answers saved</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <CheckCircle className="w-5 h-5 text-accent-green" />
                    <span className="font-medium">Review performance</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Detailed Features */}
      <section className="container mx-auto px-4 py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Key Features
            </h2>
            <p className="text-lg text-foreground/70">
              Everything you need for effective interview practice
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mic className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Voice Recognition</h3>
                  <p className="text-foreground/70">
                    Advanced speech-to-text technology captures your answers accurately, 
                    making practice feel natural and conversational.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-accent-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Volume2 className="w-6 h-6 text-accent-green" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">AI Voice Questions</h3>
                  <p className="text-foreground/70">
                    Questions are read aloud by a natural-sounding female voice, 
                    simulating real interview conditions.
                  </p>
                </div>
              </div>

              
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Code className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">AI-Generated Questions</h3>
                  <p className="text-foreground/70">
                    For technical interviews, Gemini AI generates relevant questions 
                    when pre-made questions are exhausted.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-accent-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-accent-green" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Session History</h3>
                  <p className="text-foreground/70">
                    All your practice sessions are saved locally, allowing you to 
                    review answers and track your progress over time.
                  </p>
                </div>
              </div>

              
            </div>
          </div>
        </div>
      </section>

      {/* Question Types */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Question Categories
          </h2>
          <p className="text-lg text-foreground/70">
            Practice with carefully curated questions for each interview type
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          <Card className="border-2">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Technical Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-foreground/70 mb-4">
                  Deep technical questions on programming languages, frameworks, and concepts.
                </p>
                <div className="space-y-2">
                  <div className="text-sm bg-muted p-2 rounded">
                    "What is the virtual DOM in React?"
                  </div>
                  <div className="text-sm bg-muted p-2 rounded">
                    "Explain closures in JavaScript"
                  </div>
                  <div className="text-sm bg-muted p-2 rounded">
                    "What are Python decorators?"
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <div className="w-12 h-12 bg-accent-green/10 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-accent-green" />
              </div>
              <CardTitle>HR Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-foreground/70 mb-4">
                  Behavioral and personality questions commonly asked by HR teams.
                </p>
                <div className="space-y-2">
                  <div className="text-sm bg-muted p-2 rounded">
                    "Tell me about yourself"
                  </div>
                  <div className="text-sm bg-muted p-2 rounded">
                    "What are your strengths?"
                  </div>
                  <div className="text-sm bg-muted p-2 rounded">
                    "Why should we hire you?"
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-orange-500" />
              </div>
              <CardTitle>Managerial Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-foreground/70 mb-4">
                  Leadership and management scenarios for senior-level positions.
                </p>
                <div className="space-y-2">
                  <div className="text-sm bg-muted p-2 rounded">
                    "Describe your leadership style"
                  </div>
                  <div className="text-sm bg-muted p-2 rounded">
                    "How do you manage team conflict?"
                  </div>
                  <div className="text-sm bg-muted p-2 rounded">
                    "How do you ensure accountability?"
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Start Practicing?
          </h2>
          <p className="text-lg text-foreground/70 mb-8">
            Join thousands of job seekers who have improved their interview skills with MockNCrack.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/interview" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-xl">
                <Play className="w-5 h-5 mr-2" />
                Start Your First Session
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            
            <Link to="/pricing" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-xl border-2">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>;
}