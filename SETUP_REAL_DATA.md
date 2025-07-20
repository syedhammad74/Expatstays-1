# 🔧 Switch from Mock Data to Real Firebase Data

## Current Issue

Your Properties page and Profile recommendations are showing **fake/mock data** instead of real data from your Firebase database.

## ✅ Step-by-Step Solution

### Step 1: Create Environment Configuration

1. **Create `.env.local` file** in your project root (same level as `package.json`):

```bash
# Copy the template
cp env.template .env.local
```

2. **Edit `.env.local` and add these critical settings:**

```env
# CRITICAL: Set this to false to use real data
USE_MOCK_DATA=false

# Your Firebase Configuration (get from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=your-actual-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Optional: Development Settings
NEXT_PUBLIC_USE_EMULATORS=false
NEXT_PUBLIC_USE_DATA_CONNECT=true

# Optional: Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key
SKIP_STRIPE_PAYMENT=true
```

### Step 2: Get Your Firebase Configuration

1. **Go to [Firebase Console](https://console.firebase.google.com/)**
2. **Select your project**
3. **Click Settings** (gear icon) → **Project Settings**
4. **Scroll down to "Your apps"** section
5. **Click the web app icon** (</>) or create a new web app
6. **Copy the configuration values** and paste them into `.env.local`

### Step 3: Restart Development Server

```bash
# Stop current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 4: Verify Real Data is Loading

1. **Open your browser's Developer Console** (F12)
2. **Navigate to Properties page** (`http://localhost:3000/properties`)
3. **Look for these console messages:**

✅ **Success indicators:**

```
🔍 Environment check:
  - USE_MOCK_DATA: false
  - Firebase DB available: true
  - Firebase project ID: your-project-id

📊 SUCCESS: Loaded X active properties from database
🏠 First property: Your Real Property Name
```

❌ **Problem indicators:**

```
🔧 Using mock property data - Set USE_MOCK_DATA=false in .env to use real database
```

### Step 5: Verify Properties Exist in Database

If you see "Loaded 0 properties", you need to add properties:

1. **Go to Admin Panel:** `http://localhost:3000/admin`
2. **Click "Create Property"** and add real properties
3. **Make sure properties are set to "Active"**
4. **Refresh Properties page** to see them appear

### Step 6: Deploy Firestore Indexes (if needed)

If you see Firestore index errors:

```bash
firebase deploy --only firestore
```

## 🔍 Troubleshooting

### Still Showing Mock Data?

1. **Check `.env.local` location** - Must be in project root
2. **Verify exact spelling:** `USE_MOCK_DATA=false` (not `true`)
3. **Restart development server** completely
4. **Clear browser cache** and refresh

### No Properties Showing?

1. **Check admin panel** - Add properties if none exist
2. **Verify property status** - Must be "Active"
3. **Check Firestore rules** - Must allow read access
4. **Deploy indexes** - Run `firebase deploy --only firestore`

### Firebase Connection Issues?

1. **Verify all Firebase config** variables are set correctly
2. **Check Firebase Console** - Project must exist and be active
3. **Check browser network tab** - Look for Firebase errors

## 📋 Expected Result

Once properly configured:

✅ **Properties Page:** Shows real properties from your database  
✅ **Profile Recommendations:** Shows real featured properties  
✅ **Admin Panel:** Same properties appear in both admin and public views  
✅ **Full Functionality:** Search, booking, and all features work with real data

## 🆘 Need Help?

If you're still having issues:

1. **Check browser console** for error messages
2. **Share the console output** from the Properties page
3. **Verify your `.env.local` file exists** and has correct values
4. **Ensure Firebase project** is set up and accessible

---

After completing these steps, your application will use real Firebase data instead of mock data!
