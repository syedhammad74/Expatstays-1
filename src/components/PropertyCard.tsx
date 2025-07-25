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
      <Card className="dashboard-card-hover group relative overflow-hidden transition-all duration-300 hover:shadow-lg">
        <CardHeader className="p-0 relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl">
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
          <CardTitle className="text-xl font-bold mb-4 text-card-foreground group-hover:text-secondary transition-colors duration-300 line-clamp-2">
            {title}
          </CardTitle>

          <div className="space-y-3 text-sm">
            <div className="flex items-center group/item">
              <div className="bg-secondary/10 rounded-xl p-2 mr-3 group-hover/item:bg-secondary/20 transition-colors duration-300">
                <MapPin className="w-4 h-4 text-secondary" />
              </div>
              <span className="text-card-foreground/80 group-hover:text-card-foreground transition-colors duration-300 truncate">
                {location}
              </span>
            </div>

            <div className="flex items-center group/item">
              <div className="bg-secondary/10 rounded-xl p-2 mr-3 group-hover/item:bg-secondary/20 transition-colors duration-300">
                <BedDouble className="w-4 h-4 text-secondary" />
              </div>
              <span className="text-card-foreground/80 group-hover:text-card-foreground transition-colors duration-300">
                {bedrooms} Bedroom{bedrooms > 1 ? "s" : ""}
              </span>
            </div>

            <div className="flex items-center group/item">
              <div className="bg-secondary/10 rounded-xl p-2 mr-3 group-hover/item:bg-secondary/20 transition-colors duration-300">
                <Users className="w-4 h-4 text-secondary" />
              </div>
              <span className="text-card-foreground/80 group-hover:text-card-foreground transition-colors duration-300">
                Up to {guests} Guest{guests > 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Availability badge */}
          <div className="mt-4">
            <Badge className="bg-secondary/20 text-secondary border-secondary/30 transition-all duration-300 group-hover:bg-secondary/30">
              Available
            </Badge>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <Button
            asChild
            className="w-full rounded-buttons bg-primary text-primary-foreground font-semibold shadow-modern hover:bg-secondary hover:text-secondary-foreground hover:shadow-modern-hover transition-smooth text-base py-3 group-hover:scale-[1.02] transform"
          >
            <Link href={`/properties/${slug}/book`}>
              <CreditCard className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
              Book Now
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }
);

PropertyCard.displayName = "PropertyCard";

export default PropertyCard;
