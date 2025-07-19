# Firebase Setup Guide for Studio Property Rental Platform

This guide will help you set up and deploy your property rental platform with Firebase.

## Prerequisites

1. Node.js 18+ installed
2. Firebase CLI installed (`npm install -g firebase-tools`)
3. A Firebase project created

## Quick Setup

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
npm run setup:env

# 3. Login to Firebase and select your project
npm run setup:firebase

# 4. Generate Data Connect SDK
npm run dataconnect:generate

# 5. Run the complete setup
npm run setup:all
```

## Manual Setup Steps

### 1. Environment Configuration

Copy the environment template and fill in your Firebase project details:

```bash
cp env.template .env.local
```

Update `.env.local` with your Firebase project configuration:

```env
# Get these values from Firebase Console > Project Settings > General
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=studio
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=studio.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://expat-stays-default-rtdb.asia-southeast1.firebasedatabase.app

# For server-side operations (get from Firebase Console > Project Settings > Service Accounts)
FIREBASE_PROJECT_ID=studio
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@studio.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key\n-----END PRIVATE KEY-----"

# Optional: Development Settings
NEXT_PUBLIC_USE_EMULATORS=false
NEXT_PUBLIC_USE_DATA_CONNECT=true
USE_MOCK_DATA=false
```

### 2. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing "studio" project
3. Enable the following services:
   - Authentication (enable Email/Password provider)
   - Firestore Database
   - Storage
   - Functions
   - App Hosting
   - Data Connect

### 3. Data Connect Setup

Your Data Connect is configured with:

- **Service ID**: studio
- **Location**: us-central1
- **Database**: fdcdb
- **Instance**: studio-fdc

Make sure your PostgreSQL instance is created and running.

### 4. Authentication Setup

Enable Authentication providers in Firebase Console:

1. Go to Authentication > Sign-in method
2. Enable Email/Password
3. Add authorized domains if deploying to production

### 5. Firestore Setup

Your Firestore rules and indexes are already configured for production use.

## Development Commands

```bash
# Start development server
npm run dev

# Start with Firebase emulators
npm run dev:full

# Start only emulators
npm run firebase:emulators

# Generate Data Connect SDK
npm run dataconnect:generate

# Validate Firebase configuration
npm run validate:config
```

## Deployment Commands

```bash
# Deploy everything
npm run firebase:deploy

# Deploy only hosting
npm run firebase:deploy:hosting

# Deploy only functions
npm run firebase:deploy:functions

# Deploy only Firestore rules/indexes
npm run firebase:deploy:firestore

# Deploy only Data Connect
npm run firebase:deploy:dataconnect
```

## Database Schema

Your application includes:

### Core Entities

- **Users**: Firebase Auth integration with roles (GUEST, HOST, ADMIN)
- **Properties**: Rental properties with location, pricing, and amenities
- **Bookings**: Property reservations with payment integration
- **Availability**: Property availability calendar
- **PricingRules**: Dynamic pricing rules
- **AdminNotifications**: System notifications

### Key Features

- Multi-tenant property management
- Booking workflow with payment integration
- Dynamic pricing rules
- Admin dashboard with notifications
- Real-time availability checking
- Role-based access control

## Security

- Production-ready Firestore security rules
- Role-based access control
- Property owner permissions
- Admin-only functions
- Secure payment processing

## Functions

The following Cloud Functions are deployed:

- `onBookingCreated`: Handles new booking workflow
- `onBookingUpdated`: Manages booking status changes
- `createPaymentIntent`: Creates Stripe payment intents
- `sendEmailNotification`: Sends email notifications
- `validatePropertyData`: Validates property data
- `cleanupExpiredAvailability`: Scheduled cleanup

## Monitoring

Monitor your application:

1. Firebase Console > Functions (for function logs)
2. Firebase Console > Firestore (for database operations)
3. Firebase Console > Authentication (for user management)
4. Firebase Console > Hosting (for deployment status)

## Troubleshooting

### Common Issues

1. **Data Connect not generating SDK**

   ```bash
   firebase dataconnect:sdk:generate --force
   ```

2. **Functions deployment fails**

   ```bash
   cd functions && npm install && npm run build
   ```

3. **Environment variables not loading**

   - Ensure `.env.local` exists and has correct values
   - Restart development server

4. **Emulators not connecting**
   ```bash
   firebase emulators:start --import=./emulator-data
   ```

### Configuration Validation

Run this command to check your Firebase setup:

```bash
npm run validate:config
```

## Next Steps

1. Set up your `.env.local` file with actual Firebase credentials
2. Deploy your Firestore rules: `npm run firebase:deploy:firestore`
3. Deploy your Data Connect schema: `npm run dataconnect:deploy`
4. Deploy your functions: `npm run firebase:deploy:functions`
5. Deploy your application: `npm run firebase:deploy:hosting`

Your property rental platform is now configured and ready for development and deployment!

## Admin Data Manager

Your application now includes a comprehensive Admin Data Manager that allows admins to:

### Dual Database Operations

- **Simultaneous Writing**: Add data to both Cloud Firestore and Realtime Database
- **Real-time Synchronization**: Automatic sync between both database systems
- **Live Updates**: Real-time activity feed showing all database operations

### Key Features

- **Data Management**: Create, read, update, and delete operations across both databases
- **Category Organization**: Organize data by categories with filtering capabilities
- **Priority System**: Assign priority levels (low, medium, high) to data items
- **Status Tracking**: Track data status (active, inactive, archived)
- **Tag System**: Add tags for better organization and filtering
- **Bulk Operations**: Select multiple items for bulk actions
- **Real-time Activity Feed**: Live feed of all database operations
- **Statistics Dashboard**: Analytics showing data distribution and activity

### Database Structure

#### Cloud Firestore Collections

- `admin_data`: Main data storage with full document structure
- Includes metadata like timestamps, user info, and relational data

#### Realtime Database Structure

```
admin_data/
  {id}/
    title: string
    description: string
    category: string
    data: object
    createdAt: timestamp
    updatedAt: timestamp
    createdBy: string
    priority: string
    status: string
    tags: array

admin_activity/
  {id}/
    type: string
    title: string
    description: string
    timestamp: number
    category: string
    priority: string
    createdBy: string
```

### Admin Panel Access

Access the Admin Data Manager through:

1. Navigate to `/admin` (admin authentication required)
2. Click on the "Data Manager" tab
3. Use the interface to manage data across both databases

### Real-time Features

- **Live Connection Status**: Visual indicators for Firestore and Realtime DB
- **Activity Feed**: Real-time updates of all database operations
- **Auto-refresh**: Data automatically updates across all admin sessions
- **Conflict Resolution**: Automatic handling of concurrent operations

### Security

- **Admin Only**: Requires admin authentication to access
- **Audit Trail**: All operations logged in activity feed
- **Validation**: Input validation and error handling
- **Safe Operations**: Transaction-based operations to prevent data corruption
