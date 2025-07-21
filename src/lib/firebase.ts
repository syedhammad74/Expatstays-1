import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

// Validate required configuration
const requiredConfig = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
];

const missingConfig = requiredConfig.filter((key) => !process.env[key]);
if (missingConfig.length > 0) {
  console.warn("Missing Firebase configuration:", missingConfig);
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);
export const realtimeDb = getDatabase(app);

// Connect to emulators in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const useEmulators = process.env.NEXT_PUBLIC_USE_EMULATORS === "true";

  if (useEmulators) {
    try {
      // Only connect to emulators once
      if (!auth.config.emulator) {
        connectAuthEmulator(auth, "http://localhost:9099", {
          disableWarnings: true,
        });
      }
      if (!db._delegate._terminated) {
        connectFirestoreEmulator(db, "localhost", 8080);
      }
      if (!functions.app.options.projectId?.includes("demo-")) {
        connectFunctionsEmulator(functions, "localhost", 5001);
      }
      if (!storage.app.options.projectId?.includes("demo-")) {
        connectStorageEmulator(storage, "localhost", 9199);
      }
      // Connect Realtime Database emulator
      try {
        connectDatabaseEmulator(realtimeDb, "localhost", 9000);
      } catch (realtimeError) {
        console.log(
          "Realtime Database emulator already connected or failed to connect:",
          realtimeError
        );
      }
    } catch (error) {
      console.log("Emulators already connected or failed to connect:", error);
    }
  }
}

// Data Connect integration (if enabled)
export let dataConnect: any = null;
if (process.env.NEXT_PUBLIC_USE_DATA_CONNECT === "true") {
  try {
    // Import Data Connect SDK properly
    import("firebase/data-connect")
      .then(({ getDataConnect, connectDataConnectEmulator }) => {
        import("@firebasegen/default-connector")
          .then(({ connectorConfig }) => {
            dataConnect = getDataConnect(connectorConfig);

            // Connect to emulator in development
            if (
              typeof window !== "undefined" &&
              process.env.NODE_ENV === "development"
            ) {
              const useEmulators =
                process.env.NEXT_PUBLIC_USE_EMULATORS === "true";
              if (useEmulators) {
                try {
                  connectDataConnectEmulator(dataConnect, "localhost", 9399);
                } catch (dcError) {
                  console.log(
                    "Data Connect emulator already connected or failed to connect:",
                    dcError
                  );
                }
              }
            }
          })
          .catch((error) => {
            console.warn("Data Connect connector config not available:", error);
          });
      })
      .catch((error) => {
        console.warn("Data Connect SDK not available:", error);
      });
  } catch (error) {
    console.warn("Data Connect not available:", error);
  }
}

// Firebase configuration status
export const firebaseStatus = {
  isConfigured: !missingConfig.length,
  missingConfig,
  services: {
    auth: !!auth,
    firestore: !!db,
    functions: !!functions,
    storage: !!storage,
    realtimeDb: !!realtimeDb,
    dataConnect: !!dataConnect,
  },
  projectId: firebaseConfig.projectId,
};

// Helper functions for common Firebase operations
export const firebase = {
  // Authentication helpers
  auth: {
    getCurrentUser: () => auth.currentUser,
    signOut: () => auth.signOut(),
    onAuthStateChanged: (callback: (user: unknown) => void) =>
      auth.onAuthStateChanged(callback),
  },

  // Firestore helpers
  firestore: {
    doc: (path: string) => db.collection("").doc(path),
    collection: (path: string) => db.collection(path),
    serverTimestamp: () => ({ serverTimestamp: true }),
  },

  // Realtime Database helpers
  realtimeDb: {
    ref: (path: string) => {
      const { ref } = require("firebase/database");
      return ref(realtimeDb, path);
    },
    set: async (reference: unknown, value: unknown) => {
      const { set } = require("firebase/database");
      return set(reference, value);
    },
    push: async (reference: unknown, value: unknown) => {
      const { push } = require("firebase/database");
      return push(reference, value);
    },
    onValue: (reference: unknown, callback: (snapshot: unknown) => void) => {
      const { onValue } = require("firebase/database");
      return onValue(reference, callback);
    },
    serverTimestamp: () => {
      const { serverTimestamp } = require("firebase/database");
      return serverTimestamp();
    },
  },

  // Functions helpers
  functions: {
    httpsCallable: (name: string) => {
      const { httpsCallable } = require("firebase/functions");
      return httpsCallable(functions, name);
    },
  },

  // Storage helpers
  storage: {
    ref: (path: string) => {
      const { ref } = require("firebase/storage");
      return ref(storage, path);
    },
    uploadBytes: async (storageRef: unknown, file: File) => {
      const { uploadBytes } = require("firebase/storage");
      return uploadBytes(storageRef, file);
    },
    getDownloadURL: async (storageRef: unknown) => {
      const { getDownloadURL } = require("firebase/storage");
      return getDownloadURL(storageRef);
    },
  },
};

export default app;
