"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, Home, RotateCcw, HelpCircle } from "lucide-react";
// Removed framer-motion for performance
import Link from "next/link";
import { bookingService } from "@/lib/services/bookings";
import { Booking } from "@/lib/types/firebase";

export default function BookingCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading cancellation details...
        </div>
      }
    >
      <BookingCancelContent />
    </Suspense>
  );
}

function BookingCancelContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking_id");

  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) {
        return;
      }

      try {
        const bookingData = await bookingService.getBookingById(bookingId);
        setBooking(bookingData);
      } catch (err) {
        console.error("Error fetching booking details:", err);
      } finally {
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] via-white to-[#DAF1DE]/30 py-12">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div
            className="text-center mb-8"
          >
            <XCircle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-[#163832] mb-2">
              Payment Cancelled
            </h1>
            <p className="text-xl text-[#235347]/70">
              Your payment was cancelled. No charges were made to your account.
            </p>
          </div>

          <div
          >
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  What Happened?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-[#235347]/70">
                  Your payment was cancelled before completion. This could have
                  happened because:
                </p>
                <ul className="list-disc list-inside space-y-2 text-[#235347]/70">
                  <li>
                    You clicked the back button or closed the payment window
                  </li>
                  <li>There was an issue with your payment method</li>
                  <li>You decided not to complete the booking</li>
                  <li>The payment session expired</li>
                </ul>

                {booking && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-[#163832] mb-2">
                      Booking Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-[#235347]/70">Booking ID</p>
                        <p className="font-mono">{booking.id}</p>
                      </div>
                      <div>
                        <p className="text-[#235347]/70">Amount</p>
                        <p className="font-medium">
                          {formatCurrency(
                            booking.pricing.total,
                            booking.pricing.currency
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#235347]/70">Status</p>
                        <p className="font-medium text-orange-600">
                          Payment Cancelled
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div
            className="space-y-4"
          >
            <Card>
              <CardHeader>
                <CardTitle>What Would You Like to Do?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {booking && (
                    <Button
                      asChild
                      size="lg"
                      className="bg-[#8EB69B] text-[#051F20] hover:bg-[#235347] hover:text-[#DAF1DE]"
                    >
                      <Link href={`/booking/payment?booking_id=${booking.id}`}>
                        <RotateCcw className="h-5 w-5 mr-2" />
                        Try Payment Again
                      </Link>
                    </Button>
                  )}

                  <Button asChild variant="outline" size="lg">
                    <Link href="/">
                      <Home className="h-5 w-5 mr-2" />
                      Back to Home
                    </Link>
                  </Button>
                </div>

                <div className="text-center">
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/properties">Browse Other Properties</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div
            className="mt-8"
          >
            <Card className="bg-gray-50 border-gray-200">
              <CardHeader>
                <CardTitle className="text-[#163832]">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#235347]/70 mb-4">
                  If you&apos;re experiencing issues with payment or have
                  questions about your booking:
                </p>
                <div className="space-y-2">
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                  <p className="text-sm text-center text-[#235347]/60">
                    Or call us at <strong>1-800-EXPAT-STAYS</strong>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
