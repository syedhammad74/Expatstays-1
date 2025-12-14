'use client';

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Home, DollarSign, Search } from "lucide-react";

const BookingSearchWidget = () => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* Location */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground ml-1">Location</label>
          <Select>
            <SelectTrigger className="w-full h-14 bg-background border-border hover:border-primary/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 w-full">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <SelectValue placeholder="Where to?" className="flex-1 text-left" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dubai-marina">Dubai Marina</SelectItem>
              <SelectItem value="palm-jumeirah">Palm Jumeirah</SelectItem>
              <SelectItem value="downtown-dubai">Downtown Dubai</SelectItem>
              <SelectItem value="business-bay">Business Bay</SelectItem>
              <SelectItem value="jbr">JBR</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Property Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground ml-1">Property Type</label>
          <Select>
            <SelectTrigger className="w-full h-14 bg-background border-border hover:border-primary/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Home className="h-4 w-4 text-primary" />
                </div>
                <SelectValue placeholder="Property Type" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
              <SelectItem value="penthouse">Penthouse</SelectItem>
              <SelectItem value="studio">Studio</SelectItem>
              <SelectItem value="townhouse">Townhouse</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Budget */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground ml-1">Budget</label>
          <Select>
            <SelectTrigger className="w-full h-14 bg-background border-border hover:border-primary/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
                <SelectValue placeholder="Price Range" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-1000">$0 - $1,000</SelectItem>
              <SelectItem value="1000-2500">$1,000 - $2,500</SelectItem>
              <SelectItem value="2500-5000">$2,500 - $5,000</SelectItem>
              <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
              <SelectItem value="10000+">$10,000+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <div className="space-y-2">
          <Button
            type="submit"
            className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold rounded-xl shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <Search className="mr-2 h-5 w-5" />
            Find Properties
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingSearchWidget;
