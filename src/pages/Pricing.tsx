import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, Zap, Shield, ArrowRight } from "lucide-react";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge variant="secondary" className="mb-6">
          Simple & Affordable Pricing
        </Badge>
        
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          Start Free, Pay as You Practice
        </h1>
        
        <p className="text-xl text-foreground/70 mb-8 max-w-3xl mx-auto">
          Begin with 10,000 free tokens and purchase more as needed. 
          No subscriptions, no hidden fees - just straightforward pricing.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          
          {/* Free Starter */}
          <Card className="relative border-2 hover:border-primary/50 transition-all duration-300">
            <CardHeader className="text-center pb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl mb-2">Free Starter</CardTitle>
              <div className="text-4xl font-bold text-foreground mb-2">
                ₹0
              </div>
              <p className="text-foreground/60">Get started for free</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent-green" />
                  <span>10,000 free tokens</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent-green" />
                  <span>2,000 practice sessions</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent-green" />
                  <span>All interview types</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent-green" />
                  <span>Voice recognition</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent-green" />
                  <span>Session history</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent-green" />
                  <span>No sign-up required</span>
                </div>
              </div>

              <Link to="/interview">
                <Button className="w-full rounded-xl" size="lg">
                  Start Free Session
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Token Pack */}
          <Card className="relative border-2 border-accent-green hover:border-accent-green/70 transition-all duration-300 scale-105">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Badge className="bg-accent-green text-accent-green-foreground px-4 py-1">
                Most Popular
              </Badge>
            </div>
            
            <CardHeader className="text-center pb-8 pt-8">
              <div className="w-16 h-16 bg-accent-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-accent-green" />
              </div>
              <CardTitle className="text-2xl mb-2">Token Pack</CardTitle>
              <div className="text-4xl font-bold text-foreground mb-2">
                ₹100
              </div>
              <p className="text-foreground/60">100 additional tokens</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent-green" />
                  <span>100 tokens (20 sessions)</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent-green" />
                  <span>₹1 per token (₹5 per session)</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent-green" />
                  <span>All free features included</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent-green" />
                  <span>Instant token delivery</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent-green" />
                  <span>Secure UPI payments</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent-green" />
                  <span>No expiry date</span>
                </div>
              </div>

              <Link to="/buy-tokens">
                <Button 
                  className="w-full rounded-xl bg-accent-green hover:bg-accent-green/90" 
                  size="lg"
                >
                  Buy Token Pack
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Enterprise */}
          <Card className="relative border-2 hover:border-orange-500/50 transition-all duration-300">
            <CardHeader className="text-center pb-8">
              <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-orange-500" />
              </div>
              <CardTitle className="text-2xl mb-2">Enterprise</CardTitle>
              <div className="text-4xl font-bold text-foreground mb-2">
                Custom
              </div>
              <p className="text-foreground/60">For teams & organizations</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent-green" />
                  <span>Bulk token purchases</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent-green" />
                  <span>Custom question banks</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent-green" />
                  <span>Team analytics</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent-green" />
                  <span>Priority support</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent-green" />
                  <span>API access</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent-green" />
                  <span>Custom integrations</span>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full rounded-xl border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white" 
                size="lg"
              >
                Contact Sales
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Token Usage Explanation */}
      <section className="container mx-auto px-4 py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How Tokens Work
            </h2>
            <p className="text-lg text-foreground/70">
              Understanding our simple token-based pricing system
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  Token = 1 Question
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/70">
                  Each question in an interview session costs 1 token. 
                  Since every session has 5 questions, you'll use 5 tokens per complete session.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-accent-green/10 rounded-lg flex items-center justify-center">
                    <span className="text-accent-green font-bold">∞</span>
                  </div>
                  Tokens Never Expire
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/70">
                  Purchase tokens once and use them whenever you want. 
                  There's no time limit or expiry date on your token balance.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-orange-500" />
                  </div>
                  Fair Usage Policy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/70">
                  Tokens are only deducted when you submit an answer to a question. 
                  If you restart or abandon a session, unused tokens remain in your balance.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  Secure Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/70">
                  All payments are processed securely through UPI. 
                  Tokens are added to your account manually after payment verification.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">How many sessions can I complete with 10,000 free tokens?</h3>
                <p className="text-foreground/70">
                  You can complete 2,000 interview sessions with 10,000 tokens (5 tokens per session). 
                  That's enough practice for most job seekers!
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Do I need to create an account?</h3>
                <p className="text-foreground/70">
                  Yes! You need to create an account. Your tokens and session history 
                  are stored in database.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">How long does it take to receive tokens after payment?</h3>
                <p className="text-foreground/70">
                  Tokens are added manually after we verify your UPI payment. 
                  This typically takes 2-4 hours during business hours.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Can I get a refund if I'm not satisfied?</h3>
                <p className="text-foreground/70">
                  We offer a 7-day money-back guarantee. If you're not satisfied with your purchase, 
                  contact our support team for a full refund.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Start Practicing?
          </h2>
          <p className="text-lg text-foreground/70 mb-8">
            Begin with 10,000 free tokens and start improving your interview skills today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/interview" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-xl">
                Start Free Session
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            
            <Link to="/buy-tokens" className="w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto text-lg px-8 py-6 rounded-xl border-accent-green text-accent-green hover:bg-accent-green hover:text-accent-green-foreground"
              >
                Buy Token Pack
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}