export function Stats() {
	const stats = [
	  { value: "99.99%", label: "Uptime SLA", company: "Guaranteed" },
	  { value: "<30s", label: "Alert time", company: "Average response" },
	  { value: "200+", label: "Integrations", company: "Supported" },
	  { value: "24/7", label: "Monitoring", company: "Global coverage" },
	]
  
	return (
	  <section className="border-y border-border bg-card py-16">
		<div className="container mx-auto px-4">
		  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
			{stats.map((stat, index) => (
			  <div key={index} className="text-center">
				<div className="text-4xl md:text-5xl font-bold text-foreground mb-2">{stat.value}</div>
				<div className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</div>
				<div className="text-xs text-muted-foreground/70">{stat.company}</div>
			  </div>
			))}
		  </div>
		</div>
	  </section>
	)
  }
  