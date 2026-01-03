import { cn } from "@/lib/utils";

interface UptimeChartProps {
  data: { date: string; uptime: number }[];
  className?: string;
}

export function UptimeChart({ data, className }: UptimeChartProps) {
 // const maxUptime = 100;
  
  return (
    <div className={cn("glass-card p-6 rounded-xl", className)}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg">Uptime History</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">99.9%+</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning" />
            <span className="text-muted-foreground">99%+</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <span className="text-muted-foreground">&lt;99%</span>
          </div>
        </div>
      </div>
      
      <div className="relative h-48">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-muted-foreground">
          <span>100%</span>
          <span>99.5%</span>
          <span>99%</span>
        </div>
        
        {/* Chart area */}
        <div className="ml-14 h-full flex items-end gap-1">
          {data.map((item, index) => {
            const height = ((item.uptime - 98) / 2) * 100; // Scale from 98-100 to 0-100%
            const color = item.uptime >= 99.9 
              ? "bg-primary" 
              : item.uptime >= 99 
                ? "bg-warning" 
                : "bg-destructive";
            
            return (
              <div
                key={index}
                className="flex-1 flex flex-col items-center gap-2 group"
              >
                <div className="w-full relative">
                  <div
                    className={cn(
                      "w-full rounded-t-sm transition-all duration-300 hover:opacity-80",
                      color
                    )}
                    style={{ height: `${Math.max(height, 5)}%`, minHeight: '8px' }}
                  />
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-card border border-border rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {item.uptime.toFixed(2)}%
                    <br />
                    <span className="text-muted-foreground">{item.date}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* X-axis labels */}
      <div className="ml-14 flex justify-between mt-2 text-xs text-muted-foreground">
        <span>{data[0]?.date}</span>
        <span>{data[Math.floor(data.length / 2)]?.date}</span>
        <span>{data[data.length - 1]?.date}</span>
      </div>
    </div>
  );
}
