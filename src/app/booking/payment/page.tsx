"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { bookingService } from "@/lib/services/bookings";
import { propertyService } from "@/lib/services/properties";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  MapPin,
  Users,
  Loader2,
  AlertCircle,
  CreditCard,
  CheckCircle,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { Booking, Property } from "@/lib/types/firebase";
import { AuthModal } from "@/components/auth/AuthModal";
import StripeProvider from "@/components/payment/StripeProvider";
import PaymentForm from "@/components/payment/PaymentForm";
import { MockPaymentForm } from "@/components/payment/MockPaymentForm";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

// Check if we're in mock mode
const USE_MOCK_DATA =
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_USE_MOCK_DATA !== "false";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking_id");
  const { user } = useAuth();
  const { toast } = useToast();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [creatingPaymentIntent, setCreatingPaymentIntent] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    "elements" | "checkout" | "mock"
  >(USE_MOCK_DATA ? "mock" : "elements");
  const [showAuthModal, setShowAuthModal] = useState(false);

  const createPaymentIntent = useCallback(
    async (bookingData: Booking) => {
      if (!user) {
        setShowAuthModal(true);
        return;
      }

      setCreatingPaymentIntent(true);
      try {
        const response = await fetch("/api/payment/create-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingId: bookingData.id,
            amount: bookingData.payment.amount,
            currency: bookingData.payment.currency,
            customerEmail: bookingData.guest.email,
            customerName: bookingData.guest.name,
            metadata: {
              propertyId: bookingData.propertyId,
              checkIn: bookingData.dates.checkIn,
              checkOut: bookingData.dates.checkOut,
              guests: bookingData.guests.total.toString(),
            },
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to create payment intent");
        }

        setClientSecret(data.clientSecret);
        setPaymentIntentId(data.paymentIntentId);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to create payment intent";
        setError(errorMessage);
        toast({
          title: "Payment Setup Failed",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setCreatingPaymentIntent(false);
      }
    },
    [user, toast]
  );

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) {
        setError("No booking ID provided");
        setLoading(false);
        return;
      }

      try {
        const bookingData = await bookingService.getBookingById(bookingId);
        if (!bookingData) {
          setError("Booking not found");
          setLoading(false);
          return;
        }

        setBooking(bookingData);

        // Fetch property details
        const propertyData = await propertyService.getPropertyById(
          bookingData.propertyId
        );
        if (!propertyData) {
          setError("Property not found");
          setLoading(false);
          return;
        }
        setProperty(propertyData);

        // Check if payment already completed
        if (bookingData.payment.status === "completed") {
          window.location.href = `/booking/success?booking_id=${bookingId}`;
          return;
        }

        // Auto-create payment intent for Elements (not for mock)
        if (paymentMethod === "elements" && !USE_MOCK_DATA) {
          await createPaymentIntent(bookingData);
        }
      } catch (err) {
        console.error("Error fetching booking details:", err);
        setError("Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId, paymentMethod, createPaymentIntent]);

  const handleCheckoutSession = async () => {
    if (!booking || !user) {
      setShowAuthModal(true);
      return;
    }

    setCreatingPaymentIntent(true);
    try {
      const response = await fetch("/api/payment/checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: booking.id,
          amount: booking.payment.amount,
          currency: booking.payment.currency,
          customerEmail: booking.guest.email,
          customerName: booking.guest.name,
          metadata: {
            propertyId: booking.propertyId,
            checkIn: booking.dates.checkIn,
            checkOut: booking.dates.checkOut,
            guests: booking.guests.total.toString(),
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe checkout
      window.location.href = data.checkoutUrl;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to create checkout session";
      setError(errorMessage);
      toast({
        title: "Checkout Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setCreatingPaymentIntent(false);
    }
  };

  const handlePaymentSuccess = (paymentResult: unknown) => {
    toast({
      title: "Payment Successful!",
      description: "Your booking has been confirmed.",
    });

    // Redirect to success page
    window.location.href = `/booking/success?booking_id=${bookingId}`;
  };

  const handlePaymentError = (error: string) => {
    setError(error);
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    });
  };

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
      <div className="min-h-screen bg-gradient-to-br from-white to-[#DAF1DE] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#8EB69B] mx-auto mb-4" />
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-[#DAF1DE] flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-6">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Error:</strong> {error}
            </AlertDescription>
          </Alert>
          <div className="mt-6 text-center">
            <Link href="/properties">
              <Button
                variant="outline"
                className="border-[#8EB69B] text-[#8EB69B] hover:bg-[#DAF1DE]"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Properties
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!booking || !property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-[#DAF1DE] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Booking or property not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#DAF1DE]">
      <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#051F20] mb-2">
                Complete Your Payment
              </h1>
              <p className="text-gray-600">
                {USE_MOCK_DATA && (
                  <span className="text-orange-600 font-semibold">
                    [Development Mode]
                  </span>
                )}{" "}
                Secure your booking for {property.title}
              </p>
            </div>
            <Link href={`/properties/${property.id}`}>
              <Button
                variant="outline"
                className="border-[#8EB69B] text-[#8EB69B] hover:bg-[#DAF1DE]"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Property
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 border-[#8EB69B]/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-[#051F20] flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-[#8EB69B]" />
                  Booking Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Property Info */}
                <div>
                  <h3 className="font-semibold text-[#051F20] mb-2">
                    {property.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.location.address}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    {booking.guests.total} guests
                  </div>
                </div>

                <Separator />

                {/* Dates */}
                <div>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    Check-in: {formatDate(booking.dates.checkIn)}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    Check-out: {formatDate(booking.dates.checkOut)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {booking.dates.nights} nights
                  </div>
                </div>

                <Separator />

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      ${booking.pricing.basePrice} × {booking.dates.nights}{" "}
                      nights
                    </span>
                    <span>${booking.pricing.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cleaning fee</span>
                    <span>${booking.pricing.cleaningFee}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Service fee</span>
                    <span>${booking.pricing.serviceFee}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxes</span>
                    <span>${booking.pricing.taxes}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg text-[#051F20]">
                    <span>Total</span>
                    <span>
                      {formatCurrency(
                        booking.pricing.total,
                        booking.pricing.currency
                      )}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge
                    variant={
                      booking.status === "confirmed" ? "default" : "secondary"
                    }
                  >
                    {booking.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Section */}
          <div className="lg:col-span-2">
            <Card className="border-[#8EB69B]/20">
              <CardHeader>
                <CardTitle className="text-[#051F20] flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-[#8EB69B]" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                {USE_MOCK_DATA ? (
                  // Mock Payment Form
                  <MockPaymentForm
                    bookingId={booking.id}
                    amount={booking.payment.amount}
                    currency={booking.payment.currency}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                ) : (
                  // Real Stripe Payment Options
                  <Tabs
                    value={paymentMethod}
                    onValueChange={(value) =>
                      setPaymentMethod(
                        value as unknown as "elements" | "checkout"
                      )
                    }
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="elements">Card Payment</TabsTrigger>
                      <TabsTrigger value="checkout">Checkout</TabsTrigger>
                    </TabsList>

                    <TabsContent value="elements" className="mt-6">
                      {clientSecret && paymentIntentId ? (
                        <StripeProvider>
                          <PaymentForm
                            clientSecret={clientSecret}
                            bookingId={booking.id}
                            customerEmail={booking.guest.email}
                            customerName={booking.guest.name}
                            onSuccess={handlePaymentSuccess}
                            onError={handlePaymentError}
                            amount={booking.payment.amount}
                            currency={booking.payment.currency}
                          />
                        </StripeProvider>
                      ) : (
                        <div className="text-center py-8">
                          {creatingPaymentIntent ? (
                            <div>
                              <Loader2 className="h-8 w-8 animate-spin text-[#8EB69B] mx-auto mb-4" />
                              <p className="text-gray-600">
                                Setting up payment...
                              </p>
                            </div>
                          ) : (
                            <div>
                              <p className="text-gray-600 mb-4">
                                Click the button below to set up your payment
                              </p>
                              <Button
                                onClick={() => createPaymentIntent(booking)}
                                className="bg-[#8EB69B] hover:bg-[#235347] text-white"
                              >
                                Setup Payment
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="checkout" className="mt-6">
                      <div className="space-y-4">
                        <p className="text-gray-600">
                          You&apos;ll be redirected to Stripe&apos;s secure
                          checkout page to complete your payment.
                        </p>
                        <Button
                          onClick={handleCheckoutSession}
                          disabled={creatingPaymentIntent}
                          className="w-full bg-[#8EB69B] hover:bg-[#235347] text-white"
                          size="lg"
                        >
                          {creatingPaymentIntent ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Creating checkout session...
                            </>
                          ) : (
                            <>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Continue to Checkout
                            </>
                          )}
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}
