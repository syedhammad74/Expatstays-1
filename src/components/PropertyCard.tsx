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
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-0 shadow-lg bg-white">
        <CardHeader className="p-0 relative">
          <div className="relative aspect-[4/3] overflow-hidden">
            {/* Loading skeleton */}
            {!isLoaded && !hasError && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
            )}

            <Image
              src={displayImageUrl}
              alt={title}
              fill
              className={`object-cover transition-all duration-500 group-hover:scale-105 ${
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
            <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1 shadow-modern border border-border/20 transition-all duration-300 group-hover:bg-card">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-semibold text-card-foreground">
                {rating}
              </span>
            </div>

            {/* Favorite button */}
            <div className="absolute top-4 left-4">
              <Button
                size="sm"
                variant="ghost"
                className="rounded-full bg-card/90 text-card-foreground hover:bg-secondary hover:text-secondary-foreground shadow-modern transition-all duration-300 group-hover:bg-card"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>

            {/* Price tag */}
            {price && (
              <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-modern border border-border/20 transition-all duration-300 group-hover:bg-card">
                <span className="text-lg font-bold text-secondary">
                  {price}
                </span>
                <span className="text-sm text-card-foreground/60 ml-1">
                  / night
                </span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6 flex-grow relative">
          <CardTitle className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
            {title}
          </CardTitle>

          <div className="space-y-3 text-sm mb-4">
            <div className="flex items-center">
              <div className="bg-blue-50 rounded-lg p-2 mr-3">
                <MapPin className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-gray-600 truncate">
                {location}
              </span>
            </div>

            <div className="flex items-center">
              <div className="bg-green-50 rounded-lg p-2 mr-3">
                <BedDouble className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-gray-600">
                {bedrooms} Bedroom{bedrooms > 1 ? "s" : ""}
              </span>
            </div>

            <div className="flex items-center">
              <div className="bg-purple-50 rounded-lg p-2 mr-3">
                <Users className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-gray-600">
                Up to {guests} Guest{guests > 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Price and availability */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">{price}</span>
              <span className="text-sm text-gray-500">/night</span>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              Available
            </Badge>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <Button
            asChild
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 group-hover:scale-[1.02] transform shadow-lg hover:shadow-xl"
          >
            <Link href={`/properties/${slug}`}>
              <CreditCard className="w-4 h-4 mr-2" />
              View Details
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }
);

PropertyCard.displayName = "PropertyCard";

export default PropertyCard;
