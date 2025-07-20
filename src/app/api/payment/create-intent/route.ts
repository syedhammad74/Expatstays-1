import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/services/payment";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      bookingId,
      amount,
      currency,
      customerEmail,
      customerName,
      metadata,
    } = body;

    // Validate required fields
    if (!bookingId || !amount || !currency || !customerEmail || !customerName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate amount
    if (amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

    // Create payment intent
    const paymentIntent = await paymentService.createPaymentIntent({
      bookingId,
      amount,
      currency,
      customerEmail,
      customerName,
      metadata,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.clientSecret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
