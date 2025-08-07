import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">😵</span>
          </div>
          <CardTitle className="text-3xl font-bold">404</CardTitle>
          <p className="text-foreground/70">Page not found</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground/60">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/" className="flex-1">
              <Button className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
