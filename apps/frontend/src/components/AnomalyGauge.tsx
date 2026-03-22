import { cn } from "@/lib/utils";

interface AnomalyGaugeProps {
  score: number;
  confidence: number;
  reason: string;
  responseTimeMs: number;
  hasAnomaly: boolean;
  region?: string;
  detectedAt?: string;
}

export function AnomalyGauge({
  score,
  confidence,
  reason,
  responseTimeMs,
  hasAnomaly,
  region,
  detectedAt,
}: AnomalyGaugeProps) {
  const normalizedScore = Math.max(0, Math.min(1, (score + 0.5) / 0.5));
  
  const getStatusColor = () => {
    if (hasAnomaly) {
      if (confidence > 0.7) return "text-red-500";
      if (confidence > 0.4) return "text-orange-500";
      return "text-yellow-500";
    }
    return "text-emerald-500";
  };

  const getStatusBg = () => {
    if (hasAnomaly) {
      if (confidence > 0.7) return "bg-red-500";
      if (confidence > 0.4) return "bg-orange-500";
      return "bg-yellow-500";
    }
    return "bg-emerald-500";
  };

  const getReasonLabel = () => {
    switch (reason) {
      case "spike_detected":
        return "Spike Detected";
      case "severe_anomaly":
        return "Severe Anomaly";
      case "minor_deviation":
        return "Minor Deviation";
      case "normal":
        return "Normal";
      default:
        return reason || "Unknown";
    }
  };

  const getReasonIcon = () => {
    if (hasAnomaly) {
      return (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={cn(
      "relative p-4 rounded-2xl border transition-all duration-500",
      hasAnomaly 
        ? "bg-red-500/5 border-red-500/20" 
        : "bg-emerald-500/5 border-emerald-500/20"
    )}>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-background/50 rounded-2xl" />
      
      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn(
              "p-1.5 rounded-lg",
              hasAnomaly ? "bg-red-500/10" : "bg-emerald-500/10"
            )}>
              <span className={cn("block", getStatusColor())}>
                {getReasonIcon()}
              </span>
            </div>
            <span className={cn(
              "text-[10px] font-black uppercase tracking-widest",
              getStatusColor()
            )}>
              AI Anomaly Score
            </span>
          </div>
          
          {region && (
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
              {region}
            </span>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-end justify-between">
            <span className={cn(
              "text-3xl font-black tracking-tighter",
              getStatusColor()
            )}>
              {score.toFixed(3)}
            </span>
            <span className={cn(
              "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full",
              hasAnomaly 
                ? "bg-red-500/10 text-red-500" 
                : "bg-emerald-500/10 text-emerald-500"
            )}>
              {getReasonLabel()}
            </span>
          </div>

          <div className="relative h-2 bg-muted/50 rounded-full overflow-hidden">
            <div 
              className={cn(
                "absolute inset-y-0 left-0 rounded-full transition-all duration-700",
                getStatusBg()
              )}
              style={{ width: `${normalizedScore * 100}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-px h-3 bg-background/80" />
            </div>
          </div>
          
          <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-muted-foreground/30">
            <span>-0.5 (Anomaly)</span>
            <span>+0.5 (Normal)</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/30">
          <div className="space-y-0.5">
            <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/30 block">
              Response Time
            </span>
            <span className={cn(
              "text-sm font-black tracking-tight",
              hasAnomaly ? "text-red-400" : "text-foreground"
            )}>
              {responseTimeMs}ms
            </span>
          </div>
          
          <div className="space-y-0.5 text-right">
            <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/30 block">
              Confidence
            </span>
            <span className={cn(
              "text-sm font-black tracking-tight",
              getStatusColor()
            )}>
              {(confidence * 100).toFixed(0)}%
            </span>
          </div>

          {detectedAt && (
            <div className="space-y-0.5 text-right">
              <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/30 block">
                Detected
              </span>
              <span className="text-[10px] font-black tracking-tight text-muted-foreground/60">
                {formatTime(detectedAt)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
