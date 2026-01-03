import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MonitorCard } from "@/components/MonitorCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Grid3X3, 
  List,
  SlidersHorizontal
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const allMonitors = [
  {
    name: "API Production",
    url: "https://api.example.com",
    status: "up" as const,
    uptime: 99.99,
    responseTime: 124,
    lastChecked: "10s ago",
  },
  {
    name: "Marketing Website",
    url: "https://www.example.com",
    status: "up" as const,
    uptime: 99.97,
    responseTime: 245,
    lastChecked: "15s ago",
  },
  {
    name: "Customer Portal",
    url: "https://app.example.com",
    status: "degraded" as const,
    uptime: 99.45,
    responseTime: 890,
    lastChecked: "8s ago",
  },
  {
    name: "Payment Gateway",
    url: "https://pay.example.com",
    status: "up" as const,
    uptime: 99.99,
    responseTime: 89,
    lastChecked: "5s ago",
  },
  {
    name: "Admin Dashboard",
    url: "https://admin.example.com",
    status: "up" as const,
    uptime: 99.98,
    responseTime: 156,
    lastChecked: "12s ago",
  },
  {
    name: "CDN Endpoint",
    url: "https://cdn.example.com",
    status: "up" as const,
    uptime: 100,
    responseTime: 45,
    lastChecked: "3s ago",
  },
  {
    name: "Staging Server",
    url: "https://staging.example.com",
    status: "maintenance" as const,
    uptime: 98.5,
    responseTime: 320,
    lastChecked: "1m ago",
  },
  {
    name: "Database Primary",
    url: "https://db.example.com",
    status: "up" as const,
    uptime: 99.999,
    responseTime: 12,
    lastChecked: "2s ago",
  },
];

const statusFilters = [
  { value: "all", label: "All" },
  { value: "up", label: "Up" },
  { value: "down", label: "Down" },
  { value: "degraded", label: "Degraded" },
  { value: "maintenance", label: "Maintenance" },
];

export default function Monitors() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMonitors = allMonitors.filter((monitor) => {
    const matchesFilter = activeFilter === "all" || monitor.status === activeFilter;
    const matchesSearch = monitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          monitor.url.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen gradient-hero">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Monitors</h1>
              <p className="text-muted-foreground">
                {allMonitors.length} monitors configured • {allMonitors.filter(m => m.status === "up").length} operational
              </p>
            </div>
            <Button variant="default">
              <Plus className="w-4 h-4 mr-2" />
              Add Monitor
            </Button>
          </div>

          {/* Filters Bar */}
          <div className="glass-card p-4 rounded-xl mb-6">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search monitors by name or URL..." 
                  className="pl-9 bg-secondary/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Status Filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
                {statusFilters.map((filter) => (
                  <Button
                    key={filter.value}
                    variant={activeFilter === filter.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter(filter.value)}
                    className="whitespace-nowrap"
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  className={cn(viewMode === "grid" && "bg-secondary")}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className={cn(viewMode === "list" && "bg-secondary")}
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Monitors Grid/List */}
          {filteredMonitors.length > 0 ? (
            <div className={cn(
              "grid gap-4",
              viewMode === "grid" ? "md:grid-cols-2" : "grid-cols-1"
            )}>
              {filteredMonitors.map((monitor, index) => (
                <MonitorCard key={index} {...monitor} />
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-xl p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No monitors found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery 
                  ? `No monitors match "${searchQuery}"`
                  : `No monitors with status "${activeFilter}"`
                }
              </p>
              <Button variant="outline" onClick={() => { setSearchQuery(""); setActiveFilter("all"); }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
