import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StatsCard } from "@/components/StatsCard";
import { MonitorCard } from "@/components/MonitorCard";
import { IncidentCard } from "@/components/IncidentCard";
import { UptimeChart } from "@/components/UptimeChart";
import { 
  Activity, 
  Shield, 
  Clock, 
  AlertTriangle,
  Plus,
  Filter,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const monitors = [
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
];

const recentIncidents = [
  {
    id: "INC-2024-001",
    title: "API Response Time Degradation",
    description: "Elevated response times detected on the primary API cluster. Investigation in progress.",
    status: "investigating" as const,
    severity: "major" as const,
    startedAt: "Today, 2:34 PM",
    affectedMonitors: ["API Production", "Payment Gateway"],
  },
  {
    id: "INC-2024-000",
    title: "Database Connection Issues",
    description: "Brief database connectivity issues caused by network congestion.",
    status: "resolved" as const,
    severity: "minor" as const,
    startedAt: "Yesterday, 9:15 AM",
    resolvedAt: "Yesterday, 9:45 AM",
    affectedMonitors: ["Customer Portal"],
  },
];

const uptimeData = Array.from({ length: 14 }, (_, i) => ({
  date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  uptime: 99 + Math.random() * 1,
}));

export default function Dashboard() {
  return (
    <div className="min-h-screen gradient-hero">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back! Here's an overview of your monitoring status.</p>
            </div>
            <Button variant="default">
              <Plus className="w-4 h-4 mr-2" />
              Add Monitor
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard
              title="Total Monitors"
              value={24}
              subtitle="4 new this month"
              icon={Activity}
              trend={{ value: 12, isPositive: true }}
            />
            <StatsCard
              title="Average Uptime"
              value="99.94%"
              subtitle="Last 30 days"
              icon={Shield}
              trend={{ value: 0.02, isPositive: true }}
            />
            <StatsCard
              title="Avg Response Time"
              value="145ms"
              subtitle="Across all monitors"
              icon={Clock}
              trend={{ value: 8, isPositive: false }}
            />
            <StatsCard
              title="Open Incidents"
              value={1}
              subtitle="1 investigating"
              icon={AlertTriangle}
            />
          </div>

          {/* Uptime Chart */}
          <UptimeChart data={uptimeData} className="mb-8" />

          {/* Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Monitors Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Active Monitors</h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search monitors..." 
                      className="pl-9 w-48 bg-secondary/50"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid gap-4">
                {monitors.map((monitor, index) => (
                  <MonitorCard key={index} {...monitor} />
                ))}
              </div>
            </div>

            {/* Recent Incidents Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Recent Incidents</h2>
              <div className="space-y-4">
                {recentIncidents.map((incident) => (
                  <IncidentCard key={incident.id} {...incident} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
