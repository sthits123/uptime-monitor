import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        {/* Stats Grid */}

        {/* Content Grid */}
        {/* Monitors Section */}
      </main>

      <Footer />
    </div>
  );
}
