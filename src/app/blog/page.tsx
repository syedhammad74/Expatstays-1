"use client";
import {
  ArrowRight,
  Calendar,
  User,
  Search,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { getLocalImage } from "@/lib/imageUtils";
// Removed framer-motion for performance
import Header from "@/components/layout/Header";
import React, { useState, useMemo } from "react";

const blogPosts = [
  {
    slug: "top-5-things-to-do-islamabad",
    title: "Top 5 Things to Do When in Islamabad",
    date: "December 15, 2024",
    excerpt:
      "Islamabad, the capital of Pakistan, is often described as one of the most beautiful capitals in the world. Discover the top 5 experiences that will make your trip unforgettable...",
    imageUrl: "/media/blogs-appartments/islamabad-mosque.png",
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
    imageUrl: "/media/blogs-appartments/murree-hills.png",
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
    imageUrl: "/media/blogs-appartments/expat-living.png",
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
    imageUrl: "/media/blogs-appartments/islamabad-food.png",
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

  // Memoized filter logic for better performance
  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesCategory =
        activeCategory === "All Posts" || post.category === activeCategory;
      const matchesSearch =
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Expat Stays Blog",
    description:
      "Insights, tips, and inspiration for luxury travel, expat living, and making the most of your stay in premier destinations.",
    url: "https://myexpatstays.com/blog",
    publisher: {
      "@type": "Organization",
      name: "Expat Stays",
      url: "https://myexpatstays.com",
    },
    blogPost: blogPosts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      image: `https://myexpatstays.com${post.imageUrl}`,
      datePublished: post.date,
      author: {
        "@type": "Organization",
        name: post.author,
      },
      articleSection: post.category,
      url: `https://myexpatstays.com/blog/${post.slug}`,
    })),
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 relative overflow-x-hidden overflow-y-hidden">
        <Header />

        {/* Optimized Background - Reduced animations for better performance */}
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
          {/* Simplified gradient orbs - reduced for mobile performance */}
          <div className="hidden lg:block absolute top-24 left-10 w-[600px] h-[600px] bg-gradient-to-br from-[#DAF1DE]/20 to-[#8EB69B]/10 rounded-full blur-3xl" />
          <div className="hidden lg:block absolute bottom-10 right-10 w-[500px] h-[500px] bg-gradient-to-br from-[#8EB69B]/10 to-[#235347]/10 rounded-full blur-2xl" />

          {/* Strategic background images - Hidden on mobile for performance */}
          <div className="hidden lg:block absolute top-20 right-20 w-64 h-64 opacity-10">
            <Image
              src={getLocalImage("luxury", 0)}
              alt=""
              fill
              className="object-cover rounded-full"
              loading="lazy"
              quality={50}
              sizes="256px"
              aria-hidden="true"
            />
          </div>
          <div className="hidden lg:block absolute bottom-40 left-20 w-48 h-48 opacity-10">
            <Image
              src={getLocalImage("property", 1)}
              alt=""
              fill
              className="object-cover rounded-full"
              loading="lazy"
              quality={50}
              sizes="192px"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Blog Hero Section */}
        <section className="relative flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto pt-12 pb-10 px-4 sm:px-8 lg:px-12">
          {/* Textual Hero Content */}
          <div className="flex-1 z-10 text-center lg:text-left">
            <div className="inline-block mb-4 px-5 py-2 rounded-full bg-[#DAF1DE]/60 border border-[#8EB69B]/20 shadow-sm text-[#235347] font-medium text-base tracking-wide">
              <Sparkles className="inline-block w-5 h-5 mr-2 text-[#8EB69B] align-middle" aria-hidden="true" />
              <span>Insights & Tips</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-headline text-[#235347] mb-4 drop-shadow-lg">
              Expat Stays Blog
            </h1>
            <p className="text-base sm:text-lg lg:text-xl max-w-2xl mx-auto lg:mx-0 text-[#235347]/80 font-medium bg-white/70 rounded-xl px-4 sm:px-6 py-3 shadow-sm border border-[#DAF1DE]/40">
              Insights, tips, and inspiration for luxury travel, expat living, and
              making the most of your stay in premier destinations.
            </p>
          </div>
          {/* Decorative Hero Image - Hidden on mobile for performance */}
          <div className="relative hidden lg:flex flex-1 justify-end mt-10">
            <div className="relative w-80 h-80 rounded-full overflow-hidden shadow-2xl border-4 border-[#DAF1DE] bg-[#F8FCF9]">
              <Image
                src={getLocalImage("villa", 0)}
                alt="Luxury villa hero"
                fill
                className="object-cover scale-110 blur-[1px]"
                priority
                quality={75}
                sizes="320px"
              />
              {/* Soft green glow */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{ boxShadow: "0 0 64px 0 #DAF1DE88, 0 0 0 8px #8EB69B22" }}
                aria-hidden="true"
              />
            </div>
          </div>
        </section>

        {/* Filter/Search Section */}
        <section className="relative z-30 max-w-5xl mx-auto -mt-14 mb-16 px-4 sm:px-8">
          <div
            className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#DAF1DE]/60 px-6 py-5 animate-fade-in-up"
            style={{
              boxShadow: "0 8px 32px 0 #DAF1DE33, 0 1.5px 8px 0 #8EB69B22",
            }}
          >
            {/* Search */}
            <div className="flex items-center w-full md:w-auto mb-2 md:mb-0">
              <label htmlFor="blog-search" className="sr-only">
                Search blog posts
              </label>
              <span className="inline-flex items-center px-2 text-[#8EB69B]" aria-hidden="true">
                <Search className="w-5 h-5" />
              </span>
              <Input
                id="blog-search"
                type="text"
                placeholder="Search blog posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-72 rounded-full border border-[#DAF1DE] focus:ring-2 focus:ring-[#8EB69B]/40 focus:border-[#8EB69B] bg-white/90 text-[#235347] placeholder:text-[#8EB69B]/60 shadow-sm transition-all duration-300 text-base font-medium"
                aria-label="Search blog posts"
              />
            </div>
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-end w-full md:w-auto" role="tablist" aria-label="Blog post categories">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  role="tab"
                  aria-selected={activeCategory === cat}
                  aria-controls={`category-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`px-4 py-1.5 rounded-full font-semibold tracking-wide text-sm border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#8EB69B]/40 hover:scale-105 active:scale-95
                  ${activeCategory === cat
                      ? "bg-[#8EB69B] text-white border-[#8EB69B] shadow-lg"
                      : "bg-white text-[#235347] border-[#DAF1DE] hover:bg-[#DAF1DE]/40 hover:text-[#0B2B26]"
                    }
                `}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts Grid - Optimized Cards */}
        <section className="py-12 lg:py-16 relative" aria-label="Blog posts">
          <div className="container mx-auto px-4 sm:px-8">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-[#235347] mb-4">No posts found</p>
                <p className="text-[#8EB69B]">Try adjusting your search or category filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-12">
                {filteredPosts.map((post, i) => (
                  <article
                    key={post.slug}
                    className="group"
                    id={`category-${post.category.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <Card className="group transition-all duration-300 bg-white/95 hover:bg-white shadow-xl hover:shadow-2xl rounded-3xl overflow-hidden border border-[#EBEBEB]/70 hover:border-[#8EB69B]/50 px-0 pb-0 h-full flex flex-col">
                      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-3xl">
                        <Image
                          src={post.imageUrl}
                          alt={post.imageHint}
                          fill
                          className="object-cover rounded-3xl shadow-md group-hover:shadow-2xl border-2 border-transparent group-hover:border-[#DAF1DE] transition-all duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          priority={i < 2}
                          loading={i < 2 ? "eager" : "lazy"}
                          quality={75}
                        />
                      </div>
                      <CardContent className="p-5 lg:p-7 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-3 flex-wrap">
                          <div className="flex items-center gap-1 lg:gap-2 text-xs text-[#8EB69B] font-medium">
                            <Calendar className="h-3 lg:h-4 w-3 lg:w-4" aria-hidden="true" />
                            <time dateTime={post.date}>{post.date}</time>
                          </div>
                          <span className="text-[#DAF1DE]" aria-hidden="true">•</span>
                          <div className="flex items-center gap-1 lg:gap-2 text-xs text-[#8EB69B] font-medium">
                            <User className="h-3 lg:h-4 w-3 lg:w-4" aria-hidden="true" />
                            <span>{post.author}</span>
                          </div>
                          <span className="text-[#DAF1DE]" aria-hidden="true">•</span>
                          <div className="text-xs text-[#8EB69B] font-medium">
                            {post.readTime}
                          </div>
                        </div>
                        <CardTitle className="text-lg lg:text-xl font-extrabold tracking-tight text-[#051F20] group-hover:text-[#8EB69B] transition-colors mb-2 leading-snug">
                          {post.title}
                        </CardTitle>
                        <p className="text-[#4A4A4A] text-sm lg:text-base mb-3 lg:mb-4 line-clamp-3 font-medium flex-1">
                          {post.excerpt}
                        </p>
                        <Button
                          asChild
                          className="mt-auto rounded-full bg-gradient-to-r from-[#8EB69B] to-[#235347] text-white hover:from-[#235347] hover:to-[#8EB69B] shadow-lg shadow-[#8EB69B]/20 hover:shadow-xl hover:shadow-[#8EB69B]/30 transition-all duration-300 px-5 lg:px-7 py-2 text-sm lg:text-base font-semibold flex items-center justify-center tracking-wide"
                          aria-label={`Read more about ${post.title}`}
                        >
                          <Link href={`/blog/${post.slug}`}>
                            Read More
                            <ArrowRight className="h-4 lg:h-5 w-4 lg:w-5 ml-2 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
