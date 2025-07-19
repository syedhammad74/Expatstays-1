import type { LucideProps } from "lucide-react";
import React from "react";
import {
  Wifi,
  Car,
  Users,
  BedDouble,
  Bath,
  Waves,
  ChefHat,
  Coffee,
  Tv,
  Wind,
  Shield,
  Dumbbell,
  TreePine,
  MapPin,
  Star,
  Home,
  Utensils,
  WashingMachine,
  Snowflake,
  Flame,
  Camera,
  Music,
  Gamepad2,
  Book,
  Laptop,
  Phone,
} from "lucide-react";

// Amenity to icon mapping
const amenityIconMap: Record<string, React.ComponentType<LucideProps>> = {
  // Internet & Technology
  wifi: Wifi,
  "wi-fi": Wifi,
  internet: Wifi,
  wireless: Wifi,
  tv: Tv,
  television: Tv,
  cable: Tv,
  streaming: Tv,
  laptop: Laptop,
  computer: Laptop,
  phone: Phone,

  // Parking & Transportation
  parking: Car,
  garage: Car,
  car: Car,
  valet: Car,

  // Room Features
  bedroom: BedDouble,
  bed: BedDouble,
  bathroom: Bath,
  bath: Bath,
  shower: Bath,
  toilet: Bath,
  guests: Users,
  capacity: Users,
  people: Users,

  // Kitchen & Dining
  kitchen: ChefHat,
  cooking: ChefHat,
  dining: Utensils,
  restaurant: Utensils,
  coffee: Coffee,
  breakfast: Coffee,

  // Appliances
  "washing machine": WashingMachine,
  laundry: WashingMachine,
  washer: WashingMachine,
  dryer: WashingMachine,
  "air conditioning": Snowflake,
  ac: Snowflake,
  cooling: Snowflake,
  heating: Flame,
  heat: Flame,

  // Recreation & Entertainment
  pool: Waves,
  swimming: Waves,
  water: Waves,
  gym: Dumbbell,
  fitness: Dumbbell,
  exercise: Dumbbell,
  games: Gamepad2,
  gaming: Gamepad2,
  music: Music,
  sound: Music,
  camera: Camera,
  photography: Camera,
  books: Book,
  library: Book,
  reading: Book,

  // Location & Outdoor
  garden: TreePine,
  outdoor: TreePine,
  balcony: TreePine,
  terrace: TreePine,
  location: MapPin,
  address: MapPin,
  nearby: MapPin,

  // Safety & Security
  security: Shield,
  safe: Shield,
  protection: Shield,

  // General
  amenity: Star,
  feature: Star,
  service: Home,
  facility: Home,
  ventilation: Wind,
  air: Wind,
};

interface AmenityIconProps {
  IconComponent?: React.ComponentType<LucideProps>;
  label?: string;
  amenity?: string;
  className?: string;
  iconClassName?: string;
  labelClassName?: string;
}

const AmenityIcon: React.FC<AmenityIconProps> = ({
  IconComponent,
  label,
  amenity,
  className = "",
  iconClassName = "",
  labelClassName = "",
}) => {
  // Determine which icon and label to use
  let FinalIconComponent: React.ComponentType<LucideProps>;
  let finalLabel: string;

  if (amenity) {
    // Map amenity string to icon
    const amenityLower = amenity.toLowerCase().trim();
    FinalIconComponent = amenityIconMap[amenityLower] || Star;
    finalLabel = amenity;
  } else if (IconComponent && label) {
    // Use provided props
    FinalIconComponent = IconComponent;
    finalLabel = label;
  } else {
    // Fallback
    FinalIconComponent = Star;
    finalLabel = "Amenity";
  }

  return (
    <div
      className={`flex items-center space-x-3 p-3 bg-card rounded-components shadow-minimal hover:shadow-minimal-hover transition-smooth ${className}`}
    >
      <FinalIconComponent className={`w-6 h-6 text-primary ${iconClassName}`} />
      <span className={`text-sm text-foreground ${labelClassName}`}>
        {finalLabel}
      </span>
    </div>
  );
};

export default AmenityIcon;
