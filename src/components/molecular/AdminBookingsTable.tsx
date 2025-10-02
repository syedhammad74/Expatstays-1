import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atomic";
import { Button } from "@/components/atomic";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/atomic";
import {
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  User,
  DollarSign,
} from "lucide-react";
import { Booking } from "@/lib/types/firebase";

export interface AdminBookingsTableProps {
  bookings: Booking[];
  onRefresh?: () => void;
  onViewBooking?: (booking: Booking) => void;
  onUpdateStatus?: (bookingId: string, status: string) => void;
}

export const AdminBookingsTable: React.FC<AdminBookingsTableProps> = ({
  bookings,
  onRefresh,
  onViewBooking,
  onUpdateStatus,
}) => {
  const [filter, setFilter] = useState({
    status: "all",
    search: "",
  });

  // Filter bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesStatus =
        filter.status === "all" || booking.status === filter.status;
      const matchesSearch =
        filter.search === "" ||
        booking.guestName
          ?.toLowerCase()
          .includes(filter.search.toLowerCase()) ||
        booking.propertyTitle
          ?.toLowerCase()
          .includes(filter.search.toLowerCase()) ||
        booking.id.toLowerCase().includes(filter.search.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [bookings, filter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Confirmed
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Recent Bookings</span>
            <Badge variant="secondary">{filteredBookings.length}</Badge>
          </CardTitle>
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh}>
              Refresh
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search bookings..."
              value={filter.search}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            />
          </div>
          <Select
            value={filter.status}
            onValueChange={(value) => setFilter({ ...filter, status: value })}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-gray-500"
                  >
                    No bookings found
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-mono text-sm">
                      {booking.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>{booking.guestName || "Unknown"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-48">
                        <p className="font-medium truncate">
                          {booking.propertyTitle || "Unknown Property"}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {booking.propertyLocation || "Unknown Location"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{formatDate(booking.checkIn)}</p>
                        <p className="text-gray-500">
                          to {formatDate(booking.checkOut)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">
                          {formatCurrency(booking.totalAmount || 0)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewBooking?.(booking)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {booking.status === "pending" && onUpdateStatus && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                onUpdateStatus(booking.id, "confirmed")
                              }
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                onUpdateStatus(booking.id, "cancelled")
                              }
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Summary */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
          <span>Total: {bookings.length}</span>
          <span>
            Pending: {bookings.filter((b) => b.status === "pending").length}
          </span>
          <span>
            Confirmed: {bookings.filter((b) => b.status === "confirmed").length}
          </span>
          <span>
            Cancelled: {bookings.filter((b) => b.status === "cancelled").length}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
