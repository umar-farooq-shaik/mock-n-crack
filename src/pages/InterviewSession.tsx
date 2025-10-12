import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Play, Square, Send, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

// Question banks
const questionBanks = {
  hr: [
    "Tell me about yourself",
    "What are your biggest strengths?",
    "Why do you want to join our company?",
    "How do you handle stress or pressure?",
    "Why should we hire you?",
    "Have you faced any failure? What did you learn from it?",
    "Do you prefer working in a team or independently?",
    "Can you share your weakness and explain how you're working to improve it?",
    "What are your salary expectations?",
    "What motivates you at work?",
    "Where do you see yourself in 5 years?",
    "How do you respond to criticism?",
    "Do you have any questions for us?"
  ],
  managerial: [
    "Tell me about some of the projects you’ve worked on and what you contributed",
    "What was the most challenging part of your project?",
    "Tell me about a situation where you worked in a team. What was your role?",
    "What would you do if your task is stuck but the deadline is close?",
    "How do you handle conflicts within a team?",
    "How do you handle feedback?",
    "What value will you bring to our team?",
    "How do you handle deadlines?",
    "Can you share an example of a time you faced a challenging situation and how you overcame it?",
    "What are your long-term career goals?"
  ],
  technical: {
    "ReactJS": [
      "What is JSX?",
      "What is a hook in React?",
      "How does useEffect work?",
      "What is the virtual DOM?",
      "What are props in React?"
    ],
    "JavaScript": [
      "Explain closures in JavaScript.",
      "What is the difference between let, const, and var?",
      "How does async/await work?",
      "What is event delegation?",
      "Explain the this keyword in JavaScript."
    ],
    "Python": [
      "What are Python decorators?",
      "Explain list comprehensions.",
      "What is the difference between lists and tuples?",
      "How does Python's GIL work?",
      "What are Python generators?"
    ]
  }
};

