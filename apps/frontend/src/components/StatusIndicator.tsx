import { cn } from "@/lib/utils";

type Status = "up" | "down" | "degraded" | "maintenance";

interface StatusIndicatorProps {
  status: Status;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const statusConfig = {
  up: {
    label: "Operational",
    color: "bg-primary",
    ringColor: "bg-primary/30",
  },
  down: {
    label: "Down",
    color: "bg-destructive",
    ringColor: "bg-destructive/30",
  },
  degraded: {
    label: "Degraded",
    color: "bg-warning",
    ringColor: "bg-warning/30",
  },
  maintenance: {
    label: "Maintenance",
    color: "bg-accent",
    ringColor: "bg-accent/30",
  },
};

const sizeConfig = {
  sm: { dot: "w-2 h-2", ring: "w-4 h-4", text: "text-xs" },
  md: { dot: "w-3 h-3", ring: "w-6 h-6", text: "text-sm" },
  lg: { dot: "w-4 h-4", ring: "w-8 h-8", text: "text-base" },
};

export function StatusIndicator({ 
  status, 
  size = "md", 
  showLabel = false,
  className 
}: StatusIndicatorProps) {
  const config = statusConfig[status];
  const sizes = sizeConfig[size];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex items-center justify-center">
        <div className={cn(
          "absolute rounded-full animate-pulse-ring",
          sizes.ring,
          config.ringColor
        )} />
        <div className={cn(
          "relative rounded-full",
          sizes.dot,
          config.color
        )} />
      </div>
      {showLabel && (
        <span className={cn("font-medium", sizes.text)}>
          {config.label}
        </span>
      )}
    </div>
  );
}
