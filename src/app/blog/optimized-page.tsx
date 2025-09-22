"use client";

import { useState, useCallback, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOptimizedFetch } from "@/hooks/useOptimizedFetch";
import { usePerformanceMonitor } from "@/hooks/use-performance";
import Header from "@/components/layout/Header";
import OptimizedImage from "@/components/OptimizedImage";
import Link from "next/link";

// Blog post interface
interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  imageUrl: string;
  imageHint: string;
  author: string;
  category: string;
  readTime: string;
}

// Mock blog data (in production, this would come from an API)
const blogPosts: BlogPost[] = [
  {
    slug: "top-5-things-to-do-islamabad",
    title: "Top 5 Things to Do When in Islamabad",
    date: "December 15, 2024",
    excerpt: "Islamabad, the capital of Pakistan, is often described as one of the most beautiful capitals in the world. Discover the top 5 experiences that will make your trip unforgettable...",
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
    excerpt: "Islamabad is perfectly located for travelers who love nature, cool weather, and scenic getaways. Explore the best day trips from the capital to nearby hill stations...",
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
    excerpt: "Moving abroad can be both exciting and overwhelming. With the right mindset and practical steps, you can quickly create a lifestyle that feels welcoming and familiar...",
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
    excerpt: "Islamabad may be known for its calm atmosphere and greenery, but it's also a city that surprises visitors with its vibrant food culture. Discover the best dining spots...",
    imageUrl: "/media/blogs-appartments/EX-4.JPG",
    imageHint: "Islamabad restaurant dining",
    author: "Expat Stays Team",
    category: "Food & Dining",
    readTime: "9 min read",
  },
];

// Blog card component
const BlogCard = ({ post }: { post: BlogPost }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-white hover:shadow-2xl transition-all duration-300 group">
      <div className="relative aspect-[16/10] overflow-hidden">
        <OptimizedImage
          src={post.imageUrl}
          alt={post.imageHint}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-[#8EB69B]/90 text-white border-0">
            {post.category}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center gap-4 text-sm text-[#4A4A4A] mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{post.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{post.author}</span>
          </div>
          <span>{post.readTime}</span>
        </div>
        
        <CardTitle className="text-xl font-bold text-[#051F20] mb-3 line-clamp-2">
          {post.title}
        </CardTitle>
        
        <p className="text-[#4A4A4A] leading-relaxed mb-4 line-clamp-3">
          {post.excerpt}
        </p>
      </CardContent>
      
      <CardFooter className="p-6 pt-0">
        <Link href={`/blog/${post.slug}`} className="w-full">
          <Button className="w-full bg-[#8EB69B] hover:bg-[#235347] text-white group">
            Read More
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  </motion.div>
);

// Loading skeleton
const BlogCardSkeleton = () => (
  <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-white">
    <div className="aspect-[16/10] bg-gray-200 animate-pulse" />
    <CardContent className="p-6">
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-6 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
      </div>
    </CardContent>
  </Card>
);

// Filter component
const BlogFilters = ({ 
  filters, 
  onFiltersChange 
}: { 
  filters: { category: string; sortBy: string }; 
  onFiltersChange: (filters: { category: string; sortBy: string }) => void; 
}) => {
  const categories = ["All", "Travel Guides", "Lifestyle", "Food & Dining"];
  
  return (
    <Card className="border-0 shadow-xl rounded-2xl bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-[#051F20]">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-[#051F20] mb-2 block">Category</label>
          <Select
            value={filters.category}
            onValueChange={(value) => onFiltersChange({ ...filters, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category.toLowerCase()}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium text-[#051F20] mb-2 block">Sort By</label>
          <Select
            value={filters.sortBy}
            onValueChange={(value) => onFiltersChange({ ...filters, sortBy: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Latest" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="title">Title A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

// Main blog page component
function BlogPageContent() {
  const { trackInteraction } = usePerformanceMonitor("BlogPage");

  // State management
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    sortBy: 'latest',
  });

  // Optimized data fetching
  const {
    data: posts,
    loading,
    error,
    refetch,
  } = useOptimizedFetch<BlogPost[]>(
    'blog-posts',
    async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return blogPosts;
    },
    {
      cacheTime: 15 * 60 * 1000, // 15 minutes
      staleTime: 5 * 60 * 1000, // 5 minutes
      retryCount: 2,
    }
  );

  // Memoized filtered and sorted posts
  const filteredPosts = useMemo(() => {
    if (!posts) return [];

    const filtered = posts.filter((post) => {
      // Search filter
      if (filters.search && !post.title.toLowerCase().includes(filters.search.toLowerCase()) && 
          !post.excerpt.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Category filter
      if (filters.category !== 'all' && post.category.toLowerCase() !== filters.category) {
        return false;
      }

      return true;
    });

    // Sort posts
    switch (filters.sortBy) {
      case 'oldest':
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'latest':
      default:
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
    }

    return filtered;
  }, [posts, filters]);

  // Track interactions
  const handleFilterChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
    trackInteraction('filter_change');
  }, [trackInteraction]);

  const handleViewModeChange = useCallback((mode: 'grid' | 'list') => {
    setViewMode(mode);
    trackInteraction('view_mode_change');
  }, [trackInteraction]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FBF9] to-[#E6F2EC] pt-20">
      <Header />
      
      {/* Hero Section */}
      <section className="relative flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto pt-12 pb-10 px-4 sm:px-8 lg:px-12">
        <div className="flex-1 z-10 text-center lg:text-left">
          <div className="inline-block mb-4 px-5 py-2 rounded-full bg-[#DAF1DE]/60 border border-[#8EB69B]/20 shadow-sm text-[#235347] font-medium text-base tracking-wide">
            <Sparkles className="inline-block w-5 h-5 mr-2 text-[#8EB69B] align-middle" />
            Insights & Tips
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-headline text-[#235347] mb-4 drop-shadow-lg">
            Expat Stays Blog
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto lg:mx-0 text-[#235347]/80 font-medium bg-white/70 rounded-xl px-6 py-3 shadow-sm border border-[#DAF1DE]/40">
            Insights, tips, and inspiration for luxury travel, expat living, and making the most of your stay in premier destinations.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search blog posts..."
                value={filters.search}
                onChange={(e) => handleFilterChange({ ...filters, search: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={showFilters ? "default" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? "default" : "ghost"}
                size="sm"
                onClick={() => handleViewModeChange('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? "default" : "ghost"}
                size="sm"
                onClick={() => handleViewModeChange('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1">
              <BlogFilters
                filters={filters}
                onFiltersChange={handleFilterChange}
              />
            </div>
          )}

          {/* Blog Posts Grid */}
          <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <BlogCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">Failed to load blog posts</p>
                <Button onClick={() => refetch()}>Try Again</Button>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No blog posts found matching your criteria</p>
                <Button onClick={() => setFilters({
                  search: '',
                  category: 'all',
                  sortBy: 'latest',
                })}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredPosts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main export with Suspense wrapper
export default function BlogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#F8FBF9] to-[#E6F2EC] pt-20">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8EB69B]"></div>
        </div>
      </div>
    }>
      <BlogPageContent />
    </Suspense>
  );
}
