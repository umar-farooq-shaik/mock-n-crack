import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Footer } from "@/components/Footer";
import Home from "./pages/Home";
import InterviewSession from "./pages/InterviewSession";
import HowItWorks from "./pages/HowItWorks";
import Pricing from "./pages/Pricing";
import BuyTokens from "./pages/BuyTokens";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/interview" element={<InterviewSession />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/buy-tokens" element={<BuyTokens />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
