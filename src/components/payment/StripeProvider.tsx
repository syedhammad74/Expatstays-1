"use client";

import { ReactNode, useState } from "react";
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
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#0B2B26",
        colorBackground: "#fff",
        colorText: "#0B2B26",
        colorDanger: "#e3342f",
        fontFamily: "Inter, sans-serif",
        spacingUnit: "4px",
        borderRadius: "8px",
      },
      rules: {
        ".Input": {
          border: "1px solid #DAF1DE",
        },
      },
    },
    loader: "auto",
    locale: "auto",
    paymentMethodCreation: "manual",
    ...(clientSecret ? { clientSecret } : {}),
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
