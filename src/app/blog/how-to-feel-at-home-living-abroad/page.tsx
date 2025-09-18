"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, UserCircle, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { motion } from "framer-motion";

const blogPost = {
  id: "how-to-feel-at-home-living-abroad",
  title: "How to Feel at Home When You're Living Abroad",
  excerpt:
    "Moving abroad can be both exciting and overwhelming. With the right mindset and practical steps, you can quickly create a lifestyle that feels welcoming and familiar.",
  content: `
    <p>Moving abroad can be both exciting and overwhelming. A new country brings opportunities, adventures, and cultural experiences but it can also come with challenges like homesickness, adjusting to new surroundings, and building a sense of belonging.</p>
    
    <p>The good news? With the right mindset and a few practical steps, you can quickly create a lifestyle that feels welcoming and familiar even when you're thousands of miles away. Here are some proven tips on how to feel at home when you're living abroad.</p>
    
    <h2>1. Find Comfortable and Familiar Accommodation</h2>
    <p>Your living space is the foundation of your new life abroad. Choosing the right accommodation can make all the difference in how quickly you adjust. Look for a place that's safe, comfortable, and close to the essentials like grocery stores, restaurants, and transport.</p>
    
    <p>At Expat Stays, we provide thoughtfully curated residences designed to feel like home so you can focus on enjoying your new city without worrying about the basics.</p>
    
    <h2>2. Connect with the Local Community</h2>
    <p>One of the fastest ways to feel settled abroad is to build connections. Attend local events, join expat groups, or take part in cultural activities. Meeting people who share your interests will not only ease loneliness but also enrich your experience with meaningful friendships.</p>
    
    <h2>3. Embrace Local Food and Culture</h2>
    <p>Food is a universal comfort. Explore local markets, cafés, and restaurants to immerse yourself in your new home's culture. At the same time, don't hesitate to cook your favorite dishes from home blending the familiar with the new creates balance and comfort.</p>
    
    <h2>4. Personalize Your Space</h2>
    <p>Even a temporary residence can feel like home with a personal touch. Add small things that remind you of home - photos, favorite books, or even a familiar scent. These little details make your space warm, welcoming, and uniquely yours.</p>
    
    <h2>5. Maintain a Routine</h2>
    <p>When everything around you feels unfamiliar, a routine brings stability. Whether it's a morning coffee ritual, a workout schedule, or an evening walk, consistency helps you feel grounded and creates a sense of normalcy in your new environment.</p>
    
    <h2>6. Stay Connected to Loved Ones</h2>
    <p>Thanks to technology, home is just a video call away. Staying in touch with friends and family helps ease homesickness. Share your experiences, send photos, and keep the bond alive while you build new connections abroad.</p>
    
    <h2>7. Explore Like a Local</h2>
    <p>Don't just stick to tourist attractions explore hidden cafés, parks, and neighborhoods. The more familiar you become with your surroundings, the more comfortable and "at home" you'll feel.</p>
    
    <h2>Living abroad is an incredible journey filled with opportunities for growth, learning, and discovery. While the transition can feel daunting, creating a sense of home is possible with the right mindset and environment.</h2>
    
    <p>At Expat Stays, we make it our mission to provide homes away from home residences that combine comfort, convenience, and care. Because no matter where you are in the world, you deserve a place that feels like home.</p>
  `,
  publishedDate: "December 5, 2024",
  author: "Expat Stays Team",
  category: "Lifestyle",
  featuredImageUrl: "/media/blogs/EX-3.JPG",
  readTime: "7 min read",
};

export default function BlogPostDetailPage() {
  const post = blogPost;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-20 md:pt-28">
      <article>
        <header className="mb-6 lg:mb-8">
          <Link
            href="/blog"
            className="text-xs lg:text-sm text-accent hover:text-primary transition-colors mb-2 lg:mb-3 inline-block"
          >
            &larr; Back to Blog
          </Link>
          <h1 className="text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-headline font-bold text-primary mb-3 lg:mb-4 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-3 lg:gap-x-4 gap-y-2 text-xs lg:text-sm text-muted-foreground">
            <div className="flex items-center">
              <UserCircle className="w-3 lg:w-4 h-3 lg:h-4 mr-1 lg:mr-1.5" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center">
              <CalendarDays className="w-3 lg:w-4 h-3 lg:h-4 mr-1 lg:mr-1.5" />
              <span>{post.publishedDate}</span>
            </div>
            <div className="flex items-center">
              <Tag className="w-3 lg:w-4 h-3 lg:h-4 mr-1 lg:mr-1.5" />
              <Badge
                variant="secondary"
                className="bg-accent/20 text-accent text-xs lg:text-sm"
              >
                {post.category}
              </Badge>
            </div>
          </div>
        </header>

        {post.featuredImageUrl && (
          <motion.div
            whileHover={{ scale: 1.015 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden mb-6 lg:mb-8 shadow-lg border-2 border-transparent hover:border-[#DAF1DE] focus-within:border-[#8EB69B]"
          >
            <Image
              src={post.featuredImageUrl}
              alt={post.title}
              fill
              priority
              className="object-cover rounded-3xl transition-all duration-300"
            />
          </motion.div>
        )}

        <div
          className="prose prose-sm lg:prose-lg dark:prose-invert max-w-none prose-headings:font-headline prose-headings:text-primary prose-a:text-accent hover:prose-a:text-primary prose-img:rounded-2xl prose-img:shadow-lg prose-img:border-2 prose-img:border-[#DAF1DE] hover:prose-img:border-[#8EB69B] prose-img:mx-auto prose-img:transition-all prose-img:duration-300"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <Separator className="my-6 lg:my-8" />

        <footer className="mt-6 lg:mt-8">
          <div className="flex flex-wrap items-center gap-2 mb-3 lg:mb-4">
            <span className="text-xs lg:text-sm font-semibold text-foreground">
              Tags:
            </span>
            <Badge variant="outline" className="text-xs">
              Expat Living
            </Badge>
            <Badge variant="outline" className="text-xs">
              Lifestyle
            </Badge>
            <Badge variant="outline" className="text-xs">
              Tips
            </Badge>
            <Badge variant="outline" className="text-xs">
              Home Away From Home
            </Badge>
          </div>
          <div className="flex items-center space-x-3 p-3 lg:p-4 bg-card rounded-lg lg:rounded-components shadow">
            <Avatar className="h-12 lg:h-16 w-12 lg:w-16">
              <AvatarImage
                src="https://ui-avatars.com/api/?name=ES&size=100&background=235347&color=ffffff&bold=true"
                alt="Expat Stays Team"
              />
              <AvatarFallback className="text-xs lg:text-base">
                {post.author.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs lg:text-sm text-muted-foreground">
                Written by
              </p>
              <p className="text-sm lg:text-lg font-semibold text-foreground">
                {post.author}
              </p>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}
