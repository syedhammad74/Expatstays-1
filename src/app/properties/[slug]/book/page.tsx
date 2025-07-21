"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  MapPin,
  Users,
  BedDouble,
  Bath,
  ArrowLeft,
  Lock,
  Shield,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";

import { propertyService } from "@/lib/services/properties";
import { bookingService } from "@/lib/services/bookings";
import { useAuth } from "@/hooks/use-auth";
import { getLocalImage } from "@/lib/imageUtils";
import AmenityIcon from "@/components/AmenityIcon";
import { Property } from "@/lib/types/firebase";
import {
  CacheManager,
  optimizeImageUrl,
  performanceMonitor,
  useDebounce,
} from "@/lib/performance";

export default function PropertyBookingPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const propertyId = params.slug as string;

  // Property state
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Booking form state
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [guests, setGuests] = useState({
    adults: 2,
    children: 0,
    infants: 0,
  });
  const [guestDetails, setGuestDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);

  // Debounced guest details for better performance
  const debouncedGuestDetails = useDebounce(guestDetails, 300);

  // Load property data with caching
  useEffect(() => {
    loadProperty();
  }, [propertyId]);

  const loadProperty = useCallback(async () => {
    try {
      setLoading(true);
      performanceMonitor.markStart("load-property-booking");

      // Try cache first
      const cachedProperty = CacheManager.getCachedProperty(propertyId);
      if (cachedProperty) {
        console.log("📱 Using cached property for faster loading");
        setProperty(cachedProperty);
        setLoading(false);
        return;
      }

      const propertyData = await propertyService.getPropertyById(propertyId);
      if (propertyData) {
        setProperty(propertyData);
        // Cache for future use
        CacheManager.cacheProperty(propertyData);
      } else {
        toast({
          title: "Error",
          description: "Property not found",
          variant: "destructive",
        });
        router.push("/properties");
      }

      performanceMonitor.markEnd("load-property-booking");
      const loadTime = performanceMonitor.getMeasure("load-property-booking");
      console.log(
        `⚡ Property loaded for booking in ${loadTime?.toFixed(2)}ms`
      );
    } catch (error) {
      console.error("Error loading property:", error);
      toast({
        title: "Error",
        description: "Failed to load property details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [propertyId, router]);

  // Memoized calculations for better performance
  const bookingDetails = useMemo(() => {
    if (!dateRange.from || !dateRange.to || !property) return null;

    const nights = Math.ceil(
      (dateRange.to.getTime() - dateRange.from.getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const basePrice = property.pricing.basePrice * nights;
    const cleaningFee = property.pricing.cleaningFee || 0;
    const serviceFee =
      property.pricing.serviceFee || Math.round(basePrice * 0.12);
    const taxes = Math.round((basePrice + cleaningFee + serviceFee) * 0.15);
    const total = basePrice + cleaningFee + serviceFee + taxes;

    return {
      nights,
      basePrice,
      cleaningFee,
      serviceFee,
      taxes,
      total,
    };
  }, [dateRange, property]);

  // Optimized image URLs with proper error handling
  const optimizedImages = useMemo(() => {
    if (!property?.images || !Array.isArray(property.images)) return [];

    return property.images
      .map((image) => {
        if (typeof image === "string") {
          return {
            url: image,
            optimizedUrl: optimizeImageUrl(image, {
              width: 800,
              height: 600,
              quality: 90,
            }),
            thumbnailUrl: optimizeImageUrl(image, {
              width: 120,
              height: 90,
              quality: 80,
            }),
          };
        } else if (
          image &&
          typeof image === "object" &&
          "url" in image &&
          typeof image.url === "string"
        ) {
          return {
            ...image,
            optimizedUrl: optimizeImageUrl(image.url, {
              width: 800,
              height: 600,
              quality: 90,
            }),
            thumbnailUrl: optimizeImageUrl(image.url, {
              width: 120,
              height: 90,
              quality: 80,
            }),
          };
        }
        return null;
      })
      .filter(Boolean);
  }, [property?.images]);

  // Safe image display with fallback
  const displayImages =
    optimizedImages.length > 0
      ? optimizedImages
      : [
          {
            url: "/placeholder-property.jpg",
            optimizedUrl: "/placeholder-property.jpg",
            thumbnailUrl: "/placeholder-property.jpg",
            alt: property?.title || "Property image",
          },
        ];

  // Handle booking submission with performance monitoring
  const handleBooking = useCallback(async () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to make a booking",
        variant: "destructive",
      });
      return;
    }

    if (!dateRange.from || !dateRange.to) {
      toast({
        title: "Select Dates",
        description: "Please select check-in and check-out dates",
        variant: "destructive",
      });
      return;
    }

    if (
      !debouncedGuestDetails.firstName ||
      !debouncedGuestDetails.lastName ||
      !debouncedGuestDetails.email
    ) {
      toast({
        title: "Complete Details",
        description: "Please fill in all required guest details",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      performanceMonitor.markStart("process-booking");

      const bookingData = {
        propertyId: property!.id,
        guest: {
          uid: user.uid,
          firstName: debouncedGuestDetails.firstName,
          lastName: debouncedGuestDetails.lastName,
          email: debouncedGuestDetails.email,
          phone: debouncedGuestDetails.phone,
        },
        dates: {
          checkIn: format(dateRange.from, "yyyy-MM-dd"),
          checkOut: format(dateRange.to, "yyyy-MM-dd"),
        },
        guests: {
          adults: guests.adults,
          children: guests.children,
          infants: guests.infants,
        },
        pricing: {
          basePrice: bookingDetails!.basePrice,
          cleaningFee: bookingDetails!.cleaningFee,
          serviceFee: bookingDetails!.serviceFee,
          taxes: bookingDetails!.taxes,
          total: bookingDetails!.total,
        },
        payment: {
          method: paymentMethod,
          status: "pending",
        },
        specialRequests: debouncedGuestDetails.specialRequests,
        status: "pending",
      };

      const bookingId = await bookingService.createBooking(bookingData);

      toast({
        title: "Booking Created!",
        description: "Redirecting to payment...",
      });

      // Redirect to payment page
      router.push(`/booking/payment?bookingId=${bookingId}`);
    } catch (error) {
      console.error("Error creating booking:", error);
      toast({
        title: "Booking Failed",
        description: "Please try again or contact support",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      performanceMonitor.markEnd("process-booking");
    }
  }, [
    user,
    dateRange,
    guests,
    paymentMethod,
    debouncedGuestDetails,
    property,
    bookingDetails,
    router,
  ]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-[#DAF1DE]/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#8EB69B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#235347] font-medium">
            Loading property details...
          </p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-[#DAF1DE]/30 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#235347] mb-2">
            Property Not Found
          </h2>
          <Button
            onClick={() => router.push("/properties")}
            className="bg-[#8EB69B] text-[#051F20] hover:bg-[#235347] hover:text-white"
          >
            Back to Properties
          </Button>
        </div>
      </div>
    );
  }

  const images =
    property.images && property.images.length > 0
      ? property.images
      : [
          getLocalImage("villa", 0),
          getLocalImage("villa", 1),
          getLocalImage("villa", 2),
        ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#DAF1DE]/30">
      {/* Header with Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/properties")}
          className="mb-6 hover:bg-[#8EB69B]/10 text-[#235347]"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Properties
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Images Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative h-96 rounded-2xl overflow-hidden">
                <Image
                  src={displayImages[currentImageIndex].url}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                {/* Image Navigation */}
                {displayImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {displayImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentImageIndex
                            ? "bg-white"
                            : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {displayImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {displayImages.slice(0, 4).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative h-20 rounded-lg overflow-hidden transition-all duration-300 ${
                        index === currentImageIndex
                          ? "ring-2 ring-[#8EB69B]"
                          : "hover:opacity-80"
                      }`}
                    >
                      <Image
                        src={image.url}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Property Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="border-[#8EB69B]/20">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl font-bold text-[#235347] mb-2">
                        {property.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-[#235347]/70 mb-4">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {property.location.address}, {property.location.city},{" "}
                          {property.location.country}
                        </span>
                      </div>
                      <div className="flex items-center gap-6 text-[#235347]">
                        <div className="flex items-center gap-2">
                          <BedDouble className="h-4 w-4" />
                          <span>{property.capacity.bedrooms} Bedrooms</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Bath className="h-4 w-4" />
                          <span>{property.capacity.bathrooms} Bathrooms</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>
                            Up to {property.capacity.maxGuests} Guests
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-[#8EB69B]">
                        ${property.pricing.basePrice}
                      </div>
                      <div className="text-[#235347]/70">per night</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Description */}
                    <div>
                      <h3 className="text-lg font-semibold text-[#235347] mb-3">
                        About this property
                      </h3>
                      <p className="text-[#235347]/80 leading-relaxed">
                        {property.description}
                      </p>
                    </div>

                    {/* Amenities */}
                    <div>
                      <h3 className="text-lg font-semibold text-[#235347] mb-3">
                        What this place offers
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {property.amenities.map((amenity) => (
                          <div
                            key={amenity}
                            className="flex items-center gap-2 text-[#235347]/80"
                          >
                            <AmenityIcon amenity={amenity} />
                            <span className="text-sm">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="sticky top-6"
            >
              <Card className="border-[#8EB69B]/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-[#235347]">
                    Reserve Your Stay
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Date Selection */}
                  <div>
                    <Label className="text-[#235347] font-medium">
                      Check-in & Check-out
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal border-[#8EB69B]/30 hover:border-[#8EB69B]"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.from && dateRange.to
                            ? `${format(dateRange.from, "MMM d")} - ${format(
                                dateRange.to,
                                "MMM d, yyyy"
                              )}`
                            : "Select dates"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="range"
                          selected={{ from: dateRange.from, to: dateRange.to }}
                          onSelect={(range) =>
                            setDateRange(
                              range || { from: undefined, to: undefined }
                            )
                          }
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Guest Selection */}
                  <div>
                    <Label className="text-[#235347] font-medium">Guests</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label className="text-xs text-[#235347]/70">
                          Adults
                        </Label>
                        <Select
                          value={guests.adults.toString()}
                          onValueChange={(value) =>
                            setGuests({ ...guests, adults: parseInt(value) })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs text-[#235347]/70">
                          Children
                        </Label>
                        <Select
                          value={guests.children.toString()}
                          onValueChange={(value) =>
                            setGuests({ ...guests, children: parseInt(value) })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[0, 1, 2, 3, 4].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs text-[#235347]/70">
                          Infants
                        </Label>
                        <Select
                          value={guests.infants.toString()}
                          onValueChange={(value) =>
                            setGuests({ ...guests, infants: parseInt(value) })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[0, 1, 2].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Guest Details */}
                  <div className="space-y-4">
                    <Label className="text-[#235347] font-medium">
                      Guest Information
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Input
                          placeholder="First Name"
                          value={guestDetails.firstName}
                          onChange={(e) =>
                            setGuestDetails({
                              ...guestDetails,
                              firstName: e.target.value,
                            })
                          }
                          className="border-[#8EB69B]/30 focus:border-[#8EB69B]"
                        />
                      </div>
                      <div>
                        <Input
                          placeholder="Last Name"
                          value={guestDetails.lastName}
                          onChange={(e) =>
                            setGuestDetails({
                              ...guestDetails,
                              lastName: e.target.value,
                            })
                          }
                          className="border-[#8EB69B]/30 focus:border-[#8EB69B]"
                        />
                      </div>
                    </div>
                    <Input
                      placeholder="Email Address"
                      type="email"
                      value={guestDetails.email}
                      onChange={(e) =>
                        setGuestDetails({
                          ...guestDetails,
                          email: e.target.value,
                        })
                      }
                      className="border-[#8EB69B]/30 focus:border-[#8EB69B]"
                    />
                    <Input
                      placeholder="Phone Number"
                      value={guestDetails.phone}
                      onChange={(e) =>
                        setGuestDetails({
                          ...guestDetails,
                          phone: e.target.value,
                        })
                      }
                      className="border-[#8EB69B]/30 focus:border-[#8EB69B]"
                    />
                    <Textarea
                      placeholder="Special requests (optional)"
                      value={guestDetails.specialRequests}
                      onChange={(e) =>
                        setGuestDetails({
                          ...guestDetails,
                          specialRequests: e.target.value,
                        })
                      }
                      className="border-[#8EB69B]/30 focus:border-[#8EB69B]"
                      rows={3}
                    />
                  </div>

                  {/* Pricing Breakdown */}
                  {bookingDetails && (
                    <div className="space-y-3 p-4 bg-[#DAF1DE]/20 rounded-lg">
                      <div className="flex justify-between text-[#235347]">
                        <span>
                          ${property.pricing.basePrice} x{" "}
                          {bookingDetails.nights} nights
                        </span>
                        <span>${bookingDetails.basePrice}</span>
                      </div>
                      <div className="flex justify-between text-[#235347]">
                        <span>Cleaning fee</span>
                        <span>${bookingDetails.cleaningFee}</span>
                      </div>
                      <div className="flex justify-between text-[#235347]">
                        <span>Service fee</span>
                        <span>${bookingDetails.serviceFee}</span>
                      </div>
                      <div className="flex justify-between text-[#235347]">
                        <span>Taxes</span>
                        <span>${bookingDetails.taxes}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold text-[#235347]">
                        <span>Total</span>
                        <span>${bookingDetails.total}</span>
                      </div>
                    </div>
                  )}

                  {/* Payment Method */}
                  <div>
                    <Label className="text-[#235347] font-medium">
                      Payment Method
                    </Label>
                    <Select
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                    >
                      <SelectTrigger className="border-[#8EB69B]/30 focus:border-[#8EB69B]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="card">Credit/Debit Card</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Book Button */}
                  <Button
                    onClick={handleBooking}
                    disabled={isProcessing || !dateRange.from || !dateRange.to}
                    className="w-full bg-[#8EB69B] text-[#051F20] hover:bg-[#235347] hover:text-white font-bold py-3 text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Reserve & Pay
                      </>
                    )}
                  </Button>

                  {/* Security Notice */}
                  <div className="flex items-center gap-2 text-xs text-[#235347]/70 bg-[#8EB69B]/10 p-3 rounded-lg">
                    <Shield className="h-4 w-4" />
                    <span>
                      Your payment information is secure and encrypted
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
