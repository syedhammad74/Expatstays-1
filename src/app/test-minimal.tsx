"use client";

import { Button } from "@/components/ui/button";

export default function TestMinimal() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Minimal UI Test
        </h1>
        <p className="text-gray-600 mb-6">
          This is a minimal test to check if basic UI components are working.
        </p>

        <div className="space-y-4">
          <Button className="bg-blue-600 hover:bg-blue-700">Test Button</Button>

          <div className="p-4 bg-gray-100 rounded-lg">
            <p>Basic styling test</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Card 1</h3>
              <p className="text-gray-600">Content goes here</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Card 2</h3>
              <p className="text-gray-600">Content goes here</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Card 3</h3>
              <p className="text-gray-600">Content goes here</p>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-green-100 rounded-lg">
          <p className="text-green-800 font-semibold">
            ✅ If you can see this styled content, basic UI is working!
          </p>
        </div>
      </div>
    </div>
  );
}
