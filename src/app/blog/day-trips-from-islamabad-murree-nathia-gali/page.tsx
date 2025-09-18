"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, UserCircle, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { motion } from "framer-motion";

const blogPost = {
  id: "day-trips-from-islamabad-murree-nathia-gali",
  title: "Day Trips from Islamabad: Murree, Nathia Gali & Beyond",
  excerpt:
    "Islamabad is perfectly located for travelers who love nature, cool weather, and scenic getaways. Explore the best day trips from the capital to nearby hill stations.",
  content: `
    <p>Islamabad is perfectly located for travelers who love nature, cool weather, and scenic getaways. Surrounded by the Margalla Hills and within driving distance of the Himalayan foothills, the city makes an excellent base for exploring nearby hill stations and valleys.</p>
    
    <p>If you're staying in Islamabad whether for business, leisure, or relocation taking a day trip is the perfect way to experience the region's natural beauty. Here are some of the best day trips from Islamabad you should add to your travel list.</p>
    
    <h2>1. Murree – The Queen of Hills</h2>
    <p>Just a 90 minute drive from Islamabad, Murree is Pakistan's most famous hill station. Known as the Queen of Hills, it's a popular spot for both tourists and locals seeking cool mountain air and breathtaking views.</p>
    
    <p><strong>Highlights in Murree:</strong></p>
    <ul>
      <li><strong>Mall Road:</strong> Stroll along shops, cafés, and local eateries.</li>
      <li><strong>Patriata:</strong> Ride the chairlift and cable car for panoramic views.</li>
      <li><strong>Pindi Point & Kashmir Point:</strong> Scenic viewpoints with postcard-worthy sights.</li>
    </ul>
    
    <p>Perfect for: Families, couples, and anyone looking for a quick escape from the city's hustle.</p>
    
    <h2>2. Nathia Gali – Nature Lover's Paradise</h2>
    <p>A little further into the Galyat region (about 2 hours from Islamabad) lies Nathia Gali, a serene hill station known for its pine covered hills and cool climate.</p>
    
    <p><strong>Highlights in Nathia Gali:</strong></p>
    <ul>
      <li><strong>Mukshpuri & Miranjani Hikes:</strong> Easy to moderate treks with stunning views.</li>
      <li><strong>Nathia Gali Bazaar:</strong> Quaint shops offering handicrafts and local food.</li>
      <li><strong>Wildlife Spotting:</strong> If you're lucky, you might spot monkeys or even leopards in the forest.</li>
    </ul>
    
    <p>Perfect for: Hikers, adventure seekers, and nature enthusiasts.</p>
    
    <h2>3. Ayubia National Park</h2>
    <p>Located near Nathia Gali, Ayubia National Park is another great day trip destination. It's known for the famous Ayubia Chairlift and the Pipeline Track, a 4 km scenic walk surrounded by lush green forests.</p>
    
    <p>Perfect for: Families with kids, picnic lovers, and casual explorers.</p>
    
    <h2>4. Patriat</h2>
    <p>If you love adventure, head towards Patriata, located about 15 km from Murree. The highlight here is the chairlift and cable car system, which takes visitors high above the forests and valleys. The ride itself is worth the trip, especially for photographers.</p>
    
    <p>Perfect for: Thrill seekers, photographers, and couples.</p>
    
    <h2>5. Beyond Galyat – Abbottabad & Thandiani</h2>
    <p>For those who want to venture even further, Abbottabad (about 3 hours away) and Thandiani (around 4 hours from Islamabad) offer less crowded, off the beaten path experiences. With lush meadows, tall pines, and stunning mountain views, these spots are ideal for travelers looking for peace and quiet.</p>
    
    <h2>Make Islamabad Your Base with Expat Stays</h2>
    <p>The best part about these trips is that you can enjoy them all while making Islamabad your home base. At Expat Stays, we provide handpicked residences designed for comfort, convenience, and hospitality. Whether you're visiting for a few days or staying longterm, you'll always have a home away from home waiting for you in the capital.</p>
    
    <h2>Final Thoughts</h2>
    <p>From the lively streets of Murree to the peaceful trails of Nathia Gali and the hidden beauty of Thandiani, there's no shortage of day trips from Islamabad. Each destination offers a unique experience, making your stay in the capital even more memorable.</p>
    
    <p>So pack your bags, plan your trip, and let Islamabad be your gateway to the mountains.</p>
  `,
  publishedDate: "December 10, 2024",
  author: "Expat Stays Team",
  category: "Travel Guides",
  featuredImageUrl: "/media/blogs/EX-2.JPG",
  readTime: "8 min read",
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
              Day Trips
            </Badge>
            <Badge variant="outline" className="text-xs">
              Murree
            </Badge>
            <Badge variant="outline" className="text-xs">
              Nathia Gali
            </Badge>
            <Badge variant="outline" className="text-xs">
              Hill Stations
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
