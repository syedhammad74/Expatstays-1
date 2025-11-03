"use client";

import { ReactNode, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { StripeElementsOptions, Stripe } from "@stripe/stripe-js";
import { Loader2 } from "lucide-react";

// Lazy load Stripe Elements only when needed
const Elements = dynamic(
  () => import("@stripe/react-stripe-js").then((mod) => mod.Elements),
  { ssr: false }
);

interface StripeProviderProps {
  children: ReactNode;
  clientSecret?: string;
}

export default function StripeProvider({
  children,
  clientSecret,
}: StripeProviderProps) {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);

  useEffect(() => {
    // Lazy load Stripe only when component mounts (not on initial page load)
    import("@/lib/stripe").then((mod) => {
      setStripePromise(mod.default());
    });
  }, []);

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

  if (!stripePromise || !Elements) {
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
