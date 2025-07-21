"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { bookingService } from "@/lib/services/bookings";
import { availabilityService } from "@/lib/services/availability";
import { CalendarDays, Loader2, CheckCircle, Clock, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  addMonths,
} from "date-fns";

interface AvailabilityCalendarProps {
  propertyId: string;
  selectedDates?: {
    checkIn?: string;
    checkOut?: string;
  };
  onDateSelect?: (dates: { checkIn?: string; checkOut?: string }) => void;
  mode?: "view" | "select";
  className?: string;
}

export function AvailabilityCalendar({
  propertyId,
  selectedDates,
  onDateSelect,
  mode = "view",
  className = "",
}: AvailabilityCalendarProps) {
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectingCheckIn, setSelectingCheckIn] = useState(true);
  const [tempCheckIn, setTempCheckIn] = useState<string | undefined>(
    selectedDates?.checkIn
  );
  const [tempCheckOut, setTempCheckOut] = useState<string | undefined>(
    selectedDates?.checkOut
  );
  const { toast } = useToast();

  const loadAvailabilityData = useCallback(async () => {
    setLoading(true);
    try {
      const startDate = format(startOfMonth(new Date()), "yyyy-MM-dd");
      const endDate = format(
        endOfMonth(addMonths(new Date(), 2)),
        "yyyy-MM-dd"
      );

      const blocked = await bookingService.getBlockedDates(
        propertyId,
        startDate,
        endDate
      );
      setBlockedDates(blocked);
    } catch (error) {
      console.error("Error loading availability data:", error);
      toast({
        title: "Error",
        description: "Failed to load availability data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [propertyId, toast]);

  useEffect(() => {
    loadAvailabilityData();
  }, [propertyId, loadAvailabilityData]); // Added loadAvailabilityData as dependency

  useEffect(() => {
    // Set up real-time subscription for availability changes
    const unsubscribe = availabilityService.subscribeToAvailabilityChanges(
      propertyId,
      (availabilityEntries) => {
        const blocked = availabilityEntries
          .filter((entry) => entry.blocked)
          .map((entry) => entry.date);
        setBlockedDates(blocked);
      }
    );

    return () => unsubscribe();
  }, [propertyId, setBlockedDates]); // Added setBlockedDates as dependency

  const isDateBlocked = (date: Date): boolean => {
    const dateString = format(date, "yyyy-MM-dd");
    return blockedDates.includes(dateString);
  };

  const isDateInPast = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateClick = (date: Date) => {
    if (mode === "view") return;

    const dateString = format(date, "yyyy-MM-dd");

    // Don't allow selection of blocked or past dates
    if (isDateBlocked(date) || isDateInPast(date)) {
      toast({
        title: "Date Unavailable",
        description: "This date is not available for booking",
        variant: "destructive",
      });
      return;
    }

    if (selectingCheckIn) {
      setTempCheckIn(dateString);
      setTempCheckOut(undefined);
      setSelectingCheckIn(false);
    } else {
      // Validate check-out date
      if (tempCheckIn && date <= new Date(tempCheckIn)) {
        toast({
          title: "Invalid Date",
          description: "Check-out date must be after check-in date",
          variant: "destructive",
        });
        return;
      }

      // Check if any dates in the range are blocked
      if (tempCheckIn) {
        const checkInDate = new Date(tempCheckIn);
        const checkOutDate = date;

        const currentDate = new Date(checkInDate);
        currentDate.setDate(currentDate.getDate() + 1); // Start from day after check-in

        while (currentDate < checkOutDate) {
          if (isDateBlocked(currentDate)) {
            toast({
              title: "Date Range Unavailable",
              description: "Some dates in the selected range are not available",
              variant: "destructive",
            });
            return;
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }

      setTempCheckOut(dateString);
      setSelectingCheckIn(true);

      // Notify parent component
      if (onDateSelect && tempCheckIn) {
        onDateSelect({
          checkIn: tempCheckIn,
          checkOut: dateString,
        });
      }
    }
  };

  const clearSelection = () => {
    setTempCheckIn(undefined);
    setTempCheckOut(undefined);
    setSelectingCheckIn(true);
    if (onDateSelect) {
      onDateSelect({});
    }
  };

  const modifiers = {
    blocked: blockedDates.map((date) => parseISO(date)),
    selected: [tempCheckIn, tempCheckOut]
      .filter(Boolean)
      .map((date) => parseISO(date!)),
    inRange:
      tempCheckIn && tempCheckOut
        ? {
            from: parseISO(tempCheckIn),
            to: parseISO(tempCheckOut),
          }
        : undefined,
  };

  const modifiersStyles = {
    blocked: {
      backgroundColor: "#fef2f2",
      color: "#dc2626",
      textDecoration: "line-through",
    },
    selected: {
      backgroundColor: "#8EB69B",
      color: "white",
    },
    inRange: {
      backgroundColor: "#DAF1DE",
      color: "#163832",
    },
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Availability Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          {mode === "select" ? "Select Dates" : "Availability Calendar"}
        </CardTitle>
        {mode === "select" && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4" />
            {selectingCheckIn
              ? "Select check-in date"
              : "Select check-out date"}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Selected Dates Display */}
          {mode === "select" && (tempCheckIn || tempCheckOut) && (
            <div className="flex items-center justify-between p-3 bg-[#DAF1DE]/30 rounded-lg">
              <div className="flex items-center gap-4">
                {tempCheckIn && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">
                      Check-in: {format(parseISO(tempCheckIn), "MMM dd, yyyy")}
                    </span>
                  </div>
                )}
                {tempCheckOut && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">
                      Check-out:{" "}
                      {format(parseISO(tempCheckOut), "MMM dd, yyyy")}
                    </span>
                  </div>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={clearSelection}>
                Clear
              </Button>
            </div>
          )}

          {/* Calendar */}
          <Calendar
            mode="single"
            selected={tempCheckIn ? parseISO(tempCheckIn) : undefined}
            onSelect={(date) => date && handleDateClick(date)}
            modifiers={
              Object.fromEntries(
                Object.entries(modifiers).filter(
                  ([, value]) => value !== undefined && value !== null
                )
              ) as import("react-day-picker").DayModifiers
            }
            modifiersStyles={modifiersStyles}
            disabled={mode === "view"}
            className="rounded-md border"
          />

          {/* Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
              <span>Blocked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#8EB69B] border border-[#8EB69B] rounded"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded"></div>
              <span>Past</span>
            </div>
          </div>

          {/* Booking Info */}
          {mode === "select" && tempCheckIn && tempCheckOut && (
            <div className="p-3 bg-[#F4F4F4] rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-[#8EB69B]" />
                <span className="text-sm font-medium">Selected Stay</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {format(parseISO(tempCheckIn), "MMM dd, yyyy")} -{" "}
                {format(parseISO(tempCheckOut), "MMM dd, yyyy")}
                <br />
                {(() => {
                  const checkIn = parseISO(tempCheckIn);
                  const checkOut = parseISO(tempCheckOut);
                  const nights = Math.ceil(
                    (checkOut.getTime() - checkIn.getTime()) /
                      (1000 * 60 * 60 * 24)
                  );
                  return `${nights} night${nights > 1 ? "s" : ""}`;
                })()}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default AvailabilityCalendar;
