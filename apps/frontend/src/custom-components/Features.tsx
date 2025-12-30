import { Card } from "@/components/ui/card"
import { Bell, Globe, Shield, Zap, LineChart, Smartphone } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: Zap,
      title: "Lightning-fast checks",
      description: "Monitor your services every 30 seconds from multiple global locations for comprehensive coverage.",
    },
    {
      icon: Bell,
      title: "Smart alerting",
      description:
        "Get notified via SMS, email, Slack, or webhooks. Customize escalation policies and on-call schedules.",
    },
    {
      icon: Globe,
      title: "Global monitoring",
      description: "Check from 20+ locations worldwide to ensure your services are fast and reliable everywhere.",
    },
    {
      icon: Shield,
      title: "SSL & security",
      description: "Monitor SSL certificates, domain expiration, and security headers. Stay ahead of issues.",
    },
    {
      icon: LineChart,
      title: "Performance insights",
      description: "Track response times, uptime trends, and performance metrics with beautiful analytics.",
    },
    {
      icon: Smartphone,
      title: "Status pages",
      description: "Keep customers informed with beautiful, customizable status pages. Build trust and transparency.",
    },
  ]

  return (
    <section id="features" className="py-24 bg-card border-y border-border">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Everything you need to stay online
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              {"Comprehensive monitoring tools designed for modern development teams."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-background border-border p-6 hover:border-primary/50 transition-colors">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
