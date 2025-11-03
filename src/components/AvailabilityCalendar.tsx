"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { bookingService } from "@/lib/services/bookings";
import { availabilityService } from "@/lib/services/availability";
import { CalendarDays, Loader2, CheckCircle, Clock, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";
import addMonths from "date-fns/addMonths";

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
    <div className={className}>
      {/* Selected Dates Display */}
      {mode === "select" && (tempCheckIn || tempCheckOut) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-gradient-to-r from-[#DAF1DE]/40 to-[#8EB69B]/10 rounded-xl border border-[#DAF1DE]/50 mb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
            {tempCheckIn && (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#8EB69B]" />
                <span className="text-sm font-semibold text-[#051F20]">
                  Check-in: {format(parseISO(tempCheckIn), "MMM dd, yyyy")}
                </span>
              </div>
            )}
            {tempCheckOut && (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#8EB69B]" />
                <span className="text-sm font-semibold text-[#051F20]">
                  Check-out: {format(parseISO(tempCheckOut), "MMM dd, yyyy")}
                </span>
              </div>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={clearSelection}
            className="border-[#DAF1DE] text-[#8EB69B] hover:bg-[#8EB69B] hover:text-white transition-colors"
          >
            Clear
          </Button>
        </div>
      )}

      {/* Calendar */}
      <div className="bg-white rounded-xl border border-[#DAF1DE]/50 overflow-hidden">
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
          className="w-full"
          classNames={{
            months:
              "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-medium text-[#051F20]",
            nav: "space-x-1 flex items-center",
            nav_button:
              "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-[#8EB69B] hover:text-[#235347]",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell:
              "text-[#4A4A4A] rounded-md w-9 font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-[#F8FBF9] [&:has([aria-selected].day-outside)]:text-[#4A4A4A] [&:has([aria-selected])]:bg-[#8EB69B] [&:has([aria-selected])]:text-white first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-[#DAF1DE] hover:text-[#051F20] rounded-md transition-colors",
            day_range_end: "day-range-end",
            day_selected:
              "bg-[#8EB69B] text-white hover:bg-[#8EB69B] hover:text-white focus:bg-[#8EB69B] focus:text-white",
            day_today: "bg-[#F8FBF9] text-[#8EB69B] font-semibold",
            day_outside:
              "day-outside text-[#4A4A4A] opacity-50 aria-selected:bg-[#F8FBF9] aria-selected:text-[#4A4A4A] aria-selected:opacity-30",
            day_disabled: "text-[#4A4A4A] opacity-50",
            day_range_middle:
              "aria-selected:bg-[#DAF1DE] aria-selected:text-[#051F20]",
            day_hidden: "invisible",
          }}
        />
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#DAF1DE] border border-[#8EB69B]/30 rounded"></div>
          <span className="text-[#4A4A4A] font-medium">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
          <span className="text-[#4A4A4A] font-medium">Blocked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#8EB69B] border border-[#8EB69B] rounded"></div>
          <span className="text-[#4A4A4A] font-medium">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded"></div>
          <span className="text-[#4A4A4A] font-medium">Past</span>
        </div>
      </div>

      {/* Booking Info */}
      {mode === "select" && tempCheckIn && tempCheckOut && (
        <div className="p-4 bg-gradient-to-r from-[#F8FBF9] to-[#E6F2EC] rounded-xl border border-[#DAF1DE]/50 mt-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-[#8EB69B]" />
            <span className="text-sm font-semibold text-[#051F20]">
              Selected Stay
            </span>
          </div>
          <div className="text-sm text-[#4A4A4A]">
            {format(parseISO(tempCheckIn), "MMM dd, yyyy")} -{" "}
            {format(parseISO(tempCheckOut), "MMM dd, yyyy")}
            <br />
            {(() => {
              const checkIn = parseISO(tempCheckIn);
              const checkOut = parseISO(tempCheckOut);
              const nights = Math.ceil(
                (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
              );
              return `${nights} night${nights > 1 ? "s" : ""}`;
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

export default AvailabilityCalendar;
