"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Property } from "@/lib/types/firebase";
import { propertyService } from "@/lib/services/properties";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  Home,
  MapPin,
  DollarSign,
  Users,
  Wifi,
  Car,
  Utensils,
  Tv,
  Wind,
  Waves,
  Mountain,
  Coffee,
  Loader2,
  Plus,
  X,
  Camera,
  Settings,
  FileText,
  Tags,
  Upload,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import Image from "next/image";

interface PropertyCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPropertyCreated: (property: Property) => void;
}

const PROPERTY_TYPES = [
  "apartment",
  "house",
  "villa",
  "townhouse",
  "studio",
  "penthouse",
  "loft",
  "chalet",
];

const AVAILABLE_AMENITIES = [
  { id: "wifi", label: "WiFi", icon: Wifi },
  { id: "parking", label: "Parking", icon: Car },
  { id: "kitchen", label: "Kitchen", icon: Utensils },
  { id: "tv", label: "TV", icon: Tv },
  { id: "ac", label: "Air Conditioning", icon: Wind },
  { id: "pool", label: "Swimming Pool", icon: Waves },
  { id: "gym", label: "Gym", icon: Mountain },
  { id: "breakfast", label: "Breakfast", icon: Coffee },
];

export function PropertyCreationDialog({
  open,
  onOpenChange,
  onPropertyCreated,
}: PropertyCreationDialogProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    propertyType: "apartment",
    location: {
      address: "",
      city: "",
      state: "",
      country: "",
      coordinates: { lat: 0, lng: 0 },
    },
    capacity: {
      maxGuests: 1,
      bedrooms: 1,
      bathrooms: 1,
      beds: 1,
    },
    pricing: {
      basePrice: 100,
      currency: "USD",
      cleaningFee: 0,
      serviceFee: 0,
      weeklyDiscount: 0,
      monthlyDiscount: 0,
    },
    amenities: [] as string[],
    images: [] as string[],
    availability: {
      isActive: true,
      minimumStay: 2,
      maximumStay: 30,
      instantBook: false,
    },
    rules: {
      checkIn: "15:00",
      checkOut: "11:00",
      smokingAllowed: false,
      petsAllowed: false,
      partiesAllowed: false,
      quietHours: "22:00-08:00",
    },
  });

  const [newImageUrl, setNewImageUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.propertyType) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!formData.location.city || !formData.location.country) {
      toast({
        title: "Error",
        description: "Please provide at least city and country",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create a property.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      type PropertyType =
        | "apartment"
        | "house"
        | "villa"
        | "condo"
        | "hotel"
        | "other";
      const propertyData: Omit<Property, "id" | "createdAt" | "updatedAt"> = {
        ...formData,
        owner: {
          uid: user.uid,
          name: user.displayName || user.email || "Admin",
          email: user.email || "",
        },
        featured: false,
        propertyType: formData.propertyType as PropertyType,
      };

      const propertyId = await propertyService.createProperty(propertyData);

      const newProperty: Property = {
        ...propertyData,
        id: propertyId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onPropertyCreated(newProperty);
      onOpenChange(false);
      resetForm();

      toast({
        title: "Success",
        description: "Property created successfully!",
      });
    } catch (error) {
      console.error("Error creating property:", error);
      toast({
        title: "Error",
        description: "Failed to create property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      propertyType: "apartment",
      location: {
        address: "",
        city: "",
        state: "",
        country: "",
        coordinates: { lat: 0, lng: 0 },
      },
      capacity: {
        maxGuests: 1,
        bedrooms: 1,
        bathrooms: 1,
        beds: 1,
      },
      pricing: {
        basePrice: 100,
        currency: "USD",
        cleaningFee: 0,
        serviceFee: 0,
        weeklyDiscount: 0,
        monthlyDiscount: 0,
      },
      amenities: [],
      images: [],
      availability: {
        isActive: true,
        minimumStay: 2,
        maximumStay: 30,
        instantBook: false,
      },
      rules: {
        checkIn: "15:00",
        checkOut: "11:00",
        smokingAllowed: false,
        petsAllowed: false,
        partiesAllowed: false,
        quietHours: "22:00-08:00",
      },
    });
    setNewImageUrl("");
  };

  const toggleAmenity = (amenityId: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((id) => id !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()],
      }));
      setNewImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    try {
      const newImages: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type
        if (!file.type.startsWith("image/")) {
          toast({
            title: "Error",
            description: `${file.name} is not a valid image file`,
            variant: "destructive",
          });
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "Error",
            description: `${file.name} is too large. Maximum size is 5MB`,
            variant: "destructive",
          });
          continue;
        }

        // Convert to base64 or object URL for preview
        const imageUrl = URL.createObjectURL(file);
        newImages.push(imageUrl);
      }

      if (newImages.length > 0) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...newImages],
        }));

        toast({
          title: "Success",
          description: `${newImages.length} image(s) uploaded successfully`,
        });
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      toast({
        title: "Error",
        description: "Failed to upload images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingImages(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white via-[#FAFAFA] to-[#DAF1DE]/20 border-[#8EB69B]/30 shadow-2xl backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader className="border-b border-[#8EB69B]/20 pb-6 mb-6">
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-[#051F20] to-[#235347] bg-clip-text text-transparent flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#8EB69B]/20 to-[#235347]/20 flex items-center justify-center">
                <Home className="h-6 w-6 text-[#8EB69B]" />
              </div>
              Create New Property
            </DialogTitle>
            <DialogDescription className="text-[#235347]/70 text-lg">
              Add a new property to your portfolio with all the details and
              amenities
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-gradient-to-r from-[#DAF1DE]/30 to-white/50 rounded-xl p-6 border border-[#8EB69B]/20">
              <h3 className="text-xl font-semibold text-[#235347] mb-6 flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#8EB69B]" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <Label
                    htmlFor="title"
                    className="text-[#235347] font-medium flex items-center gap-2"
                  >
                    <span className="text-red-500">*</span>
                    Property Title
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Luxury Oceanview Villa in Dubai Marina"
                    className="border-[#8EB69B]/30 focus:border-[#8EB69B] focus:ring-[#8EB69B]/20 bg-white/80 backdrop-blur-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="propertyType"
                    className="text-[#235347] font-medium flex items-center gap-2"
                  >
                    <span className="text-red-500">*</span>
                    Property Type
                  </Label>
                  <Select
                    value={formData.propertyType}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, propertyType: value }))
                    }
                  >
                    <SelectTrigger className="border-[#8EB69B]/30 focus:border-[#8EB69B] bg-white/80">
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROPERTY_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="basePrice"
                    className="text-[#235347] font-medium flex items-center gap-2"
                  >
                    <DollarSign className="h-4 w-4 text-[#8EB69B]" />
                    Base Price per Night
                  </Label>
                  <Input
                    id="basePrice"
                    type="number"
                    value={formData.pricing.basePrice}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        pricing: {
                          ...prev.pricing,
                          basePrice: parseInt(e.target.value) || 0,
                        },
                      }))
                    }
                    placeholder="150"
                    className="border-[#8EB69B]/30 focus:border-[#8EB69B] focus:ring-[#8EB69B]/20 bg-white/80"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-[#235347] font-medium flex items-center gap-2"
                  >
                    <span className="text-red-500">*</span>
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Describe your property in detail..."
                    className="border-[#8EB69B]/30 focus:border-[#8EB69B] focus:ring-[#8EB69B]/20 bg-white/80 min-h-[120px]"
                    rows={5}
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-gradient-to-r from-[#DAF1DE]/20 to-white/30 rounded-xl p-6 border border-[#8EB69B]/20">
              <h3 className="text-xl font-semibold text-[#235347] mb-6 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#8EB69B]" />
                Location
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <Label
                    htmlFor="address"
                    className="text-[#235347] font-medium"
                  >
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={formData.location.address}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        location: { ...prev.location, address: e.target.value },
                      }))
                    }
                    placeholder="123 Marina Walk"
                    className="border-[#8EB69B]/30 focus:border-[#8EB69B] bg-white/80"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="city"
                    className="text-[#235347] font-medium flex items-center gap-2"
                  >
                    <span className="text-red-500">*</span>
                    City
                  </Label>
                  <Input
                    id="city"
                    value={formData.location.city}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        location: { ...prev.location, city: e.target.value },
                      }))
                    }
                    placeholder="Dubai"
                    className="border-[#8EB69B]/30 focus:border-[#8EB69B] bg-white/80"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-[#235347] font-medium">
                    State/Region
                  </Label>
                  <Input
                    id="state"
                    value={formData.location.state}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        location: { ...prev.location, state: e.target.value },
                      }))
                    }
                    placeholder="Dubai"
                    className="border-[#8EB69B]/30 focus:border-[#8EB69B] bg-white/80"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="country"
                    className="text-[#235347] font-medium flex items-center gap-2"
                  >
                    <span className="text-red-500">*</span>
                    Country
                  </Label>
                  <Input
                    id="country"
                    value={formData.location.country}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        location: { ...prev.location, country: e.target.value },
                      }))
                    }
                    placeholder="United Arab Emirates"
                    className="border-[#8EB69B]/30 focus:border-[#8EB69B] bg-white/80"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="coordinates"
                    className="text-[#235347] font-medium flex items-center gap-2"
                  >
                    <span className="text-red-500">*</span>
                    Coordinates
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      id="latitude"
                      type="number"
                      value={formData.location.coordinates.lat}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          location: {
                            ...prev.location,
                            coordinates: {
                              ...prev.location.coordinates,
                              lat: parseFloat(e.target.value) || 0,
                            },
                          },
                        }))
                      }
                      placeholder="Latitude"
                      className="border-[#8EB69B]/30 focus:border-[#8EB69B] bg-white/80"
                    />
                    <Input
                      id="longitude"
                      type="number"
                      value={formData.location.coordinates.lng}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          location: {
                            ...prev.location,
                            coordinates: {
                              ...prev.location.coordinates,
                              lng: parseFloat(e.target.value) || 0,
                            },
                          },
                        }))
                      }
                      placeholder="Longitude"
                      className="border-[#8EB69B]/30 focus:border-[#8EB69B] bg-white/80"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Capacity */}
            <div className="bg-gradient-to-r from-[#DAF1DE]/15 to-white/20 rounded-xl p-6 border border-[#8EB69B]/20">
              <h3 className="text-xl font-semibold text-[#235347] mb-6 flex items-center gap-2">
                <Users className="h-5 w-5 text-[#8EB69B]" />
                Capacity & Layout
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="maxGuests"
                    className="text-[#235347] font-medium"
                  >
                    Max Guests
                  </Label>
                  <Input
                    id="maxGuests"
                    type="number"
                    min="1"
                    value={formData.capacity.maxGuests}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        capacity: {
                          ...prev.capacity,
                          maxGuests: parseInt(e.target.value) || 1,
                        },
                      }))
                    }
                    className="border-[#8EB69B]/30 focus:border-[#8EB69B] bg-white/80"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="bedrooms"
                    className="text-[#235347] font-medium"
                  >
                    Bedrooms
                  </Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    min="0"
                    value={formData.capacity.bedrooms}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        capacity: {
                          ...prev.capacity,
                          bedrooms: parseInt(e.target.value) || 0,
                        },
                      }))
                    }
                    className="border-[#8EB69B]/30 focus:border-[#8EB69B] bg-white/80"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="bathrooms"
                    className="text-[#235347] font-medium"
                  >
                    Bathrooms
                  </Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.capacity.bathrooms}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        capacity: {
                          ...prev.capacity,
                          bathrooms: parseFloat(e.target.value) || 0,
                        },
                      }))
                    }
                    className="border-[#8EB69B]/30 focus:border-[#8EB69B] bg-white/80"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="beds" className="text-[#235347] font-medium">
                    Beds
                  </Label>
                  <Input
                    id="beds"
                    type="number"
                    min="0"
                    value={formData.capacity.beds}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        capacity: {
                          ...prev.capacity,
                          beds: parseInt(e.target.value) || 0,
                        },
                      }))
                    }
                    className="border-[#8EB69B]/30 focus:border-[#8EB69B] bg-white/80"
                  />
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-gradient-to-r from-[#DAF1DE]/10 to-white/10 rounded-xl p-6 border border-[#8EB69B]/20">
              <h3 className="text-xl font-semibold text-[#235347] mb-6 flex items-center gap-2">
                <Tags className="h-5 w-5 text-[#8EB69B]" />
                Amenities
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {AVAILABLE_AMENITIES.map((amenity) => {
                  const IconComponent = amenity.icon;
                  const isSelected = formData.amenities.includes(amenity.id);
                  return (
                    <button
                      key={amenity.id}
                      type="button"
                      onClick={() => toggleAmenity(amenity.id)}
                      className={`p-4 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                        isSelected
                          ? "border-[#8EB69B] bg-[#8EB69B]/10 text-[#235347]"
                          : "border-[#8EB69B]/30 hover:border-[#8EB69B]/50 text-[#235347]/70"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <IconComponent
                          className={`h-6 w-6 ${
                            isSelected ? "text-[#8EB69B]" : "text-[#235347]/70"
                          }`}
                        />
                        <span className="text-sm font-medium">
                          {amenity.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Images */}
            <div className="bg-gradient-to-r from-[#DAF1DE]/5 to-white/5 rounded-xl p-6 border border-[#8EB69B]/20">
              <h3 className="text-xl font-semibold text-[#235347] mb-6 flex items-center gap-2">
                <Camera className="h-5 w-5 text-[#8EB69B]" />
                Property Images
              </h3>
              <div className="space-y-4">
                {/* Upload Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* File Upload */}
                  <div className="space-y-2">
                    <Label className="text-[#235347] font-medium">
                      Upload from Device
                    </Label>
                    <div className="flex gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        onClick={openFileDialog}
                        disabled={uploadingImages}
                        className="bg-[#8EB69B] hover:bg-[#235347] text-white flex-1"
                      >
                        {uploadingImages ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Choose Images
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-[#235347]/70">
                      Select multiple images (JPG, PNG, WebP). Max 5MB each.
                    </p>
                  </div>

                  {/* URL Input */}
                  <div className="space-y-2">
                    <Label className="text-[#235347] font-medium">
                      Add Image URL
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="border-[#8EB69B]/30 focus:border-[#8EB69B] bg-white/80 flex-1"
                      />
                      <Button
                        type="button"
                        onClick={addImage}
                        disabled={!newImageUrl.trim()}
                        className="bg-[#8EB69B] hover:bg-[#235347] text-white"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-[#235347]/70">
                      Add images from online sources
                    </p>
                  </div>
                </div>

                {/* Image Gallery */}
                {formData.images.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Camera className="h-4 w-4 text-[#8EB69B]" />
                      <span className="text-sm font-medium text-[#235347]">
                        {formData.images.length} Image(s) Added
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {formData.images.map((url, index) => (
                        <div
                          key={index}
                          className="relative group bg-white/50 rounded-lg border border-[#8EB69B]/20 overflow-hidden hover:shadow-lg transition-all duration-300"
                        >
                          <div className="aspect-video relative">
                            <Image
                              src={url}
                              alt={`Property image ${index + 1}`}
                              fill
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "/media/DSC01806 HDR June 25 2025/DSC01840-HDR.jpg";
                              }}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                          </div>
                          <div className="p-2">
                            <p className="text-xs text-[#235347]/70 truncate">
                              Image {index + 1}
                            </p>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {formData.images.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-[#8EB69B]/30 rounded-lg bg-[#DAF1DE]/10">
                    <Camera className="h-12 w-12 text-[#8EB69B]/50 mx-auto mb-4" />
                    <p className="text-[#235347]/70 font-medium mb-2">
                      No images added yet
                    </p>
                    <p className="text-sm text-[#235347]/50">
                      Upload images or add URLs to showcase your property
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Availability Settings */}
            <div className="bg-gradient-to-r from-[#DAF1DE]/5 to-white/5 rounded-xl p-6 border border-[#8EB69B]/20">
              <h3 className="text-xl font-semibold text-[#235347] mb-6 flex items-center gap-2">
                <Settings className="h-5 w-5 text-[#8EB69B]" />
                Availability Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="isActive"
                    className="text-[#235347] font-medium"
                  >
                    Active Property
                  </Label>
                  <Switch
                    id="isActive"
                    checked={formData.availability.isActive}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        availability: {
                          ...prev.availability,
                          isActive: checked,
                        },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="minStay"
                    className="text-[#235347] font-medium"
                  >
                    Min Stay (nights)
                  </Label>
                  <Input
                    id="minStay"
                    type="number"
                    min="1"
                    value={formData.availability.minimumStay}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        availability: {
                          ...prev.availability,
                          minimumStay: parseInt(e.target.value) || 1,
                        },
                      }))
                    }
                    className="border-[#8EB69B]/30 focus:border-[#8EB69B] bg-white/80"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="maxStay"
                    className="text-[#235347] font-medium"
                  >
                    Max Stay (nights)
                  </Label>
                  <Input
                    id="maxStay"
                    type="number"
                    min="1"
                    value={formData.availability.maximumStay}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        availability: {
                          ...prev.availability,
                          maximumStay: parseInt(e.target.value) || 30,
                        },
                      }))
                    }
                    className="border-[#8EB69B]/30 focus:border-[#8EB69B] bg-white/80"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-[#8EB69B]/20">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-[#8EB69B]/30 text-[#235347] hover:bg-[#8EB69B]/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-[#8EB69B] to-[#235347] hover:from-[#235347] hover:to-[#051F20] text-white px-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Home className="h-4 w-4 mr-2" />
                    Create Property
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
