import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { apiClient, type AnomalyScore, type AnomalyEvent, type RegionalTick } from "@/lib/api";
import {
  Activity,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Zap,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";

interface AnomalyPanelProps {
  websiteId: string;
  websiteUrl?: string;
  history?: any[];
}

interface TimelineEntry {
  time: string;
  fullTime: Date;
  regionName: string;
  responseTime: number;
  status: string;
  isOffline: boolean;
  isAnomaly: boolean;
  anomalyReason?: string;
  confidence?: number;
}

export function AnomalyPanel({ websiteId }: AnomalyPanelProps) {
  const [anomalyScore, setAnomalyScore] = useState<AnomalyScore | null>(null);
  const [anomalyEvents, setAnomalyEvents] = useState<AnomalyEvent[]>([]);
  const [timelineData, setTimelineData] = useState<TimelineEntry[]>([]);

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 30000);
    return () => clearInterval(interval);
  }, [websiteId]);

  const fetchAllData = async () => {
    try {
      const [scoreData, eventsData, regionalData] = await Promise.all([
        apiClient.getAnomalyScore(websiteId),
        apiClient.getAnomalyEvents(websiteId, 50),
        apiClient.getRegionalHistory(websiteId, 50),
      ]);
      setAnomalyScore(scoreData);
      setAnomalyEvents(eventsData);
      prepareTimelineData(regionalData, eventsData);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  const prepareTimelineData = (regionalData: RegionalTick[], eventsData: AnomalyEvent[]) => {
    const timeline: TimelineEntry[] = regionalData.slice(0, 30).map((tick) => {
      const tickTime = new Date(tick.CreatedAt);
      
      const matchingEvent = eventsData.find((event) => {
        const eventTime = new Date(event.created_at);
        const timeDiff = Math.abs(eventTime.getTime() - tickTime.getTime());
        return timeDiff < 120000 && event.region_id === tick.RegionID;
      });

      const isOffline = tick.Status?.toLowerCase() !== 'up';
      const isAnomaly = matchingEvent?.is_anomaly ?? false;

      return {
        time: tickTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        fullTime: tickTime,
        regionName: tick.RegionName,
        responseTime: tick.ResponseTimeMs,
        status: tick.Status,
        isOffline,
        isAnomaly,
        anomalyReason: matchingEvent?.reason,
        confidence: matchingEvent?.confidence,
      };
    });

    setTimelineData(timeline);
  };

  const getStatusConfig = () => {
    if (!anomalyScore) return { color: "slate", text: "Loading", icon: RefreshCw, bgColor: "bg-slate-500/10" };
    if (anomalyScore.has_anomaly) {
      if (anomalyScore.confidence > 0.7) return { color: "red", text: "Anomaly Detected", icon: XCircle, bgColor: "bg-red-500/10" };
      if (anomalyScore.confidence > 0.4) return { color: "orange", text: "Warning", icon: AlertTriangle, bgColor: "bg-orange-500/10" };
      return { color: "yellow", text: "Minor Issue", icon: AlertTriangle, bgColor: "bg-yellow-500/10" };
    }
    return { color: "emerald", text: "Healthy", icon: CheckCircle, bgColor: "bg-emerald-500/10" };
  };

  const getReasonLabel = (reason: string) => {
    switch (reason) {
      case "spike_detected": return "Spike";
      case "severe_anomaly": return "Severe";
      case "minor_deviation": return "Minor";
      case "normal": return "Normal";
      default: return reason || "Unknown";
    }
  };

  const getTrend = () => {
    if (timelineData.length < 5) return { icon: Minus, color: "text-muted-foreground", text: "No data" };
    
    const recent = timelineData.slice(-5);
    const first = recent[0].responseTime;
    const last = recent[recent.length - 1].responseTime;
    const change = first > 0 ? ((last - first) / first) * 100 : 0;

    if (change > 20) return { icon: TrendingUp, color: "text-red-500", text: `+${change.toFixed(0)}%` };
    if (change < -20) return { icon: TrendingDown, color: "text-emerald-500", text: `${change.toFixed(0)}%` };
    return { icon: Minus, color: "text-muted-foreground", text: `${change.toFixed(0)}%` };
  };

  const status = getStatusConfig();
  const trend = getTrend();
  const TrendIcon = trend.icon;

  const avgResponseTime = timelineData.length > 0 
    ? Math.round(timelineData.reduce((sum, d) => sum + d.responseTime, 0) / timelineData.length) 
    : 0;
  
  const maxResponseTime = timelineData.length > 0 
    ? Math.max(...timelineData.map(d => d.responseTime)) 
    : 0;

  const anomalyCount = anomalyEvents.filter(e => e.is_anomaly).length;

  return (
    <div className="space-y-4">
      {/* Status Header */}
      <div className={cn(
        "flex items-center justify-between p-4 rounded-2xl border transition-all",
        status.bgColor,
        status.color === "red" ? "border-red-500/30" :
        status.color === "orange" ? "border-orange-500/30" :
        status.color === "yellow" ? "border-yellow-500/30" :
        status.color === "emerald" ? "border-emerald-500/30" :
        "border-border"
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-xl",
            status.color === "red" ? "bg-red-500/20" :
            status.color === "orange" ? "bg-orange-500/20" :
            status.color === "yellow" ? "bg-yellow-500/20" :
            status.color === "emerald" ? "bg-emerald-500/20" :
            "bg-slate-500/20"
          )}>
            <status.icon className={cn(
              "w-5 h-5",
              status.color === "red" ? "text-red-500" :
              status.color === "orange" ? "text-orange-500" :
              status.color === "yellow" ? "text-yellow-500" :
              status.color === "emerald" ? "text-emerald-500" :
              "text-slate-500"
            )} />
          </div>
          <div>
            <p className={cn(
              "text-sm font-bold",
              status.color === "red" ? "text-red-500" :
              status.color === "orange" ? "text-orange-500" :
              status.color === "yellow" ? "text-yellow-500" :
              status.color === "emerald" ? "text-emerald-500" :
              "text-slate-500"
            )}>
              {status.text}
            </p>
            <p className="text-xs text-muted-foreground/60">
              {anomalyScore?.reason ? getReasonLabel(anomalyScore.reason) : "AI Analysis"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {anomalyScore && (
            <>
              <div className="text-right">
                <p className="text-[10px] font-medium text-muted-foreground/60 uppercase">Score</p>
                <p className={cn(
                  "text-lg font-black tracking-tight",
                  anomalyScore.score < -0.1 ? "text-red-500" :
                  anomalyScore.score < 0 ? "text-orange-500" :
                  "text-emerald-500"
                )}>
                  {anomalyScore.score.toFixed(3)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-medium text-muted-foreground/60 uppercase">Confidence</p>
                <p className="text-lg font-black tracking-tight">
                  {(anomalyScore.confidence * 100).toFixed(0)}%
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-muted/30 border border-border/50">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-3 h-3 text-muted-foreground/60" />
            <span className="text-[10px] font-medium text-muted-foreground/60 uppercase">Avg</span>
          </div>
          <p className="text-lg font-black tracking-tight">{avgResponseTime}ms</p>
        </div>
        <div className="p-3 rounded-xl bg-muted/30 border border-border/50">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-3 h-3 text-muted-foreground/60" />
            <span className="text-[10px] font-medium text-muted-foreground/60 uppercase">Peak</span>
          </div>
          <p className="text-lg font-black tracking-tight text-red-500">{maxResponseTime}ms</p>
        </div>
        <div className="p-3 rounded-xl bg-muted/30 border border-border/50">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-3 h-3 text-muted-foreground/60" />
            <span className="text-[10px] font-medium text-muted-foreground/60 uppercase">Anomalies</span>
          </div>
          <p className="text-lg font-black tracking-tight">{anomalyCount}</p>
        </div>
        <div className="p-3 rounded-xl bg-muted/30 border border-border/50">
          <div className="flex items-center gap-2 mb-1">
            <TrendIcon className={cn("w-3 h-3", trend.color)} />
            <span className="text-[10px] font-medium text-muted-foreground/60 uppercase">Trend</span>
          </div>
          <p className={cn("text-lg font-black tracking-tight", trend.color)}>{trend.text}</p>
        </div>
      </div>

      {/* Timeline - Region Specific */}
      <div className="p-4 rounded-2xl bg-muted/20 border border-border/50">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60 mb-3">
          Regional Latency Timeline (Latest First)
        </h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          {timelineData.length > 0 ? (
            timelineData.map((item, index) => {
              const isOffline = item.isOffline;
              const isAnomaly = item.isAnomaly && !isOffline;
              
              const dotColor = isOffline ? "bg-red-500" : isAnomaly ? "bg-orange-500 animate-pulse" : "bg-emerald-500";
              const bgColor = isOffline ? "bg-red-500/10 border border-red-500/20" : isAnomaly ? "bg-orange-500/10 border border-orange-500/20" : "bg-muted/30";
              const textColor = isOffline ? "text-red-500" : isAnomaly ? "text-orange-500" : "text-emerald-500";
              const badgeText = isOffline ? "bg-red-500/20 text-red-500" : isAnomaly ? "bg-orange-500/20 text-orange-500" : "bg-emerald-500/20 text-emerald-500";
              
              return (
                <div 
                  key={`${item.fullTime.getTime()}-${item.regionName}-${index}`}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-lg transition-all",
                    bgColor
                  )}
                >
                  <div className={cn("w-2 h-2 rounded-full", dotColor)} />
                  <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/60 w-12">
                    {item.regionName}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground/60 w-10">
                    {item.time}
                  </span>
                  <span className={cn(
                    "text-xs font-bold px-2 py-0.5 rounded-full",
                    badgeText
                  )}>
                    {item.responseTime}ms
                  </span>
                  <span className={cn(
                    "text-[10px] uppercase tracking-wider flex-1",
                    textColor
                  )}>
                    {isOffline ? "OFFLINE" : isAnomaly ? (item.anomalyReason ? getReasonLabel(item.anomalyReason) : "Anomaly") : "Normal"}
                  </span>
                  {isAnomaly && item.confidence && (
                    <span className={cn(
                      "text-[9px] px-1.5 py-0.5 rounded font-bold",
                      item.confidence > 0.7 ? "bg-orange-500/20 text-orange-500" : "bg-yellow-500/20 text-yellow-500"
                    )}>
                      {(item.confidence * 100).toFixed(0)}%
                    </span>
                  )}
                  {!isAnomaly && !isOffline && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500/60 font-bold">
                      OK
                    </span>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-4 text-muted-foreground/40 text-sm">
              No data available - Start monitoring to see regional latency
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
