"use client";
import {
  Sailboat,
  MountainSnow,
  Utensils,
  ShoppingBag,
  Landmark,
  Heart,
  Star,
  ArrowRight,
  Filter,
  Search,
  Sparkles,
  Clock,
  Users,
  MapPin,
  ChevronRight,
  BookOpen,
  Zap,
  Globe,
  Shield,
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

const experiencesData = [
  {
    slug: "desert-safari-adventure",
    title: "Thrilling Desert Safari",
    icon: MountainSnow,
    description:
      "Experience the magic of the Arabian desert with dune bashing, camel rides, traditional entertainment, and a starlit dinner.",
    imageUrl: getLocalImage("desert", 0),
    imageHint: "desert dunes sunset",
    category: "Adventure",
    duration: "6-8 hours",
    price: "From $150",
    rating: 4.9,
    reviews: 245,
    featured: true,
    difficulty: "Moderate",
    groupSize: "2-8 people",
    location: "Arabian Desert",
  },
  {
    slug: "luxury-yacht-charter",
    title: "Private Yacht Charter",
    icon: Sailboat,
    description:
      "Cruise along the stunning coastline in a luxury yacht. Enjoy breathtaking views, swimming, and onboard refreshments.",
    imageUrl: getLocalImage("yacht", 0),
    imageHint: "yacht on sea city",
    category: "Leisure",
    duration: "4-6 hours",
    price: "From $500",
    rating: 4.8,
    reviews: 189,
    featured: true,
    difficulty: "Easy",
    groupSize: "2-12 people",
    location: "Coastal Waters",
  },
  {
    slug: "gourmet-dining-tour",
    title: "Exclusive Gourmet Dining Tour",
    icon: Utensils,
    description:
      "Embark on a culinary journey through the city's finest restaurants, experiencing world-class cuisine and ambiance.",
    imageUrl: getLocalImage("dining", 0),
    imageHint: "fine dining table",
    category: "Culinary",
    duration: "3-4 hours",
    price: "From $200",
    rating: 4.7,
    reviews: 156,
    featured: false,
    difficulty: "Easy",
    groupSize: "2-6 people",
    location: "City Center",
  },
  {
    slug: "personal-shopping-experience",
    title: "VIP Personal Shopping",
    icon: ShoppingBag,
    description:
      "Indulge in a personalized shopping spree with a dedicated stylist at a luxury mall or exclusive boutiques.",
    imageUrl: getLocalImage("shopping", 0),
    imageHint: "luxury shopping boutique",
    category: "Lifestyle",
    duration: "2-4 hours",
    price: "From $100",
    rating: 4.6,
    reviews: 98,
    featured: false,
    difficulty: "Easy",
    groupSize: "1-4 people",
    location: "Luxury District",
  },
  {
    slug: "heritage-cultural-tour",
    title: "Heritage & Cultural Discovery",
    icon: Landmark,
    description:
      "Explore the rich history and vibrant culture through guided tours of iconic landmarks, museums, and traditional markets.",
    imageUrl: getLocalImage("heritage", 0),
    imageHint: "cultural landmarks heritage",
    category: "Culture",
    duration: "4-5 hours",
    price: "From $120",
    rating: 4.8,
    reviews: 203,
    featured: false,
    difficulty: "Easy",
    groupSize: "2-10 people",
    location: "Historic District",
  },
  {
    slug: "luxury-spa-wellness",
    title: "Luxury Spa & Wellness",
    icon: Heart,
    description:
      "Rejuvenate your body and mind with world-class spa treatments and wellness programs in serene, luxurious settings.",
    imageUrl: getLocalImage("spa", 0),
    imageHint: "luxury spa wellness treatment",
    category: "Wellness",
    duration: "2-3 hours",
    price: "From $180",
    rating: 4.9,
    reviews: 167,
    featured: true,
    difficulty: "Easy",
    groupSize: "1-2 people",
    location: "Wellness Resort",
  },
];

const categories = [
  "All Experiences",
  "Adventure",
  "Leisure",
  "Culinary",
  "Lifestyle",
  "Culture",
  "Wellness",
];

export default function ExperiencesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] via-white to-[#DAF1DE]/30">
      {/* Hero Section with Split Layout */}
      <Header />
      <section className="relative pt-20 pb-24 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#8EB69B]/5 via-transparent to-[#0B2B26]/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#8EB69B]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#0B2B26]/10 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="container mx-auto px-4 sm:px-8 rela33tive z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#8EB69B]/20 to-[#0B2B26]/20 border border-[#8EB69B]/30 rounded-full px-6 py-3">
                <Sparkles className="h-4 w-4 text-[#8EB69B]" />
                <Badge className="bg-transparent text-[#0B2B26] border-[#8EB69B]/50 px-3 py-1 rounded-full text-sm font-medium">
                  Curated Experiences
                </Badge>
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-bold text-[#163832] leading-tight">
                  Indulge in the
                  <br />
                  <span className="bg-gradient-to-r from-[#8EB69B] to-[#0B2B26] bg-clip-text text-transparent">
                    Extraordinary
                  </span>
                </h1>

                <p className="text-xl text-[#235347]/80 max-w-lg leading-relaxed">
                  Curated local experiences designed to leave a lasting
                  impression.
                </p>

                <div className="flex items-center gap-8 text-sm text-[#235347]/60">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>Premium Quality</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#8EB69B]" />
                    <span>Expert Guides</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#0B2B26]" />
                    <span>Curated Locations</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={getLocalImage("desert", 0)}
                  alt="Luxury Experience"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#163832]/60 via-transparent to-transparent" />

                {/* Floating Elements */}
                <div className="absolute top-6 left-6">
                  <Badge className="bg-[#8EB69B]/90 backdrop-blur-sm text-[#163832] border-0">
                    Featured
                  </Badge>
                </div>
                <div className="absolute bottom-6 right-6">
                  <Badge className="bg-[#0B2B26]/90 backdrop-blur-sm text-white border-0">
                    From $150
                  </Badge>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Floating Category Filter Bar */}
      <section className="relative -mt-12 mb-16">
        <div className="container mx-auto px-4 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/80 backdrop-blur-xl border border-[#8EB69B]/20 rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-[#235347]/70">
                <Filter className="h-5 w-5" />
                <span className="text-sm font-medium">Filter by:</span>
              </div>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={
                      category === "All Experiences" ? "default" : "outline"
                    }
                    size="sm"
                    className={`rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                      category === "All Experiences"
                        ? "bg-[#8EB69B] text-[#163832] shadow-lg shadow-[#8EB69B]/25"
                        : "border-[#0B2B26] text-[#0B2B26] hover:bg-[#8EB69B] hover:text-white hover:shadow-lg hover:shadow-[#8EB69B]/25"
                    }`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Experiences Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-[#163832] mb-4">
              Featured Experiences
            </h2>
            <p className="text-[#235347]/70 max-w-2xl mx-auto">
              Our most popular and highly-rated experiences, carefully curated
              for the discerning traveler.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {experiencesData
              .filter((exp) => exp.featured)
              .map((exp, index) => (
                <motion.div
                  key={exp.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="group overflow-hidden border-[#8EB69B]/20 bg-[#163832] text-[#F4F4F4] rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex flex-col lg:flex-row h-full">
                      <div className="relative lg:w-1/2 aspect-[4/3] lg:aspect-square overflow-hidden">
                        <Image
                          src={exp.imageUrl}
                          alt={exp.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#163832]/60 via-transparent to-transparent" />

                        {/* Enhanced Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          <Badge className="bg-[#8EB69B]/90 backdrop-blur-sm text-[#163832] border-0">
                            {exp.category}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-[#163832]/90 backdrop-blur-sm border-[#8EB69B]/30 text-[#8EB69B]"
                          >
                            Featured
                          </Badge>
                        </div>

                        {/* Enhanced Price */}
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-[#0B2B26]/90 backdrop-blur-sm border-0 text-white font-semibold">
                            {exp.price}
                          </Badge>
                        </div>

                        {/* Enhanced Rating */}
                        <div className="absolute bottom-4 left-4">
                          <div className="flex items-center gap-2 bg-[#163832]/90 backdrop-blur-sm rounded-full px-3 py-2">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-semibold">
                              {exp.rating}
                            </span>
                            <span className="text-xs text-[#F4F4F4]/60">
                              ({exp.reviews})
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="lg:w-1/2 p-6 lg:p-8 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#8EB69B]/20 to-[#0B2B26]/20 rounded-2xl flex items-center justify-center">
                              <exp.icon className="h-6 w-6 text-[#8EB69B]" />
                            </div>
                            <div>
                              <CardTitle className="text-xl lg:text-2xl font-bold text-[#F4F4F4] group-hover:text-[#8EB69B] transition-colors">
                                {exp.title}
                              </CardTitle>
                              <p className="text-sm text-[#F4F4F4]/60 flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                {exp.duration}
                              </p>
                            </div>
                          </div>

                          <p className="text-[#F4F4F4]/80 leading-relaxed mb-6">
                            {exp.description}
                          </p>

                          {/* Enhanced Experience Details */}
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="flex items-center gap-2 text-sm text-[#F4F4F4]/70">
                              <Users className="h-4 w-4 text-[#8EB69B]" />
                              <span>{exp.groupSize}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[#F4F4F4]/70">
                              <MapPin className="h-4 w-4 text-[#0B2B26]" />
                              <span>{exp.location}</span>
                            </div>
                          </div>
                        </div>

                        <Button
                          asChild
                          className="w-full rounded-2xl bg-gradient-to-r from-[#8EB69B] to-[#0B2B26] text-white hover:from-[#0B2B26] hover:to-[#8EB69B] shadow-lg shadow-[#8EB69B]/25 hover:shadow-xl hover:shadow-[#8EB69B]/30 transition-all duration-300 py-4 text-lg font-semibold"
                        >
                          <Link href={`/experiences/${exp.slug}`}>
                            Learn More & Book
                            <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* All Experiences Grid */}
      <section className="py-16 bg-gradient-to-br from-[#FAFAFA]/50 to-white">
        <div className="container mx-auto px-4 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-[#163832] mb-4">
              All Experiences
            </h2>
            <p className="text-[#235347]/70 max-w-2xl mx-auto">
              Discover our complete collection of curated experiences designed
              to create unforgettable memories.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiencesData.map((exp, index) => (
              <motion.div
                key={exp.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="group overflow-hidden border-[#8EB69B]/20 bg-[#163832] text-[#F4F4F4] rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                  <CardHeader className="p-0">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={exp.imageUrl}
                        alt={exp.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#163832]/60 via-transparent to-transparent" />

                      {/* Enhanced Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <Badge className="bg-[#8EB69B]/90 backdrop-blur-sm text-[#163832] border-0">
                          {exp.category}
                        </Badge>
                        {exp.featured && (
                          <Badge
                            variant="outline"
                            className="bg-[#163832]/90 backdrop-blur-sm border-[#8EB69B]/30 text-[#8EB69B]"
                          >
                            Featured
                          </Badge>
                        )}
                      </div>

                      {/* Enhanced Price */}
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-[#0B2B26]/90 backdrop-blur-sm border-0 text-white font-semibold">
                          {exp.price}
                        </Badge>
                      </div>

                      {/* Enhanced Rating */}
                      <div className="absolute bottom-4 left-4">
                        <div className="flex items-center gap-2 bg-[#163832]/90 backdrop-blur-sm rounded-full px-3 py-2">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-semibold">
                            {exp.rating}
                          </span>
                          <span className="text-xs text-[#F4F4F4]/60">
                            ({exp.reviews})
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#8EB69B]/20 to-[#0B2B26]/20 rounded-2xl flex items-center justify-center">
                        <exp.icon className="h-6 w-6 text-[#8EB69B]" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-[#F4F4F4] group-hover:text-[#8EB69B] transition-colors">
                          {exp.title}
                        </CardTitle>
                        <p className="text-sm text-[#F4F4F4]/60 flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          {exp.duration}
                        </p>
                      </div>
                    </div>

                    <p className="text-[#F4F4F4]/80 leading-relaxed mb-4">
                      {exp.description}
                    </p>

                    {/* Enhanced Experience Details */}
                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm text-[#F4F4F4]/70">
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3 text-[#8EB69B]" />
                        <span>{exp.groupSize}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-[#0B2B26]" />
                        <span>{exp.location}</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-6 pt-0">
                    <Button
                      asChild
                      className="w-full rounded-2xl bg-gradient-to-r from-[#8EB69B] to-[#0B2B26] text-white hover:from-[#0B2B26] hover:to-[#8EB69B] shadow-lg shadow-[#8EB69B]/25 hover:shadow-xl hover:shadow-[#8EB69B]/30 transition-all duration-300"
                    >
                      <Link href={`/experiences/${exp.slug}`}>
                        Learn More & Book
                        <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Enhanced Load More */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-16"
          >
            <Button
              variant="outline"
              size="lg"
              className="rounded-2xl border-[#8EB69B]/30 text-[#0B2B26] hover:bg-gradient-to-r hover:from-[#8EB69B] hover:to-[#0B2B26] hover:text-white hover:border-0 px-10 py-4 text-lg font-semibold shadow-lg shadow-[#8EB69B]/25 hover:shadow-xl hover:shadow-[#8EB69B]/30 transition-all duration-300"
            >
              Load More Experiences
              <Sparkles className="h-5 w-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-br from-[#163832] to-[#0B2B26]">
        <div className="container mx-auto px-4 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-[#8EB69B]/20 border border-[#8EB69B]/30 rounded-full px-6 py-3 mb-6">
              <BookOpen className="h-4 w-4 text-[#8EB69B]" />
              <Badge className="bg-transparent text-[#8EB69B] border-[#8EB69B]/50 px-3 py-1 rounded-full text-sm font-medium">
                Concierge Service
              </Badge>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Not Sure What to Choose?
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Let our concierge guide your next experience. We'll help you find
              the perfect adventure that matches your preferences and schedule.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="rounded-2xl bg-gradient-to-r from-[#8EB69B] to-[#0B2B26] text-white hover:from-[#0B2B26] hover:to-[#8EB69B] shadow-lg shadow-[#8EB69B]/25 hover:shadow-xl hover:shadow-[#8EB69B]/30 transition-all duration-300 px-8 py-4 text-lg font-semibold"
              >
                Talk to Concierge
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-2xl border-[#8EB69B]/30 text-[#8EB69B] hover:bg-[#8EB69B] hover:text-white px-8 py-4 text-lg font-semibold transition-all duration-300"
              >
                View All Experiences
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
