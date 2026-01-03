import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { StatusIndicator } from "@/components/StatusIndicator";
import { 
  Activity, 
  Bell, 
  Shield, 
   
  Globe, 
  Clock, 
  BarChart3, 
  
  ArrowRight,
  Check,
  Smartphone
} from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Uptime Monitoring",
    description: "Monitor websites, APIs, and servers with checks every 30 seconds from multiple global locations.",
  },
  {
    icon: Bell,
    title: "Instant Alerts",
    description: "Get notified via SMS, email, Slack, PagerDuty, and 100+ other integrations when issues occur.",
  },
  {
    icon: Shield,
    title: "Incident Management",
    description: "Track, manage, and resolve incidents with your team. Keep stakeholders informed automatically.",
  },
  {
    icon: Globe,
    title: "Status Pages",
    description: "Beautiful public status pages that build trust with your users and reduce support tickets.",
  },
  {
    icon: Clock,
    title: "On-Call Scheduling",
    description: "Create on-call schedules and escalation policies. Never miss a critical alert again.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description: "Detailed uptime reports and SLA tracking. Export data and share with stakeholders.",
  },
];

const testimonials = [
  {
    quote: "UptimeMonitor has been a game-changer for our team. We reduced our incident response time by 70%.",
    author: "Sarah Chen",
    role: "CTO at TechCorp",
    avatar: "SC",
  },
  {
    quote: "The status page alone has cut our support tickets in half. Customers love the transparency.",
    author: "Mike Rodriguez",
    role: "VP Engineering at StartupXYZ",
    avatar: "MR",
  },
  {
    quote: "Best monitoring tool we've used. The on-call scheduling is incredibly intuitive.",
    author: "Emily Johnson",
    role: "SRE Lead at CloudScale",
    avatar: "EJ",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "Perfect for small teams and projects",
    features: [
      "10 monitors",
      "1-minute check intervals",
      "Email & SMS alerts",
      "Basic status page",
      "5 team members",
    ],
  },
  {
    name: "Professional",
    price: "$99",
    period: "/month",
    description: "For growing teams with complex needs",
    features: [
      "50 monitors",
      "30-second check intervals",
      "All integrations",
      "Custom status page",
      "Unlimited team members",
      "On-call scheduling",
      "Priority support",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations",
    features: [
      "Unlimited monitors",
      "15-second check intervals",
      "SSO & SAML",
      "Dedicated support",
      "Custom SLA",
      "Audit logs",
      "API access",
    ],
  },
];

const stats = [
  { value: "99.99%", label: "Platform uptime" },
  { value: "15B+", label: "Checks per month" },
  { value: "10k+", label: "Happy customers" },
  { value: "<1s", label: "Avg. alert time" },
];

export default function Index() {
  return (
    <div className="min-h-screen gradient-hero">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 animate-fade-in">
            <StatusIndicator status="up" size="sm" />
            <span className="text-sm font-medium">All systems operational</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Monitor Everything.
            <br />
            <span className="text-gradient">Miss Nothing.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in">
            The all-in-one monitoring platform that helps you detect outages, 
            respond faster, and keep your customers happy.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
            <Button variant="default" size="lg">
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="default" size="lg">
              View Demo
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 border-y border-border/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-gradient">{stat.value}</p>
                <p className="text-muted-foreground mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything you need to stay online</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive monitoring and incident management tools trusted by thousands of teams worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="glass-card p-6 rounded-xl hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">A dashboard you'll actually enjoy</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Beautiful, intuitive, and packed with all the information you need at a glance.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-2 glow-primary overflow-hidden">
            <div className="bg-card rounded-xl p-6">
              {/* Mock Dashboard Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Dashboard Overview</h3>
                    <p className="text-sm text-muted-foreground">Real-time monitoring status</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusIndicator status="up" showLabel />
                </div>
              </div>

              {/* Mock Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Monitors", value: "24", status: "All operational" },
                  { label: "Uptime", value: "99.98%", status: "Last 30 days" },
                  { label: "Incidents", value: "2", status: "This month" },
                  { label: "Response", value: "145ms", status: "Avg. response" },
                ].map((stat, i) => (
                  <div key={i} className="bg-secondary/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.status}</p>
                  </div>
                ))}
              </div>

              {/* Mock Monitors List */}
              <div className="space-y-2">
                {[
                  { name: "API Production", url: "api.example.com", status: "up" as const, uptime: "99.99%" },
                  { name: "Marketing Site", url: "www.example.com", status: "up" as const, uptime: "99.97%" },
                  { name: "Customer Portal", url: "app.example.com", status: "up" as const, uptime: "99.95%" },
                ].map((monitor, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <StatusIndicator status={monitor.status} size="sm" />
                      <div>
                        <p className="font-medium">{monitor.name}</p>
                        <p className="text-xs text-muted-foreground">{monitor.url}</p>
                      </div>
                    </div>
                    <span className="text-sm text-primary font-medium">{monitor.uptime}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Integrates with your favorite tools</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Connect UptimeMonitor with 100+ tools you already use. Get alerts where you work.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {["Slack", "PagerDuty", "Discord", "Teams", "Opsgenie", "Email", "SMS", "Webhooks"].map((tool) => (
              <div key={tool} className="glass-card px-6 py-3 rounded-lg">
                <span className="font-medium">{tool}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-4" id="pricing">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start free and scale as you grow. No hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index}
                className={`glass-card p-8 rounded-2xl relative ${
                  plan.popular ? 'border-primary glow-primary' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 gradient-primary rounded-full text-sm font-semibold text-primary-foreground">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  variant={plan.popular ? "default" : "outline"} 
                  className="w-full"
                >
                  {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent via-accent/5 to-transparent">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Loved by thousands of teams</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what our customers have to say about UptimeMonitor.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="glass-card p-6 rounded-xl">
                <p className="text-lg mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="glass-card rounded-3xl p-12 text-center glow-primary relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to never miss an outage again?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                Join 10,000+ teams who trust UptimeMonitor to keep their services running smoothly.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button variant="default" size="lg">
                  Start Your Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button variant="default" size="lg">
                  <Smartphone className="w-5 h-5 mr-2" />
                  Book a Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
