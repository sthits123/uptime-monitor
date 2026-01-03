import { StatusIndicator } from "./StatusIndicator";
import { cn } from "@/lib/utils";
import { ExternalLink, Clock, Globe } from "lucide-react";

type Status = "up" | "down" | "degraded" | "maintenance";

interface MonitorCardProps {
  name: string;
  url: string;
  status: Status;
  uptime: number;
  responseTime: number;
  lastChecked: string;
  className?: string;
}

export function MonitorCard({
  name,
  url,
  status,
  uptime,
  responseTime,
  lastChecked,
  className,
}: MonitorCardProps) {
  return (
    <div className={cn(
      "glass-card p-5 rounded-xl hover:border-primary/30 transition-all duration-200 group",
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <StatusIndicator status={status} size="md" />
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {name}
            </h3>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-accent flex items-center gap-1"
            >
              <Globe className="w-3 h-3" />
              {url.replace(/^https?:\/\//, '')}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-muted-foreground">Uptime</p>
          <p className={cn(
            "text-lg font-semibold",
            uptime >= 99.9 ? "text-primary" : uptime >= 99 ? "text-warning" : "text-destructive"
          )}>
            {uptime.toFixed(2)}%
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Response</p>
          <p className="text-lg font-semibold text-foreground">
            {responseTime}ms
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Last Check</p>
          <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {lastChecked}
          </p>
        </div>
      </div>

      {/* Uptime bar visualization */}
      <div className="mt-4 flex gap-0.5">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex-1 h-6 rounded-sm transition-colors",
              Math.random() > 0.05 
                ? "bg-primary/80 hover:bg-primary" 
                : "bg-destructive/80 hover:bg-destructive"
            )}
            title={`Day ${30 - i}`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Last 30 days uptime
      </p>
    </div>
  );
}
