import DashboardLayout from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, Clock, Plus, XCircle } from "lucide-react";

const incidents = [
  {
    id: 1,
    title: "Auth Service Outage",
    status: "ongoing",
    severity: "critical",
    monitor: "Auth Service",
    startedAt: "2024-01-15 14:32:00",
    resolvedAt: null,
    duration: "2h 15m",
    description: "The authentication service is currently experiencing issues. Users may not be able to log in.",
  },
  {
    id: 2,
    title: "CDN Degraded Performance",
    status: "ongoing",
    severity: "warning",
    monitor: "CDN",
    startedAt: "2024-01-15 13:45:00",
    resolvedAt: null,
    duration: "3h 2m",
    description: "CDN response times are elevated. Users may experience slower load times.",
  },
  {
    id: 3,
    title: "Database Connection Issues",
    status: "resolved",
    severity: "critical",
    monitor: "Database Cluster",
    startedAt: "2024-01-14 09:15:00",
    resolvedAt: "2024-01-14 09:45:00",
    duration: "30m",
    description: "Database connections were timing out due to high load.",
  },
  {
    id: 4,
    title: "API Rate Limiting",
    status: "resolved",
    severity: "warning",
    monitor: "Production API",
    startedAt: "2024-01-13 16:00:00",
    resolvedAt: "2024-01-13 16:30:00",
    duration: "30m",
    description: "API rate limits were being hit due to a traffic spike.",
  },
  {
    id: 5,
    title: "SSL Certificate Expiry Warning",
    status: "resolved",
    severity: "info",
    monitor: "Main Website",
    startedAt: "2024-01-12 10:00:00",
    resolvedAt: "2024-01-12 11:00:00",
    duration: "1h",
    description: "SSL certificate was renewed successfully.",
  },
];

const Incidents = () => {
  const ongoingCount = incidents.filter((i) => i.status === "ongoing").length;
  const resolvedCount = incidents.filter((i) => i.status === "resolved").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold">Incidents</h1>
            <p className="text-muted-foreground">Track and manage service incidents</p>
          </div>
          <Button variant="link">
            <Plus className="w-4 h-4" />
            Create Incident
          </Button>
        </div>

        {/* Stats */}
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-destructive/10 rounded-lg">
            <XCircle className="w-5 h-5 text-destructive" />
            <span className="font-medium">{ongoingCount} Ongoing</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-success/10 rounded-lg">
            <CheckCircle className="w-5 h-5 text-success" />
            <span className="font-medium">{resolvedCount} Resolved</span>
          </div>
        </div>

        {/* Incidents List */}
        <div className="space-y-4">
          {incidents.map((incident) => (
            <div
              key={incident.id}
              className={cn(
                "bg-card rounded-xl border p-6 hover:shadow-card transition-all",
                incident.status === "ongoing" ? "border-destructive/30" : "border-border"
              )}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                      incident.status === "ongoing" ? "bg-destructive/10" : "bg-success/10"
                    )}
                  >
                    {incident.status === "ongoing" ? (
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-success" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{incident.title}</h3>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-medium",
                          incident.severity === "critical" && "bg-destructive/10 text-destructive",
                          incident.severity === "warning" && "bg-warning/10 text-warning",
                          incident.severity === "info" && "bg-primary/10 text-primary"
                        )}
                      >
                        {incident.severity}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-2">{incident.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span>Monitor: {incident.monitor}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Duration: {incident.duration}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-sm font-medium",
                      incident.status === "ongoing"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-success/10 text-success"
                    )}
                  >
                    {incident.status === "ongoing" ? "Ongoing" : "Resolved"}
                  </span>
                  <span className="text-sm text-muted-foreground">{incident.startedAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Incidents;
