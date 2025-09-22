"use client";
import {
  ArrowRight,
  Calendar,
  User,
  Search,
  Filter,
  Grid,
  List,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { getLocalImage } from "@/lib/imageUtils";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import React, { useState } from "react";

const blogPosts = [
  {
    slug: "top-5-things-to-do-islamabad",
    title: "Top 5 Things to Do When in Islamabad",
    date: "December 15, 2024",
    excerpt:
      "Islamabad, the capital of Pakistan, is often described as one of the most beautiful capitals in the world. Discover the top 5 experiences that will make your trip unforgettable...",
    imageUrl: "/media/blogs-appartments/EX-1.JPG",
    imageHint: "Faisal Mosque Islamabad",
    author: "Expat Stays Team",
    category: "Travel Guides",
    readTime: "6 min read",
  },
  {
    slug: "day-trips-from-islamabad-murree-nathia-gali",
    title: "Day Trips from Islamabad: Murree, Nathia Gali & Beyond",
    date: "December 10, 2024",
    excerpt:
      "Islamabad is perfectly located for travelers who love nature, cool weather, and scenic getaways. Explore the best day trips from the capital to nearby hill stations...",
    imageUrl: "/media/blogs-appartments/EX-2.JPG",
    imageHint: "Murree hill station view",
    author: "Expat Stays Team",
    category: "Travel Guides",
    readTime: "8 min read",
  },
  {
    slug: "how-to-feel-at-home-living-abroad",
    title: "How to Feel at Home When You're Living Abroad",
    date: "December 5, 2024",
    excerpt:
      "Moving abroad can be both exciting and overwhelming. With the right mindset and practical steps, you can quickly create a lifestyle that feels welcoming and familiar...",
    imageUrl: "/media/blogs-appartments/EX-3.JPG",
    imageHint: "expat living comfort",
    author: "Expat Stays Team",
    category: "Lifestyle",
    readTime: "7 min read",
  },
  {
    slug: "food-lovers-guide-islamabad-cafes-eateries",
    title: "A Food Lover's Guide to Islamabad: Best Cafés and Eateries",
    date: "November 28, 2024",
    excerpt:
      "Islamabad may be known for its calm atmosphere and greenery, but it's also a city that surprises visitors with its vibrant food culture. Discover the best dining spots...",
    imageUrl: "/media/blogs-appartments/EX-4.JPG",
    imageHint: "Islamabad restaurant dining",
    author: "Expat Stays Team",
    category: "Food & Dining",
    readTime: "9 min read",
  },
];

const categories = [
  "All Posts",
  "Travel Guides",
  "Tips & Advice",
  "Lifestyle",
  "Food & Dining",
];

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Posts");

  // Filter logic
  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory =
      activeCategory === "All Posts" || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 relative overflow-x-hidden overflow-y-hidden">
      <Header />

      {/* Enhanced Background with Decorative Shapes */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-24 left-10 w-[300px] lg:w-[600px] h-[300px] lg:h-[600px] bg-gradient-to-br from-[#DAF1DE]/20 to-[#8EB69B]/10 rounded-full blur-3xl"
          style={{ willChange: "transform, opacity" }}
          animate={{ scale: [1, 1.04, 1], opacity: [0.13, 0.17, 0.13] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-[250px] lg:w-[500px] h-[250px] lg:h-[500px] bg-gradient-to-br from-[#8EB69B]/10 to-[#235347]/10 rounded-full blur-2xl"
          style={{ willChange: "transform, opacity" }}
          animate={{ scale: [1, 1.06, 1], opacity: [0.09, 0.13, 0.09] }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Decorative geometric shapes */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-16 lg:w-32 h-16 lg:h-32 border border-[#8EB69B]/20 rounded-full"
          style={{ willChange: "transform" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/6 w-12 lg:w-24 h-12 lg:h-24 bg-gradient-to-br from-[#DAF1DE]/30 to-[#8EB69B]/20 rounded-lg rotate-45"
          style={{ willChange: "transform" }}
          animate={{ rotate: [45, 405], scale: [1, 1.03, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 right-1/6 w-8 lg:w-16 h-8 lg:h-16 border-2 border-[#8EB69B]/30 rounded-full"
          style={{ willChange: "transform, opacity" }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.5, 0.35] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating dots */}
        <motion.div
          className="absolute top-1/3 left-1/2 w-2 h-2 bg-[#8EB69B] rounded-full"
          style={{ willChange: "transform, opacity" }}
          animate={{ y: [-6, 6, -6], opacity: [0.6, 0.8, 0.6] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-[#DAF1DE] rounded-full"
          style={{ willChange: "transform, opacity" }}
          animate={{ y: [6, -6, 6], opacity: [0.4, 0.7, 0.4] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Modern Geometric Shapes - Enhanced */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-[#8EB69B]/95 to-[#72a785]/30 rotate-45 animate-[breathing_5s_ease-in-out_infinite]" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-[#DAF1DE]/72 to-[#8EB69B]/48 rounded-full animate-[breathing_6.5s_ease-in-out_infinite]" />
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-br from-[#235347]/78 to-[#163832]/46 rotate-12 animate-[breathing_7.5s_ease-in-out_infinite]" />
        <div className="absolute top-1/3 left-1/2 w-12 h-12 bg-gradient-to-br from-[#8EB69B]/90 to-[#DAF1DE]/46 rotate-45 animate-[breathing_8.5s_ease-in-out_infinite]" />

        {/* Large Geometric Elements */}
        <div className="absolute -top-60 -right-40 w-80 h-80 bg-gradient-to-br from-[#8EB69B]/95 to-[#72a785]/43 rounded-full filter blur-2xl animate-[breathing_10s_ease-in-out_infinite]" />
        <div className="absolute -bottom-60 -left-40 w-72 h-72 bg-gradient-to-br from-[#DAF1DE]/76 to-[#8EB69B]/54 rounded-full filter blur-2xl animate-[breathing_11s_ease-in-out_infinite]" />

        {/* Triangle Shapes */}
        <div className="absolute top-1/2 right-10 w-0 h-0 border-l-[30px] border-l-transparent border-b-[52px] border-b-[#8EB69B]/8 border-r-[30px] border-r-transparent animate-[breathing_9s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/4 right-1/3 w-0 h-0 border-l-[20px] border-l-transparent border-b-[35px] border-b-[#DAF1DE]/10 border-r-[20px] border-r-transparent animate-[breathing_7s_ease-in-out_infinite]" />

        {/* Square Shapes */}
        <div className="absolute top-1/4 left-20 w-16 h-16 bg-gradient-to-br from-[#235347]/6 to-[#163832]/4 rotate-45 animate-[breathing_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/3 right-1/4 w-12 h-12 bg-gradient-to-br from-[#8EB69B]/8 to-[#72a785]/6 rotate-12 animate-[breathing_6s_ease-in-out_infinite]" />

        {/* Strategic background images */}
        <div className="absolute top-20 right-20 w-32 lg:w-64 h-32 lg:h-64 opacity-10">
          <Image
            src={getLocalImage("luxury", 0)}
            alt="Luxury background"
            fill
            className="object-cover rounded-full"
          />
        </div>
        <div className="absolute bottom-40 left-20 w-24 lg:w-48 h-24 lg:h-48 opacity-10">
          <Image
            src={getLocalImage("property", 1)}
            alt="Property background"
            fill
            className="object-cover rounded-full"
          />
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 lg:w-32 h-16 lg:h-32 opacity-5">
          <Image
            src={getLocalImage("villa", 0)}
            alt="Villa background"
            fill
            className="object-cover rounded-full"
          />
        </div>
      </div>

      {/* Blog Hero Section */}
      <section className="relative flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto pt-12 pb-10 px-4 sm:px-8 lg:px-12">
        {/* Textual Hero Content */}
        <div className="flex-1 z-10 text-center lg:text-left">
          <div className="inline-block mb-4 px-5 py-2 rounded-full bg-[#DAF1DE]/60 border border-[#8EB69B]/20 shadow-sm text-[#235347] font-medium text-base tracking-wide">
            <Sparkles className="inline-block w-5 h-5 mr-2 text-[#8EB69B] align-middle" />
            Insights & Tips
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-headline text-[#235347] mb-4 drop-shadow-lg">
            Expat Stays Blog
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto lg:mx-0 text-[#235347]/80 font-medium bg-white/70 rounded-xl px-6 py-3 shadow-sm border border-[#DAF1DE]/40">
            Insights, tips, and inspiration for luxury travel, expat living, and
            making the most of your stay in premier destinations.
          </p>
        </div>
        {/* Decorative Hero Image */}
        <div className="relative flex-1 flex justify-center lg:justify-end mt-10 lg:mt-0">
          <div className="relative w-64 h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden shadow-2xl border-4 border-[#DAF1DE] bg-[#F8FCF9]">
            <Image
              src={getLocalImage("villa", 0)}
              alt="Luxury villa hero"
              fill
              className="object-cover scale-110 blur-[1px]"
              priority
            />
            {/* Soft green glow */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{ boxShadow: "0 0 64px 0 #DAF1DE88, 0 0 0 8px #8EB69B22" }}
            />
          </div>
          {/* Floating accent orb */}
          <motion.div
            className="absolute -top-8 -right-8 w-24 h-24 bg-[#8EB69B]/20 rounded-full blur-2xl z-0"
            animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-12 h-12 bg-[#DAF1DE]/40 rounded-full blur-xl z-0"
            animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </div>
      </section>

      {/* Filter/Search Section */}
      <section className="relative z-30 max-w-5xl mx-auto -mt-14 mb-16 px-4 sm:px-8">
        <motion.div
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#DAF1DE]/60 px-6 py-5"
          style={{
            boxShadow: "0 8px 32px 0 #DAF1DE33, 0 1.5px 8px 0 #8EB69B22",
          }}
        >
          {/* Search */}
          <div className="flex items-center w-full md:w-auto mb-2 md:mb-0">
            <span className="inline-flex items-center px-2 text-[#8EB69B]">
              <Search className="w-5 h-5" />
            </span>
            <Input
              type="text"
              placeholder="Search blog posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-72 rounded-full border border-[#DAF1DE] focus:ring-2 focus:ring-[#8EB69B]/40 focus:border-[#8EB69B] bg-white/90 text-[#235347] placeholder:text-[#8EB69B]/60 shadow-sm transition-all duration-300 text-base font-medium"
            />
          </div>
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-end w-full md:w-auto">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.3 }}
                className={`px-4 py-1.5 rounded-full font-semibold tracking-wide text-sm border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#8EB69B]/40
                  ${
                    activeCategory === cat
                      ? "bg-[#8EB69B] text-white border-[#8EB69B] shadow-lg"
                      : "bg-white text-[#235347] border-[#DAF1DE] hover:bg-[#DAF1DE]/40 hover:text-[#0B2B26]"
                  }
                `}
                aria-pressed={activeCategory === cat}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Blog Posts Grid - Futuristic Cards */}
      <section className="py-12 lg:py-16 relative">
        {/* Additional decorative elements around the grid */}
        <div className="pointer-events-none absolute top-0 left-1/4 w-10 lg:w-20 h-10 lg:h-20 border border-[#8EB69B]/20 rounded-full opacity-60 z-0" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 w-8 lg:w-16 h-8 lg:h-16 bg-gradient-to-br from-[#DAF1DE]/20 to-[#8EB69B]/10 rounded-lg rotate-12 opacity-60 z-0" />
        <div className="pointer-events-none absolute top-1/2 left-0 w-6 lg:w-12 h-6 lg:h-12 border border-[#8EB69B]/30 rounded-full opacity-40 z-0" />
        <div className="pointer-events-none absolute bottom-1/3 right-0 w-12 lg:w-24 h-12 lg:h-24 bg-gradient-to-br from-[#8EB69B]/15 to-[#235347]/10 rounded-full opacity-50 z-0" />

        <div className="container mx-auto px-4 sm:px-8">
          <motion.div
            key={search + activeCategory} // animate on filter/search change
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-12"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.18 } },
            }}
          >
            {filteredPosts.map((post, i) => (
              <motion.div
                key={post.slug}
                className="group"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, delay: i * 0.18 }}
                style={{ willChange: "transform, opacity" }}
              >
                <motion.div
                  whileHover={{ scale: 1.025 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="transition-all duration-300"
                >
                  <Card className="group transition-all duration-300 bg-white/95 hover:bg-white shadow-xl hover:shadow-2xl rounded-3xl overflow-hidden border border-[#EBEBEB]/70 hover:border-[#8EB69B]/50 px-0 pb-0">
                    <div className="relative w-full aspect-[16/9] overflow-hidden rounded-3xl">
                      <Image
                        src={post.imageUrl}
                        alt={post.imageHint}
                        fill
                        className="object-cover rounded-3xl shadow-md group-hover:shadow-2xl border-2 border-transparent group-hover:border-[#DAF1DE] group-focus:border-[#8EB69B] transition-all duration-300"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        priority={i < 2}
                      />
                    </div>
                    <CardContent className="p-5 lg:p-7">
                      <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-3">
                        <div className="flex items-center gap-1 lg:gap-2 text-xs text-[#8EB69B] font-medium">
                          <Calendar className="h-3 lg:h-4 w-3 lg:w-4" />
                          {post.date}
                        </div>
                        <span className="text-[#DAF1DE]">•</span>
                        <div className="flex items-center gap-1 lg:gap-2 text-xs text-[#8EB69B] font-medium">
                          <User className="h-3 lg:h-4 w-3 lg:w-4" />
                          {post.author}
                        </div>
                        <span className="text-[#DAF1DE]">•</span>
                        <div className="text-xs text-[#8EB69B] font-medium">
                          {post.readTime}
                        </div>
                      </div>
                      <CardTitle className="text-lg lg:text-xl font-extrabold tracking-tight text-[#051F20] group-hover:text-[#8EB69B] transition-colors mb-2 leading-snug">
                        {post.title}
                      </CardTitle>
                      <p className="text-[#4A4A4A] text-sm lg:text-base mb-3 lg:mb-4 line-clamp-3 font-medium">
                        {post.excerpt}
                      </p>
                      <Button
                        asChild
                        className="mt-2 rounded-full bg-gradient-to-r from-[#8EB69B] to-[#235347] text-white hover:from-[#235347] hover:to-[#8EB69B] shadow-lg shadow-[#8EB69B]/20 hover:shadow-xl hover:shadow-[#8EB69B]/30 transition-all duration-300 px-5 lg:px-7 py-2 text-sm lg:text-base font-semibold flex items-center justify-center tracking-wide"
                      >
                        <Link href={`/blog/${post.slug}`}>
                          Read More
                          <ArrowRight className="h-4 lg:h-5 w-4 lg:w-5 ml-2 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
