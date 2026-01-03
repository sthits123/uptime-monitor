import { StatusIndicator } from "@/components/StatusIndicator";
import { Activity, ExternalLink, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

type ServiceStatus = "up" | "down" | "degraded" | "maintenance";

interface Service {
  name: string;
  description: string;
  status: ServiceStatus;
  uptime: number;
}

const services: Service[] = [
  {
    name: "API",
    description: "Core API infrastructure",
    status: "up",
    uptime: 99.99,
  },
  {
    name: "Web Application",
    description: "Customer-facing web app",
    status: "up",
    uptime: 99.97,
  },
  {
    name: "Customer Portal",
    description: "Customer dashboard and settings",
    status: "degraded",
    uptime: 99.45,
  },
  {
    name: "Payment Processing",
    description: "Billing and payment systems",
    status: "up",
    uptime: 99.99,
  },
  {
    name: "CDN",
    description: "Content delivery network",
    status: "up",
    uptime: 100,
  },
  {
    name: "Email Delivery",
    description: "Transactional email service",
    status: "up",
    uptime: 99.98,
  },
];

const recentUpdates = [
  {
    date: "Today, 2:34 PM",
    title: "Investigating: Customer Portal Performance",
    status: "investigating",
    description: "We are investigating reports of slow response times on the customer portal. Our team is actively working on identifying the root cause.",
  },
  {
    date: "Yesterday, 9:45 AM",
    title: "Resolved: Database Connectivity",
    status: "resolved",
    description: "The database connectivity issues have been fully resolved. All systems are now operating normally.",
  },
  {
    date: "Jan 1, 2025, 3:30 PM",
    title: "Resolved: SSL Certificate Renewal",
    status: "resolved",
    description: "SSL certificate has been successfully renewed for all domains.",
  },
];

type DayStatus = "up" | "degraded" | "down";

const uptimeDays: { status: DayStatus }[] = Array.from({ length: 90 }, () => ({
  status: (Math.random() > 0.02 ? "up" : Math.random() > 0.5 ? "degraded" : "down") as DayStatus,
}));

export default function Status() {
  const hasDown = services.some(s => s.status === "down");
  const hasDegraded = services.some(s => s.status === "degraded");
  const overallStatus: "up" | "down" | "degraded" = hasDown 
    ? "down" 
    : hasDegraded 
      ? "degraded" 
      : "up";

  const overallUptime = (services.reduce((acc, s) => acc + s.uptime, 0) / services.length).toFixed(2);

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">UptimeMonitor</span>
            </Link>
            <span className="text-sm text-muted-foreground">System Status</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Overall Status Banner */}
        <div className={cn(
          "glass-card rounded-2xl p-8 mb-12 text-center",
          overallStatus === "up" && "border-primary/50",
          overallStatus === "degraded" && "border-warning/50",
          overallStatus === "down" && "border-destructive/50"
        )}>
          <StatusIndicator status={overallStatus} size="lg" className="justify-center mb-4" />
          <h1 className="text-4xl font-bold mb-2">
            {overallStatus === "up" && "All Systems Operational"}
            {overallStatus === "degraded" && "Partial System Degradation"}
            {overallStatus === "down" && "System Outage Detected"}
          </h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleString()} • Overall uptime: {overallUptime}%
          </p>
        </div>

        {/* 90-Day Uptime Overview */}
        <div className="glass-card rounded-xl p-6 mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">90-Day Uptime</h2>
            <span className="text-sm text-muted-foreground">{overallUptime}% uptime</span>
          </div>
          <div className="flex gap-[2px]">
            {uptimeDays.map((day, i) => (
              <div
                key={i}
                className={cn(
                  "flex-1 h-8 rounded-sm transition-opacity hover:opacity-80",
                  day.status === "up" && "bg-primary",
                  day.status === "degraded" && "bg-warning",
                  day.status === "down" && "bg-destructive"
                )}
                title={`Day ${90 - i}: ${day.status}`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>90 days ago</span>
            <span>Today</span>
          </div>
        </div>

        {/* Services List */}
        <div className="glass-card rounded-xl overflow-hidden mb-12">
          <div className="p-6 border-b border-border/50">
            <h2 className="text-xl font-semibold">Current Status by Service</h2>
          </div>
          <div className="divide-y divide-border/50">
            {services.map((service, index) => (
              <div key={index} className="p-6 flex items-center justify-between hover:bg-secondary/30 transition-colors">
                <div className="flex items-center gap-4">
                  <StatusIndicator status={service.status} size="md" />
                  <div>
                    <h3 className="font-semibold">{service.name}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "font-semibold",
                    service.uptime >= 99.9 && "text-primary",
                    service.uptime >= 99 && service.uptime < 99.9 && "text-warning",
                    service.uptime < 99 && "text-destructive"
                  )}>
                    {service.uptime}%
                  </p>
                  <p className="text-xs text-muted-foreground">uptime</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Updates */}
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="p-6 border-b border-border/50">
            <h2 className="text-xl font-semibold">Recent Updates</h2>
          </div>
          <div className="divide-y divide-border/50">
            {recentUpdates.map((update, index) => (
              <div key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                    update.status === "resolved" && "bg-primary/20",
                    update.status === "investigating" && "bg-warning/20",
                    update.status === "ongoing" && "bg-destructive/20"
                  )}>
                    {update.status === "resolved" && <CheckCircle className="w-5 h-5 text-primary" />}
                    {update.status === "investigating" && <Clock className="w-5 h-5 text-warning" />}
                    {update.status === "ongoing" && <AlertTriangle className="w-5 h-5 text-destructive" />}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{update.date}</p>
                    <h3 className="font-semibold mb-2">{update.title}</h3>
                    <p className="text-sm text-muted-foreground">{update.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscribe Section */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Want to receive status updates?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#" className="flex items-center gap-2 text-primary hover:underline">
              <ExternalLink className="w-4 h-4" />
              Subscribe via Email
            </a>
            <span className="text-muted-foreground">•</span>
            <a href="#" className="flex items-center gap-2 text-primary hover:underline">
              <ExternalLink className="w-4 h-4" />
              RSS Feed
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Powered by{" "}
              <Link to="/" className="text-primary hover:underline font-medium">
                UptimeMonitor
              </Link>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 Example Inc. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
