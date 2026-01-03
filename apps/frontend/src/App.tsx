import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
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
import SignUpPage from "./pages/SignupPage";
import SignInPage from './pages/SigninPage';

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
          <Route path="/signup"  element={<SignUpPage/>}/>
          <Route path="/signin" element={<SignInPage/>}/>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </ThemeProvider>
    </QueryClientProvider>
    
  )
}

export default App
