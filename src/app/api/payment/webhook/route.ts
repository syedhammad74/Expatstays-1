import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/services/payment";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      console.error("Missing Stripe signature");
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Handle the webhook
    await paymentService.handleWebhook(body, signature);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Webhook handling failed" },
      { status: 500 }
    );
  }
}

// Disable body parsing for webhooks
export const runtime = "nodejs";
export const preferredRegion = "auto";
