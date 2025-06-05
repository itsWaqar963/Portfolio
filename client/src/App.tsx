import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import { ThemeProvider } from "@/lib/theme";
import { useEffect } from "react";
import { initGA } from "./lib/analytics";
import { useAnalytics } from "./hooks/use-analytics";
import { Analytics } from "@vercel/analytics/react";

function Router() {
  // Track page views when routes change
  useAnalytics();
  
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Initialize Google Analytics when app loads
  useEffect(() => {
    // Verify required environment variable is present
    if (!import.meta.env.VITE_GA_MEASUREMENT_ID) {
      console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    } else {
      initGA();
      console.log('Google Analytics initialized with ID:', import.meta.env.VITE_GA_MEASUREMENT_ID);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <Router />
        <Toaster />
        <Analytics />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
