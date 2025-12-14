"use client";

import { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  CardElement,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CreditCard,
  Loader2,
  Shield,
  Lock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
// Removed framer-motion for performance
import type { PaymentIntent } from "@stripe/stripe-js";

export interface PaymentFormProps {
  clientSecret: string;
  amount: number;
  currency: string;
  bookingId: string;
  customerEmail: string;
  customerName: string;
  onSuccess: (paymentIntent: PaymentIntent) => void;
  onError: (error: string) => void;
  loading?: boolean;
}

export interface BillingDetails {
  name: string;
  email: string;
  phone: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

export default function PaymentForm({
  clientSecret,
  amount,
  currency,
  bookingId,
  customerEmail,
  customerName,
  onSuccess,
  onError,
  loading = false,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();

  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);
  const [savePaymentMethod, setSavePaymentMethod] = useState(false);
  const [usePaymentElement, setUsePaymentElement] = useState(true);

  const [billingDetails, setBillingDetails] = useState<BillingDetails>({
    name: customerName,
    email: customerEmail,
    phone: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "US",
    },
  });

  useEffect(() => {
    if (!stripe || !clientSecret) {
      return;
    }

    // Check if payment already succeeded
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (paymentIntent?.status === "succeeded") {
        setPaymentSucceeded(true);
        onSuccess(paymentIntent);
      }
    });
  }, [stripe, clientSecret, onSuccess]);

  const handleBillingDetailsChange = (
    field: keyof BillingDetails | string,
    value: string
  ) => {
    if (field.includes("address.")) {
      const addressField = field.split(
        "."
      )[1] as keyof BillingDetails["address"];
      setBillingDetails((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setBillingDetails((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setPaymentError(null);

    try {
      let result: PaymentIntent;

      if (usePaymentElement) {
        // Use Payment Element (recommended)
        const { error } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/booking/success?booking_id=${bookingId}`,
            receipt_email: customerEmail,
            payment_method_data: {
              billing_details: billingDetails,
            },
          },
          redirect: "if_required",
        });

        if (error) {
          throw new Error(error.message);
        }

        // If we get here, payment succeeded without redirect
        const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
        if (!paymentIntent) throw new Error("PaymentIntent not found");
        result = paymentIntent;
      } else {
        // Use Card Element (legacy)
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          throw new Error("Card element not found");
        }

        const confirmResult = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: billingDetails,
          },
          setup_future_usage: savePaymentMethod ? "off_session" : undefined,
        });
        if (confirmResult.error) {
          throw new Error(confirmResult.error.message);
        }
        if (!confirmResult.paymentIntent) throw new Error("PaymentIntent not found");
        result = confirmResult.paymentIntent;
      }

      if (result.status === "succeeded") {
        setPaymentSucceeded(true);
        onSuccess(result);
        toast({
          title: "Payment Successful!",
          description: "Your booking has been confirmed.",
        });
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Payment failed";
      setPaymentError(errorMessage);
      onError(errorMessage);
      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  if (paymentSucceeded) {
    return (
      <div
        className="text-center py-8"
      >
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-[#163832] mb-2">
          Payment Successful!
        </h3>
        <p className="text-[#235347]/70">Your booking has been confirmed.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Booking ID:</span>
              <span className="font-mono text-sm">{bookingId}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total Amount:</span>
              <span>{formatAmount(amount, currency)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Secure Payment
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-[#235347]/70">
            <Shield className="h-4 w-4" />
            Your payment information is secure and encrypted
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Billing Information */}
            <div className="space-y-4">
              <h4 className="font-semibold">Billing Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="billing-name">Full Name</Label>
                  <Input
                    id="billing-name"
                    value={billingDetails.name}
                    onChange={(e) =>
                      handleBillingDetailsChange("name", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="billing-email">Email</Label>
                  <Input
                    id="billing-email"
                    type="email"
                    value={billingDetails.email}
                    onChange={(e) =>
                      handleBillingDetailsChange("email", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="billing-phone">Phone</Label>
                  <Input
                    id="billing-phone"
                    type="tel"
                    value={billingDetails.phone}
                    onChange={(e) =>
                      handleBillingDetailsChange("phone", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="billing-address">Address</Label>
                  <Input
                    id="billing-address"
                    value={billingDetails.address.line1}
                    onChange={(e) =>
                      handleBillingDetailsChange(
                        "address.line1",
                        e.target.value
                      )
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="billing-city">City</Label>
                  <Input
                    id="billing-city"
                    value={billingDetails.address.city}
                    onChange={(e) =>
                      handleBillingDetailsChange("address.city", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="billing-state">State</Label>
                  <Input
                    id="billing-state"
                    value={billingDetails.address.state}
                    onChange={(e) =>
                      handleBillingDetailsChange(
                        "address.state",
                        e.target.value
                      )
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="billing-zip">ZIP Code</Label>
                  <Input
                    id="billing-zip"
                    value={billingDetails.address.postal_code}
                    onChange={(e) =>
                      handleBillingDetailsChange(
                        "address.postal_code",
                        e.target.value
                      )
                    }
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-4">
              <h4 className="font-semibold">Payment Method</h4>

              {/* Toggle between Payment Element and Card Element */}
              <div className="flex items-center space-x-4">
                <Button
                  type="button"
                  variant={usePaymentElement ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUsePaymentElement(true)}
                >
                  Payment Element
                </Button>
                <Button
                  type="button"
                  variant={!usePaymentElement ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUsePaymentElement(false)}
                >
                  Card Element
                </Button>
              </div>

              <div className="p-4 border rounded-lg bg-gray-50">
                {usePaymentElement ? (
                  <PaymentElement
                    options={{
                      layout: "tabs",
                    }}
                  />
                ) : (
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#424770",
                          "::placeholder": {
                            color: "#aab7c4",
                          },
                        },
                      },
                    }}
                  />
                )}
              </div>
            </div>

            {/* Save Payment Method */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="save-payment-method"
                checked={savePaymentMethod}
                onCheckedChange={(checked) =>
                  setSavePaymentMethod(checked as boolean)
                }
              />
              <Label htmlFor="save-payment-method" className="text-sm">
                Save this payment method for future bookings
              </Label>
            </div>

            {/* Error Display */}
            {paymentError && (
              <div>
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{paymentError}</AlertDescription>
                </Alert>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-[#8EB69B] text-[#051F20] hover:bg-[#235347] hover:text-[#DAF1DE] transition-all duration-300 py-3 text-lg font-semibold"
              disabled={!stripe || processing || loading}
            >
              {processing || loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-5 w-5" />
                  Pay {formatAmount(amount, currency)}
                </>
              )}
            </Button>

            {/* Security Notice */}
            <p className="text-xs text-center text-[#235347]/70">
              Your payment is secured by 256-bit SSL encryption and processed by
              Stripe. We never store your payment information.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
