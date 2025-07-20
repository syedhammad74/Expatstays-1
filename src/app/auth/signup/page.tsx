"use client";

import { SignUpForm } from "@/components/auth/SignUpForm";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, Sparkles, Shield, Heart } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function SignUpPage() {
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
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B2B26]/20 to-[#8EB69B]/10 z-10" />
        <Image
          src="/media/DSC01806 HDR June 25 2025/DSC01846-HDR.jpg"
          alt="Luxury Property"
          fill
          className="object-cover object-center"
          priority
        />

        {/* Overlay Content */}
        <div className="relative left-20 pb-10 z-20 flex flex-col justify-center h-full p-4 text-white">
          <motion.div
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

            <h1 className="text-4xl text-[#e2ffe7] font-bold mb-4 leading-tight">
              Discover Your Perfect
              <span className="block text-[#73e887]">Dream Home</span>
            </h1>

            <p className="text-base mb-6 text-white/70 font-bold leading-relaxed">
              Join thousands of satisfied guests who have experienced the finest
              luxury accommodations. Start your journey with us today.
            </p>

            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#DAF1DE]/20 flex items-center justify-center">
                  <Shield className="h-3.5 w-3.5 text-[#267834]" />
                </div>
                <span className="text-sm font-semibold text-white/80">
                  Secure & Trusted Platform
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#DAF1DE]/20 flex items-center justify-center">
                  <Heart className="h-3.5 w-3.5 text-[#267834]" />
                </div>
                <span className="text-sm font-semibold text-white/80">
                  Premium Customer Support
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="flex-1 flex flex-col gap-6 items-center justify-center p-3 sm:p-5 lg:p-8">
        <div className="w-full max-w-[400px] sm:max-w-[500px] lg:max-w-[600px] my-8 flex flex-col justify-center rounded-2xl lg:rounded-3xl shadow-xl border border-[#DAF1DE]/60 bg-white/95 p-4 sm:p-6 lg:p-8 max-h-[90vh] overflow-y-auto">
          {/* Brand/Logo Accent */}
          <div className="flex flex-col items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-[#DAF1DE] flex items-center justify-center mb-2 shadow-md">
              <Image src="/logo.png" alt="Logo" width={32} height={32} />
            </div>
            <span className="text-[#0B2B26] font-bold text-lg tracking-tight">
              Expat Stays
            </span>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-3 lg:mb-4"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-[#0B2B26] mb-2">
              Create Account
            </h2>
            <p className="text-[#4A4A4A] text-xs sm:text-sm">
              Join our community and start exploring amazing properties
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-3 lg:space-y-4"
          >
            <SignUpForm onToggleMode={() => router.push("/auth/signin")} />

            <div className="text-center mt-3 pt-3 border-t border-[#DAF1DE]/40">
              <p className="text-xs sm:text-sm text-[#8EB69B]">
                Already have an account?{" "}
                <Link
                  href="/auth/signin"
                  className="font-medium text-[#0B2B26] hover:text-[#8EB69B] transition-colors underline"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
