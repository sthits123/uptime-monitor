import { ThemeProvider } from "./components/ui/theme-provider"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster  } from "./components/ui/sonner";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Monitors from "./pages/Monitors";
import Incidents from "./pages/Incidents";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Status from "./pages/Status";
import {TooltipProvider } from "@radix-ui/react-tooltip";

function App() {
  return (
    <ThemeProvider>
     <TooltipProvider>
      <Toaster />
      
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/monitors" element={<Monitors />} />
          <Route path="/incidents" element={<Incidents />} />
          <Route path="/status" element={<Status />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </ThemeProvider>
    
    
  )
}

export default App
