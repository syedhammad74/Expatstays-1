'use client';

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Home, DollarSign, Search } from "lucide-react";
import React from "react";

const BookingSearchWidget = () => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {/* Location */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Location</label>
          <Select>
            <SelectTrigger className="w-full h-12 bg-background border-border rounded-buttons shadow-minimal transition-smooth">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Select Location" />
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
          <label className="text-sm font-medium text-foreground">Property Type</label>
          <Select>
            <SelectTrigger className="w-full h-12 bg-background border-border rounded-buttons shadow-minimal transition-smooth">
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-muted-foreground" />
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
          <label className="text-sm font-medium text-foreground">Budget</label>
          <Select>
            <SelectTrigger className="w-full h-12 bg-background border-border rounded-buttons shadow-minimal transition-smooth">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
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
          <label className="text-sm font-medium text-transparent">Search</label>
          <Button 
            type="submit" 
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-buttons shadow-minimal hover:shadow-primary transition-smooth"
          >
            <Search className="mr-2 h-4 w-4" />
            Search Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingSearchWidget;
