import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atomic";
import {
  Users,
  Home,
  DollarSign,
  Calendar,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: "increase" | "decrease";
  icon: React.ReactNode;
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon,
  description,
}) => {
  const isPositive = changeType === "increase";
  const isNegative = changeType === "decrease";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <div className="text-gray-400">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {change !== undefined && (
          <div className="flex items-center space-x-1 text-xs">
            {isPositive ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : isNegative ? (
              <TrendingDown className="h-3 w-3 text-red-500" />
            ) : null}
            <span
              className={`
              ${isPositive ? "text-green-500" : ""}
              ${isNegative ? "text-red-500" : ""}
              ${!isPositive && !isNegative ? "text-gray-500" : ""}
            `}
            >
              {change > 0 ? "+" : ""}
              {change}%
            </span>
            <span className="text-gray-500">from last month</span>
          </div>
        )}
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export interface AdminStatsProps {
  stats: {
    totalBookings: number;
    totalRevenue: number;
    occupancyRate: number;
    totalProperties: number;
    pendingBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    activeListings: number;
  };
  loading?: boolean;
}

export const AdminStats: React.FC<AdminStatsProps> = ({
  stats,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Total Bookings"
        value={stats.totalBookings}
        change={12}
        changeType="increase"
        icon={<Calendar className="h-4 w-4" />}
        description="All time bookings"
      />

      <StatCard
        title="Total Revenue"
        value={`$${stats.totalRevenue.toLocaleString()}`}
        change={8}
        changeType="increase"
        icon={<DollarSign className="h-4 w-4" />}
        description="This month"
      />

      <StatCard
        title="Occupancy Rate"
        value={`${stats.occupancyRate}%`}
        change={-3}
        changeType="decrease"
        icon={<Home className="h-4 w-4" />}
        description="Average occupancy"
      />

      <StatCard
        title="Active Properties"
        value={stats.totalProperties}
        change={5}
        changeType="increase"
        icon={<Users className="h-4 w-4" />}
        description="Listed properties"
      />
    </div>
  );
};
