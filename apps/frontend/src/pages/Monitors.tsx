import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ExternalLink, MoreVertical, Pause, Play, Plus, Search, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const monitors = [
  {
    id: 1,
    name: "Production API",
    url: "https://api.example.com",
    type: "HTTP",
    status: "up",
    uptime: 99.98,
    responseTime: 145,
    checkInterval: 30,
    enabled: true,
  },
  {
    id: 2,
    name: "Main Website",
    url: "https://example.com",
    type: "HTTP",
    status: "up",
    uptime: 99.95,
    responseTime: 89,
    checkInterval: 30,
    enabled: true,
  },
  {
    id: 3,
    name: "CDN",
    url: "https://cdn.example.com",
    type: "HTTP",
    status: "degraded",
    uptime: 98.5,
    responseTime: 456,
    checkInterval: 60,
    enabled: true,
  },
  {
    id: 4,
    name: "Database Cluster",
    url: "https://db.example.com:5432",
    type: "TCP",
    status: "up",
    uptime: 99.99,
    responseTime: 12,
    checkInterval: 30,
    enabled: true,
  },
  {
    id: 5,
    name: "Auth Service",
    url: "https://auth.example.com",
    type: "HTTP",
    status: "down",
    uptime: 95.2,
    responseTime: 0,
    checkInterval: 30,
    enabled: true,
  },
  {
    id: 6,
    name: "Backup Server",
    url: "https://backup.example.com",
    type: "HTTP",
    status: "paused",
    uptime: 99.9,
    responseTime: 0,
    checkInterval: 300,
    enabled: false,
  },
];

const Monitors = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold">Monitors</h1>
            <p className="text-muted-foreground">Manage all your monitoring endpoints</p>
          </div>
          <Button variant="link">
            <Plus className="w-4 h-4" />
            Add Monitor
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search monitors..." className="pl-10" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              All
            </Button>
            <Button variant="ghost" size="sm">
              Up
            </Button>
            <Button variant="ghost" size="sm">
              Down
            </Button>
            <Button variant="ghost" size="sm">
              Paused
            </Button>
          </div>
        </div>

        {/* Monitors Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Monitor</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Uptime</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Response</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Interval</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {monitors.map((monitor, index) => (
                <tr
                  key={monitor.id}
                  className={cn(
                    "border-t border-border hover:bg-muted/30 transition-colors",
                    index % 2 === 0 && "bg-muted/10"
                  )}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-2.5 h-2.5 rounded-full",
                          monitor.status === "up" && "bg-success",
                          monitor.status === "down" && "bg-destructive",
                          monitor.status === "degraded" && "bg-warning",
                          monitor.status === "paused" && "bg-muted-foreground"
                        )}
                      />
                      <div>
                        <p className="font-medium">{monitor.name}</p>
                        <a
                          href={monitor.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
                        >
                          {monitor.url.replace(/^https?:\/\//, "").slice(0, 30)}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium capitalize",
                        monitor.status === "up" && "bg-success/10 text-success",
                        monitor.status === "down" && "bg-destructive/10 text-destructive",
                        monitor.status === "degraded" && "bg-warning/10 text-warning",
                        monitor.status === "paused" && "bg-muted text-muted-foreground"
                      )}
                    >
                      {monitor.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 hidden md:table-cell">
                    <span className="font-medium">{monitor.uptime}%</span>
                  </td>
                  <td className="py-4 px-4 hidden lg:table-cell">
                    <span className="text-muted-foreground">
                      {monitor.responseTime > 0 ? `${monitor.responseTime}ms` : "-"}
                    </span>
                  </td>
                  <td className="py-4 px-4 hidden lg:table-cell">
                    <span className="text-muted-foreground">{monitor.checkInterval}s</span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          {monitor.enabled ? (
                            <>
                              <Pause className="w-4 h-4 mr-2" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Resume
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Monitors;
