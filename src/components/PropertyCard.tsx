import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BedDouble,
  Users,
  MapPin,
  CreditCard,
  Star,
  Heart,
} from "lucide-react";
import { useState, memo } from "react";
import { optimizeImageUrl, useImageLoad } from "@/lib/performance";

export interface PropertyCardProps {
  slug: string;
  imageUrl: string;
  imageHint?: string;
  title: string;
  bedrooms: number;
  guests: number;
  location: string;
  price?: string;
  rating?: number;
}

const PropertyCard: React.FC<PropertyCardProps> = memo(
  ({
    slug,
    imageUrl,
    imageHint,
    title,
    bedrooms,
    guests,
    location,
    price,
    rating = 4.8,
  }: PropertyCardProps) => {
    const [imageError, setImageError] = useState(false);
    const { isLoaded, hasError } = useImageLoad(imageUrl);

    // Optimize image URL for better performance
    const optimizedImageUrl = optimizeImageUrl(imageUrl, {
      width: 400,
      height: 300,
      quality: 85,
    });

    // Fallback image for errors
    const displayImageUrl =
      imageError || hasError ? "/placeholder-property.jpg" : optimizedImageUrl;

    return (
      <Card className="group transition-all duration-300 bg-white/95 hover:bg-white shadow-xl hover:shadow-2xl rounded-3xl overflow-hidden border border-[#EBEBEB]/70 hover:border-[#8EB69B]/50 px-0 pb-0">
        <CardHeader className="p-0 relative">
          <div className="relative w-full aspect-[16/9] overflow-hidden rounded-3xl">
            {/* Loading skeleton */}
            {!isLoaded && !hasError && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
            )}

            <Image
              src={displayImageUrl}
              alt={title}
              fill
              className={`object-cover rounded-3xl shadow-md group-hover:shadow-2xl border-2 border-transparent group-hover:border-[#DAF1DE] group-focus:border-[#8EB69B] transition-all duration-300 ${
                !isLoaded ? "opacity-0" : "opacity-100"
              }`}
              data-ai-hint={imageHint || "luxury property exterior"}
              onError={() => setImageError(true)}
              priority={false}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-card/50 to-transparent" />

            {/* Floating rating badge */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1 shadow-lg border border-[#DAF1DE]/50 transition-all duration-300 group-hover:bg-white">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-semibold text-[#051F20]">
                {rating}
              </span>
            </div>

            {/* Favorite button */}
            <div className="absolute top-4 left-4">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white border border-[#DAF1DE]/50 shadow-lg transition-all duration-300 group-hover:scale-110"
              >
                <Heart className="h-4 w-4 text-[#051F20]/70 group-hover:text-red-500 transition-colors duration-300" />
              </Button>
            </div>

            {/* Price tag */}
            {price && (
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-[#DAF1DE]/50 transition-all duration-300 group-hover:bg-white">
                <span className="text-lg font-bold text-[#8EB69B]">
                  {price}
                </span>
                <span className="text-sm text-[#051F20]/60 ml-1">/ night</span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-5 lg:p-7">
          <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-3">
            <div className="flex items-center gap-1 lg:gap-2 text-xs text-[#8EB69B] font-medium">
              <MapPin className="h-3 lg:h-4 w-3 lg:w-4" />
              {location}
            </div>
            <span className="text-[#DAF1DE]">•</span>
            <div className="flex items-center gap-1 lg:gap-2 text-xs text-[#8EB69B] font-medium">
              <BedDouble className="h-3 lg:h-4 w-3 lg:w-4" />
              {bedrooms} Bedroom{bedrooms > 1 ? "s" : ""}
            </div>
            <span className="text-[#DAF1DE]">•</span>
            <div className="text-xs text-[#8EB69B] font-medium">
              Up to {guests} Guest{guests > 1 ? "s" : ""}
            </div>
          </div>

          <CardTitle className="text-lg lg:text-xl font-extrabold tracking-tight text-[#051F20] group-hover:text-[#8EB69B] transition-colors mb-2 leading-snug">
            {title}
          </CardTitle>

          <div className="flex items-center justify-between mb-3 lg:mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl lg:text-2xl font-bold text-[#051F20]">
                {price}
              </span>
              <span className="text-sm text-[#8EB69B]">/night</span>
            </div>
            <Badge className="bg-[#DAF1DE]/60 text-[#235347] border-[#8EB69B]/20">
              Available
            </Badge>
          </div>
        </CardContent>

        <CardFooter className="p-5 lg:p-7 pt-0">
          <Button
            asChild
            className="mt-2 rounded-full bg-gradient-to-r from-[#8EB69B] to-[#235347] text-white hover:from-[#235347] hover:to-[#8EB69B] shadow-lg shadow-[#8EB69B]/20 hover:shadow-xl hover:shadow-[#8EB69B]/30 transition-all duration-300 px-5 lg:px-7 py-2 text-sm lg:text-base font-semibold flex items-center justify-center tracking-wide w-full"
          >
            <Link href={`/properties/${slug}`}>
              View Details
              <CreditCard className="h-4 lg:h-5 w-4 lg:w-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }
);

PropertyCard.displayName = "PropertyCard";

export default PropertyCard;
