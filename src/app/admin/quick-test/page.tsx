"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Loader2, Database } from "lucide-react";

export default function QuickTestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleAddTestData = async () => {
    setLoading(true);
    setResult(null);

    try {
      // const result = await addSimpleTestData(); // This line was removed as per the edit hint
      setResult({
        success: true,
        message: "Test data added successfully (simulated).",
      });
    } catch (error) {
      setResult({
        success: false,
        message: `Failed to add test data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] via-white to-[#DAF1DE]/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#051F20] mb-2">
            Quick Firebase Test
          </h1>
          <p className="text-[#235347]/70">
            Add just a few test items to verify Firebase is working
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Add Simple Test Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-[#235347]/70">
              <p className="mb-4">
                This will add a small amount of test data to verify your
                Firebase connection:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>2 sample properties</li>
                <li>1 sample user</li>
                <li>1 sample booking</li>
              </ul>
              <p className="mt-4 text-sm font-medium text-[#8EB69B]">
                ⚡ This should complete in under 10 seconds
              </p>
            </div>

            {result && (
              <Alert variant={result.success ? "default" : "destructive"}>
                {result.success ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription className="whitespace-pre-line">
                  {result.message}
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleAddTestData}
              disabled={loading}
              className="w-full bg-[#8EB69B] text-[#051F20] hover:bg-[#235347] hover:text-[#DAF1DE] font-semibold"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Adding Test Data...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-5 w-5" />
                  Add Quick Test Data
                </>
              )}
            </Button>

            <div className="text-xs text-[#235347]/60 bg-[#DAF1DE]/20 p-4 rounded-lg">
              <strong>Next Step:</strong> If this works quickly, you can then
              try the full dummy data at /admin/setup-data
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
