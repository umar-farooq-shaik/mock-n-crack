import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
export function Footer() {
  return <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-accent-green">MockNCrack</h3>
            <p className="text-sm text-muted-foreground">
              AI-powered voice interviews to help you crack your next job interview.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/how-it-works" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                How It Works
              </Link>
              <Link to="/pricing" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link to="/contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Interview Types */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Interview Types</h4>
            <div className="space-y-2">
              <Link to="/interview?type=technical" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Technical Interview
              </Link>
              <Link to="/interview?type=hr" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                HR Interview
              </Link>
              <Link to="/interview?type=managerial" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Managerial Interview
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Support</h4>
            <div className="space-y-2">
              <Link to="/buy-tokens" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Buy Tokens
              </Link>
              <a href="mailto:support@mockNcrack.com" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact Support
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">© 2025 MockNCrack. All rights reserved.</p>
            <p className="text-sm text-muted-foreground flex items-center">
              Made with <Heart className="w-4 h-4 mx-1 text-red-500" /> for job seekers
            </p>
          </div>
        </div>
      </div>
    </footer>;
}