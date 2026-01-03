import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CTO at TechFlow",
    content: "UptimeMonitor has been instrumental in maintaining our 99.99% uptime. The alerting system is incredibly fast and reliable.",
    avatar: "SC",
  },
  {
    name: "Marcus Rodriguez",
    role: "DevOps Lead at Scaler",
    content: "We switched from three different monitoring tools to just UptimeMonitor. It does everything we need and more.",
    avatar: "MR",
  },
  {
    name: "Emily Watson",
    role: "Founder at Startup.io",
    content: "The status page feature alone is worth it. Our customers love the transparency it provides.",
    avatar: "EW",
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Trusted by thousands of teams
          </h2>
          <p className="text-lg text-muted-foreground">
            See what our customers have to say about UptimeMonitor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="p-6 bg-card rounded-xl border border-border animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-warning text-warning" />
                ))}
              </div>
              <p className="text-foreground mb-6">"{testimonial.content}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center text-primary-foreground font-semibold text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-muted-foreground text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
