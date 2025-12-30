import { Button } from "@/components/ui/button"
import { Activity } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20 transition-transform hover:scale-105">
              <Activity className="h-5 w-5 text-primary-foreground" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              UptimeMonitor
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <a 
              href="#features" 
              className="relative px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground rounded-md hover:bg-accent/50 group"
            >
              Features
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </a>
            <a 
              href="#integrations" 
              className="relative px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground rounded-md hover:bg-accent/50 group"
            >
              Integrations
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </a>
            <a 
              href="#pricing" 
              className="relative px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground rounded-md hover:bg-accent/50 group"
            >
              Pricing
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </a>
            <a 
              href="#docs" 
              className="relative px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground rounded-md hover:bg-accent/50 group"
            >
              Docs
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all"
            >
              Sign in
            </Button>
            <Button 
              size="sm" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all hover:scale-105 font-medium"
            >
              Start Free Trial
            </Button>
            
          
            
          </div>
        </div>
      </div>
    </header>
  )
}
