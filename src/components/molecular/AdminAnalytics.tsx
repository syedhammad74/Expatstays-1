import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atomic";
import {
  BarChart3,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { Booking, Property } from "@/lib/types/firebase";

export interface AdminAnalyticsProps {
  analytics: {
    totalBookings: number;
    totalRevenue: number;
    occupancyRate: number;
    totalProperties: number;
    pendingBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    activeListings: number;
  };
  bookings: Booking[];
  properties: Property[];
}

export const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({
  analytics,
  bookings,
  properties,
}) => {
  // Calculate monthly revenue
  const monthlyRevenue = React.useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return bookings
      .filter((booking) => {
        const bookingDate = new Date(booking.createdAt || booking.checkIn);
        return (
          bookingDate.getMonth() === currentMonth &&
          bookingDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
  }, [bookings]);

  // Calculate average booking value
  const averageBookingValue = React.useMemo(() => {
    if (bookings.length === 0) return 0;
    const totalRevenue = bookings.reduce(
      (sum, booking) => sum + (booking.totalAmount || 0),
      0
    );
    return totalRevenue / bookings.length;
  }, [bookings]);

  // Calculate top performing properties
  const topProperties = React.useMemo(() => {
    const propertyBookings = bookings.reduce((acc, booking) => {
      const propertyId = booking.propertyId;
      if (!acc[propertyId]) {
        acc[propertyId] = { bookings: 0, revenue: 0, property: null };
      }
      acc[propertyId].bookings += 1;
      acc[propertyId].revenue += booking.totalAmount || 0;
      return acc;
    }, {} as Record<string, { bookings: number; revenue: number; property: Property | null }>);

    // Find property details
    Object.keys(propertyBookings).forEach((propertyId) => {
      const property = properties.find((p) => p.id === propertyId);
      if (property) {
        propertyBookings[propertyId].property = property;
      }
    });

    return Object.values(propertyBookings)
      .filter((item) => item.property)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [bookings, properties]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Revenue Analytics</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(monthlyRevenue)}
              </div>
              <div className="text-sm text-blue-600">This Month</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(analytics.totalRevenue)}
              </div>
              <div className="text-sm text-green-600">Total Revenue</div>
            </div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-700">
              {formatCurrency(averageBookingValue)}
            </div>
            <div className="text-sm text-gray-600">Average Booking Value</div>
          </div>
        </CardContent>
      </Card>

      {/* Top Properties */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Top Performing Properties</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topProperties.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No booking data available
              </div>
            ) : (
              topProperties.map((item, index) => (
                <div
                  key={item.property?.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-sm">
                        {item.property?.title || "Unknown Property"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.bookings} bookings
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sm">
                      {formatCurrency(item.revenue)}
                    </div>
                    <div className="text-xs text-gray-500">Revenue</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Quick Stats</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {analytics.totalBookings}
              </div>
              <div className="text-sm text-blue-600">Total Bookings</div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {analytics.occupancyRate}%
              </div>
              <div className="text-sm text-green-600">Occupancy Rate</div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {analytics.totalProperties}
              </div>
              <div className="text-sm text-purple-600">Total Properties</div>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {analytics.pendingBookings}
              </div>
              <div className="text-sm text-orange-600">Pending Bookings</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
