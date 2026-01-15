import { Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { SignupForm } from "@/components/signup-form";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
            <Activity className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
            UptimeMonitor
          </span>
        </Link>

        {/* Form */}
        <SignupForm />

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          By creating an account, you agree to our{" "}
          <a href="#" className="text-primary hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
