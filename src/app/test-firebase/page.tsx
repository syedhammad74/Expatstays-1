"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function TestFirebasePage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState("");

  const addResult = (message: string) => {
    setResults((prev) => [...prev, message]);
  };

  const testFirebaseConnection = async () => {
    setLoading(true);
    setResults([]);
    setError("");

    try {
      // Test 1: Basic connection
      addResult("🔍 Testing Firebase connection...");

      // Test 2: Try to read from a collection
      addResult("📖 Testing Firestore read permissions...");
      const testCollection = collection(db, "test_connection");
      const snapshot = await getDocs(testCollection);
      addResult(
        `✅ Successfully read from Firestore (${snapshot.size} documents)`
      );

      // Test 3: Try to write to Firestore
      addResult("✏️ Testing Firestore write permissions...");
      const testDoc = await addDoc(testCollection, {
        message: "Test connection",
        timestamp: new Date().toISOString(),
        test: true,
      });
      addResult(`✅ Successfully wrote to Firestore (ID: ${testDoc.id})`);

      // Test 4: Clean up test document
      addResult("🧹 Cleaning up test document...");
      await deleteDoc(doc(db, "test_connection", testDoc.id));
      addResult("✅ Successfully cleaned up test document");

      addResult(
        "🎉 All Firebase tests passed! Your setup is working correctly."
      );
    } catch (err: unknown) {
      console.error("Firebase test error:", err);
      setError(
        `❌ Firebase test failed: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      addResult(
        `❌ Error: ${err instanceof Error ? err.message : String(err)}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] via-white to-[#DAF1DE]/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#051F20] mb-2">
            Firebase Connection Test
          </h1>
          <p className="text-[#235347]/70">
            Test your Firebase configuration and permissions
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-[#8EB69B]" />
              Firebase Configuration Test
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-[#235347]/70 text-sm">
                <p>
                  <strong>What this test does:</strong>
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Connects to your Firebase project</li>
                  <li>Tests read permissions from Firestore</li>
                  <li>Tests write permissions to Firestore</li>
                  <li>Cleans up test data automatically</li>
                </ul>
              </div>

              <Button
                onClick={testFirebaseConnection}
                disabled={loading}
                className="w-full bg-[#8EB69B] text-[#051F20] hover:bg-[#235347] hover:text-[#DAF1DE] font-semibold"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Testing Firebase...
                  </>
                ) : (
                  "Test Firebase Connection"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="text-sm font-mono bg-[#DAF1DE]/20 p-2 rounded"
                  >
                    {result}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 text-center">
          <div className="text-xs text-[#235347]/60 bg-[#DAF1DE]/20 p-4 rounded-lg">
            <strong>Next Steps:</strong> If the test passes, your Firebase is
            configured correctly. If it fails, check your .env.local file and
            Firebase security rules.
          </div>
        </div>
      </div>
    </div>
  );
}
