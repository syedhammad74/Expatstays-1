"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Calendar,
  Settings,
  MapPin,
  Loader2,
  Edit3,
  Check,
  X,
  Heart,
  Star,
  Users,
  ArrowRight,
  Shield,
  Bell,
  Globe,
  CreditCard,
  LogOut,
  BedDouble,
  Home,
  CalendarIcon,
  Eye,
} from "lucide-react";
import { Booking, Property } from "@/lib/types/firebase";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export default function ProfilePage() {
  const {
    user,
    userProfile,
    updateUserProfile,
    loading: authLoading,
  } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const { toast } = useToast();

  const loadUserBookings = useCallback(async () => {
    if (!user) return;

    setLoadingBookings(true);
    try {
      const userBookings = await bookingService.getUserBookings(user.uid);
      setBookings(userBookings);
    } catch (error) {
      console.error("Error loading bookings:", error);
      toast({
        title: "Error",
        description: "Failed to load your bookings",
        variant: "destructive",
      });
    } finally {
      setLoadingBookings(false);
    }
  }, [user, toast]);

  const loadRecommendedProperties = useCallback(async () => {
    setLoadingProperties(true);
    try {
      // Debug configuration
      console.log("🔍 Profile Page - Configuration Check:");
      console.log("  - USE_MOCK_DATA:", process.env.USE_MOCK_DATA);
      console.log(
        "  - Firebase Project:",
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
      );

      // Load featured properties as recommended properties
      const featuredProperties = await propertyService.getFeaturedProperties(6);

      console.log("🏠 Profile Page - Loaded Recommended Properties:");
      console.log(`  - Total recommended: ${featuredProperties.length}`);
      if (featuredProperties.length > 0) {
        console.log(`  - First property: ${featuredProperties[0].title}`);
        console.log(
          `  - Data source: ${
            featuredProperties[0].id.startsWith("prop_")
              ? "MOCK DATA"
              : "REAL DATABASE"
          }`
        );
      }

      setProperties(featuredProperties);
    } catch (error) {
      console.error("Error loading recommended properties:", error);
      toast({
        title: "Error",
        description: "Failed to load recommended properties",
        variant: "destructive",
      });
    } finally {
      setLoadingProperties(false);
    }
  }, [toast]);

  useEffect(() => {
    if (userProfile) {
      setProfileData({
        firstName: userProfile.profile.firstName,
        lastName: userProfile.profile.lastName,
        phone: userProfile.profile.phone || "",
      });
    }
  }, [userProfile, setProfileData]); // Added setProfileData as dependency

  useEffect(() => {
    if (user) {
      loadUserBookings();
    }
    loadRecommendedProperties();
  }, [user, loadUserBookings, loadRecommendedProperties]); // Added missing dependencies

  const handleProfileUpdate = async () => {
    if (!profileData.firstName || !profileData.lastName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setUpdatingProfile(true);
    try {
      await updateUserProfile(profileData);
      setEditingProfile(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setUpdatingProfile(false);
    }
  };

  const cancelEdit = () => {
    if (userProfile) {
      setProfileData({
        firstName: userProfile.profile.firstName,
        lastName: userProfile.profile.lastName,
        phone: userProfile.profile.phone || "",
      });
    }
    setEditingProfile(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-[#8EB69B] text-[#163832]";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] via-white to-[#DAF1DE]/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 md:pt-32">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-[#8EB69B]" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] via-white to-[#DAF1DE]/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 md:pt-32">
          <Alert className="max-w-md mx-auto">
            <AlertDescription>
              Please sign in to view your profile.{" "}
              <Link href="/" className="underline text-[#8EB69B]">
                Go to homepage
              </Link>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] via-white to-[#DAF1DE]/30">
      <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-8 pt-24 md:pt-32">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Decorative Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#8EB69B]/5 via-transparent to-[#0B2B26]/5 rounded-3xl" />
            <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-[#8EB69B]/10 rounded-full blur-2xl" />

            <div className="relative bg-white/90 backdrop-blur-xl border border-[#8EB69B]/20 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl">
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 sm:gap-0">
                <div className="flex flex-col sm:flex-row items-center sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 w-full">
                  <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-4 border-[#8EB69B]/20">
                    <AvatarImage
                      src={user.photoURL || undefined}
                      alt={user.displayName || "User"}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-[#8EB69B] to-[#0B2B26] text-white text-lg sm:text-xl font-semibold">
                      {user.displayName ? getInitials(user.displayName) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center sm:text-left w-full">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#163832]">
                      Welcome back,{" "}
                      {userProfile?.profile.firstName ||
                        user.displayName?.split(" ")[0] ||
                        "Guest"}
                    </h1>
                    <p className="text-[#235347]/70 mt-1 text-sm sm:text-base">
                      Here&apos;s your latest activity and preferences.
                    </p>
                    <p className="text-xs sm:text-sm text-[#235347]/60 mt-2">
                      Member since{" "}
                      {new Date(
                        user.metadata.creationTime || ""
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 mt-4 sm:mt-0 w-full sm:w-auto justify-center sm:justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-[#8EB69B]/30 text-[#0B2B26] hover:bg-[#8EB69B] hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-[#8EB69B]/25 transition-all duration-300 ease-in-out w-10 h-10 sm:w-auto sm:h-auto group"
                  >
                    <Settings className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                    <span className="hidden sm:inline ml-2">Settings</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-[#8EB69B]/30 text-[#0B2B26] hover:bg-red-500 hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 ease-in-out w-10 h-10 sm:w-auto sm:h-auto group"
                  >
                    <LogOut className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    <span className="hidden sm:inline ml-2">Logout</span>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3"
          >
            <Card className="bg-white/90 backdrop-blur-xl border-[#8EB69B]/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-[#235347]/60">
                      Total Bookings
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-[#163832]">
                      {bookings.length}
                    </p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#8EB69B]/20 to-[#0B2B26]/20 rounded-2xl flex items-center justify-center">
                    <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-[#8EB69B]" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/90 backdrop-blur-xl border-[#8EB69B]/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-[#235347]/60">
                      Saved Experiences
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-[#163832]">
                      12
                    </p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#8EB69B]/20 to-[#0B2B26]/20 rounded-2xl flex items-center justify-center">
                    <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-[#8EB69B]" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/90 backdrop-blur-xl border-[#8EB69B]/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-[#235347]/60">
                      Average Rating
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-[#163832]">
                      4.8
                    </p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#8EB69B]/20 to-[#0B2B26]/20 rounded-2xl flex items-center justify-center">
                    <Star className="h-5 w-5 sm:h-6 sm:w-6 text-[#8EB69B]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="bg-white/80 backdrop-blur-xl border-[#8EB69B]/20 rounded-2xl p-2 shadow-lg">
              <TabsTrigger
                value="profile"
                className="flex items-center gap-2 rounded-xl data-[state=active]:bg-[#8EB69B] data-[state=active]:text-white hover:bg-[#8EB69B]/10 hover:scale-105 transition-all duration-300 ease-in-out group"
              >
                <User className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="bookings"
                className="flex items-center gap-2 rounded-xl data-[state=active]:bg-[#8EB69B] data-[state=active]:text-white hover:bg-[#8EB69B]/10 hover:scale-105 transition-all duration-300 ease-in-out group"
              >
                <Calendar className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                Bookings
              </TabsTrigger>
              <TabsTrigger
                value="saved"
                className="flex items-center gap-2 rounded-xl data-[state=active]:bg-[#8EB69B] data-[state=active]:text-white hover:bg-[#8EB69B]/10 hover:scale-105 transition-all duration-300 ease-in-out group"
              >
                <Home className="h-4 w-4 group-hover:scale-110 group-hover:text-[#8EB69B] transition-all duration-300" />
                Recommended
              </TabsTrigger>
              <TabsTrigger
                value="preferences"
                className="flex items-center gap-2 rounded-xl data-[state=active]:bg-[#8EB69B] data-[state=active]:text-white hover:bg-[#8EB69B]/10 hover:scale-105 transition-all duration-300 ease-in-out group"
              >
                <Settings className="h-4 w-4 group-hover:scale-110 group-hover:rotate-90 transition-all duration-300" />
                Preferences
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="bg-white/80 backdrop-blur-xl border-[#8EB69B]/20 rounded-2xl shadow-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl font-bold text-[#163832]">
                          Personal Information
                        </CardTitle>
                        <CardDescription className="text-[#235347]/70">
                          Manage your personal details and contact information
                        </CardDescription>
                      </div>
                      {!editingProfile ? (
                        <Button
                          variant="outline"
                          onClick={() => setEditingProfile(true)}
                          className="flex items-center gap-2 rounded-full border-[#8EB69B]/30 text-[#0B2B26] hover:bg-[#8EB69B] hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-[#8EB69B]/25 transition-all duration-300 ease-in-out group"
                        >
                          <Edit3 className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                          <span>Edit</span>
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={cancelEdit}
                            disabled={updatingProfile}
                            className="rounded-full hover:bg-red-100 hover:text-red-600 hover:scale-110 transition-all duration-300 ease-in-out group"
                          >
                            <X className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleProfileUpdate}
                            disabled={updatingProfile}
                            className="rounded-full bg-[#8EB69B] hover:bg-[#0B2B26] text-white hover:scale-110 hover:shadow-lg hover:shadow-[#8EB69B]/25 transition-all duration-300 ease-in-out group"
                          >
                            {updatingProfile ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4 group-hover:scale-125 transition-transform duration-300" />
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label
                          htmlFor="firstName"
                          className="text-[#163832] font-medium"
                        >
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          value={profileData.firstName}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              firstName: e.target.value,
                            }))
                          }
                          disabled={!editingProfile}
                          className={`mt-2 rounded-xl border-[#8EB69B]/30 focus:border-[#8EB69B] focus:ring-[#8EB69B]/20 ${
                            !editingProfile ? "bg-[#FAFAFA]" : ""
                          }`}
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="lastName"
                          className="text-[#163832] font-medium"
                        >
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          value={profileData.lastName}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              lastName: e.target.value,
                            }))
                          }
                          disabled={!editingProfile}
                          className={`mt-2 rounded-xl border-[#8EB69B]/30 focus:border-[#8EB69B] focus:ring-[#8EB69B]/20 ${
                            !editingProfile ? "bg-[#FAFAFA]" : ""
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="email"
                        className="text-[#163832] font-medium"
                      >
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        value={user.email || ""}
                        disabled
                        className="mt-2 rounded-xl bg-[#FAFAFA] border-[#8EB69B]/30"
                      />
                      <p className="text-xs text-[#235347]/60 mt-1">
                        Email cannot be changed from this page
                      </p>
                    </div>

                    <div>
                      <Label
                        htmlFor="phone"
                        className="text-[#163832] font-medium"
                      >
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        disabled={!editingProfile}
                        className={`mt-2 rounded-xl border-[#8EB69B]/30 focus:border-[#8EB69B] focus:ring-[#8EB69B]/20 ${
                          !editingProfile ? "bg-[#FAFAFA]" : ""
                        }`}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="bookings">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="bg-white/80 backdrop-blur-xl border-[#8EB69B]/20 rounded-2xl shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-[#163832]">
                      Your Bookings
                    </CardTitle>
                    <CardDescription className="text-[#235347]/70">
                      View and manage your property reservations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loadingBookings ? (
                      <div className="flex items-center justify-center h-32">
                        <Loader2 className="h-6 w-6 animate-spin text-[#8EB69B]" />
                      </div>
                    ) : bookings.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-[#235347]/40 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2 text-[#163832]">
                          No bookings yet
                        </h3>
                        <p className="text-[#235347]/70 mb-4">
                          Start exploring our amazing properties!
                        </p>
                        <Button
                          asChild
                          className="bg-[#8EB69B] hover:bg-[#0B2B26] text-white rounded-full hover:scale-110 hover:shadow-lg hover:shadow-[#8EB69B]/25 transition-all duration-300 ease-in-out group"
                        >
                          <Link href="/properties">
                            <span>Browse Properties</span>
                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {bookings.map((booking) => (
                          <Card
                            key={booking.id}
                            className="border-[#8EB69B]/20 bg-white/60 backdrop-blur-sm rounded-2xl hover:shadow-lg transition-all duration-300"
                          >
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between">
                                <div className="space-y-3">
                                  <div className="flex items-center gap-3">
                                    <h4 className="font-semibold text-[#163832]">
                                      Booking #{booking.id.slice(-8)}
                                    </h4>
                                    <Badge
                                      className={`${getStatusColor(
                                        booking.status
                                      )} rounded-full`}
                                    >
                                      {booking.status}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-6 text-sm text-[#235347]/70">
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4 text-[#8EB69B]" />
                                      {formatDate(booking.dates.checkIn)} -{" "}
                                      {formatDate(booking.dates.checkOut)}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Users className="h-4 w-4 text-[#0B2B26]" />
                                      {booking.guests.total} guest
                                      {booking.guests.total > 1 ? "s" : ""}
                                    </div>
                                  </div>
                                  <div className="text-sm">
                                    <span className="font-medium text-[#163832]">
                                      Total:{" "}
                                    </span>
                                    ${booking.pricing.total}{" "}
                                    {booking.pricing.currency}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-lg font-semibold text-[#163832]">
                                    ${booking.pricing.basePrice}/night
                                  </div>
                                  <div className="text-sm text-[#235347]/60">
                                    {booking.dates.nights} nights
                                  </div>
                                </div>
                              </div>

                              {booking.specialRequests && (
                                <div className="mt-4 pt-4 border-t border-[#8EB69B]/20">
                                  <p className="text-sm text-[#235347]/80">
                                    <span className="font-medium text-[#163832]">
                                      Special requests:{" "}
                                    </span>
                                    {booking.specialRequests}
                                  </p>
                                </div>
                              )}

                              <div className="mt-4 flex gap-3">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  asChild
                                  className="rounded-full border-[#8EB69B]/30 text-[#0B2B26] hover:bg-[#8EB69B] hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-[#8EB69B]/25 transition-all duration-300 ease-in-out group"
                                >
                                  <Link href={`/my-bookings/${booking.id}`}>
                                    <span>View Details</span>
                                    <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                                  </Link>
                                </Button>
                                {booking.status === "confirmed" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full border-[#8EB69B]/30 text-[#0B2B26] hover:bg-[#8EB69B] hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-[#8EB69B]/25 transition-all duration-300 ease-in-out group"
                                  >
                                    <Edit3 className="h-3 w-3 mr-1 group-hover:rotate-12 transition-transform duration-300" />
                                    <span>Modify Booking</span>
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="saved">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="bg-white/80 backdrop-blur-xl border-[#8EB69B]/20 rounded-2xl shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-[#163832]">
                      Recommended Properties
                    </CardTitle>
                    <CardDescription className="text-[#235347]/70">
                      Curated properties you might love, fetched from our
                      database
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loadingProperties ? (
                      <div className="flex items-center justify-center h-32">
                        <Loader2 className="h-6 w-6 animate-spin text-[#8EB69B]" />
                      </div>
                    ) : properties.length === 0 ? (
                      <div className="text-center py-8">
                        <Home className="h-12 w-12 text-[#235347]/40 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2 text-[#163832]">
                          No properties available
                        </h3>
                        <p className="text-[#235347]/70 mb-4">
                          Check back later for new property recommendations
                        </p>
                        <Button
                          asChild
                          className="bg-[#8EB69B] hover:bg-[#0B2B26] text-white rounded-full"
                        >
                          <Link href="/properties">Browse All Properties</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {properties.map((property) => (
                          <motion.div
                            key={property.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                            className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            {/* Property Image */}
                            <div className="relative h-48 overflow-hidden">
                              <Image
                                src={
                                  property.images && property.images.length > 0
                                    ? property.images[0]
                                    : "/media/DSC01806 HDR June 25 2025/DSC01822-HDR.jpg"
                                }
                                alt={property.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src =
                                    "/media/DSC01806 HDR June 25 2025/DSC01822-HDR.jpg";
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                              {/* Featured Badge */}
                              {property.featured && (
                                <div className="absolute top-3 left-3">
                                  <Badge className="bg-[#8EB69B] text-[#051F20] hover:bg-[#8EB69B] font-semibold">
                                    Featured
                                  </Badge>
                                </div>
                              )}

                              {/* Rating Badge */}
                              <div className="absolute top-3 right-3">
                                <div className="bg-white/90 backdrop-blur-sm text-[#051F20] px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-[#8EB69B] text-[#8EB69B]" />
                                  4.9
                                </div>
                              </div>
                            </div>

                            {/* Property Details */}
                            <div className="p-4 space-y-3">
                              {/* Location */}
                              <div className="flex items-center gap-2 text-[#235347]/70 text-sm">
                                <MapPin className="h-4 w-4" />
                                <span>
                                  {property.location.city},{" "}
                                  {property.location.country}
                                </span>
                              </div>

                              {/* Title */}
                              <h3 className="font-bold text-[#163832] group-hover:text-[#8EB69B] transition-colors duration-300 line-clamp-2">
                                {property.title}
                              </h3>

                              {/* Property Info */}
                              <div className="flex items-center gap-4 text-sm text-[#235347]/70">
                                <span className="flex items-center gap-1">
                                  <BedDouble className="h-4 w-4" />
                                  {property.capacity.bedrooms} beds
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {property.capacity.maxGuests} guests
                                </span>
                              </div>

                              {/* Price */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-baseline gap-1">
                                  <span className="text-lg font-bold text-[#8EB69B]">
                                    ${property.pricing.basePrice}
                                  </span>
                                  <span className="text-sm text-[#235347]/70">
                                    / night
                                  </span>
                                </div>
                              </div>

                              {/* Book Now Button */}
                              <Button
                                className="w-full bg-[#8EB69B] text-[#051F20] hover:bg-[#235347] hover:text-white transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
                                onClick={() => {
                                  window.location.href = `/properties/${property.id}/book`;
                                }}
                              >
                                <CalendarIcon className="h-4 w-4 mr-2" />
                                Book Now
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="preferences">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="bg-white/80 backdrop-blur-xl border-[#8EB69B]/20 rounded-2xl shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-[#163832]">
                      Account Preferences
                    </CardTitle>
                    <CardDescription className="text-[#235347]/70">
                      Manage your account settings and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {/* Email Notifications */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#8EB69B]/20 to-[#0B2B26]/20 rounded-xl flex items-center justify-center">
                          <Bell className="h-5 w-5 text-[#8EB69B]" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#163832]">
                            Email Notifications
                          </h4>
                          <p className="text-sm text-[#235347]/70">
                            Manage your email preferences
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3 ml-13">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="w-4 h-4 text-[#8EB69B] border-[#8EB69B]/30 rounded focus:ring-[#8EB69B]/20"
                          />
                          <span className="text-sm text-[#235347]">
                            Booking confirmations
                          </span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="w-4 h-4 text-[#8EB69B] border-[#8EB69B]/30 rounded focus:ring-[#8EB69B]/20"
                          />
                          <span className="text-sm text-[#235347]">
                            Booking reminders
                          </span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-[#8EB69B] border-[#8EB69B]/30 rounded focus:ring-[#8EB69B]/20"
                          />
                          <span className="text-sm text-[#235347]">
                            Marketing emails
                          </span>
                        </label>
                      </div>
                    </div>

                    <Separator className="bg-[#8EB69B]/20" />

                    {/* Currency */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#8EB69B]/20 to-[#0B2B26]/20 rounded-xl flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-[#8EB69B]" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#163832]">
                            Currency
                          </h4>
                          <p className="text-sm text-[#235347]/70">
                            Select your preferred currency
                          </p>
                        </div>
                      </div>
                      <div className="ml-13">
                        <select className="w-full p-3 rounded-xl border-[#8EB69B]/30 focus:border-[#8EB69B] focus:ring-[#8EB69B]/20 bg-white">
                          <option value="USD">USD - US Dollar</option>
                          <option value="EUR">EUR - Euro</option>
                          <option value="GBP">GBP - British Pound</option>
                        </select>
                      </div>
                    </div>

                    <Separator className="bg-[#8EB69B]/20" />

                    {/* Language */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#8EB69B]/20 to-[#0B2B26]/20 rounded-xl flex items-center justify-center">
                          <Globe className="h-5 w-5 text-[#8EB69B]" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#163832]">
                            Language
                          </h4>
                          <p className="text-sm text-[#235347]/70">
                            Choose your preferred language
                          </p>
                        </div>
                      </div>
                      <div className="ml-13">
                        <select className="w-full p-3 rounded-xl border-[#8EB69B]/30 focus:border-[#8EB69B] focus:ring-[#8EB69B]/20 bg-white">
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                        </select>
                      </div>
                    </div>

                    <Separator className="bg-[#8EB69B]/20" />

                    {/* Security */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#8EB69B]/20 to-[#0B2B26]/20 rounded-xl flex items-center justify-center">
                          <Shield className="h-5 w-5 text-[#8EB69B]" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#163832]">
                            Security Settings
                          </h4>
                          <p className="text-sm text-[#235347]/70">
                            Manage your account security
                          </p>
                        </div>
                      </div>
                      <div className="ml-13 space-y-3">
                        <Button
                          variant="outline"
                          className="w-full justify-start rounded-xl border-[#8EB69B]/30 text-[#0B2B26] hover:bg-[#8EB69B] hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-[#8EB69B]/25 transition-all duration-300 ease-in-out group"
                        >
                          <Eye className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                          <span>Change Password</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start rounded-xl border-[#8EB69B]/30 text-[#0B2B26] hover:bg-[#8EB69B] hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-[#8EB69B]/25 transition-all duration-300 ease-in-out group"
                        >
                          <Shield className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                          <span>Two-Factor Authentication</span>
                        </Button>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button className="w-full bg-[#8EB69B] hover:bg-[#0B2B26] text-white rounded-xl py-3 hover:scale-105 hover:shadow-lg hover:shadow-[#8EB69B]/25 transition-all duration-300 ease-in-out group">
                        <Check className="h-4 w-4 mr-2 group-hover:scale-125 transition-transform duration-300" />
                        <span>Save Preferences</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
