import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Moon, Sun, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navigation = () => {
  const [isDark, setIsDark] = useState(false);
  const [tokens, setTokens] = useState(10000);
  const location = useLocation();

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }

    // Load tokens from localStorage
    const savedTokens = localStorage.getItem("mockNCrackTokens");
    if (savedTokens) {
      setTokens(parseInt(savedTokens));
    }

    // Listen for token updates
    const handleTokenUpdate = (event: CustomEvent) => {
      setTokens(event.detail);
    };
    
    window.addEventListener('tokensUpdated', handleTokenUpdate as EventListener);
    
    return () => {
      window.removeEventListener('tokensUpdated', handleTokenUpdate as EventListener);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <Mic className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">MockNCrack</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`font-medium transition-colors hover:text-primary ${
                isActive("/") ? "text-primary" : "text-foreground/80"
              }`}
            >
              Home
            </Link>
            <Link 
              to="/how-it-works" 
              className={`font-medium transition-colors hover:text-primary ${
                isActive("/how-it-works") ? "text-primary" : "text-foreground/80"
              }`}
            >
              How It Works
            </Link>
            <Link 
              to="/pricing" 
              className={`font-medium transition-colors hover:text-primary ${
                isActive("/pricing") ? "text-primary" : "text-foreground/80"
              }`}
            >
              Pricing
            </Link>
            <Link 
              to="/contact" 
              className={`font-medium transition-colors hover:text-primary ${
                isActive("/contact") ? "text-primary" : "text-foreground/80"
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Token Display */}
            <div className="hidden sm:flex items-center space-x-2 text-sm">
              <span className="text-foreground/60">Tokens:</span>
              <span className="font-semibold text-accent-green">{tokens.toLocaleString()}</span>
            </div>

            {/* Buy Tokens Button */}
            <Link to="/buy-tokens">
              <Button 
                variant="outline" 
                size="sm"
                className="border-accent-green text-accent-green hover:bg-accent-green hover:text-accent-green-foreground"
              >
                Buy Tokens
              </Button>
            </Link>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-9 h-9 p-0"
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden py-3 border-t">
          <div className="grid grid-cols-2 gap-4 mb-3">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-primary py-2 px-3 rounded-lg text-center ${
                isActive("/") ? "text-primary bg-primary/10" : "text-foreground/80"
              }`}
            >
              Home
            </Link>
            <Link 
              to="/how-it-works" 
              className={`text-sm font-medium transition-colors hover:text-primary py-2 px-3 rounded-lg text-center ${
                isActive("/how-it-works") ? "text-primary bg-primary/10" : "text-foreground/80"
              }`}
            >
              How It Works
            </Link>
            <Link 
              to="/pricing" 
              className={`text-sm font-medium transition-colors hover:text-primary py-2 px-3 rounded-lg text-center ${
                isActive("/pricing") ? "text-primary bg-primary/10" : "text-foreground/80"
              }`}
            >
              Pricing
            </Link>
            <Link 
              to="/contact" 
              className={`text-sm font-medium transition-colors hover:text-primary py-2 px-3 rounded-lg text-center ${
                isActive("/contact") ? "text-primary bg-primary/10" : "text-foreground/80"
              }`}
            >
              Contact
            </Link>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-sm bg-muted/50 rounded-lg py-2">
            <span className="text-foreground/60">Tokens:</span>
            <span className="font-semibold text-accent-green">{tokens.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};