import Stripe from "stripe";
import { bookingService } from "./bookings";
import {
  USE_MOCK_DATA,
  SKIP_STRIPE_PAYMENT,
  mockBookingService,
} from "./mock-data";

// Initialize Stripe for server-side operations
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2022-11-15",
} as Stripe.StripeConfig);

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  clientSecret: string;
  bookingId?: string;
  metadata?: Record<string, string>;
}

export interface PaymentData {
  bookingId: string;
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  metadata?: Record<string, string>;
}

export interface PaymentConfirmation {
  paymentIntentId: string;
  status: "succeeded" | "failed" | "canceled";
  bookingId: string;
  amount: number;
  receiptUrl?: string;
}

class PaymentService {
  /**
   * Create a payment intent for a booking
   */
  async createPaymentIntent(paymentData: PaymentData): Promise<PaymentIntent> {
    // Use mock payment in development mode
    if (USE_MOCK_DATA || SKIP_STRIPE_PAYMENT) {
      console.log("🔧 Using mock payment intent");
      return this.createMockPaymentIntent(paymentData);
    }

    try {
      const {
        bookingId,
        amount,
        currency,
        customerEmail,
        customerName,
        metadata,
      } = paymentData;

      // Create customer if they don't exist
      const customers = await stripe.customers.list({
        email: customerEmail,
        limit: 1,
      });

      let customer = customers.data[0];
      if (!customer) {
        customer = await stripe.customers.create({
          email: customerEmail,
          name: customerName,
        });
      }

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        customer: customer.id,
        metadata: {
          bookingId,
          customerEmail,
          ...metadata,
        },
        automatic_payment_methods: {
          enabled: true,
        },
        receipt_email: customerEmail,
        description: `Booking payment for ${bookingId}`,
      });

