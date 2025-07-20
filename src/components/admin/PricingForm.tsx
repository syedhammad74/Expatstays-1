"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Property } from "@/lib/types/firebase";
import { DollarSign, Loader2 } from "lucide-react";

interface PricingFormProps {
  property: Property;
  onSave: (newPrice: number) => Promise<void>;
  loading: boolean;
  onCancel: () => void;
}

export function PricingForm({ property, onSave, loading, onCancel }: PricingFormProps) {
  const [newPrice, setNewPrice] = useState(property.pricing.basePrice);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPrice <= 0) return;
    await onSave(newPrice);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 rounded-lg bg-gradient-to-r from-[#DAF1DE]/20 to-white/50 border border-[#8EB69B]/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#8EB69B]/20 to-[#235347]/20 flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-[#8EB69B]" />
          </div>
          <div>
            <h3 className="font-semibold text-[#235347]">Current Pricing</h3>
            <p className="text-sm text-[#235347]/70">
              Current base price: ${property.pricing.basePrice}/night
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="new-price" className="text-[#235347] font-medium">
              New Base Price (per night)
            </Label>
            <div className="relative mt-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-4 w-4 text-[#8EB69B]" />
              </div>
              <Input
                id="new-price"
                type="number"
                min="1"
                step="1"
                value={newPrice}
                onChange={(e) => setNewPrice(Number(e.target.value))}
                className="pl-10 border-[#8EB69B]/30 focus:border-[#8EB69B] bg-white/80 backdrop-blur-sm"
                placeholder="Enter new price"
                required
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-white/60 border border-[#8EB69B]/20">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#235347]/70">Price Change:</span>
              <span className={`font-medium ${
                newPrice > property.pricing.basePrice 
                  ? 'text-green-600' 
                  : newPrice < property.pricing.basePrice 
                    ? 'text-red-600' 
                    : 'text-[#235347]'
              }`}>
                {newPrice > property.pricing.basePrice && '+'}
                ${newPrice - property.pricing.basePrice}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm mt-1">
              <span className="text-[#235347]/70">Percentage Change:</span>
              <span className={`font-medium ${
                newPrice > property.pricing.basePrice 
                  ? 'text-green-600' 
                  : newPrice < property.pricing.basePrice 
                    ? 'text-red-600' 
                    : 'text-[#235347]'
              }`}>
                {((newPrice - property.pricing.basePrice) / property.pricing.basePrice * 100).toFixed(1)}%
              </span>
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
          disabled={loading || newPrice <= 0 || newPrice === property.pricing.basePrice}
          className="flex-1 bg-gradient-to-r from-[#8EB69B] to-[#235347] hover:from-[#235347] hover:to-[#051F20] text-white"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <DollarSign className="h-4 w-4 mr-2" />
              Update Price
            </>
          )}
        </Button>
      </div>
    </form>
  );
} 