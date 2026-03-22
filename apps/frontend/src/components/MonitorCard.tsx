import { useState, useEffect } from "react";
import {
  Globe,
  Zap,
  ExternalLink,
  Trash2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  Card,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiClient, type Website, type RegionalStatus } from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AnomalyPanel } from "./AnomalyPanel";

interface MonitorCardProps {
  website: Website;
  onDelete: (id: string) => void;
}

export function MonitorCard({ website, onDelete }: MonitorCardProps) {
  const [history, setHistory] = useState<any[]>([]);
  const [regionalStatus, setRegionalStatus] = useState<RegionalStatus[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [historyData, regionalData] = await Promise.all([
        apiClient.getWebsiteHistory(website.id, 24),
        apiClient.getWebsiteRegionalStatus(website.id),
      ]);
      setHistory(historyData.reverse());
      setRegionalStatus(regionalData);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to stop monitoring ${website.url}?`)) return;
    try {
      setIsDeleting(true);
      await apiClient.deleteWebsite(website.id);
      toast.success("Monitor removed");
      onDelete(website.id);
    } catch (err) {
      toast.error("Failed to delete monitor");
    } finally {
      setIsDeleting(false);
    }
  };

  const statusInfo = (status: string | null | undefined) => {
    const s = (status || "").toLowerCase();
    if (s === "up") return { color: "bg-emerald-500", text: "Operational", icon: CheckCircle2 };
    return { color: "bg-rose-500", text: "Offline", icon: XCircle };
  };

  const info = statusInfo(website.status);

  return (
    <Card className="group relative rounded-[2.5rem] border-border/50 bg-card/40 backdrop-blur-xl hover:bg-card/60 transition-all duration-500 overflow-hidden isolate shadow-xl hover:shadow-2xl hover:shadow-primary/5 active:scale-[0.99]">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="p-8 relative z-10">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div className="flex items-center gap-5 min-w-0">
            <div className="p-4 rounded-2xl bg-muted border border-border/50 flex-shrink-0 group-hover:scale-110 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-500 shadow-inner">
              <Globe className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" strokeWidth={2.5} />
            </div>
            <div className="truncate">
              <CardTitle className="text-2xl font-black text-foreground truncate max-w-[200px] tracking-tight italic">
                {(() => {
                  try { return new URL(website.url).hostname; }
                  catch { return website.url.replace(/^https?:\/\//, '') || 'Unknown'; }
                })()}
              </CardTitle>
              <CardDescription className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 mt-1 truncate">
                {website.url}
              </CardDescription>
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting}
            className="h-10 w-10 rounded-xl text-muted-foreground/20 hover:text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/20 opacity-0 group-hover:opacity-100 transition-all border-none outline-none"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-8">
          {/* Node Stability History */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-0.5">
              <span>Node Stability</span>
              <span className={cn("px-2 py-0.5 rounded-full bg-current/10 font-bold", info.color.replace('bg', 'text'))}>{info.text}</span>
            </div>
            <div className="flex gap-1.5 h-7 items-center">
              {Array.from({ length: 24 }).map((_, i) => {
                const tick = history[i];
                let color = "bg-muted/50";
                let label = "No telemetry";

                if (tick) {
                  color = tick.status.toLowerCase() === 'up' ? "bg-emerald-500" : "bg-rose-500";
                  label = `${tick.status === 'up' ? 'Online' : 'Offline'} at ${new Date(tick.created_at).toLocaleTimeString()}`;
                }

                return (
                  <TooltipProvider key={i} delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className={cn("flex-1 h-full rounded-[4px] transition-all hover:scale-125 hover:z-20 cursor-crosshair", color, !tick && "border border-border/5 overflow-hidden")} />
                      </TooltipTrigger>
                      <TooltipContent className="bg-popover/90 backdrop-blur-md border-border text-[10px] font-black text-popover-foreground uppercase tracking-widest p-3 rounded-xl shadow-2xl">
                        {label}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          </div>

          {/* AI Anomaly Detection Panel */}
          <AnomalyPanel
            websiteId={website.id}
            websiteUrl={website.url}
          />

          {/* Global Connectivity */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-0.5">
              <span>Global Connectivity</span>
              <span className="flex items-center gap-1.5 text-blue-500">
                <Globe className="h-3 w-3" />
                {regionalStatus.length} Regions
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {regionalStatus.length > 0 ? (
                regionalStatus.map((region) => {
                  const normalizedStatus = (region.status || '').toLowerCase();
                  const isUp = normalizedStatus === 'up';
                  const isDown = normalizedStatus === 'down' || normalizedStatus === 'unknown' || !normalizedStatus;
                  return (
                    <TooltipProvider key={region.region_name}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className={cn(
                            "flex items-center justify-between p-3 rounded-2xl border transition-all duration-300 cursor-help",
                            isUp ? "bg-emerald-500/10 border-emerald-500/30" : "bg-red-500/10 border-red-500/30",
                            isUp ? "hover:border-emerald-500/50" : "hover:border-red-500/50"
                          )}>
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className={cn(
                                "w-2 h-2 rounded-full",
                                isUp ? "bg-emerald-500 animate-pulse" : "bg-red-500"
                              )} />
                              <span className="text-[10px] font-black uppercase tracking-widest text-foreground/80 truncate">{region.region_name}</span>
                            </div>
                            <span className={cn(
                              "text-[9px] font-black tabular-nums italic",
                              isUp ? "text-emerald-500/80" : "text-red-500/80",
                              "group-hover/region:transition-colors"
                            )}>
                              {isDown ? '--' : `${region.response_time_ms}ms`}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-popover/90 backdrop-blur-md border-border text-[10px] font-black text-popover-foreground p-3 rounded-xl shadow-2xl">
                          <div className="space-y-1">
                            <p className={cn(
                              "uppercase tracking-widest font-black",
                              isUp ? "text-emerald-500" : "text-red-500"
                            )}>
                              {isUp ? "Operational" : "Offline"}
                            </p>
                            <p className="text-muted-foreground/60">
                              {isDown
                                ? `Worker not running`
                                : `Last checked: ${new Date(region.last_checked).toLocaleString()}`
                              }
                            </p>
                            {isDown && region.response_time_ms > 0 && (
                              <p className="text-muted-foreground/60">
                                Response: {region.response_time_ms}ms
                              </p>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })
              ) : (
                <div className="col-span-2 p-3 rounded-2xl bg-muted/20 border border-dashed border-border/50 flex items-center justify-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">Synchronizing Nodes...</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-border/50">
            <div className="space-y-1.5">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30">Latency Delta</p>
              <div className="flex items-center gap-2 font-black text-indigo-500 italic text-lg tracking-tighter">
                <Zap className="h-4 w-4 fill-current" strokeWidth={3} />
                <span>{website.response_time_ms || '--'}ms</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-12 px-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] bg-muted/50 hover:bg-primary hover:text-white hover:border-primary transition-all group/btn border-none outline-none shadow-sm"
              onClick={() => window.open(website.url, "_blank")}
            >
              Analyze
              <ExternalLink className="ml-2 h-3.5 w-3.5 opacity-0 group-hover/btn:opacity-100 transition-all translate-x-[-4px] group-hover/btn:translate-x-0" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