      return {
        id: paymentIntent.id,
        amount: paymentIntent.amount / 100, // Convert back from cents
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        clientSecret: paymentIntent.client_secret || "",
        bookingId,
        metadata: paymentIntent.metadata,
      };
    } catch (error) {
      console.error("Error creating payment intent:", error);
      console.log("🔧 Falling back to mock payment");
      return this.createMockPaymentIntent(paymentData);
    }
  }

  /**
   * Create a mock payment intent for development
   */
  private createMockPaymentIntent(paymentData: PaymentData): PaymentIntent {
    const mockPaymentIntentId = `pi_mock_${Date.now()}`;
    const mockClientSecret = `${mockPaymentIntentId}_secret_mock`;

    return {
      id: mockPaymentIntentId,
      amount: paymentData.amount,
      currency: paymentData.currency,
      status: "requires_payment_method",
      clientSecret: mockClientSecret,
      bookingId: paymentData.bookingId,
      metadata: paymentData.metadata,
    };
  }

  /**
   * Retrieve a payment intent
   */
  async getPaymentIntent(paymentIntentId: string): Promise<PaymentIntent> {
    // Handle mock payment intents
    if (
      USE_MOCK_DATA ||
      SKIP_STRIPE_PAYMENT ||
      paymentIntentId.startsWith("pi_mock_")
    ) {
      return {
        id: paymentIntentId,
        amount: 0,
        currency: "usd",
        status: "succeeded",
        clientSecret: `${paymentIntentId}_secret_mock`,
        bookingId: undefined,
        metadata: {},
      };
    }

    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
      );

      return {
        id: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        clientSecret: paymentIntent.client_secret || "",
        bookingId: paymentIntent.metadata?.bookingId,
        metadata: paymentIntent.metadata,
      };
    } catch (error) {
      console.error("Error retrieving payment intent:", error);
      throw new Error("Failed to retrieve payment intent");
    }
  }

  /**
   * Confirm payment and update booking status
   */
  async confirmPayment(paymentIntentId: string): Promise<PaymentConfirmation> {
    // Handle mock payment confirmation
    if (
      USE_MOCK_DATA ||
      SKIP_STRIPE_PAYMENT ||
      paymentIntentId.startsWith("pi_mock_")
    ) {
      console.log("🔧 Using mock payment confirmation");
      return this.confirmMockPayment(paymentIntentId);
    }

    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
      );
      const bookingId = paymentIntent.metadata?.bookingId;

      if (!bookingId) {
        throw new Error("Booking ID not found in payment metadata");
      }

      let status: "succeeded" | "failed" | "canceled" = "failed";

      if (paymentIntent.status === "succeeded") {
        status = "succeeded";
        // Update booking status to confirmed
        await bookingService.updateBookingStatus(bookingId, "confirmed");

        // Add payment information to booking
        await bookingService.updateBookingPayment(bookingId, {
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
          status: "completed",
          paymentMethod: paymentIntent.payment_method as string,
          receiptUrl:
            (paymentIntent as Stripe.PaymentIntent).charges?.data?.[0]
              ?.receipt_url || undefined,
        });
      } else if (paymentIntent.status === "canceled") {
        status = "canceled";
        await bookingService.updateBookingStatus(bookingId, "cancelled");
      } else {
        await bookingService.updateBookingStatus(bookingId, "pending");
      }

      return {
        paymentIntentId: paymentIntent.id,
        status,
        bookingId,
        amount: paymentIntent.amount / 100,
        receiptUrl: (paymentIntent as Stripe.PaymentIntent).charges?.data?.[0]
          ?.receipt_url,
      };
    } catch (error) {
      console.error("Error confirming payment:", error);
      throw new Error("Failed to confirm payment");
    }
  }

  /**
   * Confirm mock payment for development
   */
  private async confirmMockPayment(
    paymentIntentId: string
  ): Promise<PaymentConfirmation> {
    // Extract booking ID from mock payment intent (if available)
    // For now, we'll simulate success without a specific booking
    const mockReceiptUrl = `https://mock-receipts.com/receipt/${paymentIntentId}`;

    return {
      paymentIntentId,
      status: "succeeded",
      bookingId: "mock_booking", // This would be extracted from metadata in real implementation
      amount: 100, // Mock amount
      receiptUrl: mockReceiptUrl,
    };
  }

  /**
   * Process mock payment - simulates the entire payment flow
   */
  async processMockPayment(
    bookingId: string,
    amount: number
  ): Promise<PaymentConfirmation> {
    console.log(
      `🔧 Processing mock payment for booking ${bookingId}: $${amount}`
    );

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Use mock booking service to handle payment
    const result = await mockBookingService.processPayment(bookingId, amount);

    if (result.success) {
      return {
        paymentIntentId: result.paymentIntentId!,
        status: "succeeded",
        bookingId,
        amount,
        receiptUrl: result.receiptUrl,
      };
    } else {
      return {
        paymentIntentId: "pi_mock_failed",
        status: "failed",
        bookingId,
        amount,
      };
    }
  }

  /**
   * Handle Stripe webhook events
   */
  async handleWebhook(payload: string, signature: string): Promise<void> {
    // Skip webhook processing in mock mode
    if (USE_MOCK_DATA || SKIP_STRIPE_PAYMENT) {
      console.log("🔧 Skipping webhook processing in mock mode");
      return;
    }

    try {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!webhookSecret) {
        throw new Error("Webhook secret not configured");
      }

      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret
      );

      switch (event.type) {
        case "payment_intent.succeeded":
          await this.handlePaymentSucceeded(
            event.data.object as Stripe.PaymentIntent
          );
          break;
        case "payment_intent.payment_failed":
          await this.handlePaymentFailed(
            event.data.object as Stripe.PaymentIntent
          );
          break;
        case "payment_intent.canceled":
          await this.handlePaymentCanceled(
            event.data.object as Stripe.PaymentIntent
          );
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error("Error handling webhook:", error);
      throw new Error("Failed to handle webhook");
    }
  }

  /**
   * Handle successful payment
   */
  private async handlePaymentSucceeded(
    paymentIntent: Stripe.PaymentIntent
  ): Promise<void> {
    try {
      const bookingId = paymentIntent.metadata?.bookingId;
      if (!bookingId) {
        console.error("Booking ID not found in payment metadata");
        return;
      }

      // Update booking status to confirmed
      await bookingService.updateBookingStatus(bookingId, "confirmed");

      // Add payment information to booking
      await bookingService.updateBookingPayment(bookingId, {
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: "completed",
        paymentMethod: paymentIntent.payment_method as string,
        receiptUrl:
          (paymentIntent as Stripe.PaymentIntent).charges?.data?.[0]
            ?.receipt_url || undefined,
      });

      console.log(`Payment succeeded for booking ${bookingId}`);
    } catch (error) {
      console.error("Error handling payment success:", error);
    }
  }

  /**
   * Handle failed payment
   */
  private async handlePaymentFailed(
    paymentIntent: Stripe.PaymentIntent
  ): Promise<void> {
    try {
      const bookingId = paymentIntent.metadata?.bookingId;
      if (!bookingId) {
        console.error("Booking ID not found in payment metadata");
        return;
      }

      // Update booking status to failed
      await bookingService.updateBookingStatus(bookingId, "cancelled");

      console.log(`Payment failed for booking ${bookingId}`);
    } catch (error) {
      console.error("Error handling payment failure:", error);
    }
  }

  /**
   * Handle canceled payment
   */
  private async handlePaymentCanceled(
    paymentIntent: Stripe.PaymentIntent
  ): Promise<void> {
    try {
      const bookingId = paymentIntent.metadata?.bookingId;
      if (!bookingId) {
        console.error("Booking ID not found in payment metadata");
        return;
      }

      // Update booking status to cancelled
      await bookingService.updateBookingStatus(bookingId, "cancelled");

      console.log(`Payment canceled for booking ${bookingId}`);
    } catch (error) {
      console.error("Error handling payment cancellation:", error);
    }
  }

  /**
   * Refund a payment
   */
  async refundPayment(
    paymentIntentId: string,
    amount?: number
  ): Promise<Stripe.Refund> {
    // Skip refund in mock mode
    if (USE_MOCK_DATA || SKIP_STRIPE_PAYMENT) {
      console.log("🔧 Mock refund processed");
      return {
        id: "re_mock_refund",
        amount: amount || 0,
        currency: "usd",
        status: "succeeded",
      } as unknown as Stripe.Refund;
    }

    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
      });

      return refund;
    } catch (error) {
      console.error("Error creating refund:", error);
      throw new Error("Failed to create refund");
    }
  }

  /**
   * Get customer payment methods
   */
  async getCustomerPaymentMethods(
    customerId: string
  ): Promise<Stripe.PaymentMethod[]> {
    // Return empty array in mock mode
    if (USE_MOCK_DATA || SKIP_STRIPE_PAYMENT) {
      return [];
    }

    try {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: "card",
      });

      return paymentMethods.data;
    } catch (error) {
      console.error("Error retrieving payment methods:", error);
      throw new Error("Failed to retrieve payment methods");
    }
  }

  /**
   * Create checkout session
   */
  async createCheckoutSession(paymentData: PaymentData): Promise<string> {
    // Return mock URL in mock mode
    if (USE_MOCK_DATA || SKIP_STRIPE_PAYMENT) {
      console.log("🔧 Creating mock checkout session");
      return `https://mock-checkout.com/session/${paymentData.bookingId}`;
    }

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: paymentData.currency,
              product_data: {
                name: `Booking ${paymentData.bookingId}`,
              },
              unit_amount: Math.round(paymentData.amount * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/cancel`,
        customer_email: paymentData.customerEmail,
        metadata: {
          bookingId: paymentData.bookingId,
          ...paymentData.metadata,
        },
      });

      return session.url || "";
    } catch (error) {
      console.error("Error creating checkout session:", error);
      throw new Error("Failed to create checkout session");
    }
  }
}

export const paymentService = new PaymentService();