export default function InterviewSession() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, tokens, updateTokens, signInWithGoogle } = useAuth();

  const [interviewType, setInterviewType] = useState(searchParams.get("type") || "technical");
  const [topic, setTopic] = useState("");

  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam && ["technical", "hr", "managerial"].includes(typeParam)) {
      setInterviewType(typeParam);
      setSessionStarted(false);
      setSessionCompleted(false);
      setCurrentQuestion(0);
      setQuestions([]);
      setAnswers([]);
      setCurrentAnswer("");
    }
  }, [searchParams]);

  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState("");

  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setCurrentAnswer(prev => prev + ' ' + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        setIsListening(false);
        toast({ title: "Speech Recognition Error", description: "Please try again or check microphone permissions.", variant: "destructive" });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [toast]);

  const generateQuestions = () => {
    let selectedQuestions: string[] = [];
    if (interviewType === "hr") {
      selectedQuestions = [...questionBanks.hr];
    } else if (interviewType === "managerial") {
      selectedQuestions = [...questionBanks.managerial];
    } else {
      return [];
    }
    const shuffled = selectedQuestions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  };

  const getNextTechnicalQuestion = async (): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-question', {
        body: { topic }
      });
      
      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to generate question');
      }
      
      if (data?.error) {
        console.error('API error response:', data.error);
        throw new Error(data.error);
      }
      
      if (!data?.question) {
        console.error('No question in response:', data);
        throw new Error('No question received from server');
      }
      
      // Update token balance if provided
      if (data.newBalance !== undefined) {
        const tokenChange = data.newBalance - tokens;
        if (tokenChange !== 0) {
          updateTokens(tokenChange);
        }
      }
      
      return data.question;
    } catch (error) {
      console.error('Failed to get technical question:', error);
      throw error instanceof Error ? error : new Error('Failed to generate question');
    }
  };

  const speakQuestion = (question: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(question);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      const voices = speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => voice.name.includes('Female') || voice.name.includes('Samantha') || voice.name.includes('Victoria') || voice.name.toLowerCase().includes('female'));
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      utterance.onend = () => setIsSpeaking(false);
      synthesisRef.current = utterance;
      speechSynthesis.speak(utterance);
    }
  };

  const startSession = async () => {
    if (interviewType === "technical" && !topic.trim()) {
      toast({ title: "Topic Required", description: "Please enter a topic for the technical interview.", variant: "destructive" });
      return;
    }

    if (!user) {
      toast({ title: "Authentication Required", description: "Please sign in to start an interview.", variant: "destructive" });
      return;
    }

    setSessionStarted(true);
    setCurrentQuestion(0);
    setAnswers([]);

    if (interviewType === "technical") {
      setQuestions([]);
      try {
        const firstQuestion = await getNextTechnicalQuestion();
        setQuestions([firstQuestion]);
        setTimeout(() => speakQuestion(firstQuestion), 1000);
      } catch (error) {
        console.error('Error starting technical interview:', error);
        toast({ 
          title: "Error Loading Question", 
          description: error instanceof Error ? error.message : "Failed to load the first question. Please try again.",
          variant: "destructive" 
        });
        setSessionStarted(false);
      }
    } else {
      const sessionQuestions = generateQuestions();
      setQuestions(sessionQuestions);
      
      // Deduct token before showing first question
      try {
        await updateTokens(-1);
        setTimeout(() => speakQuestion(sessionQuestions[0]), 1000);
      } catch (error) {
        toast({ title: "Token Update Failed", description: "Unable to start session. Please check your token balance.", variant: "destructive" });
        setSessionStarted(false);
      }
    }
  };

  const handleStartInterview = () => {
    if (!user) {
      signInWithGoogle();
    } else {
      if (tokens < 5) {
        toast({
          title: "Insufficient Tokens",
          description: "You need at least 5 tokens to start a session.",
          variant: "destructive"
        });
        return;
      }
      startSession();
    }
  }

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast({ title: "Speech Recognition Not Available", description: "Your browser doesn't support speech recognition.", variant: "destructive" });
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setCurrentAnswer("");
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const submitAnswer = async () => {
    if (!currentAnswer.trim()) {
      toast({ title: "No Answer Recorded", description: "Please record an answer before submitting.", variant: "destructive" });
      return;
    }
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    const newAnswers = [...answers, currentAnswer.trim()];
    setAnswers(newAnswers);
    setCurrentAnswer("");

    if (currentQuestion >= 4) {
      setSessionCompleted(true);
      
      // Save session to database instead of localStorage
      if (user) {
        try {
          await supabase.from('interview_sessions').insert({
            user_id: user.id,
            interview_type: interviewType,
            topic: interviewType === "technical" ? topic : null,
            questions: questions,
            answers: newAnswers,
            status: "completed",
            completed_at: new Date().toISOString()
          });
          
          toast({ 
            title: "Session Completed!", 
            description: "Your interview session has been saved securely." 
          });
        } catch (error) {
          console.error('Failed to save session:', error);
          toast({ 
            title: "Session Completed", 
            description: "Note: Session could not be saved to your account.",
            variant: "destructive"
          });
        }
      }
    } else {
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);
      if (interviewType === "technical") {
        try {
          const nextQuestionText = await getNextTechnicalQuestion();
          setQuestions(prev => [...prev, nextQuestionText]);
          setTimeout(() => speakQuestion(nextQuestionText), 1000);
        } catch (error) {
          toast({ title: "Error Loading Next Question", description: "Failed to load the next question. Please try again.", variant: "destructive" });
        }
      } else {
        // Deduct token before showing next question
        try {
          await updateTokens(-1);
          setTimeout(() => speakQuestion(questions[nextQuestion]), 1000);
        } catch (error) {
          toast({ title: "Token Update Failed", description: "Unable to continue. Please check your token balance.", variant: "destructive" });
        }
      }
    }
  };

  const restartSession = () => {
    setSessionStarted(false);
    setSessionCompleted(false);
    setCurrentQuestion(0);
    setQuestions([]);
    setAnswers([]);
    setCurrentAnswer("");
  };

  if (sessionCompleted) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-accent-green">Session Completed! 🎉</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-lg text-foreground/70 mb-4">
                  Great job! You've completed your {interviewType} interview session.
                </p>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  5 Questions Answered
                </Badge>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Your Answers:</h3>
                {answers.map((answer, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <p className="font-medium text-sm text-foreground/60 mb-2">
                      Q{index + 1}: {questions[index]}
                    </p>
                    <p className="text-foreground">{answer}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 justify-center">
                <Button onClick={restartSession} variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  New Session
                </Button>
                <Button onClick={() => navigate("/")} className="bg-accent-green hover:bg-accent-green/90">
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {!sessionStarted ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Start Interview Session</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="interview-type">Interview Type</Label>
                <Select value={interviewType} onValueChange={setInterviewType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select interview type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical Interview</SelectItem>
                    <SelectItem value="hr">HR Interview</SelectItem>
                    <SelectItem value="managerial">Managerial Interview</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {interviewType === "technical" && (
                <div className="space-y-2">
                  <Label htmlFor="topic">Enter Topic for Technical Interview</Label>
                  <Input
                    placeholder="e.g., ReactJS, Python, REST APIs, System Design"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="text-base"
                  />
                </div>
              )}

              {user && (
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Available Tokens:</span>
                    <Badge variant={tokens < 5 ? "destructive" : "default"}>
                      {tokens.toLocaleString()}
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground/60">
                    This session will use 5 tokens (1 per question)
                  </p>
                </div>
              )}

              <Button
                onClick={handleStartInterview}
                disabled={user && tokens < 5}
                className={`w-full ${interviewType === "managerial"
                  ? "bg-accent-orange hover:bg-accent-orange/90 text-accent-orange-foreground"
                  : ""
                  }`}
                size="lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Start {interviewType.charAt(0).toUpperCase() + interviewType.slice(1)} Interview
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {interviewType.charAt(0).toUpperCase() + interviewType.slice(1)} Interview
                    </h2>
                    {interviewType === "technical" && (
                      <p className="text-foreground/60">Topic: {topic}</p>
                    )}
                  </div>
                  <Badge variant="outline">
                    Question {currentQuestion + 1} of 5
                  </Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / 5) * 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Current Question</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg mb-4">
                  <p className="text-lg">{questions[currentQuestion]}</p>
                </div>
                {isSpeaking && (
                  <div className="flex items-center text-primary mb-4">
                    <div className="animate-pulse w-2 h-2 bg-primary rounded-full mr-2" />
                    <span className="text-sm">Speaking question...</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Answer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg min-h-[100px]">
                  {currentAnswer || (
                    <span className="text-foreground/50">
                      Click the microphone to start recording your answer...
                    </span>
                  )}
                </div>
                <div className="flex gap-4">
                  <Button
                    onClick={toggleListening}
                    variant={isListening ? "destructive" : "default"}
                    size="lg"
                    className="flex-1"
                  >
                    {isListening ? (
                      <>
                        <Square className="w-5 h-5 mr-2" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5 mr-2" />
                        Start Recording
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={submitAnswer}
                    disabled={!currentAnswer.trim()}
                    className="bg-accent-green hover:bg-accent-green/90"
                    size="lg"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Submit Answer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
