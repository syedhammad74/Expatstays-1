"use client";
import Image from "next/image";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Landmark,
  Trophy,
  Award,
  Star,
  Shield,
  ArrowRight,
  Sparkles,
  Globe,
  Clock,
  CheckCircle,
  Target,
  Crown,
  MapPin,
  Phone,
  Calendar,
} from "lucide-react";
// Removed framer-motion for performance
import Header from "@/components/layout/Header";

const features = [
  {
    icon: Target,
    title: "Precision",
    desc: "We deliver personalized service with pinpoint focus.",
    color: "from-[#8EB69B] to-[#235347]",
  },
  {
    icon: Globe,
    title: "Global Soul",
    desc: "Built for expatriates, rooted in local richness.",
    color: "from-[#DAF1DE] to-[#8EB69B]",
  },
  {
    icon: Shield,
    title: "Integrity",
    desc: "Transparency and respect in every interaction.",
    color: "from-[#235347] to-[#163832]",
  },
  {
    icon: Crown,
    title: "Excellence",
    desc: "Unwavering commitment to luxury and quality.",
    color: "from-[#8EB69B] to-[#DAF1DE]",
  },
];

// Removed unused team and differentiators arrays

const testimonials = [
  {
    quote:
      "Expat Stays transformed our stay into an unforgettable experience. The attention to detail was remarkable.",
    author: "Sarah Chen",
    role: "Tech Executive",
    avatar: "/media/Close Ups June 25 2025/DSC01827.jpg",
    rating: 5,
    location: "Islamabad",
  },
  {
    quote:
      "Finally, a service that understands what expats truly need. Seamless, luxurious, and reliable.",
    author: "Michael Rodriguez",
    role: "Investment Banker",
    avatar: "/media/Close Ups June 25 2025/DSC01831.jpg",
    rating: 5,
    location: "Palm Jumeirah",
  },
  {
    quote:
      "The personalized service exceeded all expectations. They truly care about every detail.",
    author: "Emma Thompson",
    role: "Consultant",
    avatar: "/media/Close Ups June 25 2025/DSC01832.jpg",
    rating: 5,
    location: "Gulberg Greens",
  },
];

const stats = [
  {
    number: "500+",
    label: "Properties",
    icon: Landmark,
    detail: "Verified & Inspected",
  },
  {
    number: "10K+",
    label: "Happy Guests",
    icon: Users,
    detail: "Satisfied Customers",
  },
  { number: "50+", label: "Cities", icon: Globe, detail: "Global Coverage" },
  { number: "24/7", label: "Support", icon: Clock, detail: "Always Available" },
];

