"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { bookingService } from "@/lib/services/bookings";
import { propertyService } from "@/lib/services/properties";
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
  Calendar,
  User,
  MapPin,
  Loader2,
  Download,
  MessageSquare,
  CreditCard,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  Phone,
  Mail,
  Star,
  Home,
  Users,
  BedDouble,
  Sparkles,
  ArrowRight,
  Eye,
} from "lucide-react";
import { Booking, Property } from "@/lib/types/firebase";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { getLocalImage } from "@/lib/imageUtils";
import Header from "@/components/layout/Header";

interface BookingWithProperty extends Booking {
  propertyDetails?: Property;
}

export default function MyBookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<BookingWithProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadBookingsWithProperties();

      // Set up real-time subscription
      const unsubscribe = bookingService.subscribeToUserBookings(
        user.uid,
        handleBookingsUpdate
      );

      return () => unsubscribe();
    }
  }, [user]);

  const loadBookingsWithProperties = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const userBookings = await bookingService.getUserBookings(user.uid);

      // Fetch property details for each booking
      const bookingsWithProperties = await Promise.all(
        userBookings.map(async (booking) => {
          try {
            const property = await propertyService.getPropertyById(
              booking.propertyId
            );
            return { ...booking, propertyDetails: property || undefined };
          } catch (error) {
            console.error("Error loading property details:", error);
            return booking;
          }
        })
      );

      setBookings(bookingsWithProperties);
    } catch (error) {
      console.error("Error loading bookings:", error);
      toast({
        title: "Error",
        description: "Failed to load your bookings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookingsUpdate = (updatedBookings: Booking[]) => {
    // Update bookings in real-time
    setBookings((prevBookings) =>
      updatedBookings.map((booking) => {
        const existing = prevBookings.find((b) => b.id === booking.id);
        return existing?.propertyDetails
          ? { ...booking, propertyDetails: existing.propertyDetails }
          : booking;
      })
    );
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await bookingService.cancelBooking(bookingId);
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully",
      });
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast({
        title: "Error",
        description: "Failed to cancel booking",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-[#8EB69B] text-[#163832]";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      case "completed":
        return <Star className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-[#8EB69B] text-[#163832]";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "refunded":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    return booking.status === filter;
  });

  const getBookingCounts = () => {
    return {
      all: bookings.length,
      pending: bookings.filter((b) => b.status === "pending").length,
      confirmed: bookings.filter((b) => b.status === "confirmed").length,
      completed: bookings.filter((b) => b.status === "completed").length,
      cancelled: bookings.filter((b) => b.status === "cancelled").length,
    };
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] via-white to-[#DAF1DE]/30">
        <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 pt-20 lg:pt-24 md:pt-32">
          <div className="flex items-center justify-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="h-8 w-8 text-[#8EB69B]" />
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] via-white to-[#DAF1DE]/30">
        <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 pt-20 lg:pt-24 md:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Alert className="max-w-md mx-auto bg-white/80 backdrop-blur-xl border-[#8EB69B]/20 rounded-2xl shadow-xl">
              <AlertCircle className="h-4 w-4 text-[#8EB69B]" />
              <AlertDescription className="text-[#163832]">
            Please sign in to view your bookings.{" "}
                <Link
                  href="/"
                  className="text-[#8EB69B] hover:text-[#0B2B26] underline font-medium"
                >
              Go to homepage
            </Link>
          </AlertDescription>
        </Alert>
          </motion.div>
        </div>
      </div>
    );
  }

  const counts = getBookingCounts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] via-white to-[#DAF1DE]/30">
      <Header />

      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-[300px] lg:w-[600px] h-[300px] lg:h-[600px] bg-gradient-to-br from-[#DAF1DE]/10 to-[#8EB69B]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-0 w-[400px] lg:w-[800px] h-[400px] lg:h-[800px] bg-gradient-to-tr from-[#0B2B26]/5 to-transparent rounded-full blur-3xl"></div>
        </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 pt-20 lg:pt-24 md:pt-32">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4"
          >
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-[#051F20] leading-tight tracking-tight">
              My <span className="text-[#8EB69B]">Bookings</span>
            </h1>
            <p className="text-lg lg:text-xl text-[#4A4A4A] max-w-2xl mx-auto leading-relaxed">
              Manage your luxury property reservations and view booking details
            </p>
          </motion.div>

          {/* Booking Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6"
          >
            {[
              {
                label: "Total",
                count: counts.all,
                icon: Home,
                color: "from-[#8EB69B] to-[#0B2B26]",
              },
              {
                label: "Pending",
                count: counts.pending,
                icon: Clock,
                color: "from-amber-400 to-amber-600",
              },
              {
                label: "Confirmed",
                count: counts.confirmed,
                icon: CheckCircle,
                color: "from-emerald-400 to-emerald-600",
              },
              {
                label: "Completed",
                count: counts.completed,
                icon: Star,
                color: "from-blue-400 to-blue-600",
              },
              {
                label: "Cancelled",
                count: counts.cancelled,
                icon: XCircle,
                color: "from-red-400 to-red-600",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                <Card className="bg-white/60 backdrop-blur-xl border-[#8EB69B]/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
                  ></div>
                  <CardContent className="relative p-4 lg:p-6 text-center">
                    <div
                      className={`w-12 h-12 mx-auto mb-3 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}
                    >
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-2xl lg:text-3xl font-bold text-[#163832] mb-1">
                      {stat.count}
                    </div>
                    <div className="text-sm lg:text-base text-[#235347]/70 font-medium">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Booking Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
        <Tabs
          value={filter}
          onValueChange={setFilter}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-2 bg-white/60 backdrop-blur-xl border-[#8EB69B]/20 rounded-2xl shadow-lg p-2">
                {[
                  { value: "all", label: "All", count: counts.all },
                  { value: "pending", label: "Pending", count: counts.pending },
                  {
                    value: "confirmed",
                    label: "Confirmed",
                    count: counts.confirmed,
                  },
                  {
                    value: "completed",
                    label: "Completed",
                    count: counts.completed,
                  },
                  {
                    value: "cancelled",
                    label: "Cancelled",
                    count: counts.cancelled,
                  },
                ].map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="text-sm lg:text-base font-medium rounded-xl data-[state=active]:bg-[#8EB69B] data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-[#8EB69B]/10 transition-all duration-300"
                  >
                    {tab.label} ({tab.count})
            </TabsTrigger>
                ))}
          </TabsList>

              <AnimatePresence mode="wait">
                <TabsContent key={filter} value={filter} className="space-y-6">
            {filteredBookings.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card className="bg-white/80 backdrop-blur-xl border-[#8EB69B]/20 rounded-3xl shadow-xl">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              duration: 0.6,
                              delay: 0.2,
                              type: "spring",
                            }}
                            className="w-24 h-24 bg-gradient-to-br from-[#8EB69B]/20 to-[#0B2B26]/20 rounded-full flex items-center justify-center mb-6"
                          >
                            <Calendar className="h-12 w-12 text-[#8EB69B]" />
                          </motion.div>
                          <motion.h3
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-2xl lg:text-3xl font-bold text-[#163832] mb-3 text-center"
                          >
                    No {filter === "all" ? "" : filter} bookings found
                          </motion.h3>
                          <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="text-lg text-[#235347]/70 text-center mb-8 max-w-md"
                          >
                    {filter === "all"
                              ? "You haven't made any bookings yet. Start exploring our amazing luxury properties!"
                      : `You don't have any ${filter} bookings at the moment.`}
                          </motion.p>
                  {filter === "all" && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6, delay: 0.6 }}
                            >
                              <Button
                                asChild
                                size="lg"
                                className="bg-[#8EB69B] hover:bg-[#0B2B26] text-white rounded-full px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                              >
                                <Link href="/properties">
                                  <Sparkles className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                                  Discover Properties
                                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                                </Link>
                    </Button>
                            </motion.div>
                  )}
                </CardContent>
              </Card>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-6"
                    >
                      {filteredBookings.map((booking, index) => (
                        <motion.div
                          key={booking.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          whileHover={{ y: -5 }}
                          className="group"
                        >
                          <Card className="bg-white/80 backdrop-blur-xl border-[#8EB69B]/20 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
                        {/* Property Image */}
                                <div className="lg:col-span-1 relative">
                                  <div className="aspect-[4/3] lg:aspect-auto lg:h-full relative overflow-hidden">
                          {booking.propertyDetails?.images?.[0] ? (
                              <Image
                                src={booking.propertyDetails.images[0]}
                                alt="Property"
                                fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                          ) : (
                                      <div className="w-full h-full bg-gradient-to-br from-[#8EB69B]/10 to-[#0B2B26]/10 flex items-center justify-center">
                                        <Home className="h-16 w-16 text-[#8EB69B]/50" />
                            </div>
                          )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

                                    {/* Property Type Badge */}
                                    <div className="absolute top-4 left-4">
                                      <Badge className="bg-white/90 backdrop-blur-sm text-[#163832] border-0 font-medium capitalize">
                                        {booking.propertyDetails
                                          ?.propertyType || "Property"}
                                      </Badge>
                                    </div>
                                  </div>
                        </div>

                        {/* Booking Details */}
                                <div className="lg:col-span-3 p-6 lg:p-8">
                                  {/* Header with Status */}
                                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 gap-4">
                            <div className="flex-1">
                                      <h3 className="text-2xl lg:text-3xl font-bold text-[#163832] mb-3 group-hover:text-[#8EB69B] transition-colors duration-300">
                                  {booking.propertyDetails?.title ||
                                    "Property Details Loading..."}
                                </h3>

                                      {/* Status Badges */}
                                      <div className="flex flex-wrap items-center gap-3 mb-4">
                                <Badge
                                  className={`${getStatusColor(
                                    booking.status
                                          )} border px-3 py-1 text-sm font-medium rounded-full flex items-center gap-2`}
                                        >
                                          {getStatusIcon(booking.status)}
                                          {booking.status
                                            .charAt(0)
                                            .toUpperCase() +
                                            booking.status.slice(1)}
                                </Badge>
                                <Badge
                                  className={`${getPaymentStatusColor(
                                            booking.payment.status
                                          )} border px-3 py-1 text-sm font-medium rounded-full flex items-center gap-2`}
                                        >
                                          <DollarSign className="h-4 w-4" />
                                          {booking.payment.status ===
                                          "completed"
                                            ? "Paid"
                                            : booking.payment.status
                                                .charAt(0)
                                                .toUpperCase() +
                                              booking.payment.status.slice(1)}
                                </Badge>
                              </div>

                                      {/* Property Details */}
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[#235347]/70">
                                        <div className="flex items-center gap-2">
                                          <MapPin className="h-4 w-4 text-[#8EB69B]" />
                                          <span className="text-sm lg:text-base">
                                            {
                                              booking.propertyDetails?.location
                                                .city
                                            }
                                            ,{" "}
                                            {
                                              booking.propertyDetails?.location
                                                .country
                                            }
                                          </span>
                                </div>
                                        <div className="flex items-center gap-2">
                                          <Users className="h-4 w-4 text-[#8EB69B]" />
                                          <span className="text-sm lg:text-base">
                                  {booking.guests.total} guest
                                            {booking.guests.total > 1
                                              ? "s"
                                              : ""}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <BedDouble className="h-4 w-4 text-[#8EB69B]" />
                                          <span className="text-sm lg:text-base">
                                            {
                                              booking.propertyDetails?.capacity
                                                .bedrooms
                                            }{" "}
                                            bedroom
                                            {booking.propertyDetails?.capacity
                                              .bedrooms !== 1
                                              ? "s"
                                              : ""}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Calendar className="h-4 w-4 text-[#8EB69B]" />
                                          <span className="text-sm lg:text-base">
                                            {booking.dates.nights} night
                                            {booking.dates.nights > 1
                                              ? "s"
                                              : ""}
                                          </span>
                                </div>
                              </div>
                            </div>

                                    {/* Price Section */}
                                    <div className="text-center lg:text-right">
                                      <div className="text-3xl lg:text-4xl font-bold text-[#163832] mb-2">
                                        $
                                        {booking.pricing.total.toLocaleString()}
                              </div>
                                      <div className="text-sm lg:text-base text-[#235347]/70">
                                ${booking.pricing.basePrice}/night ×{" "}
                                {booking.dates.nights} nights
                              </div>
                                      <div className="text-xs text-[#235347]/50 mt-1">
                                        Booking #
                                        {booking.id.slice(-8).toUpperCase()}
                              </div>
                            </div>
                          </div>

                                  {/* Dates Section */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div className="bg-[#8EB69B]/5 backdrop-blur-sm rounded-2xl p-4 border border-[#8EB69B]/10">
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#8EB69B]/20 rounded-xl flex items-center justify-center">
                                          <Calendar className="h-5 w-5 text-[#8EB69B]" />
                                        </div>
                              <div>
                                          <div className="font-semibold text-[#163832] text-lg">
                                  Check-in
                                </div>
                                          <div className="text-[#235347]/70">
                                  {formatDate(booking.dates.checkIn)}
                                </div>
                              </div>
                            </div>
                                    </div>
                                    <div className="bg-[#0B2B26]/5 backdrop-blur-sm rounded-2xl p-4 border border-[#0B2B26]/10">
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#0B2B26]/20 rounded-xl flex items-center justify-center">
                                          <Calendar className="h-5 w-5 text-[#0B2B26]" />
                                        </div>
                              <div>
                                          <div className="font-semibold text-[#163832] text-lg">
                                  Check-out
                                </div>
                                          <div className="text-[#235347]/70">
                                  {formatDate(booking.dates.checkOut)}
                                          </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Special Requests */}
                          {booking.specialRequests && (
                                    <div className="mb-6 p-4 bg-gradient-to-r from-[#8EB69B]/5 to-[#0B2B26]/5 rounded-2xl border border-[#8EB69B]/10">
                                      <div className="flex items-center gap-2 mb-2">
                                        <MessageSquare className="h-4 w-4 text-[#8EB69B]" />
                                        <span className="font-semibold text-[#163832]">
                                Special Requests
                                        </span>
                              </div>
                                      <p className="text-[#235347]/70 text-sm lg:text-base">
                                {booking.specialRequests}
                                      </p>
                            </div>
                          )}

                                  {/* Action Buttons */}
                                  <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-[#8EB69B]/10">
                            <Button
                              variant="outline"
                                      size="default"
                              asChild
                                      className="border-[#8EB69B]/30 text-[#0B2B26] hover:bg-[#8EB69B] hover:text-white rounded-full transition-all duration-300 group"
                            >
                              <Link href={`/my-bookings/${booking.id}`}>
                                        <Eye className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                                View Details
                              </Link>
                            </Button>

                            {booking.status === "confirmed" && (
                              <>
                                <Button
                                  variant="outline"
                                          size="default"
                                          className="border-[#8EB69B]/30 text-[#0B2B26] hover:bg-[#8EB69B] hover:text-white rounded-full transition-all duration-300 group"
                                >
                                          <Phone className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                                  Contact Host
                                </Button>
                                <Button
                                  variant="outline"
                                          size="default"
                                          className="border-[#8EB69B]/30 text-[#0B2B26] hover:bg-[#8EB69B] hover:text-white rounded-full transition-all duration-300 group"
                                >
                                          <Download className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                                  Download Receipt
                                </Button>
                              </>
                            )}

                            {booking.status === "pending" &&
                                      booking.payment.status === "pending" && (
                                <Button
                                          size="default"
                                          className="bg-[#8EB69B] hover:bg-[#0B2B26] text-white rounded-full transition-all duration-300 group"
                                >
                                          <CreditCard className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                                  Complete Payment
                                </Button>
                              )}

                            {(booking.status === "pending" ||
                              booking.status === "confirmed") && (
                              <Button
                                variant="destructive"
                                        size="default"
                                        onClick={() =>
                                          handleCancelBooking(booking.id)
                                        }
                                        className="rounded-full transition-all duration-300 group hover:scale-105"
                                      >
                                        <XCircle className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                                Cancel Booking
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                        </motion.div>
                ))}
                    </motion.div>
            )}
          </TabsContent>
              </AnimatePresence>
        </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
