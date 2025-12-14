"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { bookingService } from "@/lib/services/bookings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Removed unused Card imports
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Loader2,
  AlertCircle,
  Users,
  CheckCircle,
} from "lucide-react";
import { Booking } from "@/lib/types/firebase";
import { AuthModal } from "@/components/auth/AuthModal";
import { AvailabilityCalendar } from "@/components/AvailabilityCalendar";

interface BookingFormProps {
  property: {
    id: string;
    name: string;
    description: string;
    capacity: {
      maxGuests: number;
    };
    pricing: {
      basePrice: number;
      cleaningFee: number;
      serviceFee: number;
      currency: string;
    };
  };
  onBookingComplete: (booking: Booking) => void;
}

export function BookingForm({ property, onBookingComplete }: BookingFormProps) {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    adults: 1,
    children: 0,
    infants: 0,
    specialRequests: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pricing, setPricing] = useState<any>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  // Calculate pricing when dates change
  const calculatePricing = useCallback(() => {
    if (!formData.checkIn || !formData.checkOut) return;

    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (nights > 0) {
      const pricingDetails = bookingService.calculateBookingTotal(
        property.pricing.basePrice,
        nights,
        property.pricing.cleaningFee,
        property.pricing.serviceFee
      );
      setPricing({ ...pricingDetails, nights });
    }
  }, [
    formData.checkIn,
    formData.checkOut,
    property.pricing.basePrice,
    property.pricing.cleaningFee,
    property.pricing.serviceFee,
  ]);

  const checkAvailability = useCallback(async () => {
    if (!formData.checkIn || !formData.checkOut) return;

    setCheckingAvailability(true);
    try {
      const available = await bookingService.checkAvailability(
        property.id,
        formData.checkIn,
        formData.checkOut
      );
      setIsAvailable(available);
    } catch (error) {
      console.error("Error checking availability:", error);
      setError("Failed to check availability");
    } finally {
      setCheckingAvailability(false);
    }
  }, [formData.checkIn, formData.checkOut, property.id]);

  useEffect(() => {
    if (formData.checkIn && formData.checkOut) {
      calculatePricing();
      checkAvailability();
    }
  }, [
    formData.checkIn,
    formData.checkOut,
    calculatePricing,
    checkAvailability,
  ]);

  const handleInputChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.checkIn || !formData.checkOut) {
      setError("Please select check-in and check-out dates");
      return false;
    }

    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      setError("Check-in date cannot be in the past");
      return false;
    }

    if (checkOutDate <= checkInDate) {
      setError("Check-out date must be after check-in date");
      return false;
    }

    const totalGuests = formData.adults + formData.children + formData.infants;
    if (totalGuests > property.capacity.maxGuests) {
      setError(`Maximum ${property.capacity.maxGuests} guests allowed`);
      return false;
    }

    if (formData.adults < 1) {
      setError("At least 1 adult is required");
      return false;
    }

    if (isAvailable === false) {
      setError("Selected dates are not available");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!validateForm() || !pricing) return;

    setLoading(true);
    setError("");

    try {
      const bookingData: Omit<Booking, "id" | "createdAt" | "updatedAt"> = {
        propertyId: property.id,
        propertyName: property.name,
        guest: {
          uid: user.uid,
          name: user.displayName || "",
          email: user.email || "",
          phone: user.phoneNumber || "",
        },
        dates: {
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          nights: (pricing as { nights: number }).nights, // If pricing is unknown, narrow before accessing nights
        },
        guests: {
          adults: formData.adults,
          children: formData.children,
          infants: formData.infants,
          total: formData.adults + formData.children + formData.infants,
        },
        pricing: {
          basePrice: property.pricing.basePrice,
          totalNights:
            typeof pricing === "object" &&
              pricing !== null &&
              "nights" in pricing
              ? (pricing as { nights: number }).nights
              : 0,
          subtotal: (pricing as { subtotal: number }).subtotal,
          cleaningFee: (pricing as { cleaningFee: number }).cleaningFee,
          serviceFee: (pricing as { serviceFee: number }).serviceFee,
          taxes: (pricing as { taxes: number }).taxes,
          total: (pricing as { total: number }).total,
          currency: property.pricing.currency,
        },
        status: "pending",
        payment: {
          status: "pending",
          amount: (pricing as { total: number }).total,
          currency: property.pricing.currency,
        },
        specialRequests: formData.specialRequests,
      };

      const bookingId = await bookingService.createBooking(bookingData);

      // Redirect to payment page
      window.location.href = `/booking/payment?booking_id=${bookingId}`;

      const createdBooking = await bookingService.getBookingById(bookingId);
      if (createdBooking) {
        onBookingComplete?.(createdBooking);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      setError("Failed to create booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-sm mx-auto lg:mx-0">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-md border border-[#DAF1DE]/50 overflow-hidden">
          <div className="bg-gradient-to-r from-[#8EB69B] to-[#235347] p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5" />
              <h3 className="text-lg font-bold">Book Your Stay</h3>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">
                ${property.pricing.basePrice}
              </span>
              <span className="text-sm opacity-90">/ night</span>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Date Selection Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-[#8EB69B]" />
                  <h4 className="text-base font-semibold text-[#051F20]">
                    Select Dates
                  </h4>
                </div>

                <div className="bg-gradient-to-br from-[#F8FBF9] to-[#E6F2EC] rounded-lg p-3 border border-[#DAF1DE]/50">
                  <AvailabilityCalendar
                    propertyId={property.id}
                    selectedDates={{
                      checkIn: formData.checkIn,
                      checkOut: formData.checkOut,
                    }}
                    onDateSelect={(dates) => {
                      if (dates.checkIn) {
                        handleInputChange("checkIn", dates.checkIn);
                      }
                      if (dates.checkOut) {
                        handleInputChange("checkOut", dates.checkOut);
                      }
                    }}
                    mode="select"
                    className="w-full border-0 shadow-none bg-transparent"
                  />
                </div>
              </div>

              {/* Guest Selection Section */}
              <div className="space-y-3">
                <h4 className="text-base font-semibold text-[#051F20] flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#8EB69B]" />
                  Guests
                </h4>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="adults"
                      className="text-sm font-medium text-[#4A4A4A]"
                    >
                      Adults
                    </Label>
                    <Input
                      id="adults"
                      type="number"
                      value={formData.adults}
                      onChange={(e) =>
                        handleInputChange("adults", parseInt(e.target.value))
                      }
                      min="1"
                      max={property.capacity.maxGuests}
                      required
                      className="border-[#DAF1DE] focus:border-[#8EB69B] focus:ring-[#8EB69B]/20 rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="children"
                      className="text-sm font-medium text-[#4A4A4A]"
                    >
                      Children
                    </Label>
                    <Input
                      id="children"
                      type="number"
                      value={formData.children}
                      onChange={(e) =>
                        handleInputChange("children", parseInt(e.target.value))
                      }
                      min="0"
                      max={property.capacity.maxGuests - formData.adults}
                      className="border-[#DAF1DE] focus:border-[#8EB69B] focus:ring-[#8EB69B]/20 rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="infants"
                      className="text-sm font-medium text-[#4A4A4A]"
                    >
                      Infants
                    </Label>
                    <Input
                      id="infants"
                      type="number"
                      value={formData.infants}
                      onChange={(e) =>
                        handleInputChange("infants", parseInt(e.target.value))
                      }
                      min="0"
                      max={
                        property.capacity.maxGuests -
                        formData.adults -
                        formData.children
                      }
                      className="border-[#DAF1DE] focus:border-[#8EB69B] focus:ring-[#8EB69B]/20 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Special Requests Section */}
              <div className="space-y-2">
                <Label
                  htmlFor="specialRequests"
                  className="text-sm font-medium text-[#4A4A4A]"
                >
                  Special Requests (Optional)
                </Label>
                <textarea
                  id="specialRequests"
                  className="w-full p-2.5 border border-[#DAF1DE] rounded-lg focus:border-[#8EB69B] focus:ring-[#8EB69B]/20 resize-none text-sm"
                  value={formData.specialRequests}
                  onChange={(e) =>
                    handleInputChange("specialRequests", e.target.value)
                  }
                  placeholder="Any special requests or notes..."
                  rows={2}
                />
              </div>

              {/* Availability Status */}
              {formData.checkIn && formData.checkOut && (
                <div className="p-3 border border-[#DAF1DE] rounded-lg bg-gradient-to-r from-[#F8FBF9] to-[#E6F2EC]">
                  {checkingAvailability ? (
                    <div className="flex items-center gap-2 text-[#4A4A4A]">
                      <Loader2 className="h-4 w-4 animate-spin text-[#8EB69B]" />
                      <span className="text-sm font-medium">
                        Checking availability...
                      </span>
                    </div>
                  ) : isAvailable === true ? (
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Available for selected dates
                      </span>
                    </div>
                  ) : isAvailable === false ? (
                    <div className="flex items-center gap-2 text-red-700">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Not available for selected dates
                      </span>
                    </div>
                  ) : null}
                </div>
              )}

              {/* Pricing Breakdown */}
              {pricing && (
                <div className="bg-gradient-to-br from-[#F8FBF9] to-[#E6F2EC] border border-[#DAF1DE] rounded-lg p-4 space-y-2">
                  <h4 className="text-base font-semibold text-[#051F20] mb-3">
                    Price Breakdown
                  </h4>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#4A4A4A]">
                        ${property.pricing.basePrice} ×{" "}
                        {(pricing as { nights: number }).nights} nights
                      </span>
                      <span className="font-medium text-[#051F20]">
                        ${(pricing as { subtotal: number }).subtotal}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#4A4A4A]">Cleaning fee</span>
                      <span className="font-medium text-[#051F20]">
                        ${(pricing as { cleaningFee: number }).cleaningFee}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#4A4A4A]">Service fee</span>
                      <span className="font-medium text-[#051F20]">
                        ${(pricing as { serviceFee: number }).serviceFee}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#4A4A4A]">Taxes</span>
                      <span className="font-medium text-[#051F20]">
                        ${(pricing as { taxes: number }).taxes}
                      </span>
                    </div>
                  </div>

                  <Separator className="bg-[#DAF1DE]" />

                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-[#051F20]">
                      Total
                    </span>
                    <span className="text-xl font-bold text-[#8EB69B]">
                      ${(pricing as { total: number }).total}
                    </span>
                  </div>
                </div>
              )}

              {/* Book Now Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#8EB69B] to-[#235347] hover:from-[#235347] hover:to-[#8EB69B] text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  loading || checkingAvailability || isAvailable === false
                }
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Booking...
                  </>
                ) : user ? (
                  "Book Now"
                ) : (
                  "Sign In to Book"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="signin"
      />
    </>
  );
}
