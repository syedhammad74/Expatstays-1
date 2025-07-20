import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/services/payment";
import { bookingService } from "@/lib/services/bookings";
import { USE_MOCK_DATA, SKIP_STRIPE_PAYMENT } from "@/lib/services/mock-data";

export async function POST(request: NextRequest) {
  try {
    // Only allow mock payments in development mode
    if (!USE_MOCK_DATA && !SKIP_STRIPE_PAYMENT) {
      return NextResponse.json(
        { error: "Mock payments are only available in development mode" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { bookingId, amount, currency } = body;

    // Validate required fields
    if (!bookingId || !amount || !currency) {
      return NextResponse.json(
        { error: "Missing required fields: bookingId, amount, currency" },
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

    // Get booking details
    const booking = await bookingService.getBookingById(bookingId);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Check if payment already completed
    if (booking.payment.status === "completed") {
      return NextResponse.json(
        { error: "Payment already completed" },
        { status: 400 }
      );
    }

    // Process mock payment
    const paymentResult = await paymentService.processMockPayment(
      bookingId,
      amount
    );

    if (paymentResult.status === "succeeded") {
      return NextResponse.json({
        success: true,
        paymentIntentId: paymentResult.paymentIntentId,
        status: paymentResult.status,
        amount: paymentResult.amount,
        receiptUrl: paymentResult.receiptUrl,
        bookingId: paymentResult.bookingId,
        message: "Mock payment processed successfully",
      });
    } else {
      return NextResponse.json(
        { error: "Payment processing failed" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing mock payment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
