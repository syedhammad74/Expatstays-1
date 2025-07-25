"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { bookingService } from "@/lib/services/bookings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Calendar, Loader2, AlertCircle } from "lucide-react";
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
  const [pricing, setPricing] = useState<unknown>(null);
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
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Book Your Stay
          </CardTitle>
          <CardDescription>
            ${property.pricing.basePrice} / night
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Availability Calendar */}
            <div className="mb-6">
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
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="adults">Adults</Label>
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
                />
              </div>
              <div>
                <Label htmlFor="children">Children</Label>
                <Input
                  id="children"
                  type="number"
                  value={formData.children}
                  onChange={(e) =>
                    handleInputChange("children", parseInt(e.target.value))
                  }
                  min="0"
                  max={property.capacity.maxGuests - formData.adults}
                />
              </div>
              <div>
                <Label htmlFor="infants">Infants</Label>
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
                />
              </div>
            </div>

            <div>
              <Label htmlFor="specialRequests">Special Requests</Label>
              <textarea
                id="specialRequests"
                className="w-full p-2 border rounded-md"
                value={formData.specialRequests}
                onChange={(e) =>
                  handleInputChange("specialRequests", e.target.value)
                }
                placeholder="Any special requests or notes..."
                rows={3}
              />
            </div>

            {/* Availability Status */}
            {formData.checkIn && formData.checkOut && (
              <div className="p-3 border rounded-md">
                {checkingAvailability ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {"Checking availability..." as React.ReactNode}
                  </div>
                ) : isAvailable === true ? (
                  <div className="text-green-600 text-sm font-medium">
                    {"Available for selected dates" as React.ReactNode}
                  </div>
                ) : isAvailable === false ? (
                  <div className="text-red-600 text-sm font-medium">
                    {"Not available for selected dates" as React.ReactNode}
                  </div>
                ) : null}
              </div>
            )}

            {/* Pricing Breakdown */}
            {pricing && (
              <div className="border rounded-md p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    ${property.pricing.basePrice} ×{" "}
                    {(pricing as { nights: number }).nights} nights
                  </span>
                  <span>${(pricing as { subtotal: number }).subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Cleaning fee</span>
                  <span>
                    ${(pricing as { cleaningFee: number }).cleaningFee}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Service fee</span>
                  <span>${(pricing as { serviceFee: number }).serviceFee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Taxes</span>
                  <span>${(pricing as { taxes: number }).taxes}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${(pricing as { total: number }).total}</span>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
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
        </CardContent>
      </Card>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="signin"
      />
    </>
  );
}
