import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/services/payment";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentIntentId } = body;

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: "Payment intent ID is required" },
        { status: 400 }
      );
    }

    // Confirm payment and update booking
    const confirmation = await paymentService.confirmPayment(paymentIntentId);

    return NextResponse.json(confirmation);
  } catch (error) {
    console.error("Error confirming payment:", error);
    return NextResponse.json(
      { error: "Failed to confirm payment" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentIntentId = searchParams.get("payment_intent_id");

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: "Payment intent ID is required" },
        { status: 400 }
      );
    }

    // Get payment intent status
    const paymentIntent = await paymentService.getPaymentIntent(
      paymentIntentId
    );

    return NextResponse.json(paymentIntent);
  } catch (error) {
    console.error("Error getting payment intent:", error);
    return NextResponse.json(
      { error: "Failed to get payment intent" },
      { status: 500 }
    );
  }
}
