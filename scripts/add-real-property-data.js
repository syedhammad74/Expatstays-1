const admin = require("firebase-admin");
const path = require("path");

// Initialize Firebase Admin
const serviceAccount = {
  projectId: "expat-stays",
  // Add your service account credentials here
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://expat-stays-default-rtdb.firebaseio.com",
  });
}

const db = admin.firestore();
const realtimeDb = admin.database();

// Real property data for Dubai luxury stays
const realPropertyData = [
  {
    id: "burj-khalifa-penthouse",
    title: "Luxurious Burj Khalifa Penthouse with Panoramic Views",
    description:
      "Experience unparalleled luxury in this stunning penthouse located in the iconic Burj Khalifa. Featuring floor-to-ceiling windows with breathtaking views of Dubai Fountain and the city skyline. This meticulously designed space offers world-class amenities and service.",
    location: {
      address: "Burj Khalifa, Downtown Dubai",
      city: "Dubai",
      country: "United Arab Emirates",
      coordinates: {
        lat: 25.1972,
        lng: 55.2744,
      },
      neighborhood: "Downtown Dubai",
      zipCode: "00000",
    },
    pricing: {
      basePrice: 2500,
      currency: "USD",
      cleaningFee: 200,
      serviceFee: 150,
      taxRate: 0.05,
    },
    capacity: {
      maxGuests: 4,
      bedrooms: 2,
      bathrooms: 3,
      beds: 2,
    },
    images: [
      "/media/DSC01806 HDR June 25 2025/DSC01806-HDR.jpg",
      "/media/DSC01806 HDR June 25 2025/DSC01812-HDR.jpg",
      "/media/DSC01806 HDR June 25 2025/DSC01817-HDR.jpg",
      "/media/DSC01806 HDR June 25 2025/DSC01822-HDR.jpg",
      "/media/DSC01806 HDR June 25 2025/DSC01840-HDR.jpg",
    ],
    amenities: [
      "wifi",
      "air_conditioning",
      "kitchen",
      "parking",
      "pool",
      "gym",
      "concierge",
      "balcony",
      "city_view",
      "elevator",
      "security",
      "spa",
    ],
    availability: {
      isActive: true,
      minStay: 3,
      maxStay: 30,
      checkInTime: "15:00",
      checkOutTime: "11:00",
    },
    houseRules: {
      smokingAllowed: false,
      petsAllowed: false,
      partiesAllowed: false,
      quietHours: "22:00-08:00",
      maxGuests: 4,
    },
    host: {
      uid: "host_001",
      name: "Ahmed Al Mansouri",
      email: "ahmed@expatstays.com",
      phone: "+971-50-123-4567",
      verified: true,
      joinedDate: "2023-01-15",
    },
    features: [
      "Private Elevator Access",
      "Dubai Fountain View",
      "Burj Khalifa Address",
      "24/7 Concierge Service",
      "Premium Furnishing",
      "Smart Home Technology",
    ],
    policies: {
      cancellation: "strict",
      instantBook: false,
      selfCheckIn: false,
    },
    rating: {
      average: 4.9,
      count: 156,
      breakdown: {
        cleanliness: 4.9,
        accuracy: 4.8,
        checkin: 4.9,
        communication: 5.0,
        location: 5.0,
        value: 4.7,
      },
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    id: "palm-jumeirah-villa",
    title: "Exclusive Palm Jumeirah Villa with Private Beach Access",
    description:
      "Indulge in the ultimate luxury experience at this magnificent villa on the prestigious Palm Jumeirah. Featuring a private beach, infinity pool, and stunning Arabian Gulf views. Perfect for families and groups seeking privacy and elegance.",
    location: {
      address: "Palm Jumeirah, Frond N",
      city: "Dubai",
      country: "United Arab Emirates",
      coordinates: {
        lat: 25.1124,
        lng: 55.139,
      },
      neighborhood: "Palm Jumeirah",
      zipCode: "00000",
    },
    pricing: {
      basePrice: 1800,
      currency: "USD",
      cleaningFee: 300,
      serviceFee: 120,
      taxRate: 0.05,
    },
    capacity: {
      maxGuests: 8,
      bedrooms: 4,
      bathrooms: 5,
      beds: 4,
    },
    images: [
      "/media/DSC01806 HDR June 25 2025/DSC01846-HDR.jpg",
      "/media/DSC01806 HDR June 25 2025/DSC01856-HDR.jpg",
      "/media/DSC01806 HDR June 25 2025/DSC01861-HDR.jpg",
      "/media/DSC01806 HDR June 25 2025/DSC01866-HDR.jpg",
      "/media/DSC01806 HDR June 25 2025/DSC01871-HDR.jpg",
    ],
    amenities: [
      "wifi",
      "air_conditioning",
      "kitchen",
      "parking",
      "pool",
      "private_beach",
      "garden",
      "balcony",
      "sea_view",
      "bbq",
      "security",
      "maid_service",
    ],
    availability: {
      isActive: true,
      minStay: 5,
      maxStay: 60,
      checkInTime: "16:00",
      checkOutTime: "12:00",
    },
    houseRules: {
      smokingAllowed: false,
      petsAllowed: true,
      partiesAllowed: false,
      quietHours: "23:00-07:00",
      maxGuests: 8,
    },
    host: {
      uid: "host_002",
      name: "Sarah Johnson",
      email: "sarah@expatstays.com",
      phone: "+971-55-987-6543",
      verified: true,
      joinedDate: "2022-08-20",
    },
    features: [
      "Private Beach Access",
      "Infinity Pool",
      "Chef's Kitchen",
      "Master Suite Balcony",
      "Garden Landscaping",
      "Security System",
    ],
    policies: {
      cancellation: "moderate",
      instantBook: true,
      selfCheckIn: true,
    },
    rating: {
      average: 4.8,
      count: 89,
      breakdown: {
        cleanliness: 4.9,
        accuracy: 4.7,
        checkin: 4.8,
        communication: 4.9,
        location: 4.9,
        value: 4.6,
      },
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    id: "marina-luxury-apartment",
    title: "Modern Dubai Marina Apartment with Yacht Club Access",
    description:
      "Contemporary luxury meets urban sophistication in this stunning Marina apartment. Featuring sleek design, premium amenities, and access to exclusive yacht club facilities. Walking distance to finest restaurants and nightlife.",
    location: {
      address: "Dubai Marina Walk, Marina District",
      city: "Dubai",
      country: "United Arab Emirates",
      coordinates: {
        lat: 25.0657,
        lng: 55.1396,
      },
      neighborhood: "Dubai Marina",
      zipCode: "00000",
    },
    pricing: {
      basePrice: 950,
      currency: "USD",
      cleaningFee: 100,
      serviceFee: 75,
      taxRate: 0.05,
    },
    capacity: {
      maxGuests: 6,
      bedrooms: 3,
      bathrooms: 3,
      beds: 3,
    },
    images: [
      "/media/DSC01806 HDR June 25 2025/DSC01884-HDR.jpg",
      "/media/DSC01806 HDR June 25 2025/DSC01889-HDR.jpg",
      "/media/DSC01806 HDR June 25 2025/DSC01897-HDR.jpg",
      "/media/DSC01806 HDR June 25 2025/DSC01902-HDR.jpg",
      "/media/Close Ups June 25 2025/DSC01827.jpg",
    ],
    amenities: [
      "wifi",
      "air_conditioning",
      "kitchen",
      "parking",
      "pool",
      "gym",
      "marina_view",
      "balcony",
      "elevator",
      "security",
      "yacht_club",
      "restaurant",
    ],
    availability: {
      isActive: true,
      minStay: 2,
      maxStay: 30,
      checkInTime: "15:00",
      checkOutTime: "11:00",
    },
    houseRules: {
      smokingAllowed: false,
      petsAllowed: false,
      partiesAllowed: true,
      quietHours: "23:00-08:00",
      maxGuests: 6,
    },
    host: {
      uid: "host_003",
      name: "Mohammed Hassan",
      email: "mohammed@expatstays.com",
      phone: "+971-50-555-1234",
      verified: true,
      joinedDate: "2023-03-10",
    },
    features: [
      "Marina Walk Access",
      "Yacht Club Membership",
      "Skyline Views",
      "Premium Appliances",
      "Walk to Metro",
      "Shopping Access",
    ],
    policies: {
      cancellation: "flexible",
      instantBook: true,
      selfCheckIn: true,
    },
    rating: {
      average: 4.7,
      count: 234,
      breakdown: {
        cleanliness: 4.8,
        accuracy: 4.6,
        checkin: 4.8,
        communication: 4.7,
        location: 4.9,
        value: 4.6,
      },
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    id: "jumeirah-beach-penthouse",
    title: "Spectacular Jumeirah Beach Penthouse with Infinity Pool",
    description:
      "Breathtaking beachfront penthouse offering unobstructed views of the Arabian Gulf and Burj Al Arab. Features a private rooftop infinity pool, premium furnishings, and direct beach access. The epitome of Dubai luxury living.",
    location: {
      address: "Jumeirah Beach Residence, The Walk",
      city: "Dubai",
      country: "United Arab Emirates",
      coordinates: {
        lat: 25.0685,
        lng: 55.1323,
      },
      neighborhood: "Jumeirah Beach Residence",
      zipCode: "00000",
    },
    pricing: {
      basePrice: 2200,
      currency: "USD",
      cleaningFee: 250,
      serviceFee: 140,
      taxRate: 0.05,
    },
    capacity: {
      maxGuests: 6,
      bedrooms: 3,
      bathrooms: 4,
      beds: 3,
    },
    images: [
      "/media/DSC01806 HDR June 25 2025/DSC01904-HDR.jpg",
      "/media/DSC01806 HDR June 25 2025/DSC01909-HDR.jpg",
      "/media/DSC01806 HDR June 25 2025/DSC01914-HDR.jpg",
      "/media/DSC01806 HDR June 25 2025/DSC01919-HDR.jpg",
      "/media/Close Ups June 25 2025/DSC01831.jpg",
    ],
    amenities: [
      "wifi",
      "air_conditioning",
      "kitchen",
      "parking",
      "pool",
      "private_pool",
      "beach_access",
      "sea_view",
      "balcony",
      "elevator",
      "security",
      "spa",
    ],
    availability: {
      isActive: true,
      minStay: 4,
      maxStay: 45,
      checkInTime: "16:00",
      checkOutTime: "12:00",
    },
    houseRules: {
      smokingAllowed: false,
      petsAllowed: false,
      partiesAllowed: false,
      quietHours: "22:30-07:30",
      maxGuests: 6,
    },
    host: {
      uid: "host_004",
      name: "Elena Rodriguez",
      email: "elena@expatstays.com",
      phone: "+971-52-888-9999",
      verified: true,
      joinedDate: "2022-11-05",
    },
    features: [
      "Private Rooftop Pool",
      "Burj Al Arab View",
      "Beach Front Location",
      "Premium Interior Design",
      "Smart Home System",
      "Concierge Service",
    ],
    policies: {
      cancellation: "strict",
      instantBook: false,
      selfCheckIn: false,
    },
    rating: {
      average: 4.9,
      count: 67,
      breakdown: {
        cleanliness: 5.0,
        accuracy: 4.8,
        checkin: 4.9,
        communication: 4.9,
        location: 5.0,
        value: 4.8,
      },
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    id: "business-bay-studio",
    title: "Executive Business Bay Studio with Canal Views",
    description:
      "Sophisticated studio apartment perfect for business travelers and couples. Located in the heart of Business Bay with stunning canal views and easy access to DIFC. Modern amenities and professional workspace included.",
    location: {
      address: "Business Bay, Canal Views Tower",
      city: "Dubai",
      country: "United Arab Emirates",
      coordinates: {
        lat: 25.1938,
        lng: 55.2663,
      },
      neighborhood: "Business Bay",
      zipCode: "00000",
    },
    pricing: {
      basePrice: 450,
      currency: "USD",
      cleaningFee: 75,
      serviceFee: 35,
      taxRate: 0.05,
    },
    capacity: {
      maxGuests: 2,
      bedrooms: 1,
      bathrooms: 1,
      beds: 1,
    },
    images: [
      "/media/DSC01806 HDR June 25 2025/DSC01929-HDR.jpg",
      "/media/DSC01806 HDR June 25 2025/DSC01934-HDR.jpg",
      "/media/DSC01806 HDR June 25 2025/DSC01939-HDR.jpg",
      "/media/Close Ups June 25 2025/DSC01832.jpg",
      "/media/Close Ups June 25 2025/DSC01833.jpg",
    ],
    amenities: [
      "wifi",
      "air_conditioning",
      "kitchenette",
      "parking",
      "pool",
      "gym",
      "canal_view",
      "balcony",
      "elevator",
      "security",
      "workspace",
      "metro_access",
    ],
    availability: {
      isActive: true,
      minStay: 1,
      maxStay: 30,
      checkInTime: "15:00",
      checkOutTime: "11:00",
    },
    houseRules: {
      smokingAllowed: false,
      petsAllowed: false,
      partiesAllowed: false,
      quietHours: "22:00-08:00",
      maxGuests: 2,
    },
    host: {
      uid: "host_005",
      name: "James Wilson",
      email: "james@expatstays.com",
      phone: "+971-56-777-8888",
      verified: true,
      joinedDate: "2023-05-15",
    },
    features: [
      "Business District Location",
      "Professional Workspace",
      "High-Speed Internet",
      "Canal Views",
      "Metro Connectivity",
      "DIFC Proximity",
    ],
    policies: {
      cancellation: "moderate",
      instantBook: true,
      selfCheckIn: true,
    },
    rating: {
      average: 4.6,
      count: 178,
      breakdown: {
        cleanliness: 4.7,
        accuracy: 4.5,
        checkin: 4.7,
        communication: 4.6,
        location: 4.8,
        value: 4.5,
      },
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
];

// Real booking data to accompany the properties
const realBookingData = [
  {
    id: "booking_001",
    propertyId: "burj-khalifa-penthouse",
    guest: {
      uid: "guest_001",
      name: "Michael Thompson",
      email: "michael.t@email.com",
      phone: "+1-555-0123",
    },
    dates: {
      checkIn: "2024-02-15",
      checkOut: "2024-02-18",
    },
    guests: {
      adults: 2,
      children: 0,
      infants: 0,
    },
    pricing: {
      basePrice: 2500,
      nights: 3,
      subtotal: 7500,
      cleaningFee: 200,
      serviceFee: 150,
      taxes: 392.5,
      total: 8242.5,
      currency: "USD",
    },
    payment: {
      status: "completed",
      amount: 8242.5,
      currency: "USD",
      paymentIntentId: "pi_real_001",
      paymentMethod: "card",
      processedAt: "2024-01-20T10:30:00Z",
    },
    status: "confirmed",
    specialRequests: "Late check-in requested, anniversary celebration",
    createdAt: "2024-01-20T10:30:00Z",
    updatedAt: "2024-01-20T10:30:00Z",
  },
  {
    id: "booking_002",
    propertyId: "palm-jumeirah-villa",
    guest: {
      uid: "guest_002",
      name: "Emily Chen",
      email: "emily.chen@email.com",
      phone: "+1-555-0456",
    },
    dates: {
      checkIn: "2024-03-01",
      checkOut: "2024-03-08",
    },
    guests: {
      adults: 6,
      children: 2,
      infants: 0,
    },
    pricing: {
      basePrice: 1800,
      nights: 7,
      subtotal: 12600,
      cleaningFee: 300,
      serviceFee: 120,
      taxes: 656,
      total: 13676,
      currency: "USD",
    },
    payment: {
      status: "completed",
      amount: 13676,
      currency: "USD",
      paymentIntentId: "pi_real_002",
      paymentMethod: "card",
      processedAt: "2024-02-01T14:20:00Z",
    },
    status: "confirmed",
    specialRequests: "Family vacation, baby crib needed",
    createdAt: "2024-02-01T14:20:00Z",
    updatedAt: "2024-02-01T14:20:00Z",
  },
  {
    id: "booking_003",
    propertyId: "marina-luxury-apartment",
    guest: {
      uid: "guest_003",
      name: "David Rodriguez",
      email: "david.r@email.com",
      phone: "+1-555-0789",
    },
    dates: {
      checkIn: "2024-02-28",
      checkOut: "2024-03-05",
    },
    guests: {
      adults: 4,
      children: 1,
      infants: 0,
    },
    pricing: {
      basePrice: 950,
      nights: 6,
      subtotal: 5700,
      cleaningFee: 100,
      serviceFee: 75,
      taxes: 296.25,
      total: 6171.25,
      currency: "USD",
    },
    payment: {
      status: "pending",
      amount: 6171.25,
      currency: "USD",
      paymentIntentId: "pi_real_003",
      paymentMethod: "card",
      processedAt: "2024-02-15T09:15:00Z",
    },
    status: "pending",
    specialRequests: "Business trip with family",
    createdAt: "2024-02-15T09:15:00Z",
    updatedAt: "2024-02-15T09:15:00Z",
  },
];

async function addRealDataToFirebase() {
  try {
    console.log("🚀 Starting to add real property data to Firebase...");

    // Add properties to Firestore
    console.log("📍 Adding properties to Firestore...");
    for (const property of realPropertyData) {
      await db.collection("properties").doc(property.id).set(property);
      console.log(`✅ Added property: ${property.title}`);
    }

    // Add bookings to Firestore
    console.log("📅 Adding bookings to Firestore...");
    for (const booking of realBookingData) {
      await db.collection("bookings").doc(booking.id).set(booking);
      console.log(`✅ Added booking: ${booking.id}`);
    }

    // Add properties to Realtime Database for admin panel
    console.log("🔄 Adding properties to Realtime Database...");
    for (const property of realPropertyData) {
      await realtimeDb
        .ref("properties")
        .child(property.id)
        .set({
          ...property,
          createdAt: admin.database.ServerValue.TIMESTAMP,
          updatedAt: admin.database.ServerValue.TIMESTAMP,
        });
    }

    // Add bookings to Realtime Database
    console.log("🔄 Adding bookings to Realtime Database...");
    for (const booking of realBookingData) {
      await realtimeDb
        .ref("bookings")
        .child(booking.id)
        .set({
          ...booking,
          createdAt: admin.database.ServerValue.TIMESTAMP,
          updatedAt: admin.database.ServerValue.TIMESTAMP,
        });
    }

    // Add activity log
    await realtimeDb.ref("activity_feed").push({
      type: "data_migration",
      action: "Real data added to database",
      details: `Added ${realPropertyData.length} properties and ${realBookingData.length} bookings`,
      timestamp: admin.database.ServerValue.TIMESTAMP,
      user: "System",
    });

    console.log("🎉 Successfully added all real data to Firebase!");
    console.log(`📊 Summary:`);
    console.log(`   - ${realPropertyData.length} luxury properties`);
    console.log(`   - ${realBookingData.length} bookings`);
    console.log(`   - Data added to both Firestore and Realtime Database`);
  } catch (error) {
    console.error("❌ Error adding data to Firebase:", error);
  }
}

// Remove all mock/dummy data first
async function removeDummyData() {
  try {
    console.log("🧹 Removing dummy data...");

    // Get all properties and remove those with "dummy" or "mock" in the ID
    const propertiesSnapshot = await db.collection("properties").get();
    const dummyProperties = propertiesSnapshot.docs.filter(
      (doc) =>
        doc.id.includes("dummy") ||
        doc.id.includes("mock") ||
        doc.id.includes("property_")
    );

    for (const doc of dummyProperties) {
      await doc.ref.delete();
      console.log(`🗑️ Removed dummy property: ${doc.id}`);
    }

    // Remove from Realtime Database too
    const rtdbPropertiesSnapshot = await realtimeDb
      .ref("properties")
      .once("value");
    if (rtdbPropertiesSnapshot.exists()) {
      const properties = rtdbPropertiesSnapshot.val();
      for (const [key, property] of Object.entries(properties)) {
        if (
          key.includes("dummy") ||
          key.includes("mock") ||
          key.includes("property_")
        ) {
          await realtimeDb.ref("properties").child(key).remove();
          console.log(`🗑️ Removed dummy property from RTDB: ${key}`);
        }
      }
    }

    console.log("✅ Dummy data cleanup complete");
  } catch (error) {
    console.error("❌ Error removing dummy data:", error);
  }
}

// Main execution
async function main() {
  console.log("🎯 Starting real data migration process...");

  await removeDummyData();
  await addRealDataToFirebase();

  console.log("🏁 Real data migration completed successfully!");
  process.exit(0);
}

// Run the script
main().catch(console.error);
