"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  Calendar,
  User,
  MapPin,
  Mail,
  Download,
  Home,
  CreditCard,
  Loader2,
} from "lucide-react";
import { bookingService } from "@/lib/services/bookings";
import { propertyService } from "@/lib/services/properties";
import { Booking, Property } from "@/lib/types/firebase";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import Image from "next/image";

export default function BookingSuccessPage() {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const { toast } = useToast();

  const loadBookingDetails = useCallback(async () => {
    if (!bookingId) return;

    try {
      const bookingData = await bookingService.getBookingById(bookingId);
      if (!bookingData) {
        setError("Booking not found");
        return;
      }

      setBooking(bookingData);

      // Load property details
      const propertyData = await propertyService.getPropertyById(
        bookingData.propertyId
      );
      setProperty(propertyData);
    } catch (error) {
      console.error("Error loading booking details:", error);
      setError("Failed to load booking details");
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    if (bookingId) {
      loadBookingDetails();
    } else {
      setError("No booking ID provided");
      setLoading(false);
    }
  }, [bookingId, loadBookingDetails]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDownloadReceipt = async () => {
    if (!booking) return;

    try {
      // In a real app, this would generate and download a PDF receipt
      toast({
        title: "Receipt Downloaded",
        description: "Your booking receipt has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download receipt",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 pt-20 lg:pt-24 md:pt-32">
        <div className="flex items-center justify-center h-48 lg:h-64">
          <Loader2 className="h-6 lg:h-8 w-6 lg:w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 pt-20 lg:pt-24 md:pt-32">
        <div className="max-w-2xl mx-auto">
          <Alert variant="destructive">
            <AlertDescription>{error || "Booking not found"}</AlertDescription>
          </Alert>
          <div className="mt-4 lg:mt-6 text-center">
            <Button asChild>
              <Link href="/properties">Browse Properties</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 pt-20 lg:pt-24 md:pt-32">
      <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8">
        {/* Success Header */}
        <div className="text-center space-y-3 lg:space-y-4">
          <div className="flex items-center justify-center">
            <CheckCircle className="h-12 lg:h-16 w-12 lg:w-16 text-green-500" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold">Booking Confirmed!</h1>
          <p className="text-sm lg:text-base text-muted-foreground">
            Your reservation has been successfully created. You&apos;ll receive
            a confirmation email shortly.
          </p>
        </div>

        {/* Booking Details */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-primary text-primary-foreground p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-xl lg:text-2xl">
                  Booking Details
                </CardTitle>
                <CardDescription className="text-primary-foreground/80 text-sm lg:text-base">
                  Reservation #{booking.id.slice(-8).toUpperCase()}
                </CardDescription>
              </div>
              <Badge
                variant="secondary"
                className="bg-white text-primary text-xs lg:text-sm"
              >
                {booking.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
              {/* Property Image */}
              <div className="lg:col-span-1">
                {property?.images?.[0] ? (
                  <div className="aspect-square lg:aspect-auto lg:h-full relative">
                    <Image
                      src={property.images[0]}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-square lg:aspect-auto lg:h-full bg-muted flex items-center justify-center">
                    <Home className="h-8 lg:h-12 w-8 lg:w-12 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Booking Information */}
              <div className="lg:col-span-2 p-4 lg:p-6 space-y-4 lg:space-y-6">
                <div>
                  <h3 className="text-lg lg:text-xl font-semibold mb-2">
                    {property?.title || "Property Details Loading..."}
                  </h3>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm lg:text-base">
                    <MapPin className="h-3 lg:h-4 w-3 lg:w-4" />
                    <span>
                      {property?.location.city}, {property?.location.country}
                    </span>
                  </div>
                </div>

                {/* Dates and Guests */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 lg:h-4 w-3 lg:w-4 text-muted-foreground" />
                      <span className="font-medium text-sm lg:text-base">
                        Check-in
                      </span>
                    </div>
                    <p className="text-xs lg:text-sm text-muted-foreground">
                      {formatDate(booking.dates.checkIn)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 lg:h-4 w-3 lg:w-4 text-muted-foreground" />
                      <span className="font-medium text-sm lg:text-base">
                        Check-out
                      </span>
                    </div>
                    <p className="text-xs lg:text-sm text-muted-foreground">
                      {formatDate(booking.dates.checkOut)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-3 lg:h-4 w-3 lg:w-4 text-muted-foreground" />
                      <span className="font-medium text-sm lg:text-base">
                        Guests
                      </span>
                    </div>
                    <p className="text-xs lg:text-sm text-muted-foreground">
                      {booking.guests.total} guest
                      {booking.guests.total > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-3 lg:h-4 w-3 lg:w-4 text-muted-foreground" />
                      <span className="font-medium text-sm lg:text-base">
                        Total Cost
                      </span>
                    </div>
                    <p className="text-xs lg:text-sm text-muted-foreground">
                      ${booking.pricing.total} {booking.pricing.currency}
                    </p>
                  </div>
                </div>

                {/* Guest Information */}
                <div className="space-y-2 lg:space-y-3">
                  <h4 className="font-medium text-sm lg:text-base">
                    Guest Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 text-xs lg:text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>
                      <p>{booking.guest.name}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email:</span>
                      <p>{booking.guest.email}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone:</span>
                      <p>{booking.guest.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                {booking.specialRequests && (
                  <div className="space-y-2 lg:space-y-3">
                    <h4 className="font-medium text-sm lg:text-base">
                      Special Requests
                    </h4>
                    <p className="text-xs lg:text-sm text-muted-foreground bg-muted p-3 rounded-md">
                      {booking.specialRequests}
                    </p>
                  </div>
                )}

                {/* Pricing Breakdown */}
                <div className="space-y-2 lg:space-y-3">
                  <h4 className="font-medium text-sm lg:text-base">
                    Pricing Breakdown
                  </h4>
                  <div className="space-y-2 text-xs lg:text-sm">
                    <div className="flex justify-between">
                      <span>
                        ${booking.pricing.basePrice}/night ×{" "}
                        {booking.dates.nights} nights
                      </span>
                      <span>
                        ${booking.pricing.basePrice * booking.dates.nights}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cleaning fee</span>
                      <span>${booking.pricing.cleaningFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service fee</span>
                      <span>${booking.pricing.serviceFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes</span>
                      <span>${booking.pricing.taxes}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>
                        ${booking.pricing.total} {booking.pricing.currency}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader className="p-4 lg:p-6">
            <CardTitle className="text-lg lg:text-xl">
              What&apos;s Next?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 lg:space-y-4 p-4 lg:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
              <div className="flex items-start gap-2 lg:gap-3">
                <Mail className="h-4 lg:h-5 w-4 lg:w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm lg:text-base">
                    Check your email
                  </h4>
                  <p className="text-xs lg:text-sm text-muted-foreground">
                    We&apos;ve sent a confirmation email with all your booking
                    details
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 lg:gap-3">
                <Calendar className="h-4 lg:h-5 w-4 lg:w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm lg:text-base">
                    Save the dates
                  </h4>
                  <p className="text-xs lg:text-sm text-muted-foreground">
                    Add your check-in and check-out dates to your calendar
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 lg:gap-4 justify-center">
          <Button
            size="lg"
            onClick={handleDownloadReceipt}
            className="w-full sm:w-auto text-sm lg:text-base"
          >
            <Download className="h-3 lg:h-4 w-3 lg:w-4 mr-2" />
            Download Receipt
          </Button>
          <Button
            variant="outline"
            size="lg"
            asChild
            className="w-full sm:w-auto text-sm lg:text-base"
          >
            <Link href="/my-bookings">View My Bookings</Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            asChild
            className="w-full sm:w-auto text-sm lg:text-base"
          >
            <Link href="/properties">Browse More Properties</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
