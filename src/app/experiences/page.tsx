"use client";
import {
  MountainSnow,
  ShoppingBag,
  Landmark,
  Clock,
  Users,
  MapPin,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";

const experiencesData = [
  {
    slug: "margalla-hills-nature-escape",
    title: "Margalla Hills Nature Escape",
    icon: MountainSnow,
    description:
      "Experience the tranquility of Margalla Hills National Park with stunning hiking trails, breathtaking viewpoints like Daman-e-Koh, and panoramic views of Islamabad. Perfect for nature lovers seeking peace and fresh mountain air just minutes from the city.",
    imageUrl: "/media/DSC01806 HDR June 25 2025/DSC01929-HDR.jpg",
    imageHint: "margalla hills islamabad view",
    category: "Nature",
    duration: "4-6 hours",
    price: "Complimentary with stay",
    rating: 4.9,
    reviews: 187,
    featured: true,
    difficulty: "Moderate",
    groupSize: "1-10 people",
    location: "Margalla Hills, Islamabad",
  },
  {
    slug: "d17-modern-living-experience",
    title: "D-17 Modern Living Experience",
    icon: Landmark,
    description:
      "Discover the charm of D-17, one of Islamabad's fastest-growing residential areas. Enjoy modern amenities, serene farmhouse settings, beautiful dam views, and easy access to the Margalla Hills. An ideal blend of urban convenience and natural beauty.",
    imageUrl: "/media/famhouse/DSC02227.jpg",
    imageHint: "d-17 islamabad farmhouse",
    category: "Lifestyle",
    duration: "Full stay experience",
    price: "Included with property",
    rating: 4.8,
    reviews: 143,
    featured: true,
    difficulty: "Easy",
    groupSize: "Families \u0026 Groups",
    location: "D-17, Islamabad",
  },
  {
    slug: "gulberg-greens-urban-lifestyle",
    title: "Gulberg Greens Urban Lifestyle",
    icon: ShoppingBag,
    description:
      "Experience modern urban living in Gulberg Greens with its contemporary apartments, central location, nearby shopping centers, restaurants, cafes, and easy access to key city landmarks. Perfect for business travelers and families seeking comfort and convenience.",
    imageUrl: "/media/DSC01806 HDR June 25 2025/DSC01914-HDR.jpg",
    imageHint: "gulberg greens islamabad apartment",
    category: "Urban",
    duration: "Full stay experience",
    price: "Included with property",
    rating: 4.7,
    reviews: 156,
    featured: true,
    difficulty: "Easy",
    groupSize: "1-6 people",
    location: "Gulberg Greens, Islamabad",
  },
];

export default function ExperiencesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden bg-white">
        {/* Subtle Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50" />

        <div className="container mx-auto px-4 sm:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#8EB69B]/10 border border-[#8EB69B]/20 rounded-full px-5 py-2">
              <Sparkles className="h-4 w-4 text-[#8EB69B]" />
              <span className="text-sm font-medium text-[#163832]">Curated Experiences</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-[#163832] leading-tight">
              Discover Islamabad's
              <br />
              <span className="text-[#8EB69B]">Best Locations</span>
            </h1>

            {/* Description */}
            <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Experience the perfect blend of nature, modern living, and urban convenience in Pakistan's beautiful capital.
            </p>

            {/* Features */}
            <div className="flex items-center justify-center gap-8 pt-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#8EB69B]" />
                <span>Prime Locations</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[#163832]" />
                <span>Expert Hosts</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#8EB69B]" />
                <span>Premium Quality</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Experiences Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#163832] mb-3">
              Explore Our Locations
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the unique charm and amenities of each area in Islamabad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {experiencesData.map((exp) => (
              <div
                key={exp.slug}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:border-[#8EB69B] hover:shadow-lg transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-12 h-12 bg-[#8EB69B]/10 rounded-xl flex items-center justify-center mb-4">
                  <exp.icon className="h-6 w-6 text-[#8EB69B]" />
                </div>

                {/* Category Badge */}
                <div className="inline-block mb-3">
                  <Badge className="bg-[#8EB69B]/10 text-[#163832] border-0 text-xs font-medium">
                    {exp.category}
                  </Badge>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-[#163832] mb-3">
                  {exp.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                  {exp.description}
                </p>

                {/* Details */}
                <div className="space-y-2 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-[#8EB69B]" />
                    <span>{exp.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4 text-[#8EB69B]" />
                    <span>{exp.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4 text-[#8EB69B]" />
                    <span>{exp.groupSize}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-[#8EB69B] font-semibold">{exp.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
