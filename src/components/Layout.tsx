import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChart, Brain } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}
type RouteTitle = {
  [key: string]: string;
};

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  // find the current route
  const currentRoute = window.location.pathname;
  // map the current route to a title
  const routeToTitle : RouteTitle = {
    "/": "Brainwell",
    "/brain-map": "Brain Map",
    "/brain-region/ACC": "Anterior Cingulate Cortex",
    "/brain-region/PFC": "Prefrontal Cortex",
    "/brain-region/Hippocampus": "Hippocampus",
    "/brain-region/Amygdala": "Amygdala",
    "/stats": "Statistics",
    "/charts": "Analytics"
  }
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
  <div className="container mx-auto px-4 h-16 relative flex items-center">
    
    {/* Left: Back button */}
    <Button
      variant="ghost"
      size="sm"
      onClick={() => navigate(-1)}
      className="flex items-center text-muted-foreground hover:text-foreground transition-colors -ml-2 z-10"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mr-2 h-4 w-4"
      >
        <path d="m15 18-6-6 6-6" />
      </svg>
      Back
    </Button>

    {/* Center: Title */}
    <div className="absolute left-1/2 -translate-x-1/2 font-semibold text-lg text-primary/70">
      {routeToTitle[currentRoute]}
    </div>

    {/* Right: Button to go to Charts */}
    <div className="absolute right-4 flex flex-row">
      {!currentRoute.startsWith("/charts") &&
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center text-muted-foreground hover:text-foreground transition-colors z-10"
        onClick={() => navigate("/charts")}
      >
        <BarChart className="h-4 w-4" />
      </Button>
      }
      {!currentRoute.startsWith("/brain-map") && 
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center text-muted-foreground hover:text-foreground transition-colors z-10"
        onClick={() => navigate("/brain-map")}
      >
        <Brain className="h-4 w-4" />
      </Button>
    }
    </div>
  </div>
</header>
      
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;
