"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { bookingService } from "@/lib/services/bookings";
import { propertyService } from "@/lib/services/properties";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DecorativeElements } from "@/components/ui/decorative-elements";
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
  Clock,
  ChevronRight,
  Gift,
  Award,
  Bookmark,
  Camera,
  Trash2,
} from "lucide-react";
import { Booking, Property } from "@/lib/types/firebase";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
// Removed framer-motion for performance

export default function ProfilePage() {
  const router = useRouter();
  const {
    user,
    userProfile,
    updateUserProfile,
    loading: authLoading,
    logout,
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
    bio: "",
    location: "",
  });
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);
  const { toast } = useToast();

  const loadUserBookings = useCallback(async () => {
    if (!user) return;

    setLoadingBookings(true);
    try {
      const userBookings = await bookingService.getUserBookings(user.uid);
      setBookings(userBookings);

      // Separate active and past bookings
      const now = new Date();
      const active = userBookings.filter(
        (booking) =>
          new Date(booking.dates.checkOut) >= now ||
          booking.status === "confirmed" ||
          booking.status === "pending"
      );
      const past = userBookings.filter(
        (booking) =>
          new Date(booking.dates.checkOut) < now &&
          booking.status !== "confirmed" &&
          booking.status !== "pending"
      );

      setActiveBookings(active);
      setPastBookings(past);
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
      // Load featured properties as recommended properties
      const featuredProperties = await propertyService.getFeaturedProperties(6);
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
        firstName: userProfile.profile.firstName || "",
        lastName: userProfile.profile.lastName || "",
        phone: userProfile.profile.phone || "",
        bio: userProfile.profile.bio || "",
        location: userProfile.profile.location || "",
      });
    }
  }, [userProfile]);

  useEffect(() => {
    if (user) {
      loadUserBookings();
    }
    loadRecommendedProperties();
  }, [user, loadUserBookings, loadRecommendedProperties]);

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
        firstName: userProfile.profile.firstName || "",
        lastName: userProfile.profile.lastName || "",
        phone: userProfile.profile.phone || "",
        bio: userProfile.profile.bio || "",
        location: userProfile.profile.location || "",
      });
    }
    setEditingProfile(false);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      toast({
        title: "Success",
        description: "You have logged out successfully.",
        variant: "default",
      });
      router.push("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F4F8] via-white to-[#DAF1DE]/40 relative">
      {/* Decorative elements in the background */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none">
        <DecorativeElements variant="default" density="low" />
      </div>

      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-20 md:pt-28">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="relative">
            {/* Decorative Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#8EB69B]/5 via-transparent to-[#0B2B26]/5 rounded-3xl" />
            <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-[#8EB69B]/10 rounded-full blur-2xl" />

            <div className="relative bg-white/90 backdrop-blur-xl border border-[#8EB69B]/20 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-xl">
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-3 sm:gap-4">
                <div className="flex flex-col sm:flex-row items-center sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full">
                  <div className="relative group">
                    <Avatar className="h-16 w-16 sm:h-24 sm:w-24 border-4 border-[#8EB69B]/20 group-hover:border-[#8EB69B]/50 transition-all duration-300">
                      <AvatarImage
                        src={user.photoURL || undefined}
                        alt={user.displayName || "User"}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-[#8EB69B] to-[#0B2B26] text-white text-lg sm:text-xl font-semibold">
                        {user.displayName ? getInitials(user.displayName) : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8 rounded-full bg-white border-[#8EB69B]/30 hover:bg-[#8EB69B] hover:text-white"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-center sm:text-left w-full">
                    <h1 className="text-xl sm:text-2xl font-bold text-[#163832]">
                      Welcome back,{" "}
                      {userProfile?.profile.firstName ||
                        user.displayName?.split(" ")[0] ||
                        "Guest"}
                    </h1>
                    <p className="text-[#235347]/70 mt-1 text-xs sm:text-sm">
                      Here&apos;s your latest activity and preferences.
                    </p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1 mt-1">
                      <Badge className="bg-[#8EB69B]/20 text-[#163832] hover:bg-[#8EB69B]/30 transition-colors duration-300">
                        <Clock className="h-3 w-3 mr-1" />
                        Member since{" "}
                        {new Date(
                          user.metadata.creationTime || ""
                        ).toLocaleDateString()}
                      </Badge>
                      {userProfile?.profile.location && (
                        <Badge className="bg-[#8EB69B]/20 text-[#163832] hover:bg-[#8EB69B]/30 transition-colors duration-300">
                          <MapPin className="h-3 w-3 mr-1" />
                          {userProfile.profile.location}
                        </Badge>
                      )}
                      <Badge className="bg-[#8EB69B]/20 text-[#163832] hover:bg-[#8EB69B]/30 transition-colors duration-300">
                        <Award className="h-3 w-3 mr-1" />
                        Verified User
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 mt-3 sm:mt-0 w-full sm:w-auto justify-center sm:justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/profile/settings")}
                    className="rounded-full border-[#8EB69B]/30 text-[#0B2B26] hover:bg-[#8EB69B] hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-[#8EB69B]/25 transition-all duration-300 ease-in-out w-10 h-10 sm:w-auto sm:h-auto group"
                  >
                    <Settings className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                    <span className="hidden sm:inline ml-2">Settings</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="rounded-full border-[#8EB69B]/30 text-[#0B2B26] hover:bg-red-500 hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 ease-in-out w-10 h-10 sm:w-auto sm:h-auto group"
                  >
                    <LogOut className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    <span className="hidden sm:inline ml-2">
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-4">
            <Card className="bg-white/90 backdrop-blur-xl border-[#8EB69B]/20 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-[#235347]/60">
                      Total Bookings
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-[#163832]">
                      {bookings.length}
                    </p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#8EB69B]/20 to-[#0B2B26]/20 rounded-xl flex items-center justify-center">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-[#8EB69B]" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/90 backdrop-blur-xl border-[#8EB69B]/20 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-[#235347]/60">
                      Active Bookings
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-[#163832]">
                      {activeBookings.length}
                    </p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#8EB69B]/20 to-[#0B2B26]/20 rounded-xl flex items-center justify-center">
                    <BedDouble className="h-4 w-4 sm:h-5 sm:w-5 text-[#8EB69B]" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/90 backdrop-blur-xl border-[#8EB69B]/20 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-[#235347]/60">
                      Saved Properties
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-[#163832]">
                      {userProfile?.savedProperties?.length || 0}
                    </p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#8EB69B]/20 to-[#0B2B26]/20 rounded-xl flex items-center justify-center">
                    <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-[#8EB69B]" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/90 backdrop-blur-xl border-[#8EB69B]/20 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-[#235347]/60">
                      Loyalty Points
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-[#163832]">
                      {userProfile?.loyaltyPoints || 0}
                    </p>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#8EB69B]/20 to-[#0B2B26]/20 rounded-xl flex items-center justify-center">
                    <Gift className="h-4 w-4 sm:h-5 sm:w-5 text-[#8EB69B]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="bg-white/80 backdrop-blur-xl border border-[#8EB69B]/20 rounded-2xl p-2 shadow-lg">
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
                <Bookmark className="h-4 w-4 group-hover:scale-110 group-hover:text-[#8EB69B] transition-all duration-300" />
                Saved
              </TabsTrigger>
              <TabsTrigger
                value="recommended"
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Card className="bg-white/80 backdrop-blur-xl border-[#8EB69B]/20 rounded-xl shadow-xl h-full">
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
                            First Name <span className="text-red-500">*</span>
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
                            Last Name <span className="text-red-500">*</span>
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

                      <div>
                        <Label
                          htmlFor="location"
                          className="text-[#163832] font-medium"
                        >
                          Location
                        </Label>
                        <Input
                          id="location"
                          value={profileData.location}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              location: e.target.value,
                            }))
                          }
                          disabled={!editingProfile}
                          className={`mt-2 rounded-xl border-[#8EB69B]/30 focus:border-[#8EB69B] focus:ring-[#8EB69B]/20 ${
                            !editingProfile ? "bg-[#FAFAFA]" : ""
                          }`}
                          placeholder="City, Country"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="bio"
                          className="text-[#163832] font-medium"
                        >
                          Bio
                        </Label>
                        <textarea
                          id="bio"
                          value={profileData.bio}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              bio: e.target.value,
                            }))
                          }
                          disabled={!editingProfile}
                          className={`mt-2 rounded-xl border-[#8EB69B]/30 focus:border-[#8EB69B] focus:ring-[#8EB69B]/20 w-full p-2 ${
                            !editingProfile ? "bg-[#FAFAFA]" : ""
                          }`}
                          placeholder="Tell us a bit about yourself..."
                          rows={4}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card className="bg-white/80 backdrop-blur-xl border-[#8EB69B]/20 rounded-2xl shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-[#163832]">
                        Account Security
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-[#8EB69B]" />
                            <span className="text-sm font-medium text-[#163832]">
                              Email Verification
                            </span>
                          </div>
                          <Badge
                            className={
                              user.emailVerified
                                ? "bg-[#8EB69B]/20 text-[#163832]"
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {user.emailVerified ? "Verified" : "Unverified"}
                          </Badge>
                        </div>
                        {!user.emailVerified && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-2 rounded-xl border-[#8EB69B]/30 text-[#0B2B26] hover:bg-[#8EB69B] hover:text-white"
                          >
                            Verify Email
                          </Button>
                        )}
                      </div>

                      <Separator className="bg-[#8EB69B]/20" />

                      <Button
                        variant="outline"
                        className="w-full justify-start rounded-xl border-red-200 text-red-600 hover:bg-red-50 group"
                      >
                        <Trash2 className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                        Delete Account
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="bookings">
              <div>
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
                      <div>
                        <Tabs defaultValue="active" className="mb-6">
                          <TabsList className="bg-[#FAFAFA] rounded-xl p-1">
                            <TabsTrigger value="active" className="rounded-lg">
                              Active ({activeBookings.length})
                            </TabsTrigger>
                            <TabsTrigger value="past" className="rounded-lg">
                              Past ({pastBookings.length})
                            </TabsTrigger>
                            <TabsTrigger value="all" className="rounded-lg">
                              All ({bookings.length})
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent
                            value="active"
                            className="mt-4 space-y-4"
                          >
                            {activeBookings.length === 0 ? (
                              <div className="text-center py-4">
                                <p className="text-[#235347]/70">
                                  No active bookings
                                </p>
                              </div>
                            ) : (
                              activeBookings.map((booking) => (
                                <BookingCard
                                  key={booking.id}
                                  booking={booking}
                                />
                              ))
                            )}
                          </TabsContent>

                          <TabsContent value="past" className="mt-4 space-y-4">
                            {pastBookings.length === 0 ? (
                              <div className="text-center py-4">
                                <p className="text-[#235347]/70">
                                  No past bookings
                                </p>
                              </div>
                            ) : (
                              pastBookings.map((booking) => (
                                <BookingCard
                                  key={booking.id}
                                  booking={booking}
                                />
                              ))
                            )}
                          </TabsContent>

                          <TabsContent value="all" className="mt-4 space-y-4">
                            {bookings.map((booking) => (
                              <BookingCard key={booking.id} booking={booking} />
                            ))}
                          </TabsContent>
                        </Tabs>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="saved">
              <div>
                <Card className="bg-white/80 backdrop-blur-xl border-[#8EB69B]/20 rounded-2xl shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-[#163832]">
                      Saved Properties
                    </CardTitle>
                    <CardDescription className="text-[#235347]/70">
                      Properties you&apos;ve saved for future reference
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Heart className="h-12 w-12 text-[#235347]/40 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2 text-[#163832]">
                        No saved properties yet
                      </h3>
                      <p className="text-[#235347]/70 mb-4">
                        Save properties you love for easy access later
                      </p>
                      <Button
                        asChild
                        className="bg-[#8EB69B] hover:bg-[#0B2B26] text-white rounded-full hover:scale-110 hover:shadow-lg hover:shadow-[#8EB69B]/25 transition-all duration-300 ease-in-out group"
                      >
                        <Link href="/properties">
                          <span>Explore Properties</span>
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="recommended">
              <div>
                <Card className="bg-white/80 backdrop-blur-xl border-[#8EB69B]/20 rounded-2xl shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-[#163832]">
                      Recommended for You
                    </CardTitle>
                    <CardDescription className="text-[#235347]/70">
                      Properties we think you&apos;ll love based on your
                      preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loadingProperties ? (
                      <div className="flex items-center justify-center h-32">
                        <Loader2 className="h-6 w-6 animate-spin text-[#8EB69B]" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {properties.map((property) => (
                          <PropertyCard key={property.id} property={property} />
                        ))}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-center pt-4">
                    <Button
                      asChild
                      variant="outline"
                      className="rounded-full border-[#8EB69B]/30 text-[#0B2B26] hover:bg-[#8EB69B] hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-[#8EB69B]/25 transition-all duration-300 ease-in-out group"
                    >
                      <Link href="/properties">
                        <span>View All Properties</span>
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="preferences">
              <div>
                <Card className="bg-white/80 backdrop-blur-xl border-[#8EB69B]/20 rounded-2xl shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-[#163832]">
                      Your Preferences
                    </CardTitle>
                    <CardDescription className="text-[#235347]/70">
                      Customize your experience and notification settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-[#163832]">
                        Communication Preferences
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-[#163832]">
                              Email Notifications
                            </Label>
                            <p className="text-sm text-[#235347]/70">
                              Receive booking updates and offers
                            </p>
                          </div>
                          <Switch
                            defaultChecked={
                              userProfile?.preferences?.emailNotifications
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-[#163832]">
                              SMS Notifications
                            </Label>
                            <p className="text-sm text-[#235347]/70">
                              Receive text messages for urgent updates
                            </p>
                          </div>
                          <Switch
                            defaultChecked={
                              userProfile?.preferences?.smsNotifications
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-[#163832]">
                              Marketing Communications
                            </Label>
                            <p className="text-sm text-[#235347]/70">
                              Receive promotional offers and newsletters
                            </p>
                          </div>
                          <Switch defaultChecked={false} />
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-[#8EB69B]/20" />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-[#163832]">
                        Display Preferences
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-[#163832]">Currency</Label>
                          <Select
                            defaultValue={
                              userProfile?.preferences?.currency || "USD"
                            }
                          >
                            <SelectTrigger className="mt-2 rounded-xl border-[#8EB69B]/30">
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD">USD ($)</SelectItem>
                              <SelectItem value="EUR">EUR (€)</SelectItem>
                              <SelectItem value="GBP">GBP (£)</SelectItem>
                              <SelectItem value="AED">AED (د.إ)</SelectItem>
                              <SelectItem value="AUD">AUD ($)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-[#163832]">Language</Label>
                          <Select
                            defaultValue={
                              userProfile?.preferences?.language || "en"
                            }
                          >
                            <SelectTrigger className="mt-2 rounded-xl border-[#8EB69B]/30">
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="es">Spanish</SelectItem>
                              <SelectItem value="fr">French</SelectItem>
                              <SelectItem value="de">German</SelectItem>
                              <SelectItem value="ar">Arabic</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-[#8EB69B]/20" />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-[#163832]">
                        Travel Preferences
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-[#163832]">
                            Preferred Property Types
                          </Label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                            <Button
                              variant="outline"
                              className="rounded-xl border-[#8EB69B]/30 bg-[#8EB69B]/10 hover:bg-[#8EB69B]/20"
                            >
                              Apartments
                            </Button>
                            <Button
                              variant="outline"
                              className="rounded-xl border-[#8EB69B]/30 hover:bg-[#8EB69B]/10"
                            >
                              Villas
                            </Button>
                            <Button
                              variant="outline"
                              className="rounded-xl border-[#8EB69B]/30 hover:bg-[#8EB69B]/10"
                            >
                              Houses
                            </Button>
                            <Button
                              variant="outline"
                              className="rounded-xl border-[#8EB69B]/30 hover:bg-[#8EB69B]/10"
                            >
                              Penthouses
                            </Button>
                            <Button
                              variant="outline"
                              className="rounded-xl border-[#8EB69B]/30 hover:bg-[#8EB69B]/10"
                            >
                              Townhouses
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button className="bg-[#8EB69B] hover:bg-[#0B2B26] text-white rounded-full hover:scale-110 hover:shadow-lg hover:shadow-[#8EB69B]/25 transition-all duration-300 ease-in-out">
                        Save Preferences
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// Booking Card Component
function BookingCard({ booking }: { booking: Booking }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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

  const getTimeUntilCheckIn = (checkInDate: string) => {
    const now = new Date();
    const checkIn = new Date(checkInDate);
    const diffTime = checkIn.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Check-in passed";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 7) return `${diffDays} days`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks`;
    return `${Math.floor(diffDays / 30)} months`;
  };

  return (
    <Card className="border-[#8EB69B]/20 bg-white/60 backdrop-blur-sm rounded-xl hover:shadow-md transition-all duration-300 overflow-hidden">
      <CardContent className="p-3">
        <div className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-1/4 h-28 md:h-32">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 md:hidden"></div>
            <div className="absolute bottom-4 left-4 z-20 md:hidden">
              <Badge
                className={`${getStatusColor(booking.status)} rounded-full`}
              >
                {booking.status}
              </Badge>
            </div>
          </div>
          <div className="p-3 w-full md:w-3/4">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-[#163832] text-base">
                    {booking.propertyName || `Booking #${booking.id.slice(-8)}`}
                  </h4>
                  <Badge
                    className={`${getStatusColor(
                      booking.status
                    )} rounded-full hidden md:flex text-xs`}
                  >
                    {booking.status}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#235347]/70">
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
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#8EB69B]" />
                    {getTimeUntilCheckIn(booking.dates.checkIn)}
                  </div>
                </div>
                <div className="text-xs">
                  <span className="font-medium text-[#163832]">Total: </span>$
                  {booking.pricing.total} {booking.pricing.currency}
                </div>
              </div>
              <div className="text-right mt-2 md:mt-0">
                <div className="text-base font-semibold text-[#163832]">
                  ${booking.pricing.basePrice}/night
                </div>
                <div className="text-xs text-[#235347]/60">
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

            <div className="mt-4 flex flex-wrap gap-3">
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
                  className="rounded-full border-[#8EB69B]/30 text-[#0B2B26] hover:bg-[#8EB69B] hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-[#8EB69B]/25 transition-all duration-300 ease-in-out"
                >
                  Modify Booking
                </Button>
              )}
              {booking.status === "completed" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-[#8EB69B]/30 text-[#0B2B26] hover:bg-[#8EB69B] hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-[#8EB69B]/25 transition-all duration-300 ease-in-out"
                >
                  Leave Review
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Property Card Component
function PropertyCard({ property }: { property: Property }) {
  return (
    <Card className="overflow-hidden border-[#8EB69B]/20 bg-white/60 backdrop-blur-sm rounded-xl hover:shadow-lg transition-all duration-300 group">
      <div className="relative h-32 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
        <div className="absolute top-3 right-3 z-20">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full bg-white/80 hover:bg-white text-[#235347] hover:text-[#8EB69B] backdrop-blur-sm"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute bottom-3 left-3 z-20">
          <Badge className="bg-[#8EB69B]/90 text-white backdrop-blur-sm rounded-full">
            ${property.pricing.basePrice}/night
          </Badge>
        </div>
      </div>
      <CardContent className="p-3">
        <div className="space-y-1">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-[#163832] text-base line-clamp-1">
              {property.title}
            </h3>
            <div className="flex items-center gap-1 text-[#8EB69B]">
              <Star className="h-3 w-3 fill-[#8EB69B]" />
              <span className="text-xs font-medium">
                {property.rating || "4.8"}
              </span>
            </div>
          </div>
          <p className="text-xs text-[#235347]/70 line-clamp-1">
            <MapPin className="h-3 w-3 inline mr-1" />
            {property.location.city}, {property.location.country}
          </p>
          <p className="text-xs text-[#235347]/70 line-clamp-2">
            {property.description?.substring(0, 100)}...
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <Button
          asChild
          variant="outline"
          className="w-full rounded-full border-[#8EB69B]/30 text-[#0B2B26] hover:bg-[#8EB69B] hover:text-white group text-xs py-2"
        >
          <Link href={`/properties/${property.id}`}>
            <span>View Property</span>
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
