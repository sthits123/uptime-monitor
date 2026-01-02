import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Activity, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === "/";

  const navLinks = isLanding
    ? [
        { href: "#features", label: "Features" },
        { href: "#pricing", label: "Pricing" },
        { href: "#testimonials", label: "Testimonials" },
      ]
    : [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/monitors", label: "Monitors" },
        { href: "/incidents", label: "Incidents" },
        { href: "/status", label: "Status Page" },
      ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-xl">PingGuard</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isLanding ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="link">Start Free</Button>
                </Link>
              </>
            ) : (
              <Link to="/settings">
                <Button variant="outline" size="sm">
                  Settings
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {isLanding && (
                <div className="flex flex-col gap-2 pt-4 border-t border-border">
                  <Link to="/dashboard">
                    <Button variant="ghost" className="w-full">Sign In</Button>
                  </Link>
                  <Link to="/dashboard">
                    <Button variant="link" className="w-full">Start Free</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
