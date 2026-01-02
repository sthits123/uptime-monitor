import { Activity, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const services = [
  {
    name: "API",
    status: "operational",
    uptime: 99.99,
    history: Array.from({ length: 90 }, () => (Math.random() > 0.02 ? "up" : "down")),
  },
  {
    name: "Web Application",
    status: "operational",
    uptime: 99.95,
    history: Array.from({ length: 90 }, () => (Math.random() > 0.03 ? "up" : "down")),
  },
  {
    name: "CDN",
    status: "degraded",
    uptime: 98.5,
    history: Array.from({ length: 90 }, () => (Math.random() > 0.1 ? "up" : "down")),
  },
  {
    name: "Database",
    status: "operational",
    uptime: 99.99,
    history: Array.from({ length: 90 }, () => (Math.random() > 0.01 ? "up" : "down")),
  },
  {
    name: "Authentication",
    status: "outage",
    uptime: 95.2,
    history: Array.from({ length: 90 }, () => (Math.random() > 0.3 ? "up" : "down")),
  },
  {
    name: "Email Service",
    status: "operational",
    uptime: 99.9,
    history: Array.from({ length: 90 }, () => (Math.random() > 0.02 ? "up" : "down")),
  },
];

const recentIncidents = [
  {
    date: "January 15, 2024",
    title: "Authentication Service Outage",
    status: "investigating",
    updates: [
      { time: "14:32", message: "We are investigating issues with the authentication service." },
      { time: "14:45", message: "The issue has been identified. A fix is being deployed." },
    ],
  },
  {
    date: "January 14, 2024",
    title: "Database Connection Issues",
    status: "resolved",
    updates: [
      { time: "09:15", message: "Database connections are timing out." },
      { time: "09:30", message: "Root cause identified: connection pool exhaustion." },
      { time: "09:45", message: "Issue resolved. All systems operational." },
    ],
  },
];

const Status = () => {
  const allOperational = services.every((s) => s.status === "operational");
  const hasOutage = services.some((s) => s.status === "outage");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg gradient-hero flex items-center justify-center">
                <Activity className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-xl">PingGuard Status</h1>
                <p className="text-sm text-muted-foreground">Service health dashboard</p>
              </div>
            </div>
            <a href="/" className="text-sm text-primary hover:underline">
              ← Back to PingGuard
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Overall Status Banner */}
        <div
          className={cn(
            "rounded-2xl p-8 mb-8 text-center",
            allOperational
              ? "bg-success/10 border border-success/20"
              : hasOutage
              ? "bg-destructive/10 border border-destructive/20"
              : "bg-warning/10 border border-warning/20"
          )}
        >
          <div
            className={cn(
              "w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center",
              allOperational ? "bg-success" : hasOutage ? "bg-destructive" : "bg-warning"
            )}
          >
            {allOperational ? (
              <CheckCircle className="w-8 h-8 text-success-foreground" />
            ) : (
              <Activity className="w-8 h-8 text-destructive-foreground" />
            )}
          </div>
          <h2 className="font-heading text-2xl font-bold mb-2">
            {allOperational
              ? "All Systems Operational"
              : hasOutage
              ? "Service Outage Detected"
              : "Degraded Performance"}
          </h2>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>

        {/* Services Status */}
        <section className="mb-12">
          <h3 className="font-heading text-xl font-semibold mb-4">Services</h3>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {services.map((service, index) => (
              <div
                key={service.name}
                className={cn(
                  "p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4",
                  index > 0 && "border-t border-border"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full",
                      service.status === "operational" && "bg-success",
                      service.status === "degraded" && "bg-warning",
                      service.status === "outage" && "bg-destructive"
                    )}
                  />
                  <span className="font-medium">{service.name}</span>
                  <span
                    className={cn(
                      "text-sm capitalize",
                      service.status === "operational" && "text-success",
                      service.status === "degraded" && "text-warning",
                      service.status === "outage" && "text-destructive"
                    )}
                  >
                    {service.status}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex gap-0.5">
                    {service.history.slice(-30).map((day, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-1 h-6 rounded-sm",
                          day === "up" ? "bg-success/70" : "bg-destructive/70"
                        )}
                        title={`Day ${i + 1}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground w-16 text-right">
                    {service.uptime}%
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Uptime over the last 30 days
          </p>
        </section>

        {/* Recent Incidents */}
        <section>
          <h3 className="font-heading text-xl font-semibold mb-4">Recent Incidents</h3>
          <div className="space-y-6">
            {recentIncidents.map((incident) => (
              <div key={incident.title} className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{incident.date}</p>
                    <h4 className="font-semibold">{incident.title}</h4>
                  </div>
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium capitalize",
                      incident.status === "resolved"
                        ? "bg-success/10 text-success"
                        : "bg-warning/10 text-warning"
                    )}
                  >
                    {incident.status}
                  </span>
                </div>
                <div className="space-y-3 border-l-2 border-border pl-4">
                  {incident.updates.map((update, i) => (
                    <div key={i} className="flex gap-3 text-sm">
                      <span className="text-muted-foreground flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3" />
                        {update.time}
                      </span>
                      <p>{update.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Subscribe */}
        <section className="mt-12 text-center py-8 border-t border-border">
          <p className="text-muted-foreground">
            Subscribe to updates via email, SMS, or webhook
          </p>
        </section>
      </main>
    </div>
  );
};

export default Status;
