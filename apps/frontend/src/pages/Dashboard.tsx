import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Plus,
  Globe,
  Loader2,
  BarChart3,
  ShieldCheck,
  Zap,
  Search,
  Activity,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient, type Website, isAuthenticated } from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { MonitorCard } from "@/components/MonitorCard";

export default function Dashboard() {
  const navigate = useNavigate();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newWebsiteUrl, setNewWebsiteUrl] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/signin");
      return;
    }
    fetchWebsites();

    const interval = setInterval(fetchWebsites, 15000);
    return () => clearInterval(interval);
  }, [navigate]);

  const fetchWebsites = async () => {
    try {
      const data = await apiClient.getWebsites();
      setWebsites(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWebsite = async () => {
    if (!newWebsiteUrl.trim()) {
      toast.error("Endpoint URL is required");
      return;
    }

    let url = newWebsiteUrl.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }

    try {
      setIsCreating(true);
      await apiClient.createWebsite({ url });
      toast.success("Service added to tracking");
      setNewWebsiteUrl("");
      setIsDialogOpen(false);
      fetchWebsites();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Deployment failed");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteSuccess = (id: string) => {
    setWebsites(prev => prev.filter(w => w.id !== id));
  };

  const filteredWebsites = websites.filter(w =>
    w.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 transition-colors duration-700 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_-10%,hsl(var(--primary)/0.08),transparent_60%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <Navbar />

      <main className="pt-32 pb-20 relative z-10">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Dashboard Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md shadow-inner">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Global Mesh Active</span>
              </div>
              <h1 className="text-6xl font-black tracking-tighter leading-none text-foreground mb-4">
                UptimeMonitor <span className="text-muted-foreground/30">Dashboard</span>
              </h1>
              <p className="text-muted-foreground text-xl font-medium max-w-lg leading-relaxed">
                Real-time observability and latency metrics across your distributed infrastructure.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="relative group/search">
                <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-lg opacity-0 group-focus-within/search:opacity-100 transition-opacity" />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within/search:text-primary transition-colors" />
                <Input
                  placeholder="Filter infrastructure..."
                  className="pl-12 h-12 w-full sm:w-72 bg-muted/40 backdrop-blur-md border-border/50 rounded-2xl focus:border-primary/50 transition-all font-bold text-sm shadow-inner"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="h-12 px-8 rounded-2xl bg-primary hover:bg-primary/90 shadow-[0_10px_30px_-10px_hsl(var(--primary)/0.5)] transition-all hover:scale-[1.05] active:scale-[0.98] font-black text-xs uppercase tracking-widest border-none outline-none">
                    <Plus className="mr-3 h-5 w-5" strokeWidth={3} />
                    Deploy Monitor
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden rounded-[2.5rem] border-border/50 bg-background/80 backdrop-blur-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] transition-all">
                  <div className="p-1 relative isolate">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -z-10 animate-UptimeMonitor" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 blur-[80px] -z-10" />

                    <div className="p-10">
                      <DialogHeader className="mb-10 p-0 text-left">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-primary/10 border border-primary/20 flex items-center justify-center mb-8 shadow-inner shadow-primary/20">
                          <Zap className="h-8 w-8 text-primary" strokeWidth={2.5} />
                        </div>
                        <DialogTitle className="text-4xl font-black tracking-tighter text-foreground mb-4 leading-none">
                          Initialize Node
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground text-lg font-medium leading-relaxed max-w-[320px]">
                          Configure a high-frequency health probe for your infrastructure.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-10">
                        <div className="space-y-4">
                          <Label htmlFor="url" className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 ml-1">
                            Target Endpoint
                          </Label>
                          <div className="relative group">
                            <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-xl group-focus-within:bg-primary/10 transition-all opacity-0 group-focus-within:opacity-100" />
                            <div className="relative flex items-center">
                              <Globe className="absolute left-5 h-5 w-5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                              <Input
                                id="url"
                                placeholder="api.example.com or https://..."
                                className="h-16 pl-14 pr-6 text-lg rounded-2xl bg-muted/40 border-border/50 focus:border-primary/50 text-foreground placeholder:text-muted-foreground/20 transition-all font-bold shadow-inner"
                                value={newWebsiteUrl}
                                onChange={(e) => setNewWebsiteUrl(e.target.value)}
                                autoFocus
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                          <Button
                            variant="outline"
                            className="flex-1 h-16 rounded-2xl font-black text-xs uppercase tracking-widest border-border/50 hover:bg-muted hover:text-foreground transition-all outline-none"
                            onClick={() => setIsDialogOpen(false)}
                            disabled={isCreating}
                          >
                            Cancel
                          </Button>
                          <Button
                            className="flex-[1.5] h-16 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 transition-all active:scale-[0.97] border-none outline-none"
                            onClick={handleCreateWebsite}
                            disabled={isCreating}
                          >
                            {isCreating ? (
                              <Loader2 className="h-6 w-6 animate-spin text-white" />
                            ) : (
                              "Activate UptimeMonitor"
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-24 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
            {[
              { label: "Active Nodes", value: websites.length, icon: Globe, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
              { label: "Operational", value: websites.filter(w => w.status?.toLowerCase() === 'up').length, icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
              { label: "Critical Failures", value: websites.filter(w => w.status?.toLowerCase() === 'down').length, icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" },
              { label: "Global Latency", value: "124ms", icon: BarChart3, color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
            ].map((stat, i) => (
              <div key={i} className="relative group p-8 rounded-[2.5rem] bg-card/40 backdrop-blur-xl border border-border/50 hover:bg-card/60 transition-all duration-500 shadow-xl overflow-hidden">
                <div className={cn("absolute top-0 right-0 w-32 h-32 blur-[60px] -z-1 opacity-20 transition-opacity group-hover:opacity-40", stat.bg)} />
                <div className="flex items-center justify-between mb-8">
                  <div className={cn("p-4 rounded-2xl border shadow-inner transition-transform group-hover:scale-110 duration-500", stat.bg, stat.color, stat.border)}>
                    <stat.icon className="h-6 w-6" strokeWidth={2.5} />
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="h-1.5 w-12 rounded-full bg-muted overflow-hidden">
                      <div className={cn("h-full rounded-full transition-all duration-1000", stat.bg.replace('/10', ''))} style={{ width: '65%' }} />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-2">{stat.label}</p>
                  <p className="text-4xl font-black text-foreground tabular-nums tracking-tighter italic">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Infrastructure Status</h2>
              <div className="h-px flex-1 mx-8 bg-gradient-to-r from-border/5 via-border/5 to-transparent" />
            </div>

            {loading && websites.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-72 rounded-[2.5rem] bg-card/40 border border-border/50 animate-pulse relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                  </div>
                ))}
              </div>
            ) : filteredWebsites.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-40 rounded-[3rem] border-2 border-dashed border-border/50 bg-card/20 backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />
                <div className="w-28 h-28 rounded-full bg-muted/50 flex items-center justify-center mb-10 border border-border/50 relative">
                  <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-pulse" />
                  <Activity className="h-12 w-12 text-muted-foreground/30 relative z-10" />
                </div>
                <h3 className="text-4xl font-black mb-4 text-foreground tracking-tighter italic relative z-10">Telemetry Void</h3>
                <p className="text-muted-foreground text-center max-w-sm mb-12 font-medium text-lg leading-relaxed relative z-10">
                  {searchQuery ? "Your search parameters returned no active transmissions." : "No infrastructure nodes are currently broadcasting telemetry data to the mesh."}
                </p>
                {!searchQuery && (
                  <Button onClick={() => setIsDialogOpen(true)} className="rounded-2xl h-16 px-12 font-black text-xs uppercase tracking-[0.2em] bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/20 transition-all active:scale-95 border-none outline-none relative z-10">
                    Initialize Uplink
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredWebsites.map((website) => (
                  <MonitorCard
                    key={website.id}
                    website={website}
                    onDelete={handleDeleteSuccess}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
