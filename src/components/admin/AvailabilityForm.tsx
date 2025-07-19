"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Property } from "@/lib/types/firebase";
import { Calendar, Loader2, CheckCircle, XCircle } from "lucide-react";

interface AvailabilityFormProps {
  property: Property;
  onSave: (isActive: boolean) => Promise<void>;
  loading: boolean;
  onCancel: () => void;
}

export function AvailabilityForm({
  property,
  onSave,
  loading,
  onCancel,
}: AvailabilityFormProps) {
  const [isActive, setIsActive] = useState(property.availability.isActive);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(isActive);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 rounded-lg bg-gradient-to-r from-[#DAF1DE]/20 to-white/50 border border-[#8EB69B]/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#8EB69B]/20 to-[#235347]/20 flex items-center justify-center">
            <Calendar className="h-5 w-5 text-[#8EB69B]" />
          </div>
          <div>
            <h3 className="font-semibold text-[#235347]">
              Property Availability
            </h3>
            <p className="text-sm text-[#235347]/70">
              Control whether this property is available for booking
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Current Status */}
          <div className="p-3 rounded-lg bg-white/60 border border-[#8EB69B]/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {property.availability.isActive ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <div>
                  <p className="font-medium text-[#235347]">Current Status</p>
                  <p className="text-sm text-[#235347]/70">
                    Property is currently{" "}
                    {property.availability.isActive ? "active" : "inactive"}
                  </p>
                </div>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  property.availability.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {property.availability.isActive ? "Active" : "Inactive"}
              </div>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-[#8EB69B]/20 bg-white/40">
              <div className="space-y-1">
                <Label className="text-[#235347] font-medium">
                  Property Availability
                </Label>
                <p className="text-sm text-[#235347]/70">
                  {isActive
                    ? "Property will be available for new bookings"
                    : "Property will be hidden from booking searches"}
                </p>
              </div>
              <Switch
                checked={isActive}
                onCheckedChange={setIsActive}
                className="data-[state=checked]:bg-[#8EB69B]"
              />
            </div>

            {/* Status Change Preview */}
            {isActive !== property.availability.isActive && (
              <div
                className={`p-3 rounded-lg border ${
                  isActive
                    ? "bg-green-50 border-green-200 text-green-800"
                    : "bg-red-50 border-red-200 text-red-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  {isActive ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <p className="text-sm font-medium">
                    Property will be {isActive ? "activated" : "deactivated"}
                  </p>
                </div>
                <p className="text-xs mt-1">
                  {isActive
                    ? "The property will appear in search results and accept new bookings."
                    : "The property will be hidden from guests and won't accept new bookings."}
                </p>
              </div>
            )}
          </div>

          {/* Important Notes */}
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  Important Notes:
                </p>
                <ul className="text-xs text-amber-700 mt-1 space-y-1">
                  <li>• Existing bookings will not be affected</li>
                  <li>• Deactivating hides the property from new searches</li>
                  <li>• You can reactivate the property at any time</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 border-[#8EB69B]/30 text-[#235347] hover:bg-[#8EB69B]/10"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading || isActive === property.availability.isActive}
          className="flex-1 bg-gradient-to-r from-[#8EB69B] to-[#235347] hover:from-[#235347] hover:to-[#051F20] text-white"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <Calendar className="h-4 w-4 mr-2" />
              {isActive ? "Activate" : "Deactivate"} Property
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
