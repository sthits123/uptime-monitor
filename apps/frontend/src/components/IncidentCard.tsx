import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, Clock, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

type IncidentStatus = "ongoing" | "resolved" | "investigating";

interface IncidentCardProps {
  id: string;
  title: string;
  description: string;
  status: IncidentStatus;
  severity: "critical" | "major" | "minor";
  startedAt: string;
  resolvedAt?: string;
  affectedMonitors: string[];
  className?: string;
}

const statusConfig = {
  ongoing: {
    label: "Ongoing",
    icon: AlertTriangle,
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
  investigating: {
    label: "Investigating",
    icon: Clock,
    color: "text-warning",
    bg: "bg-warning/10",
  },
  resolved: {
    label: "Resolved",
    icon: CheckCircle,
    color: "text-primary",
    bg: "bg-primary/10",
  },
};

const severityConfig = {
  critical: "border-l-destructive",
  major: "border-l-warning",
  minor: "border-l-accent",
};

export function IncidentCard({
  id,
  title,
  description,
  status,
  severity,
  startedAt,
  resolvedAt,
  affectedMonitors,
  className,
}: IncidentCardProps) {
  const StatusIcon = statusConfig[status].icon;

  return (
    <div className={cn(
      "glass-card p-5 rounded-xl border-l-4",
      severityConfig[severity],
      className
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            statusConfig[status].bg
          )}>
            <StatusIcon className={cn("w-5 h-5", statusConfig[status].color)} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">#{id}</p>
          </div>
        </div>
        <span className={cn(
          "px-3 py-1 rounded-full text-xs font-medium",
          statusConfig[status].bg,
          statusConfig[status].color
        )}>
          {statusConfig[status].label}
        </span>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {affectedMonitors.map((monitor) => (
          <span
            key={monitor}
            className="px-2 py-1 bg-secondary rounded-md text-xs font-medium text-secondary-foreground"
          >
            {monitor}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Started: {startedAt}</span>
          {resolvedAt && <span>Resolved: {resolvedAt}</span>}
        </div>
        <Button variant="ghost" size="sm" className="gap-1">
          View Details
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
