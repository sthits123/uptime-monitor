import { 
	Zap, 
	Bell, 
	Globe, 
	Shield, 
	BarChart3, 
	Users,
	Clock,
	Smartphone
  } from "lucide-react";
  
  const features = [
	{
	  icon: Zap,
	  title: "30-Second Checks",
	  description: "Monitor your services every 30 seconds from multiple locations worldwide.",
	},
	{
	  icon: Bell,
	  title: "Multi-Channel Alerts",
	  description: "Get notified via SMS, email, Slack, Discord, PagerDuty, and webhooks.",
	},
	{
	  icon: Globe,
	  title: "Global Monitoring",
	  description: "Check availability from 20+ locations across North America, Europe, and Asia.",
	},
	{
	  icon: Shield,
	  title: "SSL Monitoring",
	  description: "Get alerted before your SSL certificates expire. Never miss a renewal.",
	},
	{
	  icon: BarChart3,
	  title: "Detailed Analytics",
	  description: "Track response times, uptime percentages, and performance trends.",
	},
	{
	  icon: Users,
	  title: "Team Collaboration",
	  description: "Invite team members, create on-call schedules, and manage escalations.",
	},
	{
	  icon: Clock,
	  title: "Incident Management",
	  description: "Track incidents, set maintenance windows, and analyze root causes.",
	},
	{
	  icon: Smartphone,
	  title: "Status Pages",
	  description: "Beautiful public status pages to keep your customers informed.",
	},
  ];
  
  const Features = () => {
	return (
	  <section id="features" className="py-20 lg:py-32 bg-muted/30">
		<div className="container mx-auto px-4">
		  <div className="text-center max-w-2xl mx-auto mb-16">
			<h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
			  Everything you need to stay online
			</h2>
			<p className="text-lg text-muted-foreground">
			  Comprehensive monitoring with all the features you need to ensure your services are always available.
			</p>
		  </div>
  
		  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			{features.map((feature, index) => (
			  <div
				key={feature.title}
				className="group p-6 bg-card rounded-xl border border-border hover:border-primary/50 hover:shadow-card transition-all duration-300 animate-fade-in"
				style={{ animationDelay: `${index * 0.1}s` }}
			  >
				<div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
				  <feature.icon className="w-6 h-6 text-primary" />
				</div>
				<h3 className="font-heading font-semibold text-lg mb-2">{feature.title}</h3>
				<p className="text-muted-foreground text-sm">{feature.description}</p>
			  </div>
			))}
		  </div>
		</div>
	  </section>
	);
  };
  
  export default Features;
  