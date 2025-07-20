"use client";

import { ReactNode, useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { StripeElementsOptions } from "@stripe/stripe-js";
import getStripe from "@/lib/stripe";
import { Loader2 } from "lucide-react";

interface StripeProviderProps {
  children: ReactNode;
  clientSecret?: string;
  amount?: number;
  currency?: string;
}

export default function StripeProvider({
  children,
  clientSecret,
  amount,
  currency = "USD",
}: StripeProviderProps) {
  const [stripePromise] = useState(() => getStripe());

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#0B2B26",
        colorBackground: "#ffffff",
        colorText: "#163832",
        colorDanger: "#df1b41",
        fontFamily: '"Inter", system-ui, sans-serif',
        spacingUnit: "4px",
        borderRadius: "8px",
      },
      rules: {
        ".Tab": {
          border: "1px solid #E4E4E7",
          borderRadius: "8px",
          boxShadow:
            "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        },
        ".Tab:hover": {
          color: "#0B2B26",
          backgroundColor: "#F4F4F5",
        },
        ".Tab--selected": {
          backgroundColor: "#0B2B26",
          color: "#ffffff",
          border: "1px solid #0B2B26",
        },
        ".Input": {
          border: "1px solid #E4E4E7",
          borderRadius: "8px",
          fontSize: "16px",
          padding: "12px",
        },
        ".Input:focus": {
          border: "1px solid #8EB69B",
          boxShadow: "0 0 0 2px rgba(142, 182, 155, 0.1)",
        },
        ".Label": {
          fontWeight: "500",
          marginBottom: "8px",
          color: "#163832",
        },
      },
    },
    mode: clientSecret ? "payment" : "setup",
    amount: amount ? Math.round(amount * 100) : undefined, // Convert to cents
    currency: currency.toLowerCase(),
    setupFutureUsage: "off_session",
    paymentMethodCreation: "manual",
    paymentMethodConfiguration: {
      displayPreference: {
        preference: "ordered",
      },
    },
  };

  if (!stripePromise) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-[#8EB69B]" />
        <span className="ml-2 text-[#235347]">Loading payment system...</span>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}
