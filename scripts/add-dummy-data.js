const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();

// Dummy data for properties
const properties = [
  {
    title: "Luxury Villa with Pool",
    description:
      "Stunning modern villa with infinity pool, offering breathtaking views of the city skyline. Perfect for luxury getaways and special occasions.",
    location: {
      address: "123 Marina Boulevard",
      city: "Dubai",
      state: "Dubai",
      country: "UAE",
      coordinates: { lat: 25.076, lng: 55.1297 },
    },
    propertyType: "villa",
    capacity: {
      bedrooms: 4,
      bathrooms: 3,
      maxGuests: 8,
    },
    amenities: [
      "WiFi",
      "Pool",
      "Air Conditioning",
      "Kitchen",
      "Parking",
      "Security",
      "Garden",
      "Terrace",
      "BBQ Area",
      "Gym",
      "Spa",
      "Concierge",
    ],
    images: [
      "/media/DSC01806 HDR June 25 2025/DSC01970-HDR.jpg",
      "/media/DSC01806 HDR June 25 2025/DSC01939-HDR.jpg",
      "/media/Close Ups June 25 2025/DSC01964.jpg",
      "/media/DSC01806 HDR June 25 2025/DSC01884-HDR.jpg",
    ],
    pricing: {
      basePrice: 450,
      currency: "USD",
      cleaningFee: 50,
      serviceFee: 25,
    },
    availability: {
      isActive: true,
      minimumStay: 2,
      maximumStay: 14,
    },
    owner: {
      uid: "owner1",
      name: "Sarah Johnson",
      email: "sarah@example.com",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    title: "Modern Downtown Apartment",
    description:
      "Chic apartment in the heart of downtown, walking distance to major attractions, restaurants, and business districts.",
    location: {
      address: "456 Business Bay Drive",
      city: "Dubai",
      state: "Dubai",
      country: "UAE",
      coordinates: { lat: 25.1865, lng: 55.2654 },
    },
    propertyType: "apartment",
    capacity: {
      bedrooms: 2,
      bathrooms: 2,
      maxGuests: 4,
    },
    amenities: [
      "WiFi",
      "Air Conditioning",
      "Kitchen",
      "Laundry",
      "Balcony",
      "City View",
      "Elevator",
      "Security",
      "Gym",
      "Pool",
    ],
    images: [
      "/media/DSC01806 HDR June 25 2025/DSC01929-HDR.jpg",
      "/media/Close Ups June 25 2025/DSC01835.jpg",
      "/media/DSC01806 HDR June 25 2025/DSC01884-HDR.jpg",
      "/media/DSC01806 HDR June 25 2025/DSC01970-HDR.jpg",
    ],
    pricing: {
      basePrice: 250,
      currency: "USD",
      cleaningFee: 30,
      serviceFee: 15,
    },
    availability: {
      isActive: true,
      minimumStay: 1,
      maximumStay: 30,
    },
    owner: {
      uid: "owner2",
      name: "Michael Chen",
      email: "michael@example.com",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    title: "Beachfront Condo",
    description:
      "Spectacular beachfront condominium with direct beach access and panoramic ocean views. Perfect for romantic getaways.",
    location: {
      address: "789 Jumeirah Beach Road",
      city: "Dubai",
      state: "Dubai",
      country: "UAE",
      coordinates: { lat: 25.2084, lng: 55.2719 },
    },
    propertyType: "condo",
    capacity: {
      bedrooms: 3,
      bathrooms: 2,
      maxGuests: 6,
    },
    amenities: [
      "WiFi",
      "Beach Access",
      "Ocean View",
      "Pool",
      "Air Conditioning",
      "Kitchen",
      "Balcony",
      "Parking",
      "Security",
      "Spa",
      "Restaurant",
    ],
    images: [
      "/media/DSC01806 HDR June 25 2025/DSC01939-HDR.jpg",
      "/media/DSC01806 HDR June 25 2025/DSC01970-HDR.jpg",
      "/media/Close Ups June 25 2025/DSC01964.jpg",
      "/media/DSC01806 HDR June 25 2025/DSC01929-HDR.jpg",
    ],
    pricing: {
      basePrice: 380,
      currency: "USD",
      cleaningFee: 40,
      serviceFee: 20,
    },
    availability: {
      isActive: true,
      minimumStay: 2,
      maximumStay: 21,
    },
    owner: {
      uid: "owner3",
      name: "Emma Rodriguez",
      email: "emma@example.com",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    title: "Executive Penthouse",
    description:
      "Luxurious penthouse with private rooftop terrace, perfect for entertaining and business stays.",
    location: {
      address: "321 Sheikh Zayed Road",
      city: "Dubai",
      state: "Dubai",
      country: "UAE",
      coordinates: { lat: 25.1972, lng: 55.2744 },
    },
    propertyType: "apartment",
    capacity: {
      bedrooms: 5,
      bathrooms: 4,
      maxGuests: 10,
    },
    amenities: [
      "WiFi",
      "Private Terrace",
      "City View",
      "Jacuzzi",
      "Air Conditioning",
      "Kitchen",
      "Dining Room",
      "Office",
      "Gym",
      "Concierge",
      "Valet",
    ],
    images: [
      "/media/Close Ups June 25 2025/DSC01835.jpg",
      "/media/DSC01806 HDR June 25 2025/DSC01884-HDR.jpg",
      "/media/DSC01806 HDR June 25 2025/DSC01970-HDR.jpg",
      "/media/DSC01806 HDR June 25 2025/DSC01939-HDR.jpg",
    ],
    pricing: {
      basePrice: 650,
      currency: "USD",
      cleaningFee: 80,
      serviceFee: 35,
    },
    availability: {
      isActive: true,
      minimumStay: 3,
      maximumStay: 30,
    },
    owner: {
      uid: "owner4",
      name: "David Wilson",
      email: "david@example.com",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    title: "Cozy Garden House",
    description:
      "Charming house with beautiful garden, perfect for families and nature lovers seeking tranquility.",
    location: {
      address: "555 Al Barsha Street",
      city: "Dubai",
      state: "Dubai",
      country: "UAE",
      coordinates: { lat: 25.114, lng: 55.1969 },
    },
    propertyType: "house",
    capacity: {
      bedrooms: 3,
      bathrooms: 2,
      maxGuests: 6,
    },
    amenities: [
      "WiFi",
      "Garden",
      "BBQ Area",
      "Air Conditioning",
      "Kitchen",
      "Laundry",
      "Parking",
      "Pet Friendly",
      "Playground",
      "Terrace",
    ],
    images: [
      "/media/DSC01806 HDR June 25 2025/DSC01929-HDR.jpg",
      "/media/Close Ups June 25 2025/DSC01964.jpg",
      "/media/DSC01806 HDR June 25 2025/DSC01884-HDR.jpg",
      "/media/DSC01806 HDR June 25 2025/DSC01970-HDR.jpg",
    ],
    pricing: {
      basePrice: 200,
      currency: "USD",
      cleaningFee: 25,
      serviceFee: 12,
    },
    availability: {
      isActive: true,
      minimumStay: 1,
      maximumStay: 28,
    },
    owner: {
      uid: "owner5",
      name: "Lisa Thompson",
      email: "lisa@example.com",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Dummy users for bookings
const users = [
  {
    uid: "user1",
    email: "alice@example.com",
    displayName: "Alice Johnson",
    profile: {
      firstName: "Alice",
      lastName: "Johnson",
      phone: "+1234567890",
      nationality: "American",
    },
    preferences: {
      currency: "USD",
      language: "en",
      emailNotifications: true,
      smsNotifications: false,
    },
    bookingHistory: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    uid: "user2",
    email: "bob@example.com",
    displayName: "Bob Smith",
    profile: {
      firstName: "Bob",
      lastName: "Smith",
      phone: "+1234567891",
      nationality: "British",
    },
    preferences: {
      currency: "USD",
      language: "en",
      emailNotifications: true,
      smsNotifications: true,
    },
    bookingHistory: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    uid: "user3",
    email: "carol@example.com",
    displayName: "Carol Davis",
    profile: {
      firstName: "Carol",
      lastName: "Davis",
      phone: "+1234567892",
      nationality: "Canadian",
    },
    preferences: {
      currency: "USD",
      language: "en",
      emailNotifications: false,
      smsNotifications: true,
    },
    bookingHistory: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Function to generate date ranges
const generateDateRange = (startDaysFromNow, nights) => {
  const checkIn = new Date();
  checkIn.setDate(checkIn.getDate() + startDaysFromNow);

  const checkOut = new Date(checkIn);
  checkOut.setDate(checkOut.getDate() + nights);

  return {
    checkIn: checkIn.toISOString().split("T")[0],
    checkOut: checkOut.toISOString().split("T")[0],
    nights,
  };
};

// Function to calculate pricing
const calculatePricing = (basePrice, nights, cleaningFee, serviceFee) => {
  const subtotal = basePrice * nights;
  const taxes = subtotal * 0.08; // 8% tax
  const total = subtotal + cleaningFee + serviceFee + taxes;

  return {
    basePrice,
    totalNights: nights,
    subtotal,
    cleaningFee,
    serviceFee,
    taxes: parseFloat(taxes.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
    currency: "USD",
  };
};

// Function to add all data to Firestore
async function addDummyData() {
  try {
    console.log("Starting to add dummy data...");

    // Add properties
    console.log("Adding properties...");
    const propertyRefs = [];
    for (const property of properties) {
      const docRef = await db.collection("properties").add(property);
      propertyRefs.push({ id: docRef.id, ...property });
      console.log(`Added property: ${property.title}`);
    }

    // Add users
    console.log("Adding users...");
    for (const user of users) {
      await db.collection("users").doc(user.uid).set(user);
      console.log(`Added user: ${user.displayName}`);
    }

    // Add bookings with different statuses and payment states
    console.log("Adding bookings...");
    const bookingStatuses = ["pending", "confirmed", "completed", "cancelled"];
    const paymentStatuses = ["pending", "completed", "failed", "canceled"];

    const bookings = [];

    // Create 15 bookings with varied data
    for (let i = 0; i < 15; i++) {
      const property = propertyRefs[i % propertyRefs.length];
      const user = users[i % users.length];
      const dateRange = generateDateRange(
        Math.floor(Math.random() * 60) - 30, // -30 to +30 days from now
        Math.floor(Math.random() * 7) + 1 // 1 to 7 nights
      );

      const pricing = calculatePricing(
        property.pricing.basePrice,
        dateRange.nights,
        property.pricing.cleaningFee,
        property.pricing.serviceFee
      );

      const bookingStatus =
        bookingStatuses[Math.floor(Math.random() * bookingStatuses.length)];
      let paymentStatus =
        paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];

      // Ensure logical consistency between booking and payment status
      if (bookingStatus === "confirmed" || bookingStatus === "completed") {
        paymentStatus = "completed";
      } else if (bookingStatus === "cancelled") {
        paymentStatus = Math.random() > 0.5 ? "refunded" : "canceled";
      }

      const booking = {
        propertyId: property.id,
        guest: {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          phone: user.profile.phone,
        },
        dates: dateRange,
        guests: {
          adults: Math.floor(Math.random() * 4) + 1,
          children: Math.floor(Math.random() * 3),
          infants: Math.floor(Math.random() * 2),
          total: 0,
        },
        pricing,
        status: bookingStatus,
        payment: {
          status: paymentStatus,
          amount: pricing.total,
          currency: pricing.currency,
          paymentIntentId:
            paymentStatus === "completed"
              ? `pi_${Math.random().toString(36).substring(7)}`
              : undefined,
          paymentMethod: paymentStatus === "completed" ? "card" : undefined,
          receiptUrl:
            paymentStatus === "completed"
              ? `https://pay.stripe.com/receipts/${Math.random()
                  .toString(36)
                  .substring(7)}`
              : undefined,
          processedAt:
            paymentStatus === "completed"
              ? new Date().toISOString()
              : undefined,
        },
        specialRequests: i % 3 === 0 ? "Early check-in if possible" : undefined,
        createdAt: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Calculate total guests
      booking.guests.total =
        booking.guests.adults +
        booking.guests.children +
        booking.guests.infants;

      const docRef = await db.collection("bookings").add(booking);
      bookings.push({ id: docRef.id, ...booking });
      console.log(`Added booking: ${booking.guest.name} - ${property.title}`);
    }

    // Add availability records (blocked dates for confirmed bookings)
    console.log("Adding availability records...");
    for (const booking of bookings) {
      if (booking.status === "confirmed" || booking.status === "completed") {
        const checkInDate = new Date(booking.dates.checkIn);
        const checkOutDate = new Date(booking.dates.checkOut);

        // Block each date from check-in to check-out (excluding check-out date)
        const currentDate = new Date(checkInDate);
        while (currentDate < checkOutDate) {
          const dateString = currentDate.toISOString().split("T")[0];

          await db.collection("availability").add({
            propertyId: booking.propertyId,
            date: dateString,
            bookingId: booking.id,
            blocked: true,
            createdAt: new Date().toISOString(),
          });

          currentDate.setDate(currentDate.getDate() + 1);
        }
        console.log(`Added availability blocks for booking: ${booking.id}`);
      }
    }

    // Add some admin notifications
    console.log("Adding admin notifications...");
    const notifications = [
      {
        type: "booking_created",
        title: "New Booking Received",
        message: `A new booking has been created for ${propertyRefs[0].title}`,
        data: { bookingId: bookings[0].id, propertyId: propertyRefs[0].id },
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      {
        type: "payment_completed",
        title: "Payment Successful",
        message: `Payment completed for booking ${bookings[1].id}`,
        data: { bookingId: bookings[1].id, amount: bookings[1].pricing.total },
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      {
        type: "booking_cancelled",
        title: "Booking Cancelled",
        message: `Booking ${bookings[2].id} has been cancelled`,
        data: { bookingId: bookings[2].id },
        isRead: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    for (const notification of notifications) {
      await db.collection("admin_notifications").add(notification);
      console.log(`Added notification: ${notification.title}`);
    }

    console.log("\n✅ Successfully added all dummy data!");
    console.log(`📊 Summary:`);
    console.log(`   - ${properties.length} properties`);
    console.log(`   - ${users.length} users`);
    console.log(`   - ${bookings.length} bookings`);
    console.log(`   - ${notifications.length} admin notifications`);
    console.log(`   - Availability records for confirmed bookings`);
  } catch (error) {
    console.error("Error adding dummy data:", error);
  }
}

// Run the script
addDummyData()
  .then(() => {
    console.log("Script completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
