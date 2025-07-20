/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { setGlobalOptions } from "firebase-functions";
import { onCall } from "firebase-functions/v2/https";
import {
  onDocumentCreated,
  onDocumentUpdated,
} from "firebase-functions/v2/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";

// Initialize Firebase Admin
admin.initializeApp();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Firestore and Auth references
const db = admin.firestore();

// ========== Booking Workflow Functions ==========

// Trigger when a new booking is created
export const onBookingCreated = onDocumentCreated(
  "bookings/{bookingId}",
  async (event) => {
    const booking = event.data?.data();
    const bookingId = event.params.bookingId;

    if (!booking) {
      logger.error("No booking data found");
      return;
    }

    try {
      // Create admin notification
      await db.collection("admin_notifications").add({
        type: "NEW_BOOKING",
        title: "New Booking Received",
        message: `New booking ${bookingId} for property ${booking.propertyId}`,
        bookingId: bookingId,
        propertyId: booking.propertyId,
        userId: booking.userId,
        isRead: false,
        priority: "HIGH",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Update property availability
      await updatePropertyAvailability(
        booking.propertyId,
        booking.checkInDate,
        booking.checkOutDate,
        true
      );

      logger.info(`Booking ${bookingId} processed successfully`);
    } catch (error) {
      logger.error("Error processing new booking:", error);
    }
  }
);

// Trigger when booking status changes
export const onBookingUpdated = onDocumentUpdated(
  "bookings/{bookingId}",
  async (event) => {
    const beforeData = event.data?.before.data();
    const afterData = event.data?.after.data();
    const bookingId = event.params.bookingId;

    if (!beforeData || !afterData) return;

    // Check if status changed
    if (beforeData.status !== afterData.status) {
      try {
        switch (afterData.status) {
          case "confirmed":
            await handleBookingConfirmed(bookingId, afterData);
            break;
          case "cancelled":
            await handleBookingCancelled(bookingId, afterData);
            break;
          case "completed":
            await handleBookingCheckedOut(bookingId, afterData);
            break;
        }
      } catch (error) {
        logger.error(
          `Error handling booking status change for ${bookingId}:`,
          error
        );
      }
    }
  }
);

// ========== Payment Functions ==========

// Callable function to create payment intent
export const createPaymentIntent = onCall(async (request) => {
  const { bookingId, amount, currency = "usd" } = request.data;

  if (!request.auth) {
    throw new Error("Authentication required");
  }

  try {
    // Verify booking belongs to user
    const bookingDoc = await db.collection("bookings").doc(bookingId).get();
    if (!bookingDoc.exists || bookingDoc.data()?.userId !== request.auth.uid) {
      throw new Error("Booking not found or unauthorized");
    }

    // Here you would integrate with Stripe or your payment processor
    // For now, returning a mock response
    const paymentIntent = {
      id: `pi_mock_${Date.now()}`,
      client_secret: `pi_mock_${Date.now()}_secret`,
      amount: amount,
      currency: currency,
    };

    // Update booking with payment intent
    await db.collection("bookings").doc(bookingId).update({
      paymentIntentId: paymentIntent.id,
      paymentStatus: "PROCESSING",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return paymentIntent;
  } catch (error) {
    logger.error("Error creating payment intent:", error);
    throw error;
  }
});

// ========== Notification Functions ==========

// Send email notifications (placeholder - integrate with your email service)
export const sendEmailNotification = onCall(async (request) => {
  const { to, subject } = request.data;

  if (!request.auth) {
    throw new Error("Authentication required");
  }

  try {
    // Here you would integrate with your email service (SendGrid, Mailgun, etc.)
    logger.info(`Email would be sent to ${to} with subject: ${subject}`);

    // Mock implementation
    return { success: true, messageId: `msg_${Date.now()}` };
  } catch (error) {
    logger.error("Error sending email:", error);
    throw error;
  }
});

// ========== Data Management Functions ==========

// Callable function to validate and clean property data
export const validatePropertyData = onCall(async (request) => {
  const { propertyData } = request.data;

  if (!request.auth) {
    throw new Error("Authentication required");
  }

  try {
    // Validate required fields
    const requiredFields = [
      "title",
      "description",
      "locationCity",
      "capacityMaxGuests",
      "basePrice",
    ];
    const missingFields = requiredFields.filter(
      (field) => !propertyData[field]
    );

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    // Validate data types and ranges
    if (
      typeof propertyData.basePrice !== "number" ||
      propertyData.basePrice <= 0
    ) {
      throw new Error("Base price must be a positive number");
    }

    if (
      typeof propertyData.capacityMaxGuests !== "number" ||
      propertyData.capacityMaxGuests < 1
    ) {
      throw new Error("Max guests must be a positive number");
    }

    // Generate slug from title
    const slug = propertyData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    return {
      isValid: true,
      cleanedData: {
        ...propertyData,
        slug: slug,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
    };
  } catch (error) {
    logger.error("Error validating property data:", error);
    return {
      isValid: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
});

// ========== Scheduled Functions ==========

// Daily cleanup of expired availability records
export const cleanupExpiredAvailability = onSchedule("0 2 * * *", async () => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const expiredQuery = db
      .collection("availability")
      .where("date", "<", yesterday)
      .where("isBooked", "==", false);

    const snapshot = await expiredQuery.get();

    if (snapshot.empty) {
      logger.info("No expired availability records to clean up");
      return;
    }

    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    logger.info(`Cleaned up ${snapshot.size} expired availability records`);
  } catch (error) {
    logger.error("Error cleaning up expired availability:", error);
  }
});

// ========== Helper Functions ==========

async function updatePropertyAvailability(
  propertyId: string,
  checkInDate: any,
  checkOutDate: any,
  isBooked: boolean
) {
  const batch = db.batch();

  const startDate = new Date(checkInDate.toDate());
  const endDate = new Date(checkOutDate.toDate());

  for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
    const availabilityRef = db.collection("availability").doc();
    batch.set(
      availabilityRef,
      {
        propertyId: propertyId,
        date: admin.firestore.Timestamp.fromDate(new Date(d)),
        isBooked: isBooked,
        isBlocked: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  }

  await batch.commit();
}

async function handleBookingConfirmed(bookingId: string, booking: any) {
  // Create admin notification
  await db.collection("admin_notifications").add({
    type: "BOOKING_CONFIRMED",
    title: "Booking Confirmed",
    message: `Booking ${bookingId} has been confirmed`,
    bookingId: bookingId,
    propertyId: booking.propertyId,
    userId: booking.userId,
    isRead: false,
    priority: "MEDIUM",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  logger.info(`Booking ${bookingId} confirmed`);
}

async function handleBookingCancelled(bookingId: string, booking: any) {
  // Free up the availability
  await updatePropertyAvailability(
    booking.propertyId,
    booking.checkInDate,
    booking.checkOutDate,
    false
  );

  // Create admin notification
  await db.collection("admin_notifications").add({
    type: "BOOKING_CANCELLED",
    title: "Booking Cancelled",
    message: `Booking ${bookingId} has been cancelled`,
    bookingId: bookingId,
    propertyId: booking.propertyId,
    userId: booking.userId,
    isRead: false,
    priority: "HIGH",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  logger.info(`Booking ${bookingId} cancelled`);
}

async function handleBookingCheckedOut(bookingId: string, booking: any) {
  // Create admin notification
  await db.collection("admin_notifications").add({
    type: "CHECKOUT_COMPLETED",
    title: "Guest Checked Out",
    message: `Guest has checked out from booking ${bookingId}`,
    bookingId: bookingId,
    propertyId: booking.propertyId,
    userId: booking.userId,
    isRead: false,
    priority: "MEDIUM",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  logger.info(`Booking ${bookingId} checked out`);
}
