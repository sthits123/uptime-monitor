

import { Card } from "@/components/ui/card"
import { CheckCircle2, XCircle, Clock } from "lucide-react"
import { useState, useEffect } from "react"

export function Monitor() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 3)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const monitors = [
    { name: "Production API", status: "operational", response: "45ms", uptime: "100%" },
    { name: "Marketing Site", status: "operational", response: "120ms", uptime: "99.98%" },
    { name: "Database Cluster", status: "operational", response: "12ms", uptime: "100%" },
    { name: "CDN Edge Network", status: "operational", response: "8ms", uptime: "99.99%" },
    { name: "Auth Service", status: "degraded", response: "340ms", uptime: "99.95%" },
    { name: "Payment Gateway", status: "operational", response: "95ms", uptime: "100%" },
  ]

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Real-time monitoring at a glance
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              {
                "See the health of all your services in one beautiful dashboard. Get alerted instantly when issues arise."
              }
            </p>
          </div>

          <Card className="bg-card border-border p-6 md:p-8">
            <div className="space-y-3">
              {monitors.map((monitor, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                    activeIndex === index % 3 ? "bg-primary/5 border-primary/20" : "bg-card border-border"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {monitor.status === "operational" ? (
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    ) : monitor.status === "degraded" ? (
                      <Clock className="h-5 w-5 text-accent flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                    )}
                    <span className="font-medium text-foreground">{monitor.name}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="hidden sm:block text-right">
                      <div className="text-sm font-mono text-muted-foreground">{monitor.response}</div>
                      <div className="text-xs text-muted-foreground/70">Response</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-foreground">{monitor.uptime}</div>
                      <div className="text-xs text-muted-foreground/70">Uptime</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
