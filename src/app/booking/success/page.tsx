"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Download,
  Home,
  Calendar,
  User,
  Mail,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { bookingService } from "@/lib/services/bookings";
import { propertyService } from "@/lib/services/properties";
import { Booking, Property } from "@/lib/types/firebase";

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking_id");

  const [booking, setBooking] = useState<Booking | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) {
        // setError("No booking ID provided"); // This line was removed
        setLoading(false);
        return;
      }

      try {
        const bookingData = await bookingService.getBookingById(bookingId);
        if (!bookingData) {
          // setError("Booking not found"); // This line was removed
          setLoading(false);
          return;
        }

        setBooking(bookingData);

        // Fetch property details
        const propertyData = await propertyService.getPropertyById(
          bookingData.propertyId
        );
        setProperty(propertyData);
      } catch (err) {
        console.error("Error fetching booking details:", err);
        // setError("Failed to load booking details"); // This line was removed
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8EB69B] mx-auto mb-4"></div>
          <p className="text-[#235347]">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">❌</div>
          <h2 className="text-2xl font-bold text-[#163832] mb-2">
            Error Loading Booking
          </h2>
          <p className="text-[#235347]/70 mb-4">No booking ID provided.</p>
          <Button asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] via-white to-[#DAF1DE]/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-[#163832] mb-2">
            Payment Successful!
          </h1>
          <p className="text-xl text-[#235347]/70">
            Your booking has been confirmed. Check your email for confirmation
            details.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Booking Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#235347]/70">Booking ID</p>
                    <p className="font-mono text-sm font-medium">
                      {booking.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#235347]/70">Status</p>
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800"
                    >
                      {booking.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#235347]/70">Check-in</p>
                    <p className="font-medium">
                      {formatDate(booking.dates.checkIn)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[#235347]/70">Check-out</p>
                    <p className="font-medium">
                      {formatDate(booking.dates.checkOut)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#235347]/70">Nights</p>
                    <p className="font-medium">{booking.dates.nights}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#235347]/70">Guests</p>
                    <p className="font-medium">{booking.guests.total}</p>
                  </div>
                </div>

                {property && (
                  <div>
                    <p className="text-sm text-[#235347]/70">Property</p>
                    <p className="font-medium">{property.title}</p>
                    <p className="text-sm text-[#235347]/70">
                      {property.location.address}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#235347]/70">Payment Status</p>
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800"
                    >
                      {booking.payment.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-[#235347]/70">Payment Method</p>
                    <p className="font-medium">
                      {booking.payment.paymentMethod ? "Card" : "Credit Card"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#235347]/70">Subtotal</span>
                    <span>
                      {formatCurrency(
                        booking.pricing.subtotal,
                        booking.pricing.currency
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#235347]/70">Cleaning Fee</span>
                    <span>
                      {formatCurrency(
                        booking.pricing.cleaningFee,
                        booking.pricing.currency
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#235347]/70">Service Fee</span>
                    <span>
                      {formatCurrency(
                        booking.pricing.serviceFee,
                        booking.pricing.currency
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#235347]/70">Taxes</span>
                    <span>
                      {formatCurrency(
                        booking.pricing.taxes,
                        booking.pricing.currency
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total Paid</span>
                    <span>
                      {formatCurrency(
                        booking.pricing.total,
                        booking.pricing.currency
                      )}
                    </span>
                  </div>
                </div>

                {booking.payment.receiptUrl && (
                  <Button asChild variant="outline" className="w-full">
                    <a
                      href={booking.payment.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Receipt
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Guest Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Guest Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#235347]/70">Name</p>
                  <p className="font-medium">{booking.guest.name}</p>
                </div>
                <div>
                  <p className="text-sm text-[#235347]/70">Email</p>
                  <p className="font-medium">{booking.guest.email}</p>
                </div>
                <div>
                  <p className="text-sm text-[#235347]/70">Phone</p>
                  <p className="font-medium">{booking.guest.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-[#235347]/70">Guest ID</p>
                  <p className="font-mono text-sm font-medium">
                    {booking.guest.uid}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            asChild
            size="lg"
            className="bg-[#8EB69B] text-[#051F20] hover:bg-[#235347] hover:text-[#DAF1DE]"
          >
            <Link href="/">
              <Home className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/properties">
              <Calendar className="h-5 w-5 mr-2" />
              Browse More Properties
            </Link>
          </Button>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-8"
        >
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-[#163832]">What's Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-[#235347]/70">
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Check your email for detailed confirmation and check-in
                  instructions
                </li>
                <li className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Mark your calendar for your upcoming stay
                </li>
                <li className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  You'll receive contact information for the property
                  owner/manager
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
