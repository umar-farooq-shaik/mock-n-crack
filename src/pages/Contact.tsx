import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you within 24 hours.",
    });

    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-6">
            Get in Touch
          </Badge>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Contact <span className="text-primary">MockNCrack</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground/70 mb-8 max-w-2xl mx-auto">
            Have questions about our voice-powered interview platform? We're here to help you crack your next interview.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-primary" />
                  Contact Information
                </CardTitle>
                <CardDescription>
                  Reach out to us through any of these channels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-accent-green mt-0.5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-foreground/70">support@mockNCrack.com</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-accent-green mt-0.5" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-foreground/70">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-accent-green mt-0.5" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-foreground/70">
                      123 Tech Street<br />
                      San Francisco, CA 94102
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-accent-green mt-0.5" />
                  <div>
                    <p className="font-medium">Business Hours</p>
                    <p className="text-sm text-foreground/70">
                      Mon - Fri: 9:00 AM - 6:00 PM PST<br />
                      Weekend: 10:00 AM - 4:00 PM PST
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <UserCheck className="w-5 h-5 mr-2 text-accent-green" />
                  Response Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Email Support</span>
                      <span className="text-sm text-accent-green">&lt; 24 hours</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-accent-green h-2 rounded-full w-[95%]"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Technical Issues</span>
                      <span className="text-sm text-primary">&lt; 4 hours</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full w-[98%]"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">General Inquiries</span>
                      <span className="text-sm text-accent-orange">&lt; 48 hours</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-accent-orange h-2 rounded-full w-[90%]"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What is this message about?"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help you..."
                      rows={6}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-8"
                    size="lg"
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-foreground/70">
              Quick answers to common questions about MockNCrack
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How does the voice recognition work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/70">
                  MockNCrack uses your browser's built-in speech recognition API to convert your spoken answers into text. No additional software installation required.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What browsers are supported?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/70">
                  We support Chrome, Edge, Safari, and other modern browsers that have speech recognition capabilities built-in.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How are tokens consumed?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/70">
                  Each interview session uses 5 tokens (1 per question). Technical interviews with AI-generated questions may consume additional tokens.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is my data secure?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/70">
                  Yes! Your interview sessions are stored locally in your browser. We don't store your personal interview responses on our servers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}