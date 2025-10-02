"use client";

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { bookingService } from "@/lib/services/bookings";
import { propertyService } from "@/lib/services/properties";
import { availabilityService } from "@/lib/services/availability";
import { AdminNotification } from "@/lib/services/availability";
import { Booking, Property } from "@/lib/types/firebase";

// Lazy load heavy components
const AdminHeader = dynamic(
  () => import("@/components/molecular/AdminHeader"),
  {
    loading: () => <div className="h-20 bg-gray-100 rounded animate-pulse" />,
  }
);

const AdminStats = dynamic(() => import("@/components/molecular/AdminStats"), {
  loading: () => <div className="h-32 bg-gray-100 rounded animate-pulse" />,
});

const AdminBookingsTable = dynamic(
  () => import("@/components/molecular/AdminBookingsTable"),
  {
    loading: () => <div className="h-96 bg-gray-100 rounded animate-pulse" />,
  }
);

const AdminPropertiesTable = dynamic(
  () => import("@/components/molecular/AdminPropertiesTable"),
  {
    loading: () => <div className="h-96 bg-gray-100 rounded animate-pulse" />,
  }
);

const AdminAnalytics = dynamic(
  () => import("@/components/molecular/AdminAnalytics"),
  {
    loading: () => <div className="h-64 bg-gray-100 rounded animate-pulse" />,
  }
);

// Main Admin Dashboard Component
export default function AdminDashboard() {
  const { toast } = useToast();
  const router = useRouter();

  // State management
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Analytics state
  const [analytics, setAnalytics] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    occupancyRate: 0,
    totalProperties: 0,
    pendingBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    activeListings: 0,
  });

  // Data fetching
  const fetchData = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);

      const [bookingsData, propertiesData, notificationsData] =
        await Promise.all([
          bookingService.getAllBookings(),
          propertyService.getAllProperties(),
          availabilityService.getAdminNotifications(),
        ]);

      setBookings(bookingsData);
      setProperties(propertiesData);
      setNotifications(notificationsData);

      // Calculate analytics
      const totalBookings = bookingsData.length;
      const totalRevenue = bookingsData.reduce(
        (sum, booking) => sum + (booking.totalAmount || 0),
        0
      );
      const occupancyRate =
        propertiesData.length > 0
          ? (bookingsData.filter((b) => b.status === "confirmed").length /
              propertiesData.length) *
            100
          : 0;
      const totalProperties = propertiesData.length;
      const pendingBookings = bookingsData.filter(
        (b) => b.status === "pending"
      ).length;
      const completedBookings = bookingsData.filter(
        (b) => b.status === "confirmed"
      ).length;
      const cancelledBookings = bookingsData.filter(
        (b) => b.status === "cancelled"
      ).length;
      const activeListings = propertiesData.filter((p) => p.isAvailable).length;

      setAnalytics({
        totalBookings,
        totalRevenue,
        occupancyRate: Math.round(occupancyRate),
        totalProperties,
        pendingBookings,
        completedBookings,
        cancelledBookings,
        activeListings,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast]);

  // Initial data load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Event handlers
  const handleRefresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const handleSettings = useCallback(() => {
    router.push("/admin/settings");
  }, [router]);

  const handleLogout = useCallback(() => {
    // Implement logout logic
    router.push("/auth/signin");
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-20 bg-gray-200 rounded animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 rounded animate-pulse" />
            <div className="h-96 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Error Loading Dashboard
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleRefresh}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <AdminHeader
          userName="Admin"
          onRefresh={handleRefresh}
          onSettings={handleSettings}
          onLogout={handleLogout}
          notifications={notifications.length}
        />

        {/* Stats */}
        <AdminStats stats={analytics} loading={refreshing} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bookings Table */}
          <div className="lg:col-span-2">
            <AdminBookingsTable bookings={bookings} onRefresh={handleRefresh} />
          </div>

          {/* Properties Table */}
          <div className="lg:col-span-1">
            <AdminPropertiesTable
              properties={properties}
              onRefresh={handleRefresh}
            />
          </div>
        </div>

        {/* Analytics */}
        <AdminAnalytics
          analytics={analytics}
          bookings={bookings}
          properties={properties}
        />
      </div>
    </div>
  );
}