const achievements = [
  {
    icon: Trophy,
    title: "Best Luxury Rental Platform 2024",
    description: "Awarded by Pakistan Tourism Board",
    year: "2024",
  },
  {
    icon: Award,
    title: "Excellence in Customer Service",
    description: "Recognized by Hospitality Awards",
    year: "2023",
  },
  {
    icon: Star,
    title: "4.9/5 Guest Satisfaction",
    description: "Based on 10,000+ reviews",
    year: "2024",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white relative will-change-transform">
      <Header />

      {/* Animated Futuristic Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-24 left-10 w-[600px] h-[600px] bg-gradient-to-br from-[#8EB69B]/20 to-[#235347]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-gradient-to-br from-[#235347]/10 to-[#8EB69B]/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Modern Geometric Shapes - Enhanced */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-[#8EB69B]/95 to-[#72a785]/30 rotate-45 animate-[breathing_5s_ease-in-out_infinite]" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-[#DAF1DE]/72 to-[#8EB69B]/48 rounded-full animate-[breathing_6.5s_ease-in-out_infinite]" />
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-br from-[#235347]/78 to-[#163832]/46 rotate-12 animate-[breathing_7.5s_ease-in-out_infinite]" />
        <div className="absolute top-1/3 left-1/2 w-12 h-12 bg-gradient-to-br from-[#8EB69B]/90 to-[#DAF1DE]/46 rotate-45 animate-[breathing_8.5s_ease-in-out_infinite] will-change-transform" />

        {/* Large Geometric Elements */}
        <div className="absolute -top-60 -right-40 w-80 h-80 bg-gradient-to-br from-[#8EB69B]/95 to-[#72a785]/43 rounded-full filter blur-2xl animate-[breathing_10s_ease-in-out_infinite]" />
        <div className="absolute -bottom-60 -left-40 w-72 h-72 bg-gradient-to-br from-[#DAF1DE]/76 to-[#8EB69B]/54 rounded-full filter blur-2xl animate-[breathing_11s_ease-in-out_infinite]" />

        {/* Triangle Shapes */}
        <div className="absolute top-1/2 right-10 w-0 h-0 border-l-[30px] border-l-transparent border-b-[52px] border-b-[#8EB69B]/8 border-r-[30px] border-r-transparent animate-[breathing_9s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/4 right-1/3 w-0 h-0 border-l-[20px] border-l-transparent border-b-[35px] border-b-[#DAF1DE]/10 border-r-[20px] border-r-transparent animate-[breathing_7s_ease-in-out_infinite]" />

        {/* Square Shapes */}
        <div className="absolute top-1/4 left-20 w-16 h-16 bg-gradient-to-br from-[#235347]/6 to-[#163832]/4 rotate-45 animate-[breathing_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/3 right-1/4 w-12 h-12 bg-gradient-to-br from-[#8EB69B]/8 to-[#72a785]/6 rotate-12 animate-[breathing_6s_ease-in-out_infinite]" />
      </div>

      {/* HERO SECTION */}
      <section className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 lg:pt-16 pb-12 lg:pb-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center relative z-10">
        {/* Decorative geometric shape behind text */}
        <div className="pointer-events-none absolute left-0 top-16 w-72 h-32 lg:w-[420px] lg:h-40 bg-[#DAF1DE]/30 rounded-3xl blur-2xl z-0 animate-fade-in" />
        {/* Decorative orb in whitespace between text and image */}
        <div className="pointer-events-none absolute hidden lg:block left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[#8EB69B]/15 rounded-full blur-3xl z-0 animate-fade-in" style={{ animationDelay: '0.3s' }} />
        {/* Optionally, a sparkle accent layered on top */}
        <div className="pointer-events-none absolute hidden lg:block left-[54%] top-[44%] z-10 animate-pulse">
          <Sparkles className="w-6 h-6 text-[#8EB69B] opacity-80" />
        </div>
        {/* Decorative squircle/blob in lower whitespace */}
        <div className="pointer-events-none absolute left-1/4 bottom-[-80px] lg:left-1/2 lg:bottom-[-120px] w-[420px] h-[180px] lg:w-[600px] lg:h-[260px] bg-gradient-to-br from-[#DAF1DE]/40 via-[#8EB69B]/20 to-[#0B2B26]/10 rounded-[120px] blur-3xl z-0 animate-fade-in" style={{ animationDelay: '0.6s' }} />
        {/* Floating orb for extra depth */}
        <div className="pointer-events-none absolute left-[60%] bottom-0 w-16 h-16 bg-[#8EB69B]/20 rounded-full blur-2xl z-0 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="space-y-6 lg:space-y-8 relative z-10 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-4 lg:mb-6 relative">
            <Badge className="bg-[#8EB69B]/20 text-[#8EB69B] border-none px-4 lg:px-5 py-2 rounded-full text-sm lg:text-base font-semibold tracking-wide">
              ABOUT US
            </Badge>
            <Sparkles className="w-5 h-5 text-[#8EB69B] opacity-70 animate-pulse" />
          </div>
          <h1 className="text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-[#051F20] mb-4 lg:mb-6 leading-tight relative">
            Welcome to <span className="text-[#8EB69B]">Expat Stays</span>
            {/* Animated sparkle dot */}
            <div className="absolute -right-8 top-2 w-2.5 h-2.5 bg-[#DAF1DE] rounded-full opacity-70 animate-pulse" style={{ animationDelay: '1s' }} />
          </h1>
          <p className="text-base lg:text-lg text-[#235347] mb-6 lg:mb-10 max-w-md">
            We curate the world&apos;s most extraordinary stays and experiences
            for modern expats and global citizens.
          </p>
        </div>
        {/* Right: Hero Image with Decorative Orbs */}
        <div className="relative w-full h-64 lg:h-[420px] rounded-2xl overflow-hidden shadow-xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {/* Decorative blurred orb (top left) */}
          <div className="pointer-events-none absolute -top-8 -left-8 w-40 h-40 lg:w-64 lg:h-64 bg-[#8EB69B]/20 rounded-full blur-3xl z-0 animate-pulse" />
          {/* Decorative blurred orb (bottom right) */}
          <div className="pointer-events-none absolute -bottom-8 -right-8 w-24 h-24 lg:w-40 lg:h-40 bg-[#DAF1DE]/30 rounded-full blur-2xl z-0 animate-pulse" style={{ animationDelay: '2s' }} />
          <Image
            src="/media/DSC01806 HDR June 25 2025/DSC01817-HDR.jpg"
            alt="About Expat Stays"
            fill
            className="object-cover object-center relative z-10"
            priority
          />
        </div>
      </section>

      {/* OUR STORY SECTION */}
      <section className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="space-y-4 lg:space-y-6 order-2 lg:order-1 animate-fade-in-up">
            <Badge className="bg-[#8EB69B]/20 text-[#8EB69B] border-none px-4 lg:px-5 py-2 rounded-full mb-4 lg:mb-6 text-sm lg:text-base font-semibold tracking-wide">
              OUR STORY
            </Badge>
            <h2 className="text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-[#051F20] mb-4 lg:mb-6">
              From Vision to Reality
            </h2>
            <div className="space-y-4 lg:space-y-6 text-base lg:text-lg text-[#235347] leading-relaxed">
              <p>
                Founded in 2020, Expat Stays emerged from a simple observation:
                expatriates and global citizens needed more than just
                accommodation—they needed a home that understood their
                lifestyle.
              </p>
              <p>
                What started as a curated collection of premium properties has
                evolved into a comprehensive luxury living platform, serving
                thousands of discerning guests across Pakistan and beyond.
              </p>
              <p>
                Today, we continue to push boundaries, combining cutting-edge
                technology with timeless hospitality to create experiences that
                exceed expectations.
              </p>
            </div>
            {/* Timeline */}
            <div className="mt-6 lg:mt-8 space-y-3 lg:space-y-4">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-2 lg:w-3 h-2 lg:h-3 bg-[#8EB69B] rounded-full"></div>
                <span className="text-sm lg:text-base text-[#235347] font-medium">
                  2020 - Founded
                </span>
              </div>
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-2 lg:w-3 h-2 lg:h-3 bg-[#235347] rounded-full"></div>
                <span className="text-sm lg:text-base text-[#235347] font-medium">
                  2022 - 1000+ Properties
                </span>
              </div>
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-2 lg:w-3 h-2 lg:h-3 bg-[#8EB69B] rounded-full"></div>
                <span className="text-sm lg:text-base text-[#235347] font-medium">
                  2024 - Award Winner
                </span>
              </div>
            </div>
          </div>

          <div className="relative order-1 lg:order-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="grid grid-cols-2 gap-4 lg:gap-6">
              <Image
                src="/media/Close Ups June 25 2025/DSC01831.jpg"
                alt="Luxury Interior"
                width={600}
                height={700}
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="rounded-xl lg:rounded-2xl shadow-xl object-cover border-2 border-[#8EB69B]/20 w-full h-[150px] sm:h-[200px] lg:h-[250px] xl:h-[300px]"
                loading="lazy"
                quality={80}
              />
              <Image
                src="/media/Close Ups June 25 2025/DSC01832.jpg"
                alt="Premium Service"
                width={600}
                height={700}
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="rounded-xl lg:rounded-2xl shadow-xl object-cover border-2 border-[#235347]/20 mt-4 lg:mt-8 w-full h-[150px] sm:h-[200px] lg:h-[250px] xl:h-[300px]"
                loading="lazy"
                quality={80}
              />
            </div>
          </div>
        </div>
      </section>

      {/* MISSION & VALUES */}
      <section className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="text-center mb-12 lg:mb-16">
          <Badge className="bg-[#8EB69B]/20 text-[#8EB69B] border-none px-4 lg:px-5 py-2 rounded-full mb-4 lg:mb-6 text-sm lg:text-base font-semibold tracking-wide">
            MISSION & VALUES
          </Badge>
          <h2 className="text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-[#051F20] mb-4 lg:mb-6">
            What Drives Us Forward
          </h2>
          <p className="text-base lg:text-lg xl:text-xl text-[#235347] max-w-3xl mx-auto leading-relaxed">
            Our core values shape every decision, every interaction, and every
            experience we create.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="animate-fade-in-up"
            >
              <Card className="rounded-xl lg:rounded-2xl shadow-xl border border-[#8EB69B]/20 bg-white p-6 lg:p-8 text-center group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-full">
                <div
                  className={`w-16 lg:w-20 h-16 lg:h-20 bg-gradient-to-br ${feature.color} rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-8 lg:w-10 h-8 lg:h-10 text-white" />
                </div>
                <CardTitle className="text-lg lg:text-xl font-bold mb-3 lg:mb-4 text-[#051F20]">
                  {feature.title}
                </CardTitle>
                <p className="text-sm lg:text-base text-[#235347] leading-relaxed">
                  {feature.desc}
                </p>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="text-center mb-12 lg:mb-16">
          <Badge className="bg-[#8EB69B]/20 text-[#8EB69B] border-none px-4 lg:px-5 py-2 rounded-full mb-4 lg:mb-6 text-sm lg:text-base font-semibold tracking-wide">
            TESTIMONIALS
          </Badge>
          <h2 className="text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-[#051F20] mb-4 lg:mb-6">
            What Our Guests Say
          </h2>
          <p className="text-base lg:text-lg xl:text-xl text-[#235347] max-w-3xl mx-auto leading-relaxed">
            Real experiences from real guests who&apos;ve experienced the Expat
            Stays difference across Pakistan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.author}
              className="animate-fade-in-up"
            >
              <Card className="rounded-xl lg:rounded-2xl shadow-xl border border-[#8EB69B]/20 bg-white p-4 lg:p-6 xl:p-8 group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full">
                {/* Header with Avatar and Info */}
                <div className="flex items-start gap-3 lg:gap-4 mb-4 lg:mb-6">
                  <div className="relative">
                      <Image
                        src={testimonial.avatar}
                        alt={`${testimonial.author} profile picture`}
                        width={64}
                        height={64}
                        className="rounded-full object-cover border-3 border-[#8EB69B]/30 group-hover:scale-105 transition-transform duration-300 w-12 lg:w-16 h-12 lg:h-16"
                        loading="lazy"
                        quality={75}
                      />
                    <div className="absolute -bottom-1 -right-1 w-4 lg:w-6 h-4 lg:h-6 bg-gradient-to-br from-[#8EB69B] to-[#235347] rounded-full flex items-center justify-center">
                      <CheckCircle className="w-2 lg:w-3 h-2 lg:h-3 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-base lg:text-lg text-[#051F20] mb-1">
                      {testimonial.author}
                    </p>
                    <p className="text-xs lg:text-sm text-[#8EB69B] font-medium mb-1 lg:mb-2">
                      {testimonial.role}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[#235347]">
                      <MapPin className="w-3 h-3" />
                      <span>{testimonial.location}</span>
                    </div>
                  </div>
                </div>

                {/* Quote */}
                <blockquote className="text-sm lg:text-base text-[#235347] leading-relaxed italic mb-4 lg:mb-6 relative">
                  <div className="absolute -top-1 lg:-top-2 -left-1 lg:-left-2 text-2xl lg:text-4xl text-[#8EB69B]/30">
                    &quot;
                  </div>
                  {testimonial.quote}
                </blockquote>

                {/* Rating and Details */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 lg:w-4 h-3 lg:h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <div className="text-xs text-[#235347] font-medium">
                    Verified Guest
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#8EB69B]/5 to-transparent rounded-xl lg:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </Card>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="mt-12 lg:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="flex items-center justify-center mb-2 lg:mb-3">
                <div className="w-10 lg:w-12 h-10 lg:h-12 bg-gradient-to-br from-[#8EB69B] to-[#235347] rounded-full flex items-center justify-center">
                  <stat.icon className="w-5 lg:w-6 h-5 lg:h-6 text-white" />
                </div>
              </div>
              <p className="text-xl lg:text-2xl font-bold text-[#051F20] mb-1">
                {stat.number}
              </p>
              <p className="text-xs lg:text-sm font-semibold text-[#163832] mb-1">
                {stat.label}
              </p>
              <p className="text-xs text-[#235347]">{stat.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ACHIEVEMENTS SECTION */}
      <section className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="text-center mb-12 lg:mb-16">
          <Badge className="bg-[#8EB69B]/20 text-[#8EB69B] border-none px-4 lg:px-5 py-2 rounded-full mb-4 lg:mb-6 text-sm lg:text-base font-semibold tracking-wide">
            ACHIEVEMENTS
          </Badge>
          <h2 className="text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-[#051F20] mb-4 lg:mb-6">
            Recognized Excellence
          </h2>
          <p className="text-base lg:text-lg xl:text-xl text-[#235347] max-w-3xl mx-auto leading-relaxed">
            Our commitment to luxury and service has been recognized by industry
            leaders.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {achievements.map((achievement) => (
            <div
              key={achievement.title}
              className="animate-fade-in-up"
            >
              <Card className="rounded-xl lg:rounded-2xl shadow-xl border border-[#8EB69B]/20 bg-white p-6 lg:p-8 text-center group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-full">
                <div className="w-12 lg:w-16 h-12 lg:h-16 bg-gradient-to-br from-[#8EB69B] to-[#235347] rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <achievement.icon className="w-6 lg:w-8 h-6 lg:h-8 text-white" />
                </div>
                <CardTitle className="text-base lg:text-lg font-bold mb-2 lg:mb-3 text-[#051F20]">
                  {achievement.title}
                </CardTitle>
                <p className="text-xs lg:text-sm text-[#235347] mb-3 lg:mb-4 leading-relaxed">
                  {achievement.description}
                </p>
                <div className="inline-flex items-center gap-2 bg-[#8EB69B]/10 text-[#8EB69B] px-2 lg:px-3 py-1 rounded-full text-xs font-semibold">
                  <Calendar className="w-3 h-3" />
                  {achievement.year}
                </div>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="container mx-auto px-4 py-12 lg:py-20">
        <div className="relative bg-gradient-to-br from-[#8EB69B]/10 via-white to-[#235347]/10 rounded-2xl lg:rounded-3xl p-6 lg:p-8 xl:p-12 2xl:p-16 text-center overflow-hidden animate-fade-in-up">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-20 lg:w-40 h-20 lg:h-40 bg-gradient-to-br from-[#8EB69B]/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-24 lg:w-48 h-24 lg:h-48 bg-gradient-to-br from-[#235347]/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 lg:w-32 h-16 lg:h-32 bg-gradient-to-br from-[#DAF1DE]/30 to-transparent rounded-full blur-2xl"></div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-[#8EB69B]/20 text-[#8EB69B] px-3 lg:px-4 py-2 rounded-full text-xs lg:text-sm font-semibold mb-4 lg:mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Sparkles className="w-3 lg:w-4 h-3 lg:h-4" />
              Ready to Experience Luxury?
            </div>

            <h2 className="text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-[#051F20] mb-4 lg:mb-6 leading-tight">
              Start Your Luxury Journey Today
            </h2>
            <p className="text-base lg:text-lg xl:text-xl text-[#235347] mb-6 lg:mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of satisfied guests who&apos;ve discovered the
              Expat Luxe difference. Experience unparalleled luxury and
              personalized service.
            </p>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-8 lg:mb-10 max-w-4xl mx-auto">
              <div className="flex items-center gap-2 lg:gap-3 text-[#235347]">
                <CheckCircle className="w-4 lg:w-5 h-4 lg:h-5 text-[#8EB69B] flex-shrink-0" />
                <span className="text-xs lg:text-sm font-medium">
                  Instant Booking
                </span>
              </div>
              <div className="flex items-center gap-2 lg:gap-3 text-[#235347]">
                <CheckCircle className="w-4 lg:w-5 h-4 lg:h-5 text-[#8EB69B] flex-shrink-0" />
                <span className="text-xs lg:text-sm font-medium">
                  24/7 Support
                </span>
              </div>
              <div className="flex items-center gap-2 lg:gap-3 text-[#235347]">
                <CheckCircle className="w-4 lg:w-5 h-4 lg:h-5 text-[#8EB69B] flex-shrink-0" />
                <span className="text-xs lg:text-sm font-medium">
                  Verified Properties
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center items-center">
              <button
                className="rounded-buttons px-6 lg:px-8 py-3 lg:py-4 bg-[#8EB69B] text-[#051F20] font-bold shadow-lg hover:shadow-[0_0_20px_#8EB69B55] hover:bg-[#235347] hover:text-[#DAF1DE] transition-all duration-200 flex items-center justify-center gap-2 lg:gap-3 text-sm lg:text-base min-w-[180px] lg:min-w-[200px] w-full sm:w-auto"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <ArrowRight className="w-4 lg:w-5 h-4 lg:h-5" />
                Explore Properties
              </button>
              <button
                className="rounded-buttons px-6 lg:px-8 py-3 lg:py-4 border-2 border-[#8EB69B] text-[#8EB69B] font-bold hover:bg-[#8EB69B] hover:text-[#051F20] hover:shadow-[0_0_20px_#8EB69B55] transition-all duration-200 flex items-center justify-center gap-2 lg:gap-3 text-sm lg:text-base min-w-[180px] lg:min-w-[200px] w-full sm:w-auto"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <Phone className="w-4 lg:w-5 h-4 lg:h-5" />
                Contact Our Team
              </button>
            </div>

            {/* Additional info */}
            <div className="mt-6 lg:mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 lg:gap-6 text-xs lg:text-sm text-[#235347]">
              <div className="flex items-center gap-2">
                <Shield className="w-3 lg:w-4 h-3 lg:h-4 text-[#8EB69B]" />
                <span>Secure Booking</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3 lg:w-4 h-3 lg:h-4 text-[#8EB69B]" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-3 lg:w-4 h-3 lg:h-4 text-[#8EB69B]" />
                <span>4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
