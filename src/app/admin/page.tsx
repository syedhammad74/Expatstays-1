"use client";

import { useState, useEffect, useCallback } from "react";
import { bookingService } from "@/lib/services/bookings";
import { propertyService } from "@/lib/services/properties";
import { availabilityService } from "@/lib/services/availability";
import { AdminNotification } from "@/lib/services/availability";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  Users,
  DollarSign,
  Home,
  Bell,
  Activity,
  TrendingUp,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  Settings,
  BarChart3,
  PieChart,
  RefreshCw,
  Filter,
  Eye,
  Database,
} from "lucide-react";
import { Booking, Property } from "@/lib/types/firebase";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AdminDataManager } from "@/components/admin/AdminDataManager";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PricingForm } from "@/components/admin/PricingForm";
import { AvailabilityForm } from "@/components/admin/AvailabilityForm";
import { PropertyCreationDialog } from "@/components/admin/PropertyCreationDialog";

export default function AdminDashboard() {
  const { toast } = useToast();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>("7d");
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Enhanced booking management state
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [selectedBookings, setSelectedBookings] = useState<Set<string>>(
    new Set()
  );
  const [bookingFilter, setBookingFilter] = useState({
    status: "all",
    dateRange: "all",
    property: "all",
    searchTerm: "",
  });
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookingDetailsOpen, setBookingDetailsOpen] = useState(false);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  // Property management state
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [pricingDialogOpen, setPricingDialogOpen] = useState(false);
  const [availabilityDialogOpen, setAvailabilityDialogOpen] = useState(false);
  const [propertyCreationDialogOpen, setPropertyCreationDialogOpen] =
    useState(false);
  const [propertyFormLoading, setPropertyFormLoading] = useState(false);

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

  // Move these two useCallback hooks above the useEffect hooks that use them
  const applyBookingFilters = useCallback(() => {
    try {
      let filtered = [...bookings];

      // Status filter
      if (bookingFilter.status !== "all") {
        filtered = filtered.filter(
          (booking) => booking.status === bookingFilter.status
        );
      }

      // Date range filter
      if (bookingFilter.dateRange !== "all") {
        const now = new Date();
        let startDate: Date;

        switch (bookingFilter.dateRange) {
          case "7d":
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case "30d":
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case "90d":
            startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            break;
          default:
            startDate = new Date(0);
        }

        filtered = filtered.filter((booking) => {
          const bookingDate = new Date(booking.createdAt);
          return bookingDate >= startDate;
        });
      }

      // Property filter
      if (bookingFilter.property !== "all") {
        filtered = filtered.filter(
          (booking) => booking.propertyId === bookingFilter.property
        );
      }

      // Search term filter
      if (bookingFilter.searchTerm) {
        const searchLower = bookingFilter.searchTerm.toLowerCase();
        filtered = filtered.filter(
          (booking) =>
            booking.guest.name.toLowerCase().includes(searchLower) ||
            booking.guest.email.toLowerCase().includes(searchLower) ||
            booking.id.toLowerCase().includes(searchLower)
        );
      }

      setFilteredBookings(filtered);
    } catch (error) {
      console.error("Error filtering bookings:", error);
      setFilteredBookings(bookings);
    }
  }, [bookings, bookingFilter]);

  const calculateAnalytics = useCallback(() => {
    try {
      const now = new Date();
      const daysAgo = parseInt(selectedTimeRange.replace("d", ""));
      const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

      const recentBookings = bookings.filter((booking) => {
        const bookingDate = new Date(booking.createdAt);
        return bookingDate >= startDate;
      });

      const totalRevenue = recentBookings.reduce(
        (sum, booking) => sum + (booking.pricing?.total || 0),
        0
      );

      const pendingBookings = bookings.filter(
        (booking) => booking.status === "pending"
      ).length;

      const completedBookings = bookings.filter(
        (booking) => booking.status === "completed"
      ).length;

      const cancelledBookings = bookings.filter(
        (booking) => booking.status === "cancelled"
      ).length;

      const activeListings = properties.filter(
        (property) => property.availability?.isActive
      ).length;

      // Calculate occupancy rate (simplified)
      const totalNights = recentBookings.reduce((sum, booking) => {
        const checkIn = new Date(booking.dates.checkIn);
        const checkOut = new Date(booking.dates.checkOut);
        const nights = Math.ceil(
          (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
        );
        return sum + nights;
      }, 0);

      const possibleNights = activeListings * daysAgo;
      const occupancyRate =
        possibleNights > 0
          ? Math.round((totalNights / possibleNights) * 100)
          : 0;

      setAnalytics({
        totalBookings: recentBookings.length,
        totalRevenue,
        occupancyRate: Math.min(occupancyRate, 100), // Cap at 100%
        totalProperties: properties.length,
        pendingBookings,
        completedBookings,
        cancelledBookings,
        activeListings,
      });
    } catch (error) {
      console.error("Error calculating analytics:", error);
      setAnalytics({
        totalBookings: 0,
        totalRevenue: 0,
        occupancyRate: 0,
        totalProperties: 0,
        pendingBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        activeListings: 0,
      });
    }
  }, [bookings, properties, selectedTimeRange]);

  // Move setupRealTimeSubscriptions and its useEffect above other useEffects
  const setupRealTimeSubscriptions = useCallback(() => {
    // Subscribe to admin notifications
    try {
      const unsubscribeNotifications =
        availabilityService.subscribeToAdminNotifications(
          (updatedNotifications) => {
            setNotifications(updatedNotifications);
          }
        );
      // Subscribe to real-time bookings updates
      const unsubscribeBookings = bookingService.subscribeToAllBookings(
        (updatedBookings) => {
          setBookings(updatedBookings);
        }
      );

      // Subscribe to properties updates
      const unsubscribeProperties = propertyService.subscribeToProperties(
        (updatedProperties) => {
          setProperties(updatedProperties);
        }
      );

      // Cleanup subscriptions on unmount
      return () => {
        unsubscribeNotifications();
        unsubscribeBookings();
        unsubscribeProperties();
      };
    } catch (error) {
      console.error("Error setting up real-time subscriptions:", error);
    }
  }, []);

  useEffect(() => {
    setupRealTimeSubscriptions();
  }, [setupRealTimeSubscriptions]);

  // Filter bookings whenever filters change
  useEffect(() => {
    applyBookingFilters();
  }, [bookings, bookingFilter, applyBookingFilters]);

  // Recalculate analytics when data changes
  useEffect(() => {
    calculateAnalytics();
  }, [bookings, properties, selectedTimeRange, calculateAnalytics]);

  const loadAdminData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [bookingsData, propertiesData, notificationsData] =
        await Promise.allSettled([
          bookingService.getAllBookings(),
          propertyService.getAllPropertiesForAdmin(),
          availabilityService.getAdminNotifications(50),
        ]);

      // Handle bookings result
      if (bookingsData.status === "fulfilled") {
        setBookings(bookingsData.value);
      } else {
        console.error("Error loading bookings:", bookingsData.reason);
        setBookings([]);
      }

      // Handle properties result
      if (propertiesData.status === "fulfilled") {
        setProperties(propertiesData.value);
      } else {
        console.error("Error loading properties:", propertiesData.reason);
        setProperties([]);
      }

      // Handle notifications result
      if (notificationsData.status === "fulfilled") {
        setNotifications(notificationsData.value);
      } else {
        console.error("Error loading notifications:", notificationsData.reason);
        setNotifications([]);
      }

      // Check if any critical data failed to load
      const failedLoads = [
        bookingsData,
        propertiesData,
        notificationsData,
      ].filter((result) => result.status === "rejected");

      if (failedLoads.length > 0) {
        setError(
          `Some data failed to load. ${failedLoads.length} service(s) unavailable.`
        );
      }
    } catch (error) {
      console.error("Error loading admin data:", error);
      setError("Failed to load admin dashboard data. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-[#8EB69B] text-white hover:bg-[#235347]";
      case "completed":
        return "bg-green-500 text-white";
      case "pending":
        return "bg-yellow-500 text-white";
      case "cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getPaymentStatusColor = (paymentStatus: string) => {
    switch (paymentStatus) {
      case "completed":
        return "bg-[#8EB69B] text-white";
      case "pending":
        return "bg-yellow-500 text-white";
      case "failed":
        return "bg-red-500 text-white";
      case "refunded":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const handleNotificationClick = async (notificationId: string) => {
    try {
      await availabilityService.markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAdminData();
    setRefreshing(false);
    toast({
      title: "Success",
      description: "Admin dashboard refreshed",
    });
  };

  const handleBookingStatusUpdate = async (
    bookingId: string,
    newStatus: "pending" | "confirmed" | "completed" | "cancelled"
  ) => {
    try {
      await bookingService.updateBookingStatus(bookingId, newStatus);

      // Update local state
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );

      toast({
        title: "Success",
        description: `Booking status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    }
  };

  const handleBulkStatusUpdate = async (
    newStatus: "pending" | "confirmed" | "completed" | "cancelled"
  ) => {
    if (selectedBookings.size === 0) {
      toast({
        title: "Error",
        description: "Please select bookings to update",
        variant: "destructive",
      });
      return;
    }

    setBulkActionLoading(true);
    try {
      const updatePromises = Array.from(selectedBookings).map((bookingId) =>
        bookingService.updateBookingStatus(bookingId, newStatus)
      );

      await Promise.all(updatePromises);

      // Update local state
      setBookings((prev) =>
        prev.map((booking) =>
          selectedBookings.has(booking.id)
            ? { ...booking, status: newStatus }
            : booking
        )
      );

      setSelectedBookings(new Set());
      toast({
        title: "Success",
        description: `${selectedBookings.size} bookings updated to ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating bookings:", error);
      toast({
        title: "Error",
        description: "Failed to update bookings",
        variant: "destructive",
      });
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleSelectBooking = (bookingId: string) => {
    setSelectedBookings((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(bookingId)) {
        newSet.delete(bookingId);
      } else {
        newSet.add(bookingId);
      }
      return newSet;
    });
  };

  const handleSelectAllBookings = () => {
    if (selectedBookings.size === filteredBookings.length) {
      setSelectedBookings(new Set());
    } else {
      setSelectedBookings(
        new Set(filteredBookings.map((booking) => booking.id))
      );
    }
  };

  const handleViewBookingDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setBookingDetailsOpen(true);
  };

  const exportBookings = () => {
    try {
      const csvData = filteredBookings.map((booking) => ({
        "Booking ID": booking.id,
        "Guest Name": booking.guest.name,
        "Guest Email": booking.guest.email,
        Property: booking.propertyId,
        "Check-in": booking.dates.checkIn,
        "Check-out": booking.dates.checkOut,
        Status: booking.status,
        "Payment Status": booking.payment.status,
        Amount: booking.pricing.total,
        Created: formatDate(booking.createdAt),
      }));

      const csvContent =
        "data:text/csv;charset=utf-8," +
        Object.keys(csvData[0]).join(",") +
        "\n" +
        csvData.map((row) => Object.values(row).join(",")).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `bookings-${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Success",
        description: "Bookings exported successfully",
      });
    } catch (error) {
      console.error("Error exporting bookings:", error);
      toast({
        title: "Error",
        description: "Failed to export bookings",
        variant: "destructive",
      });
    }
  };

  // Property management handlers
  const handlePropertyPricingClick = (property: Property) => {
    setSelectedProperty(property);
    setPricingDialogOpen(true);
  };

  const handlePropertyAvailabilityClick = (property: Property) => {
    setSelectedProperty(property);
    setAvailabilityDialogOpen(true);
  };

  const handleUpdatePropertyPricing = async (newPrice: number) => {
    if (!selectedProperty) return;

    try {
      setPropertyFormLoading(true);
      await propertyService.updateProperty(selectedProperty.id, {
        pricing: {
          ...selectedProperty.pricing,
          basePrice: newPrice,
        },
      });

      // Update local state
      setProperties((prev) =>
        prev.map((property) =>
          property.id === selectedProperty.id
            ? {
                ...property,
                pricing: { ...property.pricing, basePrice: newPrice },
              }
            : property
        )
      );

      toast({
        title: "Success",
        description: "Property pricing updated successfully",
      });

      setPricingDialogOpen(false);
    } catch (error) {
      console.error("Error updating property pricing:", error);
      toast({
        title: "Error",
        description: "Failed to update property pricing",
        variant: "destructive",
      });
    } finally {
      setPropertyFormLoading(false);
    }
  };

  const handleTogglePropertyAvailability = async (isActive: boolean) => {
    if (!selectedProperty) return;

    try {
      setPropertyFormLoading(true);
      await propertyService.toggleAvailability(selectedProperty.id, isActive);

      // Update local state
      setProperties((prev) =>
        prev.map((property) =>
          property.id === selectedProperty.id
            ? {
                ...property,
                availability: { ...property.availability, isActive },
              }
            : property
        )
      );

      toast({
        title: "Success",
        description: `Property ${
          isActive ? "activated" : "deactivated"
        } successfully`,
      });

      setAvailabilityDialogOpen(false);
    } catch (error) {
      console.error("Error toggling property availability:", error);
      toast({
        title: "Error",
        description: "Failed to update property availability",
        variant: "destructive",
      });
    } finally {
      setPropertyFormLoading(false);
    }
  };

  // Handle new property creation
  const handlePropertyCreated = (newProperty: Property) => {
    // Add the new property to the local state
    setProperties((prev) => [newProperty, ...prev]);

    toast({
      title: "Success",
      description: "Property created and is now available for bookings!",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] via-white to-[#DAF1DE]/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-[#8EB69B] mx-auto" />
          <div className="space-y-2">
            <p className="text-lg font-medium text-[#235347]">
              Loading admin dashboard...
            </p>
            <p className="text-sm text-[#235347]/70">
              Fetching your data securely
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] via-white to-[#DAF1DE]/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-16">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#051F20] to-[#235347] bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-[#235347]/70 text-lg">
                Manage your properties, bookings, and monitor activities
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select
                value={selectedTimeRange}
                onValueChange={setSelectedTimeRange}
              >
                <SelectTrigger className="w-[140px] border-[#8EB69B]/30 bg-white/80 backdrop-blur-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="border-[#8EB69B]/30 text-[#235347] hover:bg-[#8EB69B]/10 hover:text-[#051F20] backdrop-blur-sm bg-white/80"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/admin/settings")}
                className="border-[#8EB69B]/30 text-[#235347] hover:bg-[#8EB69B]/10 hover:text-[#051F20] backdrop-blur-sm bg-white/80"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert className="mb-4 border-orange-200 bg-orange-50/80 backdrop-blur-sm">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              <AlertDescription className="text-orange-700">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-l-4 border-l-[#8EB69B] bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-[#235347]">
                    Total Bookings
                  </CardTitle>
                  <div className="h-10 w-10 rounded-full bg-[#8EB69B]/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-[#8EB69B]" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#051F20] mb-1">
                  {analytics.totalBookings}
                </div>
                <p className="text-xs text-[#235347]/70">
                  Last {selectedTimeRange.replace("d", " days")}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-l-4 border-l-green-500 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-[#235347]">
                    Total Revenue
                  </CardTitle>
                  <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#051F20] mb-1">
                  {formatCurrency(analytics.totalRevenue)}
                </div>
                <p className="text-xs text-[#235347]/70">
                  Last {selectedTimeRange.replace("d", " days")}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-l-4 border-l-blue-500 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-[#235347]">
                    Occupancy Rate
                  </CardTitle>
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#051F20] mb-1">
                  {analytics.occupancyRate}%
                </div>
                <p className="text-xs text-[#235347]/70">
                  Average across all properties
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-l-4 border-l-purple-500 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-[#235347]">
                    Active Properties
                  </CardTitle>
                  <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <Home className="h-5 w-5 text-purple-500" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#051F20] mb-1">
                  {analytics.activeListings}
                </div>
                <p className="text-xs text-[#235347]/70">
                  Out of {analytics.totalProperties} total
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm border border-[#8EB69B]/20 p-1 rounded-xl">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-[#8EB69B] data-[state=active]:text-white data-[state=active]:shadow-sm text-[#235347] rounded-lg transition-all duration-200"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="bookings"
              className="data-[state=active]:bg-[#8EB69B] data-[state=active]:text-white data-[state=active]:shadow-sm text-[#235347] rounded-lg transition-all duration-200"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Bookings
            </TabsTrigger>
            <TabsTrigger
              value="properties"
              className="data-[state=active]:bg-[#8EB69B] data-[state=active]:text-white data-[state=active]:shadow-sm text-[#235347] rounded-lg transition-all duration-200"
            >
              <Home className="h-4 w-4 mr-2" />
              Properties
            </TabsTrigger>
            <TabsTrigger
              value="data-manager"
              className="data-[state=active]:bg-[#8EB69B] data-[state=active]:text-white data-[state=active]:shadow-sm text-[#235347] rounded-lg transition-all duration-200"
            >
              <Database className="h-4 w-4 mr-2" />
              Data Manager
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-[#8EB69B] data-[state=active]:text-white data-[state=active]:shadow-sm text-[#235347] rounded-lg transition-all duration-200"
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications ({notifications.filter((n) => !n.isRead).length})
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-[#8EB69B]/20">
                <CardHeader>
                  <CardTitle className="text-lg text-[#235347] flex items-center gap-2">
                    <Activity className="h-5 w-5 text-[#8EB69B]" />
                    Recent Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {bookings.slice(0, 5).map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-[#DAF1DE]/20 to-white rounded-lg border border-[#8EB69B]/10 hover:border-[#8EB69B]/30 transition-all duration-200"
                      >
                        <div>
                          <p className="font-medium text-sm text-[#051F20]">
                            {booking.guest.name}
                          </p>
                          <p className="text-xs text-[#235347]/70">
                            {formatDate(booking.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge
                            className={`${getStatusColor(
                              booking.status
                            )} text-xs mb-1`}
                          >
                            {booking.status}
                          </Badge>
                          <p className="text-sm font-medium text-[#235347]">
                            {formatCurrency(booking.pricing.total)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {bookings.length === 0 && (
                      <p className="text-center text-[#235347]/70 py-8">
                        No bookings yet
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-[#8EB69B]/20">
                <CardHeader>
                  <CardTitle className="text-lg text-[#235347] flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-[#8EB69B]" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-yellow-100/50">
                      <span className="text-sm text-[#235347]">
                        Pending Bookings
                      </span>
                      <Badge
                        variant="secondary"
                        className="bg-yellow-500 text-white"
                      >
                        {analytics.pendingBookings}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-green-50 to-green-100/50">
                      <span className="text-sm text-[#235347]">
                        Completed Bookings
                      </span>
                      <Badge className="bg-[#8EB69B] text-white">
                        {analytics.completedBookings}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-red-50 to-red-100/50">
                      <span className="text-sm text-[#235347]">
                        Cancelled Bookings
                      </span>
                      <Badge variant="destructive">
                        {analytics.cancelledBookings}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100/50">
                      <span className="text-sm text-[#235347]">
                        Active Listings
                      </span>
                      <Badge
                        variant="outline"
                        className="border-[#8EB69B] text-[#235347]"
                      >
                        {analytics.activeListings}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Booking Management</CardTitle>
                    <CardDescription>
                      Manage and monitor all property bookings with advanced
                      filtering and bulk operations
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={exportBookings}
                      className="flex items-center gap-2"
                    >
                      <TrendingUp className="h-4 w-4" />
                      Export CSV
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRefresh}
                      disabled={refreshing}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${
                          refreshing ? "animate-spin" : ""
                        }`}
                      />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Filters */}
                <div className="p-6 rounded-xl bg-gradient-to-r from-[#DAF1DE]/30 to-white/50 border border-[#8EB69B]/20 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#8EB69B]/20 to-[#235347]/20 flex items-center justify-center">
                      <Filter className="h-5 w-5 text-[#8EB69B]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#235347]">
                      Advanced Filters
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="status-filter"
                        className="text-[#235347] font-medium"
                      >
                        Status
                      </Label>
                      <Select
                        value={bookingFilter.status}
                        onValueChange={(value) =>
                          setBookingFilter((prev) => ({
                            ...prev,
                            status: value,
                          }))
                        }
                      >
                        <SelectTrigger
                          id="status-filter"
                          className="border-[#8EB69B]/30 focus:border-[#8EB69B] bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-[#8EB69B]/50"
                        >
                          <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 backdrop-blur-md border-[#8EB69B]/30">
                          <SelectItem
                            value="all"
                            className="focus:bg-[#DAF1DE]/30"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                              All Statuses
                            </div>
                          </SelectItem>
                          <SelectItem
                            value="pending"
                            className="focus:bg-[#DAF1DE]/30"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                              Pending
                            </div>
                          </SelectItem>
                          <SelectItem
                            value="confirmed"
                            className="focus:bg-[#DAF1DE]/30"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-[#8EB69B]"></div>
                              Confirmed
                            </div>
                          </SelectItem>
                          <SelectItem
                            value="cancelled"
                            className="focus:bg-[#DAF1DE]/30"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-red-500"></div>
                              Cancelled
                            </div>
                          </SelectItem>
                          <SelectItem
                            value="completed"
                            className="focus:bg-[#DAF1DE]/30"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-green-500"></div>
                              Completed
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="date-filter"
                        className="text-[#235347] font-medium"
                      >
                        Date Range
                      </Label>
                      <Select
                        value={bookingFilter.dateRange}
                        onValueChange={(value) =>
                          setBookingFilter((prev) => ({
                            ...prev,
                            dateRange: value,
                          }))
                        }
                      >
                        <SelectTrigger
                          id="date-filter"
                          className="border-[#8EB69B]/30 focus:border-[#8EB69B] bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-[#8EB69B]/50"
                        >
                          <SelectValue placeholder="All Dates" />
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 backdrop-blur-md border-[#8EB69B]/30">
                          <SelectItem
                            value="all"
                            className="focus:bg-[#DAF1DE]/30"
                          >
                            All Dates
                          </SelectItem>
                          <SelectItem
                            value="today"
                            className="focus:bg-[#DAF1DE]/30"
                          >
                            Today
                          </SelectItem>
                          <SelectItem
                            value="week"
                            className="focus:bg-[#DAF1DE]/30"
                          >
                            This Week
                          </SelectItem>
                          <SelectItem
                            value="month"
                            className="focus:bg-[#DAF1DE]/30"
                          >
                            This Month
                          </SelectItem>
                          <SelectItem
                            value="quarter"
                            className="focus:bg-[#DAF1DE]/30"
                          >
                            This Quarter
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="property-filter"
                        className="text-[#235347] font-medium"
                      >
                        Property
                      </Label>
                      <Select
                        value={bookingFilter.property}
                        onValueChange={(value) =>
                          setBookingFilter((prev) => ({
                            ...prev,
                            property: value,
                          }))
                        }
                      >
                        <SelectTrigger
                          id="property-filter"
                          className="border-[#8EB69B]/30 focus:border-[#8EB69B] bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-[#8EB69B]/50"
                        >
                          <SelectValue placeholder="All Properties" />
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 backdrop-blur-md border-[#8EB69B]/30">
                          <SelectItem
                            value="all"
                            className="focus:bg-[#DAF1DE]/30"
                          >
                            All Properties
                          </SelectItem>
                          {properties.map((property) => (
                            <SelectItem
                              key={property.id}
                              value={property.id}
                              className="focus:bg-[#DAF1DE]/30"
                            >
                              {property.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="search-filter"
                        className="text-[#235347] font-medium"
                      >
                        Search
                      </Label>
                      <Input
                        id="search-filter"
                        placeholder="Search by guest name or email..."
                        value={bookingFilter.searchTerm}
                        onChange={(e) =>
                          setBookingFilter((prev) => ({
                            ...prev,
                            searchTerm: e.target.value,
                          }))
                        }
                        className="border-[#8EB69B]/30 focus:border-[#8EB69B] focus:ring-[#8EB69B]/20 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-[#8EB69B]/50"
                      />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#8EB69B]/20">
                    <p className="text-xs text-[#235347]/70">
                      Showing {filteredBookings.length} of {bookings.length}{" "}
                      bookings
                    </p>
                  </div>
                </div>

                {/* Bulk Actions */}
                {selectedBookings.size > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-gradient-to-r from-[#8EB69B]/10 to-[#235347]/5 border border-[#8EB69B]/30 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#8EB69B]/20 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-[#8EB69B]" />
                      </div>
                      <span className="text-sm font-medium text-[#235347]">
                        {selectedBookings.size} booking
                        {selectedBookings.size > 1 ? "s" : ""} selected
                      </span>
                      <div className="flex items-center gap-2 ml-auto">
                        <Button
                          size="sm"
                          onClick={() => handleBulkStatusUpdate("confirmed")}
                          disabled={bulkActionLoading}
                          className="bg-[#8EB69B] hover:bg-[#235347] text-white text-xs px-4 h-8 transition-all duration-300"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Confirm Selected
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleBulkStatusUpdate("completed")}
                          disabled={bulkActionLoading}
                          className="bg-green-500 hover:bg-green-600 text-white text-xs px-4 h-8 transition-all duration-300"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Complete Selected
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleBulkStatusUpdate("cancelled")}
                          disabled={bulkActionLoading}
                          className="text-xs px-4 h-8 transition-all duration-300"
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Cancel Selected
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedBookings(new Set())}
                          className="text-[#235347] hover:bg-[#8EB69B]/10 text-xs px-3 h-8 transition-all duration-300"
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Bookings Table */}
                <div className="border border-[#8EB69B]/20 rounded-xl overflow-hidden bg-white/80 backdrop-blur-sm shadow-lg">
                  <Table>
                    <TableHeader className="bg-gradient-to-r from-[#DAF1DE]/50 to-[#8EB69B]/10">
                      <TableRow className="border-[#8EB69B]/20 hover:bg-[#8EB69B]/5">
                        <TableHead className="w-12 text-[#235347] font-medium">
                          <input
                            type="checkbox"
                            checked={
                              selectedBookings.size ===
                                filteredBookings.length &&
                              filteredBookings.length > 0
                            }
                            onChange={handleSelectAllBookings}
                            className="rounded border-[#8EB69B]/30 text-[#8EB69B] focus:ring-[#8EB69B]/20 transition-all duration-200"
                          />
                        </TableHead>
                        <TableHead className="text-[#235347] font-medium">
                          Guest
                        </TableHead>
                        <TableHead className="text-[#235347] font-medium">
                          Property
                        </TableHead>
                        <TableHead className="text-[#235347] font-medium">
                          Dates
                        </TableHead>
                        <TableHead className="text-[#235347] font-medium">
                          Guests
                        </TableHead>
                        <TableHead className="text-[#235347] font-medium">
                          Status
                        </TableHead>
                        <TableHead className="text-[#235347] font-medium">
                          Payment
                        </TableHead>
                        <TableHead className="text-[#235347] font-medium">
                          Amount
                        </TableHead>
                        <TableHead className="text-[#235347] font-medium">
                          Created
                        </TableHead>
                        <TableHead className="text-[#235347] font-medium">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBookings.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={10} className="text-center py-8">
                            <div className="flex flex-col items-center gap-2">
                              <AlertCircle className="h-8 w-8 text-gray-400" />
                              <span className="text-gray-500">
                                No bookings found
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredBookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell>
                              <input
                                type="checkbox"
                                checked={selectedBookings.has(booking.id)}
                                onChange={() => handleSelectBooking(booking.id)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">
                                  {booking.guest.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {booking.guest.email}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="text-sm font-medium">
                                  {booking.propertyId}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {booking.guests.adults} adult
                                  {booking.guests.adults > 1 ? "s" : ""}
                                  {booking.guests.children > 0 &&
                                    `, ${booking.guests.children} child${
                                      booking.guests.children > 1 ? "ren" : ""
                                    }`}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="text-sm">
                                  {booking.dates.checkIn}
                                </p>
                                <p className="text-xs text-gray-500">
                                  to {booking.dates.checkOut}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <p>{booking.guests.adults} adults</p>
                                {booking.guests.children > 0 && (
                                  <p className="text-xs text-gray-500">
                                    {booking.guests.children} children
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={`${getStatusColor(
                                  booking.status
                                )} text-xs`}
                              >
                                {booking.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={`${getPaymentStatusColor(
                                  booking.payment.status
                                )} text-xs`}
                              >
                                {booking.payment.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <p className="font-medium">
                                {formatCurrency(booking.pricing.total)}
                              </p>
                            </TableCell>
                            <TableCell>
                              <p className="text-xs text-gray-500">
                                {formatDate(booking.createdAt)}
                              </p>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleViewBookingDetails(booking)
                                  }
                                  className="h-8 w-8 p-0"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>

                                {booking.status === "pending" && (
                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() =>
                                      handleBookingStatusUpdate(
                                        booking.id,
                                        "confirmed"
                                      )
                                    }
                                    className="h-8 px-2 text-xs"
                                  >
                                    Confirm
                                  </Button>
                                )}

                                {booking.status === "confirmed" && (
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() =>
                                      handleBookingStatusUpdate(
                                        booking.id,
                                        "completed"
                                      )
                                    }
                                    className="h-8 px-2 text-xs"
                                  >
                                    Complete
                                  </Button>
                                )}

                                {(booking.status === "pending" ||
                                  booking.status === "confirmed") && (
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() =>
                                      handleBookingStatusUpdate(
                                        booking.id,
                                        "cancelled"
                                      )
                                    }
                                    className="h-8 px-2 text-xs"
                                  >
                                    Cancel
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Booking Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Total Bookings</p>
                          <p className="text-2xl font-bold">
                            {filteredBookings.length}
                          </p>
                        </div>
                        <Calendar className="h-8 w-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Total Revenue</p>
                          <p className="text-2xl font-bold">
                            {formatCurrency(
                              filteredBookings.reduce(
                                (sum, b) => sum + b.pricing.total,
                                0
                              )
                            )}
                          </p>
                        </div>
                        <DollarSign className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Pending</p>
                          <p className="text-2xl font-bold">
                            {
                              filteredBookings.filter(
                                (b) => b.status === "pending"
                              ).length
                            }
                          </p>
                        </div>
                        <Clock className="h-8 w-8 text-yellow-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Confirmed</p>
                          <p className="text-2xl font-bold">
                            {
                              filteredBookings.filter(
                                (b) => b.status === "confirmed"
                              ).length
                            }
                          </p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Booking Details Modal */}
            {selectedBooking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 ${
                  bookingDetailsOpen ? "block" : "hidden"
                }`}
                onClick={() => setBookingDetailsOpen(false)}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-gradient-to-br from-white via-[#FAFAFA] to-[#DAF1DE]/20 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#8EB69B]/30"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#8EB69B]/20">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#8EB69B]/20 to-[#235347]/20 flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-[#8EB69B]" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#051F20] to-[#235347] bg-clip-text text-transparent">
                            Booking Details
                          </h2>
                          <p className="text-[#235347]/70">
                            Booking ID: {selectedBooking.id}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setBookingDetailsOpen(false)}
                        className="h-10 w-10 rounded-full hover:bg-[#8EB69B]/10 text-[#235347]"
                      >
                        <XCircle className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="space-y-8">
                      {/* Guest Information */}
                      <div className="p-6 rounded-xl bg-gradient-to-r from-[#DAF1DE]/30 to-white/50 border border-[#8EB69B]/20">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#8EB69B]/20 to-[#235347]/20 flex items-center justify-center">
                            <Users className="h-5 w-5 text-[#8EB69B]" />
                          </div>
                          <h3 className="text-xl font-semibold text-[#235347]">
                            Guest Information
                          </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="text-[#235347] font-medium">
                              Name
                            </Label>
                            <p className="text-lg font-semibold text-[#051F20] bg-white/60 rounded-lg p-3 border border-[#8EB69B]/20">
                              {selectedBooking.guest.name}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[#235347] font-medium">
                              Email
                            </Label>
                            <p className="text-sm text-[#051F20] bg-white/60 rounded-lg p-3 border border-[#8EB69B]/20">
                              {selectedBooking.guest.email}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[#235347] font-medium">
                              Phone
                            </Label>
                            <p className="text-sm text-[#051F20] bg-white/60 rounded-lg p-3 border border-[#8EB69B]/20">
                              {selectedBooking.guest.phone || "Not provided"}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[#235347] font-medium">
                              Total Guests
                            </Label>
                            <div className="bg-white/60 rounded-lg p-3 border border-[#8EB69B]/20">
                              <div className="flex items-center gap-2 text-sm text-[#051F20]">
                                <Users className="h-4 w-4 text-[#8EB69B]" />
                                {selectedBooking.guests.adults} adults
                                {selectedBooking.guests.children > 0 &&
                                  `, ${selectedBooking.guests.children} children`}
                                {selectedBooking.guests.infants > 0 &&
                                  `, ${selectedBooking.guests.infants} infants`}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Booking Details */}
                      <div className="p-6 rounded-xl bg-gradient-to-r from-[#DAF1DE]/20 to-white/30 border border-[#8EB69B]/20">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#8EB69B]/20 to-[#235347]/20 flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-[#8EB69B]" />
                          </div>
                          <h3 className="text-xl font-semibold text-[#235347]">
                            Booking Details
                          </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="text-[#235347] font-medium">
                              Property
                            </Label>
                            <p className="text-sm font-medium text-[#051F20] bg-white/60 rounded-lg p-3 border border-[#8EB69B]/20">
                              {selectedBooking.propertyId}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[#235347] font-medium">
                              Status
                            </Label>
                            <div className="bg-white/60 rounded-lg p-3 border border-[#8EB69B]/20">
                              <Badge
                                className={`${getStatusColor(
                                  selectedBooking.status
                                )} text-xs`}
                              >
                                {selectedBooking.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[#235347] font-medium">
                              Check-in
                            </Label>
                            <div className="bg-white/60 rounded-lg p-3 border border-[#8EB69B]/20">
                              <div className="flex items-center gap-2 text-sm text-[#051F20]">
                                <Calendar className="h-4 w-4 text-[#8EB69B]" />
                                {selectedBooking.dates.checkIn}
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[#235347] font-medium">
                              Check-out
                            </Label>
                            <div className="bg-white/60 rounded-lg p-3 border border-[#8EB69B]/20">
                              <div className="flex items-center gap-2 text-sm text-[#051F20]">
                                <Calendar className="h-4 w-4 text-[#8EB69B]" />
                                {selectedBooking.dates.checkOut}
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[#235347] font-medium">
                              Created
                            </Label>
                            <p className="text-sm text-[#051F20] bg-white/60 rounded-lg p-3 border border-[#8EB69B]/20">
                              {formatDate(selectedBooking.createdAt)}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[#235347] font-medium">
                              Booking ID
                            </Label>
                            <p className="text-sm font-mono text-[#051F20] bg-white/60 rounded-lg p-3 border border-[#8EB69B]/20">
                              {selectedBooking.id}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Pricing Information */}
                      <div className="p-6 rounded-xl bg-gradient-to-r from-[#DAF1DE]/15 to-white/20 border border-[#8EB69B]/20">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#8EB69B]/20 to-[#235347]/20 flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-[#8EB69B]" />
                          </div>
                          <h3 className="text-xl font-semibold text-[#235347]">
                            Pricing Information
                          </h3>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center py-3 px-4 bg-white/60 rounded-lg border border-[#8EB69B]/20">
                            <span className="text-[#235347] font-medium">
                              Base Price
                            </span>
                            <span className="text-[#051F20] font-semibold">
                              {formatCurrency(
                                selectedBooking.pricing.basePrice
                              )}
                            </span>
                          </div>
                          {selectedBooking.pricing.taxes && (
                            <div className="flex justify-between items-center py-3 px-4 bg-white/60 rounded-lg border border-[#8EB69B]/20">
                              <span className="text-[#235347] font-medium">
                                Taxes
                              </span>
                              <span className="text-[#051F20] font-semibold">
                                {formatCurrency(selectedBooking.pricing.taxes)}
                              </span>
                            </div>
                          )}
                          {selectedBooking.pricing.serviceFee && (
                            <div className="flex justify-between items-center py-3 px-4 bg-white/60 rounded-lg border border-[#8EB69B]/20">
                              <span className="text-[#235347] font-medium">
                                Service Fee
                              </span>
                              <span className="text-[#051F20] font-semibold">
                                {formatCurrency(
                                  selectedBooking.pricing.serviceFee
                                )}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between items-center py-4 px-4 bg-gradient-to-r from-[#8EB69B]/20 to-[#235347]/10 rounded-lg border-2 border-[#8EB69B]/30">
                            <span className="text-[#235347] font-bold text-lg flex items-center gap-2">
                              <DollarSign className="h-5 w-5 text-[#8EB69B]" />
                              Total Amount
                            </span>
                            <span className="text-[#051F20] font-bold text-xl">
                              {formatCurrency(selectedBooking.pricing.total)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-6 border-t border-[#8EB69B]/20">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#8EB69B]/20 to-[#235347]/20 flex items-center justify-center">
                            <Settings className="h-4 w-4 text-[#8EB69B]" />
                          </div>
                          <h4 className="text-lg font-semibold text-[#235347]">
                            Actions
                          </h4>
                        </div>
                        <div className="flex gap-3">
                          {selectedBooking.status === "pending" && (
                            <>
                              <Button
                                onClick={() => {
                                  handleBookingStatusUpdate(
                                    selectedBooking.id,
                                    "confirmed"
                                  );
                                  setBookingDetailsOpen(false);
                                }}
                                className="flex-1 bg-gradient-to-r from-[#8EB69B] to-[#235347] hover:from-[#235347] hover:to-[#051F20] text-white shadow-lg hover:shadow-xl transition-all duration-300"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Confirm Booking
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => {
                                  handleBookingStatusUpdate(
                                    selectedBooking.id,
                                    "cancelled"
                                  );
                                  setBookingDetailsOpen(false);
                                }}
                                className="flex-1 shadow-lg hover:shadow-xl transition-all duration-300"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Cancel Booking
                              </Button>
                            </>
                          )}
                          {selectedBooking.status === "confirmed" && (
                            <Button
                              onClick={() => {
                                handleBookingStatusUpdate(
                                  selectedBooking.id,
                                  "completed"
                                );
                                setBookingDetailsOpen(false);
                              }}
                              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark as Completed
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </TabsContent>

          {/* Properties Tab */}
          <TabsContent value="properties" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-[#8EB69B]/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#051F20] to-[#235347] bg-clip-text text-transparent">
                      Property Management
                    </CardTitle>
                    <CardDescription className="text-[#235347]/70 text-lg">
                      Manage your property listings, availability, and pricing
                      with ease
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => setPropertyCreationDialogOpen(true)}
                    className="bg-gradient-to-r from-[#8EB69B] to-[#235347] hover:from-[#235347] hover:to-[#051F20] text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Add New Property
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property, index) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="group bg-gradient-to-br from-white via-[#FAFAFA] to-[#DAF1DE]/20 border-[#8EB69B]/30 hover:border-[#8EB69B] shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg text-[#051F20] group-hover:text-[#8EB69B] transition-colors duration-300 line-clamp-2">
                                {property.title}
                              </CardTitle>
                              <div className="flex items-center text-sm text-[#235347]/70 mt-2">
                                <div className="h-6 w-6 rounded-full bg-[#8EB69B]/10 flex items-center justify-center mr-2">
                                  <MapPin className="h-3 w-3 text-[#8EB69B]" />
                                </div>
                                {property.location.city},{" "}
                                {property.location.country}
                              </div>
                            </div>
                            <Badge
                              variant={
                                property.availability.isActive
                                  ? "default"
                                  : "secondary"
                              }
                              className={`text-xs ${
                                property.availability.isActive
                                  ? "bg-[#8EB69B] text-white"
                                  : "bg-gray-200 text-gray-600"
                              }`}
                            >
                              {property.availability.isActive
                                ? "Active"
                                : "Inactive"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Property Stats */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 rounded-lg bg-gradient-to-r from-[#8EB69B]/10 to-[#235347]/5 border border-[#8EB69B]/20">
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-[#8EB69B]" />
                                <span className="text-xs text-[#235347]/70">
                                  Price/Night
                                </span>
                              </div>
                              <p className="text-lg font-bold text-[#051F20] mt-1">
                                {formatCurrency(property.pricing.basePrice)}
                              </p>
                            </div>
                            <div className="p-3 rounded-lg bg-gradient-to-r from-[#DAF1DE]/30 to-white/50 border border-[#8EB69B]/20">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-[#8EB69B]" />
                                <span className="text-xs text-[#235347]/70">
                                  Capacity
                                </span>
                              </div>
                              <p className="text-lg font-bold text-[#051F20] mt-1">
                                {property.capacity.maxGuests} guests
                              </p>
                            </div>
                          </div>

                          {/* Property Features */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center py-2 px-3 bg-white/50 rounded-lg">
                              <span className="text-sm text-[#235347] flex items-center gap-2">
                                <Home className="h-4 w-4 text-[#8EB69B]" />
                                Bedrooms
                              </span>
                              <span className="text-sm font-medium text-[#051F20]">
                                {property.capacity.bedrooms}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-2 px-3 bg-white/50 rounded-lg">
                              <span className="text-sm text-[#235347] flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-[#8EB69B]" />
                                Availability
                              </span>
                              <span className="text-sm font-medium text-[#051F20]">
                                {property.availability.isActive
                                  ? "Available"
                                  : "Blocked"}
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="grid grid-cols-2 gap-2 pt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handlePropertyAvailabilityClick(property)
                              }
                              className="border-[#8EB69B]/30 text-[#235347] hover:bg-[#8EB69B]/10 hover:border-[#8EB69B] transition-all duration-300"
                            >
                              <Calendar className="h-3 w-3 mr-1" />
                              Availability
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handlePropertyPricingClick(property)
                              }
                              className="border-[#8EB69B]/30 text-[#235347] hover:bg-[#8EB69B]/10 hover:border-[#8EB69B] transition-all duration-300"
                            >
                              <DollarSign className="h-3 w-3 mr-1" />
                              Pricing
                            </Button>
                          </div>
                          <Button
                            size="sm"
                            className="w-full bg-gradient-to-r from-[#8EB69B] to-[#235347] hover:from-[#235347] hover:to-[#051F20] text-white transition-all duration-300"
                          >
                            <Eye className="h-3 w-3 mr-2" />
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}

                  {/* Add Property Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: properties.length * 0.1,
                    }}
                  >
                    <Card
                      onClick={() => setPropertyCreationDialogOpen(true)}
                      className="group bg-gradient-to-br from-[#DAF1DE]/20 to-white border-2 border-dashed border-[#8EB69B]/30 hover:border-[#8EB69B] transition-all duration-300 transform hover:scale-105 cursor-pointer min-h-[300px] flex items-center justify-center"
                    >
                      <CardContent className="text-center">
                        <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#8EB69B]/20 to-[#235347]/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Home className="h-8 w-8 text-[#8EB69B]" />
                        </div>
                        <h3 className="text-lg font-semibold text-[#235347] mb-2">
                          Add New Property
                        </h3>
                        <p className="text-sm text-[#235347]/70 mb-4">
                          Start listing a new property and expand your portfolio
                        </p>
                        <Button className="bg-gradient-to-r from-[#8EB69B] to-[#235347] hover:from-[#235347] hover:to-[#051F20] text-white transition-all duration-300">
                          Get Started
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Properties Summary */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-gradient-to-r from-[#8EB69B]/10 to-[#235347]/5 border-[#8EB69B]/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-[#235347]">
                            Total Properties
                          </p>
                          <p className="text-2xl font-bold text-[#051F20]">
                            {properties.length}
                          </p>
                        </div>
                        <Home className="h-8 w-8 text-[#8EB69B]" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-r from-green-50 to-green-100/50 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-[#235347]">
                            Active Listings
                          </p>
                          <p className="text-2xl font-bold text-[#051F20]">
                            {
                              properties.filter((p) => p.availability.isActive)
                                .length
                            }
                          </p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-[#235347]">
                            Avg. Price
                          </p>
                          <p className="text-2xl font-bold text-[#051F20]">
                            {formatCurrency(
                              properties.length > 0
                                ? properties.reduce(
                                    (sum, p) => sum + p.pricing.basePrice,
                                    0
                                  ) / properties.length
                                : 0
                            )}
                          </p>
                        </div>
                        <DollarSign className="h-8 w-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-r from-purple-50 to-purple-100/50 border-purple-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-[#235347]">
                            Total Capacity
                          </p>
                          <p className="text-2xl font-bold text-[#051F20]">
                            {properties.reduce(
                              (sum, p) => sum + p.capacity.maxGuests,
                              0
                            )}{" "}
                            guests
                          </p>
                        </div>
                        <Users className="h-8 w-8 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Manager Tab */}
          <TabsContent value="data-manager" className="space-y-6">
            <AdminDataManager />
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Admin Notifications</CardTitle>
                <CardDescription>
                  Stay updated with all platform activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        notification.isRead
                          ? "bg-gray-50 border-gray-200"
                          : "bg-[#DAF1DE]/30 border-[#8EB69B]/30"
                      }`}
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {notification.type === "booking_created" && (
                              <Calendar className="h-4 w-4 text-[#8EB69B]" />
                            )}
                            {notification.type === "booking_cancelled" && (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            {notification.type === "property_added" && (
                              <Home className="h-4 w-4 text-blue-500" />
                            )}
                            {notification.type === "payment_received" && (
                              <DollarSign className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">
                              {notification.title}
                            </h4>
                            <p className="text-xs text-[#235347]/70 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-[#235347]/50 mt-2">
                              {formatDate(notification.createdAt)}
                            </p>
                          </div>
                        </div>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-[#8EB69B] rounded-full mt-2"></div>
                        )}
                      </div>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <p className="text-center text-[#235347]/70 py-8">
                      No notifications yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Property Pricing Dialog */}
      <Dialog open={pricingDialogOpen} onOpenChange={setPricingDialogOpen}>
        <DialogContent className="bg-white/95 backdrop-blur-md border-[#8EB69B]/30">
          <DialogHeader>
            <DialogTitle className="text-[#235347]">
              Update Property Pricing
            </DialogTitle>
            <DialogDescription className="text-[#235347]/70">
              Change the base price for {selectedProperty?.title}
            </DialogDescription>
          </DialogHeader>
          {selectedProperty && (
            <PricingForm
              property={selectedProperty}
              onSave={handleUpdatePropertyPricing}
              loading={propertyFormLoading}
              onCancel={() => setPricingDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Property Availability Dialog */}
      <Dialog
        open={availabilityDialogOpen}
        onOpenChange={setAvailabilityDialogOpen}
      >
        <DialogContent className="bg-white/95 backdrop-blur-md border-[#8EB69B]/30">
          <DialogHeader>
            <DialogTitle className="text-[#235347]">
              Manage Availability
            </DialogTitle>
            <DialogDescription className="text-[#235347]/70">
              Control availability for {selectedProperty?.title}
            </DialogDescription>
          </DialogHeader>
          {selectedProperty && (
            <AvailabilityForm
              property={selectedProperty}
              onSave={handleTogglePropertyAvailability}
              loading={propertyFormLoading}
              onCancel={() => setAvailabilityDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Property Creation Dialog */}
      <PropertyCreationDialog
        open={propertyCreationDialogOpen}
        onOpenChange={setPropertyCreationDialogOpen}
        onPropertyCreated={handlePropertyCreated}
      />
    </div>
  );
}
