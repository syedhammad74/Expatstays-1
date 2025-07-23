"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  Sparkles,
  CheckCircle,
  Star,
  Shield,
  Loader2,
  AlertCircle,
  Building,
  Zap,
  Award,
  Heart,
} from "lucide-react";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/layout/Header";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

// Define FormData and FormErrors types if not already defined.
type FormData = {
  fullName: string;
  email: string;
  phone: string;
  reason: string;
  message: string;
};
type FormErrors = Partial<Record<keyof FormData, string>>;

// Enhanced decorative SVG blob for hero
const HeroBlob = () => (
  <svg
    className="absolute -top-20 -left-32 w-[480px] h-[360px] z-0 opacity-30"
    viewBox="0 0 480 360"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M240 80C320 80 400 120 400 200C400 280 320 320 240 320C160 320 80 280 80 200C80 120 160 80 240 80Z"
      fill="url(#heroGradient)"
      fillOpacity="0.15"
    />
    <defs>
      <linearGradient
        id="heroGradient"
        x1="0"
        y1="0"
        x2="480"
        y2="360"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#DAF1DE" />
        <stop offset="0.5" stopColor="#8EB69B" />
        <stop offset="1" stopColor="#235347" />
      </linearGradient>
    </defs>
  </svg>
);

// Enhanced decorative sparkle
const Sparkle = ({ className = "" }) => (
  <Sparkles
    className={`text-[#F7E9B7] opacity-90 animate-pulse ${className}`}
  />
);

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    reason: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone validation function
  const validatePhone = (phone: string): boolean => {
    if (!phone) return true; // Phone is optional
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""));
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Reason validation
    if (!formData.reason) {
      newErrors.reason = "Please select a reason for inquiry";
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Email sending function (simulated)
  const sendEmail = async (): Promise<{
    success: boolean;
    message: string;
  }> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate success (in real implementation, this would be an actual API call)
    return { success: true, message: "Message sent successfully!" };
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setShowError(false);
    setErrorMessage("");

    try {
      const result = await sendEmail();

      if (result.success) {
        setShowSuccess(true);
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          reason: "",
          message: "",
        });
        setErrors({});
      } else {
        setShowError(true);
        setErrorMessage(result.message);
      }
    } catch {
      setShowError(true);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      content: "+971 50 123 4567",
      link: "tel:+971501234567",
    },
    {
      icon: Mail,
      title: "Email",
      content: "hello@expatluxe.com",
      link: "mailto:hello@expatluxe.com",
    },
    {
      icon: MapPin,
      title: "Office",
      content: "Business Bay, Dubai, UAE",
      link: "https://maps.google.com",
    },
    {
      icon: Clock,
      title: "Hours",
      content: "Mon-Fri: 9AM-6PM GST",
      link: null,
    },
  ];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-white via-[#FAFDFC] to-[#F5F9F8]">
        <Header />

        {/* Hero Section - Enhanced */}
        <section className="relative overflow-hidden bg-gradient-to-br from-white via-[#FAFDFC] to-[#F5F9F8] pb-12  sm:pb-16 lg:pb-24 pt-10">
          <HeroBlob />

          {/* Decorative elements */}
          <div className="absolute top-20 right-10 lg:right-20 z-10">
            <Sparkle className="w-6 h-6 text-[#8EB69B] opacity-60" />
          </div>
          <div className="absolute bottom-20 left-10 lg:left-20 z-10">
            <Sparkle className="w-4 h-4 text-[#F7E9B7] opacity-80" />
          </div>

          <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center max-w-4xl mx-auto"
            >
              {/* Enhanced badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#DAF1DE] to-[#8EB69B]/20 border border-[#8EB69B]/30 text-[#235347] text-sm font-semibold mb-8 shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                Get in Touch
                <Sparkle className="w-3 h-3" />
              </motion.div>

              {/* Enhanced title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#051F20] leading-tight tracking-tight mb-4 sm:mb-6"
              >
                Let&apos;s Start a
                <span className="block text-[#8EB69B]">Conversation</span>
              </motion.h1>

              {/* Enhanced subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg sm:text-xl lg:text-2xl text-[#235347] max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-12 px-4"
              >
                Ready to transform your Dubai experience? Our expert team is
                here to guide you through every step of your luxury journey.
              </motion.p>

              {/* Enhanced stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex flex-wrap justify-center gap-8 lg:gap-12"
              >
                <div className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-[#8EB69B] mb-2">
                    500+
                  </div>
                  <div className="text-sm text-[#235347] font-medium">
                    Happy Clients
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-[#8EB69B] mb-2">
                    24/7
                  </div>
                  <div className="text-sm text-[#235347] font-medium">
                    Support
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-[#8EB69B] mb-2">
                    5★
                  </div>
                  <div className="text-sm text-[#235347] font-medium">
                    Rating
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Contact Form Section - Enhanced */}
        <section className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start"
            >
              {/* Enhanced Form Card */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-[#8EB69B]/10 to-[#DAF1DE]/20 border-b border-[#DAF1DE]/30 pb-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8EB69B] to-[#235347] flex items-center justify-center shadow-lg">
                        <MessageSquare className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold text-[#051F20]">
                          Send us a Message
                        </CardTitle>
                        <p className="text-[#235347] text-sm mt-1">
                          We&apos;ll get back to you within 24 hours
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Success/Error Messages */}
                      <AnimatePresence>
                        {showSuccess && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 flex items-center gap-3"
                          >
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-green-800 font-medium">
                              Message sent successfully! We&apos;ll get back to
                              you soon.
                            </span>
                          </motion.div>
                        )}

                        {showError && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4 flex items-center gap-3"
                          >
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <span className="text-red-800 font-medium">
                              {errorMessage}
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Enhanced Form Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label
                            htmlFor="fullName"
                            className="text-sm font-semibold text-[#235347] flex items-center gap-2"
                          >
                            Full Name *<span className="text-[#8EB69B]">●</span>
                          </Label>
                          <div className="relative">
                            <Input
                              id="fullName"
                              name="fullName"
                              type="text"
                              value={formData.fullName}
                              onChange={handleInputChange}
                              className={`w-full rounded-xl border-2 bg-white/50 backdrop-blur-sm px-4 py-3 text-[#051F20] placeholder:text-[#8EB69B]/60 focus:border-[#8EB69B] focus:ring-2 focus:ring-[#8EB69B]/20 transition-all duration-300 ${
                                errors.fullName
                                  ? "border-red-300"
                                  : "border-[#DAF1DE]"
                              }`}
                              placeholder="Enter your full name"
                            />
                          </div>
                          {errors.fullName && (
                            <p className="text-red-500 text-sm flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.fullName}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="email"
                            className="text-sm font-semibold text-[#235347] flex items-center gap-2"
                          >
                            Email Address *
                            <span className="text-[#8EB69B]">●</span>
                          </Label>
                          <div className="relative">
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className={`w-full rounded-xl border-2 bg-white/50 backdrop-blur-sm px-4 py-3 text-[#051F20] placeholder:text-[#8EB69B]/60 focus:border-[#8EB69B] focus:ring-2 focus:ring-[#8EB69B]/20 transition-all duration-300 ${
                                errors.email
                                  ? "border-red-300"
                                  : "border-[#DAF1DE]"
                              }`}
                              placeholder="your.email@example.com"
                            />
                          </div>
                          {errors.email && (
                            <p className="text-red-500 text-sm flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.email}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label
                            htmlFor="phone"
                            className="text-sm font-semibold text-[#235347] flex items-center gap-2"
                          >
                            Phone Number
                            <span className="text-gray-400 text-xs">
                              (Optional)
                            </span>
                          </Label>
                          <div className="relative">
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className={`w-full rounded-xl border-2 bg-white/50 backdrop-blur-sm px-4 py-3 text-[#051F20] placeholder:text-[#8EB69B]/60 focus:border-[#8EB69B] focus:ring-2 focus:ring-[#8EB69B]/20 transition-all duration-300 ${
                                errors.phone
                                  ? "border-red-300"
                                  : "border-[#DAF1DE]"
                              }`}
                              placeholder="+971 50 123 4567"
                            />
                          </div>
                          {errors.phone && (
                            <p className="text-red-500 text-sm flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.phone}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="reason"
                            className="text-sm font-semibold text-[#235347] flex items-center gap-2"
                          >
                            Reason for Inquiry *
                            <span className="text-[#8EB69B]">●</span>
                          </Label>
                          <div className="relative">
                            <select
                              id="reason"
                              name="reason"
                              value={formData.reason}
                              onChange={handleInputChange}
                              className={`w-full rounded-xl border-2 bg-white/50 backdrop-blur-sm px-4 py-3 text-[#051F20] focus:border-[#8EB69B] focus:ring-2 focus:ring-[#8EB69B]/20 transition-all duration-300 appearance-none ${
                                errors.reason
                                  ? "border-red-300"
                                  : "border-[#DAF1DE]"
                              }`}
                            >
                              <option value="">Select a reason</option>
                              <option value="property-inquiry">
                                Property Inquiry
                              </option>
                              <option value="consultation">Consultation</option>
                              <option value="partnership">Partnership</option>
                              <option value="general">General Question</option>
                            </select>
                          </div>
                          {errors.reason && (
                            <p className="text-red-500 text-sm flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.reason}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="message"
                          className="text-sm font-semibold text-[#235347] flex items-center gap-2"
                        >
                          Your Message *
                          <span className="text-[#8EB69B]">●</span>
                        </Label>
                        <div className="relative">
                          <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            rows={5}
                            className={`w-full rounded-xl border-2 bg-white/50 backdrop-blur-sm px-4 py-3 text-[#051F20] placeholder:text-[#8EB69B]/60 focus:border-[#8EB69B] focus:ring-2 focus:ring-[#8EB69B]/20 transition-all duration-300 resize-none ${
                              errors.message
                                ? "border-red-300"
                                : "border-[#DAF1DE]"
                            }`}
                            placeholder="Tell us about your requirements and how we can help you..."
                          />
                        </div>
                        {errors.message && (
                          <p className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.message}
                          </p>
                        )}
                      </div>

                      {/* Enhanced Submit Button */}
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-xl px-6 py-4 bg-gradient-to-r from-[#8EB69B] to-[#235347] text-white font-bold shadow-xl hover:shadow-2xl hover:shadow-[#8EB69B]/30 transition-all duration-300 flex items-center justify-center gap-3 text-lg group"
                      >
                        {/* Loading overlay */}
                        {isSubmitting && (
                          <div className="absolute inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center rounded-xl">
                            <Loader2 className="w-6 h-6 animate-spin text-white" />
                          </div>
                        )}

                        {!isSubmitting && (
                          <>
                            <Send className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                            Send Message
                          </>
                        )}

                        {isSubmitting && (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Sending Message...
                          </>
                        )}
                      </Button>

                      {/* Enhanced form submission info */}
                      <div className="text-center space-y-2">
                        <p className="text-xs text-gray-500">
                          * Required fields. We respect your privacy and will
                          never share your information.
                        </p>
                        <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                          <div className="flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            Secure
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Encrypted
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            Private
                          </div>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Enhanced Contact Info Cards */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="space-y-6"
              >
                {/* Enhanced header */}
                <div className="text-center lg:text-left mb-8">
                  <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8EB69B] to-[#235347] flex items-center justify-center shadow-lg">
                      <Building className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#051F20]">
                        Get in Touch
                      </h3>
                      <p className="text-[#235347] text-sm">
                        Multiple ways to reach our team
                      </p>
                    </div>
                  </div>
                </div>

                {/* Enhanced contact cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                  {contactInfo.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="group relative bg-gradient-to-br from-white to-[#FAFDFC] rounded-2xl shadow-lg hover:shadow-xl border border-[#DAF1DE]/40 p-6 transition-all duration-300 hover:scale-105 overflow-hidden"
                    >
                      {/* Enhanced decorative elements */}
                      <div className="absolute top-3 right-3 flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#F7E9B7] opacity-70" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8EB69B] opacity-60" />
                      </div>

                      {/* Enhanced icon */}
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#8EB69B] to-[#235347] flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                        <item.icon className="w-7 h-7 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#8EB69B] uppercase tracking-wide mb-2">
                          {item.title}
                        </p>
                        {item.link ? (
                          <a
                            href={item.link}
                            className="text-base font-medium text-[#163832] hover:text-[#8EB69B] transition-colors duration-300 block truncate group-hover:underline"
                          >
                            {item.content}
                          </a>
                        ) : (
                          <p className="text-base font-medium text-[#163832]">
                            {item.content}
                          </p>
                        )}
                      </div>

                      {/* Enhanced verified badge */}
                      {index === 0 && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[#F7E9B7]/80 to-[#8EB69B]/20 text-[#235347] text-xs font-semibold absolute bottom-3 right-3 shadow-sm border border-[#8EB69B]/20 cursor-pointer">
                              <Shield className="w-3 h-3" /> Verified
                            </span>
                          </TooltipTrigger>
                          <TooltipContent
                            side="bottom"
                            className="bg-[#051F20] text-white border-[#8EB69B]/20"
                          >
                            Verified by Expat Stays
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Enhanced trust indicators */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="bg-gradient-to-br from-[#DAF1DE]/20 to-[#8EB69B]/10 rounded-2xl p-6 border border-[#DAF1DE]/30"
                >
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Award className="w-5 h-5 text-[#8EB69B]" />
                      <span className="text-sm font-semibold text-[#235347]">
                        Trusted by 500+ Clients
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-6 text-xs text-[#235347]">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-[#F7E9B7] fill-current" />
                        <span>5.0 Rating</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-[#8EB69B]" />
                        <span>24/7 Support</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="w-3 h-3 text-[#8EB69B]" />
                        <span>Secure</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Enhanced Map Section */}
        <section className="container mx-auto px-4 sm:px-8 pb-16 lg:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl lg:text-4xl font-bold text-[#051F20] mb-4">
                Visit Our Office
              </h3>
              <p className="text-lg text-[#235347] max-w-2xl mx-auto">
                Located in the heart of Dubai&apos;s business district, our
                office is easily accessible and ready to welcome you.
              </p>
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#DAF1DE] h-[500px]">
              <div className="absolute inset-0 pointer-events-none rounded-3xl shadow-[0_0_40px_0_#8EB69B33] z-0" />
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3609.123456789!2d55.2708!3d25.2048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43456789abcdef%3A0x123456789abcdef!2sBusiness%20Bay%2C%20Dubai!5e0!3m2!1sen!2sae!4v1680000000000!5m2!1sen!2sae"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Expat Stays Office Map"
              ></iframe>
            </div>
          </motion.div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="container mx-auto px-4 sm:px-8 pb-16 lg:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative flex flex-col lg:flex-row items-center justify-between py-16 lg:py-24 px-8 lg:px-12 max-w-7xl mx-auto bg-gradient-to-br from-white to-[#F9FCFB] rounded-3xl overflow-hidden border border-[#DAF1DE]/30 shadow-2xl"
          >
            {/* Enhanced decorative elements */}
            <div className="absolute -left-20 lg:-left-32 -top-20 lg:-top-32 w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] bg-gradient-to-br from-[#DAF1DE]/20 to-[#8EB69B]/10 rounded-full blur-3xl z-0" />
            <div className="absolute -right-16 lg:-right-24 -bottom-16 lg:-bottom-24 w-[200px] h-[200px] lg:w-[300px] lg:h-[300px] bg-gradient-to-br from-[#F7E9B7]/20 to-[#8EB69B]/10 rounded-full blur-3xl z-0" />

            {/* Left: Enhanced Content */}
            <div className="lg:w-1/2 w-full flex justify-center items-center z-10 order-2 lg:order-1">
              <div className="text-center lg:text-left space-y-8">
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8EB69B] to-[#235347] flex items-center justify-center shadow-lg">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8EB69B] to-[#235347] flex items-center justify-center shadow-lg">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8EB69B] to-[#235347] flex items-center justify-center shadow-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                </div>

                <h3 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-[#051F20] leading-tight tracking-tight">
                  Still have <span className="text-[#8EB69B]">questions?</span>
                </h3>
                <p className="text-xl text-[#235347] max-w-2xl leading-relaxed">
                  Chat with our concierge or schedule a call for personalized
                  assistance. We&apos;re here to make your experience seamless
                  and extraordinary.
                </p>
              </div>
            </div>

            {/* Right: Enhanced Buttons */}
            <div className="lg:w-1/2 w-full flex justify-center items-center z-10 order-1 lg:order-2">
              <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
                <Button className="w-full sm:w-auto rounded-xl px-8 py-4 bg-gradient-to-r from-[#8EB69B] to-[#235347] text-white font-bold shadow-xl hover:shadow-2xl hover:shadow-[#8EB69B]/30 transition-all duration-300 flex items-center gap-3 text-lg group">
                  <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  Chat with Concierge
                </Button>
                <Button className="w-full sm:w-auto rounded-xl px-8 py-4 border-2 border-[#8EB69B] text-[#8EB69B] font-bold hover:bg-[#8EB69B] hover:text-white hover:shadow-xl transition-all duration-300 flex items-center gap-3 text-lg group">
                  <Phone className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  Schedule Call
                </Button>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </TooltipProvider>
  );
}
