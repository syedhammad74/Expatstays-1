# Expat Stays - Property Rental Platform

A modern, full-stack property rental platform built with Next.js, Firebase, and React. This application provides a complete solution for managing property listings, bookings, and user accounts with real-time updates and admin functionality.

## ✨ Features

### 🏠 Core Functionality

- **Property Management**: Browse, search, and filter luxury properties
- **User Authentication**: Secure login/signup with email and Google OAuth
- **Booking System**: Complete booking flow with payment integration
- **Real-time Availability**: Live calendar updates and availability checking
- **Payment Processing**: Stripe integration for secure payments

### 👨‍💼 Admin Features

- **Comprehensive Dashboard**: Analytics, booking management, and property oversight
- **Dual Database System**: Simultaneous data management in Firestore and Realtime Database
- **Real-time Monitoring**: Live activity feeds and connection status
- **Data Synchronization**: Advanced sync capabilities between databases
- **Demo Data Management**: Automated demo data population for testing

### 🛠 Technical Features

- **Firebase Integration**: Complete Firebase ecosystem implementation
- **Data Connect**: GraphQL-based data layer with PostgreSQL
- **Cloud Functions**: Server-side business logic and automation
- **Security Rules**: Production-ready Firestore security
- **Real-time Updates**: Live data synchronization across all components

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Firebase CLI (`npm install -g firebase-tools`)
- A Firebase project with enabled services

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd studio
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.template .env.local
   ```

   Fill in your Firebase configuration values in `.env.local`. See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed instructions.

4. **Initialize Firebase (if needed)**

   ```bash
   firebase login
   firebase use --add
   ```

5. **Start development server**

   ```bash
   npm run dev
   ```

6. **Visit the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Documentation

- **[Firebase Setup Guide](./FIREBASE_SETUP.md)**: Complete Firebase configuration instructions
- **[Design System](./docs/design-system.md)**: UI components and styling guidelines
- **[Email Setup](./docs/email-setup.md)**: Email service configuration
- **[Project Blueprint](./docs/blueprint.md)**: Architecture and development guidelines

## 🏗 Project Structure

```
studio/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # Reusable UI components
│   ├── lib/                 # Utilities and services
│   ├── hooks/               # Custom React hooks
│   └── utils/               # Helper functions
├── dataconnect/             # Firebase Data Connect schema
├── functions/               # Firebase Cloud Functions
├── public/                  # Static assets
└── docs/                    # Project documentation
```

## 🔧 Available Scripts

```bash
# Development
npm run dev                        # Start development server
npm run dev:emulators             # Start Firebase emulators
npm run dev:full                  # Start both emulators and dev server
npm run build                     # Build for production
npm run start                     # Start production server

# Firebase
npm run firebase:deploy           # Deploy all Firebase services
npm run firebase:emulators        # Start Firebase emulators
npm run firebase:deploy:functions # Deploy Cloud Functions only
npm run firebase:deploy:firestore # Deploy Firestore rules and indexes
npm run firebase:deploy:hosting   # Deploy to Firebase Hosting

# Data Connect
npm run dataconnect:generate      # Generate Data Connect SDK
npm run dataconnect:deploy        # Deploy Data Connect schema

# Setup & Utilities
npm run setup:all                 # Complete project setup
npm run setup:env                 # Copy environment template
npm run setup:firebase            # Initialize Firebase CLI
npm run lint                      # Run ESLint
npm run typecheck                 # TypeScript type checking
npm run validate:config           # Validate Firebase configuration
```

## 🌐 Environment Variables

Key environment variables (see `env.template` for complete list):

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=expat-stays
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://expat-stays-default-rtdb.asia-southeast1.firebasedatabase.app

# Development Settings
NEXT_PUBLIC_USE_EMULATORS=false
NEXT_PUBLIC_USE_DATA_CONNECT=true
USE_MOCK_DATA=false

# Payment Processing
STRIPE_SECRET_KEY=your_stripe_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_public_key
```

## 🚀 Deployment

### Firebase Hosting

```bash
npm run build
npm run firebase:deploy
```

### Vercel

The project is also compatible with Vercel deployment:

```bash
npm run build
# Follow Vercel deployment instructions
```

## 🔒 Security

- **Firestore Rules**: Production-ready security rules with role-based access
- **Authentication**: Secure user authentication with Firebase Auth
- **API Protection**: Protected API routes with proper validation
- **Data Validation**: Comprehensive input validation and sanitization

## 🧪 Testing

- **Development**: Use Firebase emulators for local testing
- **Demo Data**: Built-in demo data population for testing admin features
- **Mock Services**: Optional mock data mode for development without Firebase

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- Check the [Firebase Setup Guide](./FIREBASE_SETUP.md) for configuration help
- Review the [documentation](./docs/) for detailed information
- Open an issue for bugs or feature requests

## 🏢 About

Expat Stays is a luxury property rental platform designed for international travelers and expatriates seeking premium accommodations with seamless booking experiences.
