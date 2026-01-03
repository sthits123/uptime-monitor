import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { IncidentCard } from "@/components/IncidentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Filter,
  AlertTriangle,
  Clock,
  CheckCircle
} from "lucide-react";
import { useState } from "react";
//import { cn } from "@/lib/utils";

const allIncidents = [
  {
    id: "INC-2024-005",
    title: "API Response Time Degradation",
    description: "Elevated response times detected on the primary API cluster. Investigation in progress.",
    status: "investigating" as const,
    severity: "major" as const,
    startedAt: "Today, 2:34 PM",
    affectedMonitors: ["API Production", "Payment Gateway"],
  },
  {
    id: "INC-2024-004",
    title: "CDN Cache Invalidation Issue",
    description: "Some users experiencing stale content due to cache invalidation delays.",
    status: "ongoing" as const,
    severity: "minor" as const,
    startedAt: "Today, 11:20 AM",
    affectedMonitors: ["CDN Endpoint"],
  },
  {
    id: "INC-2024-003",
    title: "Database Connection Issues",
    description: "Brief database connectivity issues caused by network congestion. All connections restored.",
    status: "resolved" as const,
    severity: "critical" as const,
    startedAt: "Yesterday, 9:15 AM",
    resolvedAt: "Yesterday, 9:45 AM",
    affectedMonitors: ["Customer Portal", "Admin Dashboard"],
  },
  {
    id: "INC-2024-002",
    title: "SSL Certificate Renewal Delay",
    description: "SSL certificate auto-renewal failed. Manually renewed and monitoring.",
    status: "resolved" as const,
    severity: "major" as const,
    startedAt: "Jan 1, 2025, 3:00 PM",
    resolvedAt: "Jan 1, 2025, 3:30 PM",
    affectedMonitors: ["Marketing Website"],
  },
  {
    id: "INC-2024-001",
    title: "Scheduled Maintenance - Database Upgrade",
    description: "Planned maintenance window for database version upgrade. No service impact expected.",
    status: "resolved" as const,
    severity: "minor" as const,
    startedAt: "Dec 28, 2024, 2:00 AM",
    resolvedAt: "Dec 28, 2024, 4:00 AM",
    affectedMonitors: ["Database Primary"],
  },
];

const statusFilters = [
  { value: "all", label: "All", icon: null },
  { value: "ongoing", label: "Ongoing", icon: AlertTriangle },
  { value: "investigating", label: "Investigating", icon: Clock },
  { value: "resolved", label: "Resolved", icon: CheckCircle },
];

export default function Incidents() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredIncidents = allIncidents.filter((incident) => {
    const matchesFilter = activeFilter === "all" || incident.status === activeFilter;
    const matchesSearch = incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          incident.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          incident.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const incidentStats = {
    ongoing: allIncidents.filter(i => i.status === "ongoing").length,
    investigating: allIncidents.filter(i => i.status === "investigating").length,
    resolved: allIncidents.filter(i => i.status === "resolved").length,
  };

  return (
    <div className="min-h-screen gradient-hero">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Incidents</h1>
              <p className="text-muted-foreground">
                Track and manage all incidents across your infrastructure.
              </p>
            </div>
            <Button variant="default">
              <Plus className="w-4 h-4 mr-2" />
              Report Incident
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="glass-card p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{incidentStats.ongoing}</p>
                  <p className="text-sm text-muted-foreground">Ongoing</p>
                </div>
              </div>
            </div>
            <div className="glass-card p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{incidentStats.investigating}</p>
                  <p className="text-sm text-muted-foreground">Investigating</p>
                </div>
              </div>
            </div>
            <div className="glass-card p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{incidentStats.resolved}</p>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="glass-card p-4 rounded-xl mb-6">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search incidents..." 
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
                    className="whitespace-nowrap gap-2"
                  >
                    {filter.icon && <filter.icon className="w-4 h-4" />}
                    {filter.label}
                  </Button>
                ))}
              </div>

              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Incidents List */}
          {filteredIncidents.length > 0 ? (
            <div className="space-y-4">
              {filteredIncidents.map((incident) => (
                <IncidentCard key={incident.id} {...incident} />
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-xl p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No incidents found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery 
                  ? `No incidents match "${searchQuery}"`
                  : activeFilter !== "all"
                    ? `No ${activeFilter} incidents`
                    : "All systems are running smoothly!"
                }
              </p>
              {(searchQuery || activeFilter !== "all") && (
                <Button variant="outline" onClick={() => { setSearchQuery(""); setActiveFilter("all"); }}>
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
