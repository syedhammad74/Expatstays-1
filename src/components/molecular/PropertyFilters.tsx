import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atomic";
import { Button } from "@/components/atomic";
import { Input } from "@/components/atomic";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Search,
  Filter,
  X,
  MapPin,
  BedDouble,
  Bath,
  Users,
} from "lucide-react";

export interface PropertyFiltersProps {
  filters: {
    search: string;
    propertyType: string;
    priceRange: [number, number];
    bedrooms: string;
    amenities: string[];
  };
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  className?: string;
}

const amenityOptions = [
  "WiFi",
  "Parking",
  "Kitchen",
  "Pool",
  "Gym",
  "Air Conditioning",
  "Heating",
  "Washer",
  "Dryer",
  "TV",
  "Balcony",
  "Garden",
  "Pet Friendly",
  "Smoking Allowed",
];

export const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  showFilters,
  onToggleFilters,
  className = "",
}) => {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handlePropertyTypeChange = (value: string) => {
    onFiltersChange({ ...filters, propertyType: value });
  };

  const handlePriceRangeChange = (value: number[]) => {
    onFiltersChange({ ...filters, priceRange: value as [number, number] });
  };

  const handleBedroomsChange = (value: string) => {
    onFiltersChange({ ...filters, bedrooms: value });
  };

  const handleAmenityToggle = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity];
    onFiltersChange({ ...filters, amenities: newAmenities });
  };

  const activeFiltersCount = [
    filters.search,
    filters.propertyType !== "all",
    filters.bedrooms !== "any",
    filters.amenities.length > 0,
  ].filter(Boolean).length;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search and Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search properties, locations..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={onToggleFilters}
          className="flex items-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Filters</CardTitle>
              <div className="flex items-center space-x-2">
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearFilters}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear All
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={onToggleFilters}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Property Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Property Type</Label>
              <Select
                value={filters.propertyType}
                onValueChange={handlePropertyTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
              </Label>
              <Slider
                value={filters.priceRange}
                onValueChange={handlePriceRangeChange}
                max={1000}
                min={0}
                step={10}
                className="w-full"
              />
            </div>

            {/* Bedrooms */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Bedrooms</Label>
              <Select
                value={filters.bedrooms}
                onValueChange={handleBedroomsChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select bedrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="1">1 Bedroom</SelectItem>
                  <SelectItem value="2">2 Bedrooms</SelectItem>
                  <SelectItem value="3">3 Bedrooms</SelectItem>
                  <SelectItem value="4">4+ Bedrooms</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Amenities */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Amenities</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {amenityOptions.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={filters.amenities.includes(amenity)}
                      onCheckedChange={() => handleAmenityToggle(amenity)}
                    />
                    <Label
                      htmlFor={amenity}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {amenity}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Active Filters</Label>
                <div className="flex flex-wrap gap-2">
                  {filters.search && (
                    <Badge
                      variant="secondary"
                      className="flex items-center space-x-1"
                    >
                      <span>Search: {filters.search}</span>
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleSearchChange("")}
                      />
                    </Badge>
                  )}
                  {filters.propertyType !== "all" && (
                    <Badge
                      variant="secondary"
                      className="flex items-center space-x-1"
                    >
                      <span>Type: {filters.propertyType}</span>
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handlePropertyTypeChange("all")}
                      />
                    </Badge>
                  )}
                  {filters.bedrooms !== "any" && (
                    <Badge
                      variant="secondary"
                      className="flex items-center space-x-1"
                    >
                      <span>Bedrooms: {filters.bedrooms}</span>
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleBedroomsChange("any")}
                      />
                    </Badge>
                  )}
                  {filters.amenities.map((amenity) => (
                    <Badge
                      key={amenity}
                      variant="secondary"
                      className="flex items-center space-x-1"
                    >
                      <span>{amenity}</span>
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleAmenityToggle(amenity)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
