import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import MonitorCard from "@/components/dashboard/MonitorCard";
import { Button } from "@/components/ui/button";
import { Activity, AlertTriangle, Clock, Plus, TrendingUp } from "lucide-react";

const monitors = [
  {
    name: "Production API",
    url: "https://api.example.com",
    status: "up" as const,
    uptime: 99.98,
    responseTime: 145,
    lastChecked: "30s ago",
  },
  {
    name: "Main Website",
    url: "https://example.com",
    status: "up" as const,
    uptime: 99.95,
    responseTime: 89,
    lastChecked: "15s ago",
  },
  {
    name: "CDN",
    url: "https://cdn.example.com",
    status: "degraded" as const,
    uptime: 98.5,
    responseTime: 456,
    lastChecked: "45s ago",
  },
  {
    name: "Database Cluster",
    url: "https://db.example.com:5432",
    status: "up" as const,
    uptime: 99.99,
    responseTime: 12,
    lastChecked: "10s ago",
  },
  {
    name: "Auth Service",
    url: "https://auth.example.com",
    status: "down" as const,
    uptime: 95.2,
    responseTime: 0,
    lastChecked: "5m ago",
  },
  {
    name: "Payment Gateway",
    url: "https://payments.example.com",
    status: "up" as const,
    uptime: 99.97,
    responseTime: 234,
    lastChecked: "20s ago",
  },
];

const Dashboard = () => {
  const upCount = monitors.filter((m) => m.status === "up").length;
  const downCount = monitors.filter((m) => m.status === "down").length;
  const avgUptime = monitors.reduce((acc, m) => acc + m.uptime, 0) / monitors.length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Monitor your services in real-time</p>
          </div>
          <Button variant="link">
            <Plus className="w-4 h-4" />
            Add Monitor
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Monitors"
            value={monitors.length}
            icon={Activity}
          />
          <StatCard
            title="Currently Up"
            value={upCount}
            change={`${downCount} down`}
            changeType={downCount > 0 ? "negative" : "positive"}
            icon={TrendingUp}
          />
          <StatCard
            title="Average Uptime"
            value={`${avgUptime.toFixed(2)}%`}
            change="+0.05%"
            changeType="positive"
            icon={Clock}
          />
          <StatCard
            title="Open Incidents"
            value={downCount}
            changeType={downCount > 0 ? "negative" : "neutral"}
            icon={AlertTriangle}
          />
        </div>

        {/* Monitors List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-xl font-semibold">Monitors</h2>
            <Button variant="ghost" size="sm">
              View all
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {monitors.map((monitor) => (
              <MonitorCard key={monitor.name} {...monitor} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;