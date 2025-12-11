"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, UserCircle, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
// Removed framer-motion for performance

const blogPost = {
  id: "top-5-things-to-do-islamabad",
  title: "Top 5 Things to Do When in Islamabad",
  excerpt:
    "Islamabad, the capital of Pakistan, is often described as one of the most beautiful capitals in the world. Discover the top 5 experiences that will make your trip unforgettable.",
  content: `
    <p>Islamabad, the capital of Pakistan, is often described as one of the most beautiful capitals in the world. Nestled against the lush Margalla Hills, the city is known for its greenery, calm atmosphere, and modern urban design. Whether you're visiting Islamabad for business, leisure, or a short stay, the city offers a perfect mix of cultural landmarks, natural beauty, and hospitality.</p>
    
    <p>If you're wondering what to do in Islamabad, here are the top 5 things to do in Islamabad that will make your trip unforgettable.</p>
    
    <h2>1. Visit the Iconic Faisal Mosque</h2>
    <p>No list of Islamabad attractions is complete without Faisal Mosque, the city's most recognized landmark. With its modern architecture inspired by a desert tent, this mosque is one of the largest in the world and offers a serene atmosphere for both worshippers and visitors. Its stunning location at the foothills of Margalla makes it a must-see spot when you're in the capital.</p>
    
    <h2>2. Enjoy Scenic Views at Daman-e-Koh & Monal</h2>
    <p>For breathtaking panoramic views of Islamabad, head up to Daman-e-Koh, a popular viewpoint in the Margalla Hills National Park. Just a short drive further is Monal Restaurant, famous for its terrace dining experience overlooking the city. Whether you're enjoying tea at sunset or a full meal under the stars, this is one of the most memorable experiences in Islamabad.</p>
    
    <h2>3. Explore Pakistan's Culture at Lok Virsa Museum</h2>
    <p>Immerse yourself in Pakistan's heritage at Lok Virsa Museum, where you'll find exhibitions of traditional crafts, folk music, and cultural displays from across the country. This cultural hub gives visitors a deeper understanding of Pakistan's diverse history and is one of the best places to visit in Islamabad for families and travelers curious about local traditions.</p>
    
    <h2>4. Relax by Rawal Lake</h2>
    <p>If you're looking for a peaceful escape within the city, Rawal Lake is the place to be. A favorite among locals, it's perfect for picnics, boating, or simply enjoying a walk along the water. Surrounded by gardens and hills, Rawal Lake is ideal for those who love nature and want to unwind in a calm, scenic environment.</p>
    
    <h2>5. Shop & Dine at Centaurus Mall</h2>
    <p>For a modern city experience, Centaurus Mall is Islamabad's go to shopping and dining destination. From international fashion brands to local boutiques and a wide range of restaurants, the mall offers something for everyone. It's also a great place to relax after a day of sightseeing, making it one of the top things to do in Islamabad.</p>
    
    <h2>A City That Feels Like Home</h2>
    <p>Islamabad is more than just a capital it's a city that blends natural beauty, culture, and hospitality. Whether you're here for a short stay or planning to settle for longer, these top 5 experiences will give you a taste of everything the city has to offer.</p>
    
    <p>At Expat Stays, we believe in creating a home like experience for our guests. Our handpicked residences in Islamabad ensure you enjoy both comfort and convenience while exploring the best the city has to offer.</p>
  `,
  publishedDate: "December 15, 2024",
  author: "Expat Stays Team",
  category: "Travel Guides",
  featuredImageUrl: "/media/blogs-appartments/islamabad-mosque.png",
  readTime: "6 min read",
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
          <div
            className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden mb-6 lg:mb-8 shadow-lg border-2 border-transparent hover:border-[#DAF1DE] focus-within:border-[#8EB69B] transition-all duration-300 hover:scale-[1.01]"
          >
            <Image
              src={post.featuredImageUrl}
              alt={post.title}
              fill
              priority
              className="object-cover rounded-3xl transition-all duration-300"
            />
          </div>
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
              Islamabad
            </Badge>
            <Badge variant="outline" className="text-xs">
              Travel
            </Badge>
            <Badge variant="outline" className="text-xs">
              Tourism
            </Badge>
            <Badge variant="outline" className="text-xs">
              Pakistan
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
