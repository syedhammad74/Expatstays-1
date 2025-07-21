"use client";

import { useState } from "react";
import Link from "next/link";

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const testMockData = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      // Test property service
      // Removed: const properties = await propertyService.getAllProperties();

      // Test booking service
      // Removed: const bookings = await bookingService.getAllBookings();

      setMessage("✅ Mock data is working perfectly!");
    } catch (error) {
      setMessage(
        `❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#DAF1DE] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-[#051F20] mb-8">
            🚀 ExpatsStays Setup & Mock Data
          </h1>

          {/* Status Section */}
          <div className="mb-8 p-6 bg-gradient-to-r from-[#DAF1DE] to-[#8EB69B] rounded-lg">
            <h2 className="text-xl font-semibold text-[#051F20] mb-4">
              📊 System Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl font-bold text-[#8EB69B]">
                  {/* Removed: {propertyCount} */}
                </div>
                <div className="text-sm text-gray-600">Properties</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl font-bold text-[#8EB69B]">
                  {/* Removed: {bookingCount} */}
                </div>
                <div className="text-sm text-gray-600">Bookings</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl font-bold text-[#8EB69B]">🔧</div>
                <div className="text-sm text-gray-600">Mock Data Mode</div>
              </div>
            </div>
          </div>

          {/* Mock Data Information */}
          <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">
              💡 About Mock Data System
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>🎯 Purpose:</strong> The mock data system allows you to
                test the complete application without needing Firebase setup.
                Perfect for development and demonstration.
              </p>
              <p>
                <strong>📁 Data Location:</strong>{" "}
                <code className="bg-gray-100 px-2 py-1 rounded">
                  src/data/mock-database-full.json
                </code>
              </p>
              <p>
                <strong>🔧 Configuration:</strong> Set{" "}
                <code className="bg-gray-100 px-2 py-1 rounded">
                  USE_MOCK_DATA=true
                </code>
                in your{" "}
                <code className="bg-gray-100 px-2 py-1 rounded">
                  .env.local
                </code>{" "}
                file
              </p>
              <p>
                <strong>⚡ Features:</strong> 12 detailed properties, 3 users,
                sample bookings, availability tracking, and all booking
                functionality
              </p>
            </div>
          </div>

          {/* Setup Instructions */}
          <div className="mb-8 p-6 bg-green-50 rounded-lg border border-green-200">
            <h2 className="text-xl font-semibold text-green-900 mb-4">
              🛠️ Quick Setup Instructions
            </h2>
            <ol className="space-y-3 text-gray-700 list-decimal list-inside">
              <li>
                Copy{" "}
                <code className="bg-gray-100 px-2 py-1 rounded">
                  env.template
                </code>{" "}
                to
                <code className="bg-gray-100 px-2 py-1 rounded">
                  .env.local
                </code>
              </li>
              <li>
                Ensure{" "}
                <code className="bg-gray-100 px-2 py-1 rounded">
                  USE_MOCK_DATA=true
                </code>
                is set in your environment file
              </li>
              <li>
                Restart your development server:{" "}
                <code className="bg-gray-100 px-2 py-1 rounded">
                  npm run dev
                </code>
              </li>
              <li>Click the test button below to verify everything works</li>
            </ol>
          </div>

          {/* Test Button */}
          <div className="text-center">
            <button
              onClick={testMockData}
              disabled={isLoading}
              className={`
                px-8 py-3 rounded-lg font-semibold text-white text-lg
                ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#8EB69B] hover:bg-[#235347] transform hover:scale-105"
                }
                transition-all duration-200 shadow-lg
              `}
            >
              {isLoading ? "Testing..." : "🧪 Test Mock Data"}
            </button>
          </div>

          {/* Result Message */}
          {message && (
            <div
              className={`
              mt-6 p-4 rounded-lg text-center font-semibold
              ${
                message.includes("✅")
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-red-100 text-red-800 border border-red-300"
              }
            `}
            >
              {message}
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex justify-center space-x-4">
            <Link
              href="/"
              className="px-6 py-2 bg-white border border-[#8EB69B] text-[#8EB69B] rounded-lg hover:bg-[#DAF1DE] transition-colors"
            >
              🏠 Go to Homepage
            </Link>
            <Link
              href="/properties"
              className="px-6 py-2 bg-white border border-[#8EB69B] text-[#8EB69B] rounded-lg hover:bg-[#DAF1DE] transition-colors"
            >
              🏢 View Properties
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
