"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, UserCircle, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { getLocalImage } from "@/lib/imageUtils";
import { motion } from "framer-motion";

// Mock blog post data
const blogPost = {
  id: "top-5-luxury-experiences-dubai",
  title: "Top 5 Luxury Experiences in Dubai You Can't Miss",
  excerpt:
    "Discover the pinnacle of opulence with our curated list of must-try luxury experiences in the dazzling city of Dubai.",
  content: `
    <p>Dubai has established itself as the global capital of luxury, offering experiences that redefine opulence and sophistication. Whether you're visiting for business or pleasure, these five luxury experiences will create memories that last a lifetime.</p>
    
    <h2>1. Private Yacht Charter in Dubai Marina</h2>
    <p>Nothing says luxury quite like cruising the pristine waters of the Arabian Gulf aboard your own private yacht. Dubai Marina offers some of the most spectacular yacht charters in the world.</p>
    
    <h2>2. Desert Safari with Luxury Camping</h2>
    <p>Experience the magic of the Arabian desert with our exclusive luxury desert safari. From thrilling dune bashing to stargazing in premium desert camps, this adventure combines excitement with unparalleled comfort.</p>
    
    <h2>3. Helicopter Tour of Iconic Landmarks</h2>
    <p>See Dubai from a bird's eye view with a private helicopter tour. Marvel at the Burj Khalifa, Palm Jumeirah, and the World Islands from above.</p>
    
    <h2>4. Private Shopping Experience at Dubai Mall</h2>
    <p>Enjoy VIP treatment with a personal shopping assistant who will guide you through the world's largest shopping mall, ensuring access to exclusive collections and personalized service.</p>
    
    <h2>5. Fine Dining at Michelin-Starred Restaurants</h2>
    <p>Dubai's culinary scene rivals any major city in the world. Experience world-class cuisine at restaurants helmed by celebrity chefs and award-winning culinary teams.</p>
  `,
  publishedDate: "October 26, 2023",
  author: "Jane Doe",
  category: "Travel Guides",
  featuredImageUrl: getLocalImage("luxury", 1),
  readTime: "8 min read",
};

export default function BlogPostDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  // In a real app, you'd fetch post data based on params.slug
  const post = blogPost; // Using mock data for now

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 pt-20 lg:pt-24 md:pt-32 max-w-4xl">
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
            {/* Add tags based on post.tags */}
          </div>
          <div className="flex items-center space-x-3 p-3 lg:p-4 bg-card rounded-lg lg:rounded-components shadow">
            <Avatar className="h-12 lg:h-16 w-12 lg:w-16">
              <AvatarImage
                src="https://ui-avatars.com/api/?name=JD&size=100&background=235347&color=ffffff&bold=true"
                alt="Jane Doe"
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

// Add basic styling for prose content in globals.css or here if needed
// For example:
// .prose h2 { @apply text-2xl font-bold mb-4 text-primary; }
// .prose p { @apply mb-4 leading-relaxed; }
// .prose figure { @apply my-6; }
// .prose img { @apply rounded-lg shadow-md mx-auto; }
// .prose figcaption { @apply text-center text-sm text-muted-foreground mt-2; }
// This is handled by Tailwind Typography plugin (prose classes) which assumes you have it installed.
// For this project, I've added basic Tailwind classes to the HTML string directly for simplicity as the plugin is not part of default scaffold.
// If Tailwind Typography is installed, the classes in HTML string for typography can be removed and `prose` classes would work.
