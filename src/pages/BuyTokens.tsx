import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Upload, QrCode, Shield, Clock, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import qrCodeImage from "@/assets/qr-code.png";

export default function BuyTokens() {
  const [formData, setFormData] = useState({
    name: "",
    upiTransactionId: "",
    screenshot: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        screenshot: file
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.upiTransactionId || !formData.screenshot) {
      toast({
        title: "Missing Information",
        description: "Please fill all fields and upload payment screenshot.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Payment Submitted! 🎉",
        description: "Your payment details have been submitted. Tokens will be added within 2-4 hours.",
      });
      
      // Reset form
      setFormData({
        name: "",
        upiTransactionId: "",
        screenshot: null
      });
      
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/pricing" 
            className="inline-flex items-center text-primary hover:text-primary/80 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Pricing
          </Link>
          
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Buy Token Pack
            </h1>
            <p className="text-lg text-foreground/70">
              Get 100 tokens for ₹100 and continue practicing interviews
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Payment Details */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <QrCode className="w-6 h-6 text-primary" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Package Info */}
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Token Pack</span>
                  <Badge className="bg-accent-green text-accent-green-foreground">
                    Most Popular
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-foreground mb-2">₹100</div>
                <div className="text-sm text-foreground/60 space-y-1">
                  <div>• 100 tokens (20 interview sessions)</div>
                  <div>• ₹1 per token, ₹5 per session</div>
                  <div>• Tokens never expire</div>
                </div>
              </div>

              <Separator />

              {/* QR Code */}
              <div className="text-center">
                <div className="max-w-64 mx-auto">
                  <img 
                    src={qrCodeImage} 
                    alt="UPI QR Code for MockNCrack payment" 
                    className="w-full aspect-square rounded-lg border"
                  />
                  <div className="text-center mt-4">
                    <p className="font-medium mb-2">UPI QR Code</p>
                    <p className="text-sm text-foreground/60">
                      Scan this QR code with any UPI app to pay ₹100
                    </p>
                  </div>
                </div>
              </div>

              {/* UPI ID */}
              <div className="text-center">
                <Label className="text-sm text-foreground/60">Or pay directly to UPI ID:</Label>
                <div className="bg-muted p-3 rounded-lg mt-2">
                  <code className="text-lg font-mono">mockcrack@upi</code>
                </div>
                <p className="text-xs text-foreground/60 mt-2">
                  Amount: ₹100 | Reference: Token Pack
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="w-4 h-4 text-accent-green" />
                  <span>Secure UPI payments</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-accent-green" />
                  <span>Tokens added within 2-4 hours</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent-green" />
                  <span>No hidden fees or charges</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Upload className="w-6 h-6 text-accent-green" />
                Submit Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="upiTransactionId">UPI Transaction ID *</Label>
                  <Input
                    id="upiTransactionId"
                    name="upiTransactionId"
                    type="text"
                    placeholder="e.g., 234567890123"
                    value={formData.upiTransactionId}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-xs text-foreground/60">
                    Find this in your UPI app after completing the payment
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="screenshot">Payment Screenshot *</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <input
                      id="screenshot"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="screenshot"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <Upload className="w-8 h-8 text-foreground/40" />
                      <div>
                        <p className="font-medium">
                          {formData.screenshot ? formData.screenshot.name : "Upload Screenshot"}
                        </p>
                        <p className="text-xs text-foreground/60">
                          PNG, JPG up to 10MB
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 text-blue-900 dark:text-blue-100">
                    Payment Instructions:
                  </h4>
                  <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>1. Scan the QR code or pay to the UPI ID above</li>
                    <li>2. Pay exactly ₹100</li>
                    <li>3. Take a screenshot of the successful payment</li>
                    <li>4. Fill this form with your payment details</li>
                    <li>5. Tokens will be added within 2-4 hours</li>
                  </ol>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-accent-green hover:bg-accent-green/90"
                  size="lg"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </div>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Submit Payment Details
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 text-center">
              <div>
                <Shield className="w-8 h-8 text-accent-green mx-auto mb-2" />
                <h3 className="font-medium mb-1">Secure Process</h3>
                <p className="text-sm text-foreground/60">
                  Your payment details are manually verified for security
                </p>
              </div>
              
              <div>
                <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-medium mb-1">Quick Processing</h3>
                <p className="text-sm text-foreground/60">
                  Tokens added within 2-4 hours during business hours
                </p>
              </div>
              
              <div>
                <CheckCircle className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <h3 className="font-medium mb-1">Money Back Guarantee</h3>
                <p className="text-sm text-foreground/60">
                  7-day refund policy if you're not satisfied
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}