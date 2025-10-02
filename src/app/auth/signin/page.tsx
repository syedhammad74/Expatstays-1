"use client";

import { SignInForm } from "@/components/auth/SignInForm";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, Sparkles, Shield, Zap } from "lucide-react";
import Link from "next/link";
// Removed framer-motion for performance
import Image from "next/image";

export default function SignInPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push("/profile");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white to-[#FAFAFA]">
        <Loader2 className="h-8 w-8 animate-spin text-[#0B2B26]" />
      </div>
    );
  }

  if (user) {
    return null; // Will redirect to profile
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#FAFAFA] to-[#DAF1DE]/20 flex flex-col lg:flex-row overflow-y-auto md:overflow-y-hidden">
      {/* Left Side - Hero Image (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B2B26]/70 via-[#8EB69B]/55 to-[#DAF1DE]/45 z-10" />
        <Image
          src="/media/DSC01806 HDR June 25 2025/DSC01861-HDR.jpg"
          alt="Sign In Property"
          fill
          className="object-cover object-center"
          priority
        />

        {/* Overlay Content */}
        <div className="relative left-20 pb-20 z-20 flex flex-col justify-center h-full p-4 text-white">
          <div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-md"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-[#185723]" />
              <h2 className="text-xl text-white/90 font-bold">
                Luxe Properties
              </h2>
            </div>

            <h1 className="text-4xl text-[#0c4015] font-bold mb-4 leading-tight">
              Welcome Back
              <span className="block text-[#73e887]">Sign In</span>
            </h1>

            <p className="text-base mb-6 text-white/70 font-bold leading-relaxed">
              Access your account and continue your luxury journey with us.
            </p>

            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#DAF1DE]/20 flex items-center justify-center">
                  <Shield className="h-3.5 w-3.5 text-[#267834]" />
                </div>
                <span className="text-sm font-semibold text-white/80">
                  Secure Login
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#DAF1DE]/20 flex items-center justify-center">
                  <Zap className="h-3.5 w-3.5 text-[#267834]" />
                </div>
                <span className="text-sm font-semibold text-white/80">
                  Fast Access
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="flex-1 flex flex-col gap-6 items-center justify-center p-3 sm:p-5 lg:p-8">
        {/* Brand/Logo - Separated above card */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-gradient-to-br from-[#DAF1DE] to-[#8EB69B] flex items-center justify-center shadow-2xl border-4 border-white hover:scale-105 transition-transform duration-300">
            <Image src="/logo.png" alt="Logo" width={80} height={80} className="w-16 h-16 lg:w-20 lg:h-20 object-contain" />
          </div>
          <span className="text-[#0B2B26] font-bold text-3xl lg:text-4xl tracking-tight mt-4 drop-shadow-sm">
            Expat Stays
          </span>
        </div>
        
        <div className="w-full max-w-[400px] sm:max-w-[500px] lg:max-w-[600px] flex flex-col justify-center rounded-2xl lg:rounded-3xl shadow-xl border border-[#DAF1DE]/60 bg-white/95 p-4 sm:p-6 lg:p-8 max-h-[90vh] overflow-y-auto">
          <div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-3 lg:mb-4"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-[#0B2B26] mb-2">
              Sign In
            </h2>
            <p className="text-[#4A4A4A] text-xs sm:text-sm">
              Sign in to access your account and continue your journey
            </p>
          </div>

          <div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-3 lg:space-y-4"
          >
            <SignInForm onToggleMode={() => router.push("/auth/signup")} />

            <div className="text-center mt-3 pt-3 border-t border-[#DAF1DE]/40">
              <p className="text-xs sm:text-sm text-[#8EB69B]">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="font-medium text-[#0B2B26] hover:text-[#8EB69B] transition-colors underline"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
