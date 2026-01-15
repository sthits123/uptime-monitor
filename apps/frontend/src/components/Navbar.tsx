import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Activity, Menu, X, LogOut, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { isAuthenticated, logout } from "@/lib/api";
import { useTheme } from "@/components/ui/theme-provider";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard", protected: true },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isAuth = isAuthenticated();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const visibleNavLinks = navLinks.filter(link => !link.protected || isAuth);

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group transition-all duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-[0_8px_16px_-4px_rgba(59,130,246,0.3)] group-hover:scale-110 transition-transform duration-500">
                <Activity className="w-5 h-5 text-white" strokeWidth={3} />
              </div>
            </div>
            <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent group-hover:to-primary transition-all duration-500 italic">
              UptimeMonitor
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {visibleNavLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "text-xs font-black uppercase tracking-[0.2em] transition-all hover:text-primary",
                  location.pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground/60"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="w-11 h-11 rounded-2xl border-border/50 bg-background/50 backdrop-blur-sm hover:bg-muted transition-all active:scale-90 border-none outline-none overflow-hidden group"
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 group-hover:text-amber-500" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 group-hover:text-blue-400" />
              </div>
              <span className="sr-only">Toggle theme</span>
            </Button>

            {isAuth ? (
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            ) : (
              <>
                <Link to="/signin">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm active:scale-95 transition-all border-none outline-none"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="w-10 h-10 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm active:scale-95 transition-all border-none outline-none"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-6 space-y-4 border-t border-border/10 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col gap-1 px-2">
              {visibleNavLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center h-12 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                    location.pathname === link.href
                      ? "bg-primary/10 text-primary shadow-inner"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="px-2 pt-4 border-t border-border/10">
              {isAuth ? (
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full h-12 rounded-xl border-border/50 font-black text-xs uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/20 active:scale-[0.98] transition-all border-none outline-none"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout Session
                </Button>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link to="/signin" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full h-12 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-muted transition-all border-none outline-none">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)}>
                    <Button className="w-full h-12 rounded-xl font-black text-xs uppercase tracking-widest bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98] border-none outline-none">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
