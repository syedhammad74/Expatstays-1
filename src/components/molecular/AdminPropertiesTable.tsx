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
import { Input } from "@/components/atomic";
import {
  Home,
  Eye,
  Edit,
  Trash2,
  MapPin,
  BedDouble,
  Bath,
  Users,
  DollarSign,
} from "lucide-react";
import { Property } from "@/lib/types/firebase";

export interface AdminPropertiesTableProps {
  properties: Property[];
  onRefresh?: () => void;
  onViewProperty?: (property: Property) => void;
  onEditProperty?: (property: Property) => void;
  onDeleteProperty?: (propertyId: string) => void;
}

export const AdminPropertiesTable: React.FC<AdminPropertiesTableProps> = ({
  properties,
  onRefresh,
  onViewProperty,
  onEditProperty,
  onDeleteProperty,
}) => {
  const [search, setSearch] = useState("");

  // Filter properties
  const filteredProperties = useMemo(() => {
    if (!search) return properties;

    return properties.filter(
      (property) =>
        property.title?.toLowerCase().includes(search.toLowerCase()) ||
        (property.location.city?.toLowerCase().includes(search.toLowerCase()) ||
          property.location.address?.toLowerCase().includes(search.toLowerCase())) ||
        property.id.toLowerCase().includes(search.toLowerCase())
    );
  }, [properties, search]);

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
            <Home className="h-5 w-5" />
            <span>Properties</span>
            <Badge variant="secondary">{filteredProperties.length}</Badge>
          </CardTitle>
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh}>
              Refresh
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Search properties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProperties.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-gray-500"
                  >
                    No properties found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProperties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell>
                      <div className="max-w-48">
                        <p className="font-medium truncate">
                          {property.title || "Untitled Property"}
                        </p>
                        <p className="text-sm text-gray-500 font-mono">
                          {property.id.slice(0, 8)}...
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm truncate max-w-32">
                          {property.location.city || "Unknown"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <BedDouble className="h-3 w-3" />
                          <span>{property.capacity.bedrooms || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Bath className="h-3 w-3" />
                          <span>{property.capacity.bathrooms || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{property.capacity.maxGuests || 0}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">
                          {formatCurrency(property.pricing.basePrice || 0)}
                        </span>
                        <span className="text-sm text-gray-500">/night</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          property.availability.isActive ? "default" : "destructive"
                        }
                        className={
                          property.availability.isActive
                            ? "bg-green-100 text-green-800"
                            : ""
                        }
                      >
                        {property.availability.isActive ? "Available" : "Unavailable"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewProperty?.(property)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditProperty?.(property)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteProperty?.(property.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
          <span>Total: {properties.length}</span>
          <span>
            Available: {properties.filter((p) => p.availability.isActive).length}
          </span>
          <span>
            Unavailable: {properties.filter((p) => !p.availability.isActive).length}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
