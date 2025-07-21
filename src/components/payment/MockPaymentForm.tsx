"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  CheckCircle,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Clock,
  DollarSign,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface MockPaymentFormProps {
  bookingId: string;
  amount: number;
  currency: string;
  onSuccess: (paymentResult: unknown) => void;
  onError: (error: string) => void;
}

export function MockPaymentForm({
  bookingId,
  amount,
  currency,
  onSuccess,
  onError,
}: MockPaymentFormProps) {
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const { toast } = useToast();

  const handleMockPayment = async () => {
    setProcessing(true);

    try {
      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await fetch("/api/payment/process-mock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId,
          amount,
          currency,
        }),
      });

      const data: { success: boolean; error?: string } = await response.json();

      if (response.ok && data.success) {
        setCompleted(true);
        toast({
          title: "Payment Successful!",
          description: "Your booking has been confirmed.",
          variant: "default",
        });

        // Wait a moment before redirecting
        setTimeout(() => {
          onSuccess(data);
        }, 1000);
      } else {
        throw new Error(data.error || "Payment failed");
      }
    } catch (error: unknown) {
      console.error("Mock payment error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Payment failed";
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

  return (
    <div className="space-y-6">
      {/* Mock Payment Notice */}
      <Alert className="border-orange-200 bg-orange-50">
        <AlertCircle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <strong>Development Mode:</strong> This is a mock payment system. No
          real payment will be processed.
        </AlertDescription>
      </Alert>

      {/* Payment Summary */}
      <Card className="border-[#8EB69B]/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-[#051F20]">
            <DollarSign className="h-5 w-5 text-[#8EB69B]" />
            Payment Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Amount</span>
            <span className="font-semibold text-lg text-[#051F20]">
              ${amount.toFixed(2)} {currency.toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Booking ID</span>
            <span className="font-mono text-sm text-[#8EB69B]">
              {bookingId}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Payment Method</span>
            <Badge
              variant="outline"
              className="text-[#8EB69B] border-[#8EB69B]"
            >
              Mock Payment
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Mock Payment Form */}
      <Card className="border-[#8EB69B]/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#051F20]">
            <CreditCard className="h-5 w-5 text-[#8EB69B]" />
            Mock Payment Processing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!completed ? (
            <>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  Secure mock payment processing
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4 text-blue-600" />
                  Processing time: ~2 seconds
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-[#8EB69B]" />
                  Automatic booking confirmation
                </div>
              </div>

              <Separator />

              <Button
                onClick={handleMockPayment}
                disabled={processing}
                className="w-full bg-[#8EB69B] hover:bg-[#235347] text-white py-3 text-lg font-semibold"
                size="lg"
              >
                {processing ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing Payment...
                  </motion.div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Complete Mock Payment
                  </div>
                )}
              </Button>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                Payment Successful!
              </h3>
              <p className="text-gray-600">
                Your booking has been confirmed. Redirecting...
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Development Info */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded border">
        <div className="font-semibold mb-1">Development Information:</div>
        <ul className="space-y-1">
          <li>• Mock payments always succeed after 2 seconds</li>
          <li>• Booking status will be updated to "confirmed"</li>
          <li>• Mock receipt URL will be generated</li>
          <li>• No real payment processing occurs</li>
        </ul>
      </div>
    </div>
  );
}
