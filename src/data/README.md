# Mock Data System 🎯

This directory contains the mock data system for ExpatsStays, allowing you to run the complete application without Firebase setup.

## 📁 Files

- **`mock-database-full.json`** - Complete mock database with 12 properties, users, bookings, and availability data
- **`mock-database.json`** - Simple version with 3 properties (legacy)

## 🚀 Quick Start

1. **Copy environment template:**

   ```bash
   cp env.template .env.local
   ```

2. **Ensure mock data is enabled:**

   ```bash
   # In .env.local
   USE_MOCK_DATA=true
   ```

3. **Start development server:**

   ```bash
   npm run dev
   ```

4. **Test the setup:**
   - Visit [http://localhost:3000/admin/setup](http://localhost:3000/admin/setup)
   - Click "Test Mock Data" to verify everything works

## 🏠 Mock Data Contents

### Properties (12 total)

- **Luxury Marina Villa** - 4BR villa with infinity pool ($450/night)
- **Modern Downtown Penthouse** - 3BR penthouse with city views ($320/night)
- **Beachfront Condo** - 2BR condo with ocean views ($280/night)
- **Executive Penthouse Suite** - 5BR luxury penthouse ($650/night)
- **Cozy Garden House** - 3BR family house in Al Barsha ($200/night)
- **Palm Jumeirah Apartment** - 2BR on iconic Palm Jumeirah ($380/night)
- **JLT Studio** - 1BR studio with lake views ($120/night)
- **Emirates Hills Mansion** - 6BR mansion with golf views ($850/night)
- **City Walk Trendy Loft** - 1BR loft in vibrant district ($180/night)
- **Burj Al Arab View Apartment** - 3BR with iconic views ($420/night)
- **Arabian Ranches Villa** - 4BR family villa ($300/night)
- **The Greens Poolside Apartment** - 2BR with pool access ($220/night)

### Users (3 total)

- Alice Johnson (American)
- Bob Smith (British)
- Carol Davis (Canadian)

### Bookings (3 sample bookings)

- Confirmed, Pending, and Completed status examples
- Real pricing calculations with taxes and fees
- Stripe payment integration data

### Availability Tracking

- Date-based availability blocking
- Booking conflict prevention
- Real-time availability checking

## 🔧 How It Works

The mock data system automatically activates when:

- `USE_MOCK_DATA=true` in environment variables
- Firebase is not configured or unavailable
- Development mode is active

### Service Layer

All services (`propertyService`, `bookingService`, etc.) automatically detect mock mode and:

- Use JSON data instead of Firebase
- Simulate async operations with realistic delays
- Provide full CRUD operations in memory
- Fall back to mock data on Firebase errors

### Features Supported

- ✅ Property browsing and filtering
- ✅ Booking creation and management
- ✅ Availability checking
- ✅ Payment integration (Stripe)
- ✅ User management
- ✅ Admin dashboard
- ✅ Search and filtering
- ✅ Date-based availability

## 🎨 Testing Different Scenarios

### Booking Flow Test

1. Go to [Properties Page](http://localhost:3000/properties)
2. Search for dates and guests
3. Select a property
4. Create a booking
5. Complete payment with Stripe test cards

### Admin Dashboard Test

1. Visit [Admin Setup](http://localhost:3000/admin/setup)
2. Test data loading
3. Check booking management
4. Verify property listings

## 🔄 Switching to Real Firebase

When ready to use real Firebase:

1. Set `USE_MOCK_DATA=false` in `.env.local`
2. Add your Firebase configuration
3. Restart the development server
4. The app will automatically use Firebase instead

## 📊 Mock Data Statistics

- **12 Properties** across Dubai locations
- **3 Users** with different profiles
- **3 Bookings** with various statuses
- **Realistic pricing** from $120-$850/night
- **Detailed amenities** and location data
- **High-quality images** from media folder
- **Comprehensive availability** tracking

## 🎯 Benefits

- **No Firebase setup required** for development
- **Complete functionality testing** without external dependencies
- **Realistic data** for demonstrations
- **Fast development** without network calls
- **Consistent testing environment** across different setups
- **Easy onboarding** for new developers

## 🚨 Important Notes

- Mock data is **in-memory only** - changes reset on server restart
- Use **real Firebase** for production
- Stripe integration works with **test keys only**
- Images are served from the **local media folder**

---

For support, visit the [Admin Setup Page](http://localhost:3000/admin/setup) or check the main README.md file.
