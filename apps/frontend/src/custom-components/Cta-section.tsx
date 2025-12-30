import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-24 bg-card border-t border-border">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Start monitoring in minutes
          </h2>
          <p className="text-lg text-muted-foreground mb-8 text-pretty">
            {"Join thousands of teams who trust UptimeWatch to keep their services online. No credit card required."}
          </p>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8">
            Start Free Trial
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
