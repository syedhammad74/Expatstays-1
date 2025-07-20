"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Eye,
  EyeOff,
  Check,
  User,
  Mail,
  Lock,
  Phone,
} from "lucide-react";

interface SignUpFormProps {
  onToggleMode: () => void;
  onClose?: () => void;
}

export function SignUpForm({ onToggleMode, onClose }: SignUpFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName) {
      setError("Please enter your first and last name");
      return false;
    }
    if (!formData.email) {
      setError("Please enter your email address");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const displayName = `${formData.firstName} ${formData.lastName}`;
      await signUp(formData.email, formData.password, displayName);
      setSuccess(true);
      // Don't close immediately - show success message
    } catch (err: any) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError("");

    try {
      await signInWithGoogle();
      onClose?.();
    } catch (err: any) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (code: string) => {
    switch (code) {
      case "auth/email-already-in-use":
        return "An account with this email already exists.";
      case "auth/weak-password":
        return "Password is too weak. Please choose a stronger password.";
      case "auth/invalid-email":
        return "Invalid email address.";
      case "auth/operation-not-allowed":
        return "Account creation is currently disabled.";
      default:
        return "An error occurred. Please try again.";
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#DAF1DE] flex items-center justify-center mx-auto">
          <Check className="h-8 w-8 text-[#0B2B26]" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-[#0B2B26] mb-2">
            Account Created!
          </h3>
          <p className="text-[#4A4A4A] mb-4">
            We've sent a verification email to {formData.email}
          </p>
        </div>

        <Alert className="bg-[#DAF1DE]/20 border-[#8EB69B]/40">
          <AlertDescription className="text-[#0B2B26]">
            Please check your email and click the verification link to complete
            your registration.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <Button
            className="w-full bg-[#0B2B26] hover:bg-[#235347] text-white"
            onClick={onToggleMode}
          >
            Sign In Now
          </Button>
          {onClose && (
            <Button
              variant="outline"
              className="w-full border-[#DAF1DE] text-[#0B2B26] hover:bg-[#DAF1DE]/20"
              onClick={onClose}
            >
              Close
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white/90 rounded-2xl shadow-lg border border-[#DAF1DE] px-4 py-6 sm:px-6 sm:py-8 max-w-md mx-auto font-sans md:bg-transparent md:shadow-none md:border-none md:rounded-none md:px-0 md:py-0">
      {error && (
        <Alert
          variant="destructive"
          className="border-red-200 bg-red-50 md:bg-inherit md:border-none"
        >
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 md:space-y-3">
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 md:grid md:grid-cols-2 md:gap-3">
          <div className="space-y-2 md:space-y-1.5">
            <Label
              htmlFor="firstName"
              className="text-base font-semibold text-[#0B2B26] md:text-xs md:font-medium"
            >
              First Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#8EB69B] md:h-4 md:w-4" />
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder="John"
                className="pl-12 h-12 text-base border-[#DAF1DE] focus:border-[#8EB69B] focus:ring-[#8EB69B]/20 rounded-xl bg-white/95 shadow-sm md:pl-9 md:h-10 md:text-sm md:rounded-buttons md:bg-white md:shadow-none"
                required
              />
            </div>
          </div>
          <div className="space-y-2 md:space-y-1.5">
            <Label
              htmlFor="lastName"
              className="text-base font-semibold text-[#0B2B26] md:text-xs md:font-medium"
            >
              Last Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#8EB69B] md:h-4 md:w-4" />
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder="Doe"
                className="pl-12 h-12 text-base border-[#DAF1DE] focus:border-[#8EB69B] focus:ring-[#8EB69B]/20 rounded-xl bg-white/95 shadow-sm md:pl-9 md:h-10 md:text-sm md:rounded-buttons md:bg-white md:shadow-none"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-2 md:space-y-1.5">
          <Label
            htmlFor="email"
            className="text-base font-semibold text-[#0B2B26] md:text-xs md:font-medium"
          >
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#8EB69B] md:h-4 md:w-4" />
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="john@example.com"
              className="pl-12 h-12 text-base border-[#DAF1DE] focus:border-[#8EB69B] focus:ring-[#8EB69B]/20 rounded-xl bg-white/95 shadow-sm md:pl-9 md:h-10 md:text-sm md:rounded-buttons md:bg-white md:shadow-none"
              required
            />
          </div>
        </div>

        <div className="space-y-2 md:space-y-1.5">
          <Label
            htmlFor="password"
            className="text-base font-semibold text-[#0B2B26] md:text-xs md:font-medium"
          >
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#8EB69B] md:h-4 md:w-4" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="Create a password"
              className="pl-12 pr-12 h-12 text-base border-[#DAF1DE] focus:border-[#8EB69B] focus:ring-[#8EB69B]/20 rounded-xl bg-white/95 shadow-sm md:pl-9 md:pr-9 md:h-10 md:text-sm md:rounded-buttons md:bg-white md:shadow-none"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-[#8EB69B] md:px-2 md:py-1"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 md:h-4 md:w-4" />
              ) : (
                <Eye className="h-5 w-5 md:h-4 md:w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-2 md:space-y-1.5">
          <Label
            htmlFor="confirmPassword"
            className="text-base font-semibold text-[#0B2B26] md:text-xs md:font-medium"
          >
            Confirm Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#8EB69B] md:h-4 md:w-4" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              placeholder="Confirm your password"
              className="pl-12 pr-12 h-12 text-base border-[#DAF1DE] focus:border-[#8EB69B] focus:ring-[#8EB69B]/20 rounded-xl bg-white/95 shadow-sm md:pl-9 md:pr-9 md:h-10 md:text-sm md:rounded-buttons md:bg-white md:shadow-none"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-[#8EB69B] md:px-2 md:py-1"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 md:h-4 md:w-4" />
              ) : (
                <Eye className="h-5 w-5 md:h-4 md:w-4" />
              )}
            </Button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-[#0B2B26] hover:bg-[#235347] text-white h-12 text-base font-semibold rounded-xl shadow-md transition-all duration-200 md:h-10 md:text-sm md:font-medium md:rounded-buttons md:shadow-none"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin md:h-4 md:w-4" />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[#DAF1DE]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-4 text-[#8EB69B] font-medium">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full border-[#DAF1DE] text-[#0B2B26] hover:bg-[#DAF1DE]/20 h-12 rounded-xl font-semibold shadow-sm md:h-10 md:text-sm md:rounded-buttons md:font-medium md:shadow-none"
        onClick={handleGoogleSignUp}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin md:h-4 md:w-4" />
        ) : (
          <svg className="mr-2 h-5 w-5 md:h-4 md:w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        )}
        Continue with Google
      </Button>
    </div>
  );
}
