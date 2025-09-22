"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, UserCircle, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { motion } from "framer-motion";

const blogPost = {
  id: "food-lovers-guide-islamabad-cafes-eateries",
  title: "A Food Lover's Guide to Islamabad: Best Cafés and Eateries",
  excerpt:
    "Islamabad may be known for its calm atmosphere and greenery, but it's also a city that surprises visitors with its vibrant food culture. Discover the best dining spots.",
  content: `
    <p>Islamabad may be known for its calm atmosphere and greenery, but it's also a city that surprises visitors with its vibrant food culture. From authentic international flavors to cozy local cafés, the capital offers a rich culinary experience for every kind of foodie.</p>
    
    <p>If you're visiting Islamabad or an expat looking for the city's best dining spots, here's your guide to the best cafés and eateries in Islamabad.</p>
    
    <h2>1. Fuoco</h2>
    <p>For a true Italian dining experience, Fuoco is unmatched. With handcrafted pastas, wood fired pizzas, and an elegant ambiance, it captures the essence of Italy right in Islamabad. The restaurant's attention to detail makes it a top choice for those who appreciate authentic Italian cuisine.</p>
    
    <h2>2. The Last Tribe</h2>
    <p>A new and exciting addition to Islamabad's dining scene, The Last Tribe blends creativity with flavor. Known for its eclectic menu and stylish atmosphere, it's quickly becoming a favorite for those who enjoy modern dining experiences with a cultural edge.</p>
    
    <h2>3. MêZ Turkish</h2>
    <p>Bringing the heart of Turkey to Islamabad, MêZ Turkish is famous for its flavorful lamb shank, mezze platters, and coal fired specialties. With warm hospitality and rich flavors, it's a go to spot for families, friends, and expats craving authentic Turkish cuisine.</p>
    
    <h2>4. The Carnivore</h2>
    <p>The Carnivore is renowned for its baked meat: slow cooked, oven baked cuts that come out tender, juicy, and deeply flavorful. It's a hearty, shareable experience perfect with classic sides and a must-try for anyone seeking the best baked meat in Islamabad.</p>
    
    <h2>5. Omer Khayyam</h2>
    <p>A longstanding favorite, Omer Khayyam offers a mix of Pakistani and continental dishes in a comfortable, welcoming setting. Known for its generous portions and consistency, it has built a loyal following among locals and expats alike.</p>
    
    <h2>From the Italian finesse of Fuoco, to the creativity of The Last Tribe, the Turkish warmth of MêZ, the bold flavors of The Carnivore, and the comfort of Omer Khayyam, Islamabad's food culture is rich, diverse, and full of flavor.</h2>
    
    <p>At Expat Stays, we know that discovering a city through its food is one of the best ways to feel at home. That's why our residences are always close to the city's best cafés and eateries so you can explore, indulge, and come back to comfort.</p>
  `,
  publishedDate: "November 28, 2024",
  author: "Expat Stays Team",
  category: "Food & Dining",
  featuredImageUrl: "/media/blogs-appartments/EX-4.JPG",
  readTime: "9 min read",
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
              Food
            </Badge>
            <Badge variant="outline" className="text-xs">
              Restaurants
            </Badge>
            <Badge variant="outline" className="text-xs">
              Islamabad
            </Badge>
            <Badge variant="outline" className="text-xs">
              Dining
            </Badge>
            <Badge variant="outline" className="text-xs">
              Cafés
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
