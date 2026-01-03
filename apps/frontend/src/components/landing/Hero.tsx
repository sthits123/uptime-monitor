import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-in">
            <Zap className="w-4 h-4" />
            <span>99.99% uptime guarantee</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Monitor your services.
            <br />
            <span className="text-gradient">Get alerted instantly.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            UptimeMonitor monitors your websites, APIs, and servers around the clock. 
            Get instant alerts via SMS, email, Slack, and more when something goes wrong.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Link to="/dashboard">
              <Button variant="hero" size="xl">
                Start monitoring free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Button variant="outline" size="xl">
              View demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span>5 monitors free forever</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span>30-second checks</span>
            </div>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="mt-16 relative animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <div className="glass rounded-2xl p-6 shadow-elevated max-w-5xl mx-auto">
            <div className="bg-card rounded-xl overflow-hidden">
              {/* Mock Dashboard Header */}
              <div className="flex items-center gap-2 p-4 border-b border-border">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <div className="w-3 h-3 rounded-full bg-warning" />
                <div className="w-3 h-3 rounded-full bg-success" />
                <span className="ml-4 text-sm text-muted-foreground">dashboard.UptimeMonitor.io</span>
              </div>
              
              {/* Mock Dashboard Content */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">All Systems Operational</h3>
                    <p className="text-sm text-muted-foreground">12 monitors • 99.98% uptime</p>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-success pulse-dot" />
                </div>
                
                {/* Mock Monitor Bars */}
                <div className="space-y-3">
                  {["api.example.com", "app.example.com", "cdn.example.com"].map((name, i) => (
                    <div key={name} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                      <div className="w-2 h-2 rounded-full bg-success" />
                      <span className="text-sm font-medium flex-1">{name}</span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 30 }).map((_, j) => (
                          <div
                            key={j}
                            className={`w-1.5 h-6 rounded-sm ${
                              Math.random() > 0.05 ? "bg-success/80" : "bg-destructive/80"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {(99.5 + Math.random() * 0.5).toFixed(2)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
