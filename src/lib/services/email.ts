import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Booking, Property } from "@/lib/types/firebase";

export interface EmailData {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  html: string;
  text?: string;
  attachments?: {
    filename: string;
    content: string;
    encoding?: string;
  }[];
}

export class EmailService {
  private static instance: EmailService;
  private emailCollection = collection(db, "mail");

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  // Send email via Firebase Extension
  private async sendEmail(emailData: EmailData): Promise<string> {
    try {
      const docRef = await addDoc(this.emailCollection, {
        ...emailData,
        delivery: {
          startTime: new Date(),
          state: "PENDING",
        },
      });
      return docRef.id;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }

  // Generate booking confirmation email template
  private generateBookingConfirmationTemplate(
    booking: Booking,
    property: Property
  ): { html: string; text: string } {
    const checkInDate = new Date(booking.dates.checkIn).toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );

    const checkOutDate = new Date(booking.dates.checkOut).toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .container {
            background-color: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #8EB69B;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #163832;
            margin-bottom: 10px;
        }
        .confirmation-badge {
            background: linear-gradient(135deg, #8EB69B, #DAF1DE);
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            display: inline-block;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .booking-details {
            background-color: #f8fffe;
            border: 1px solid #DAF1DE;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        .detail-row:last-child {
            border-bottom: none;
            font-weight: bold;
            color: #163832;
            font-size: 18px;
        }
        .property-info {
            background-color: #163832;
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .property-title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .property-location {
            opacity: 0.9;
            margin-bottom: 15px;
        }
        .important-info {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
        }
        .btn {
            display: inline-block;
            background-color: #8EB69B;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 10px 5px;
        }
        .contact-info {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🏡 Expat Stays</div>
            <div class="confirmation-badge">✅ Booking Confirmed</div>
        </div>

        <h2>Dear ${booking.guest.name},</h2>
        
        <p>Great news! Your booking has been confirmed. We're excited to host you at this beautiful property.</p>

        <div class="property-info">
            <div class="property-title">${property.title}</div>
            <div class="property-location">📍 ${property.location.address}, ${
      property.location.city
    }, ${property.location.country}</div>
            <div>🛏️ ${property.capacity.bedrooms} Bedrooms • 🚿 ${
      property.capacity.bathrooms
    } Bathrooms • 👥 Up to ${property.capacity.maxGuests} Guests</div>
        </div>

        <div class="booking-details">
            <h3>Booking Details</h3>
            <div class="detail-row">
                <span>Booking ID:</span>
                <span><strong>${booking.id}</strong></span>
            </div>
            <div class="detail-row">
                <span>Check-in:</span>
                <span>${checkInDate}</span>
            </div>
            <div class="detail-row">
                <span>Check-out:</span>
                <span>${checkOutDate}</span>
            </div>
            <div class="detail-row">
                <span>Duration:</span>
                <span>${booking.dates.nights} nights</span>
            </div>
            <div class="detail-row">
                <span>Guests:</span>
                <span>${booking.guests.adults} Adults${
      booking.guests.children > 0 ? `, ${booking.guests.children} Children` : ""
    }${
      booking.guests.infants > 0 ? `, ${booking.guests.infants} Infants` : ""
    }</span>
            </div>
            <div class="detail-row">
                <span>Total Amount:</span>
                <span>$${booking.pricing.total.toLocaleString()}</span>
            </div>
        </div>

        <div class="important-info">
            <h4>Important Information</h4>
            <ul>
                <li><strong>Check-in time:</strong> 3:00 PM onwards</li>
                <li><strong>Check-out time:</strong> 11:00 AM</li>
                <li><strong>Contact:</strong> We'll send property contact details closer to your arrival date</li>
                <li><strong>Cancellation:</strong> Please review our cancellation policy in your booking terms</li>
            </ul>
        </div>

        ${
          booking.specialRequests
            ? `
        <div class="contact-info">
            <h4>Your Special Requests</h4>
            <p>${booking.specialRequests}</p>
            <p><em>We've noted your requests and will do our best to accommodate them.</em></p>
        </div>
        `
            : ""
        }

        <div style="text-align: center; margin: 30px 0;">
            <a href="#" class="btn">View Booking Details</a>
            <a href="#" class="btn" style="background-color: #163832;">Contact Support</a>
        </div>

        <div class="footer">
            <p>Thank you for choosing Expat Stays!</p>
            <p>If you have any questions, please don't hesitate to contact our support team.</p>
            <p style="font-size: 12px; margin-top: 20px;">
                This is an automated message. Please do not reply to this email.<br>
                © 2024 Expat Stays. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>`;

    const text = `
BOOKING CONFIRMATION - Expat Stays

Dear ${booking.guest.name},

Your booking has been confirmed!

PROPERTY DETAILS:
${property.title}
${property.location.address}, ${property.location.city}, ${
      property.location.country
    }

BOOKING DETAILS:
- Booking ID: ${booking.id}
- Check-in: ${checkInDate}
- Check-out: ${checkOutDate}
- Duration: ${booking.dates.nights} nights
- Guests: ${booking.guests.adults} Adults${
      booking.guests.children > 0 ? `, ${booking.guests.children} Children` : ""
    }${booking.guests.infants > 0 ? `, ${booking.guests.infants} Infants` : ""}
- Total Amount: $${booking.pricing.total.toLocaleString()}

IMPORTANT INFORMATION:
- Check-in time: 3:00 PM onwards
- Check-out time: 11:00 AM
- Contact details will be sent closer to your arrival date

${
  booking.specialRequests
    ? `SPECIAL REQUESTS:\n${booking.specialRequests}\n\n`
    : ""
}

Thank you for choosing Expat Stays!

If you have any questions, please contact our support team.

---
This is an automated message. Please do not reply to this email.
© 2024 Expat Stays. All rights reserved.
`;

    return { html, text };
  }

  // Generate admin notification email template
  private generateAdminNotificationTemplate(
    booking: Booking,
    property: Property
  ): { html: string; text: string } {
    const checkInDate = new Date(booking.dates.checkIn).toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Booking Alert</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .container {
            background-color: white;
            border-radius: 8px;
            padding: 25px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .alert-header {
            background: linear-gradient(135deg, #ff6b6b, #ffa726);
            color: white;
            padding: 15px;
            border-radius: 6px;
            text-align: center;
            margin-bottom: 20px;
        }
        .booking-summary {
            background-color: #f8f9fa;
            border-left: 4px solid #8EB69B;
            padding: 15px;
            margin: 15px 0;
        }
        .quick-actions {
            text-align: center;
            margin: 25px 0;
        }
        .btn {
            display: inline-block;
            background-color: #8EB69B;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 4px;
            margin: 5px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="alert-header">
            <h2>🚨 New Booking Alert</h2>
            <p>A new booking has just been confirmed!</p>
        </div>

        <div class="booking-summary">
            <h3>Booking Summary</h3>
            <p><strong>Guest:</strong> ${booking.guest.name} (${
      booking.guest.email
    })</p>
            <p><strong>Property:</strong> ${property.title}</p>
            <p><strong>Check-in:</strong> ${checkInDate}</p>
            <p><strong>Nights:</strong> ${booking.dates.nights}</p>
            <p><strong>Guests:</strong> ${booking.guests.total}</p>
            <p><strong>Total Revenue:</strong> $${booking.pricing.total.toLocaleString()}</p>
            <p><strong>Booking ID:</strong> ${booking.id}</p>
        </div>

        <div class="quick-actions">
            <a href="#" class="btn">View Full Booking</a>
            <a href="#" class="btn" style="background-color: #163832;">Admin Dashboard</a>
        </div>

        <p style="text-align: center; color: #666; font-size: 14px; margin-top: 30px;">
            This notification was sent automatically when a new booking was confirmed.
        </p>
    </div>
</body>
</html>`;

    const text = `NEW BOOKING ALERT - Expat Stays Admin

A new booking has been confirmed!

BOOKING SUMMARY:
- Guest: ${booking.guest.name} (${booking.guest.email})
- Property: ${property.title}
- Check-in: ${checkInDate}
- Nights: ${booking.dates.nights}
- Guests: ${booking.guests.total}
- Total Revenue: $${booking.pricing.total.toLocaleString()}
- Booking ID: ${booking.id}

Please review the booking in your admin dashboard.

---
This is an automated notification.`;

    return { html, text };
  }

  // Send booking confirmation email to guest
  async sendBookingConfirmation(
    booking: Booking,
    property: Property
  ): Promise<string> {
    try {
      const { html, text } = this.generateBookingConfirmationTemplate(
        booking,
        property
      );

      const emailData: EmailData = {
        to: [booking.guest.email],
        subject: `Booking Confirmed - ${property.title}`,
        html,
        text,
      };

      return await this.sendEmail(emailData);
    } catch (error) {
      console.error("Error sending booking confirmation:", error);
      throw error;
    }
  }

  // Send admin notification email
  async sendAdminNotification(
    booking: Booking,
    property: Property,
    adminEmails: string[]
  ): Promise<string> {
    try {
      const { html, text } = this.generateAdminNotificationTemplate(
        booking,
        property
      );

      const emailData: EmailData = {
        to: adminEmails,
        subject: `New Booking Alert - ${property.title}`,
        html,
        text,
      };

      return await this.sendEmail(emailData);
    } catch (error) {
      console.error("Error sending admin notification:", error);
      throw error;
    }
  }

  // Send booking cancellation email
  async sendBookingCancellation(
    booking: Booking,
    property: Property
  ): Promise<string> {
    try {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #dc2626;">Booking Cancelled</h2>
          <p>Dear ${booking.guest.name},</p>
          <p>Your booking for <strong>${property.title}</strong> has been cancelled.</p>
          <p><strong>Booking ID:</strong> ${booking.id}</p>
          <p>If you have any questions, please contact our support team.</p>
          <p>Best regards,<br>Expat Stays Team</p>
        </div>
      `;

      const emailData: EmailData = {
        to: [booking.guest.email],
        subject: `Booking Cancelled - ${property.title}`,
        html,
        text: `Your booking for ${property.title} has been cancelled. Booking ID: ${booking.id}`,
      };

      return await this.sendEmail(emailData);
    } catch (error) {
      console.error("Error sending cancellation email:", error);
      throw error;
    }
  }

  // Send booking reminder email (for check-in)
  async sendBookingReminder(
    booking: Booking,
    property: Property,
    daysUntilCheckIn: number
  ): Promise<string> {
    try {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #8EB69B;">Your Trip is Coming Up!</h2>
          <p>Dear ${booking.guest.name},</p>
          <p>This is a friendly reminder that your check-in date for <strong>${
            property.title
          }</strong> is in ${daysUntilCheckIn} day${
        daysUntilCheckIn > 1 ? "s" : ""
      }.</p>
          <p><strong>Check-in Date:</strong> ${new Date(
            booking.dates.checkIn
          ).toLocaleDateString()}</p>
          <p><strong>Property Address:</strong> ${property.location.address}</p>
          <p>We're excited to host you!</p>
          <p>Best regards,<br>Expat Stays Team</p>
        </div>
      `;

      const emailData: EmailData = {
        to: [booking.guest.email],
        subject: `Reminder: Your stay at ${property.title} is coming up!`,
        html,
        text: `Reminder: Your check-in at ${
          property.title
        } is in ${daysUntilCheckIn} day${
          daysUntilCheckIn > 1 ? "s" : ""
        }. Check-in date: ${new Date(
          booking.dates.checkIn
        ).toLocaleDateString()}`,
      };

      return await this.sendEmail(emailData);
    } catch (error) {
      console.error("Error sending booking reminder:", error);
      throw error;
    }
  }
}

export const emailService = EmailService.getInstance();
