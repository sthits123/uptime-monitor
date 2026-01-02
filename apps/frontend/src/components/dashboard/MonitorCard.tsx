import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface MonitorCardProps {
  name: string;
  url: string;
  status: "up" | "down" | "degraded";
  uptime: number;
  responseTime: number;
  lastChecked: string;
}

const MonitorCard = ({ name, url, status, uptime, responseTime, lastChecked }: MonitorCardProps) => {
  const statusColors = {
    up: "bg-success",
    down: "bg-destructive",
    degraded: "bg-warning",
  };

  const statusLabels = {
    up: "Operational",
    down: "Down",
    degraded: "Degraded",
  };

  return (
    <div className="bg-card rounded-xl border border-border p-5 hover:shadow-card transition-all hover:border-primary/30">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn("w-3 h-3 rounded-full", statusColors[status], status === "up" && "pulse-dot")} />
          <div>
            <h3 className="font-semibold">{name}</h3>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
            >
              {url.replace(/^https?:\/\//, "")}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
        <span
          className={cn(
            "px-2 py-1 rounded-full text-xs font-medium",
            status === "up" && "bg-success/10 text-success",
            status === "down" && "bg-destructive/10 text-destructive",
            status === "degraded" && "bg-warning/10 text-warning"
          )}
        >
          {statusLabels[status]}
        </span>
      </div>

      {/* Uptime bars */}
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex-1 h-8 rounded-sm",
              Math.random() > (status === "up" ? 0.02 : status === "degraded" ? 0.1 : 0.3)
                ? "bg-success/80"
                : "bg-destructive/80"
            )}
          />
        ))}
      </div>

      <div className="flex items-center justify-between text-sm">
        <div>
          <span className="text-muted-foreground">Uptime:</span>
          <span className="ml-1 font-medium">{uptime.toFixed(2)}%</span>
        </div>
        <div>
          <span className="text-muted-foreground">Response:</span>
          <span className="ml-1 font-medium">{responseTime}ms</span>
        </div>
        <div className="text-muted-foreground">
          Checked {lastChecked}
        </div>
      </div>
    </div>
  );
};

export default MonitorCard;
