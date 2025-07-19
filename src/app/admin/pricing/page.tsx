"use client";

import { useState, useEffect } from "react";
import { propertyService } from "@/lib/services/properties";
import { availabilityService, PricingRule } from "@/lib/services/availability";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Calendar,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  Save,
  TrendingUp,
  BarChart3,
  Home,
  ArrowLeft,
} from "lucide-react";
import { Property } from "@/lib/types/firebase";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AdminPricingPage() {
  const { toast } = useToast();

  const [properties, setProperties] = useState<Property[]>([]);
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<PricingRule | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    propertyId: "",
    startDate: "",
    endDate: "",
    price: "",
    priceType: "base" as "base" | "peak" | "seasonal",
    description: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedProperty) {
      loadPricingRules(selectedProperty);
    }
  }, [selectedProperty]);

  const loadData = async () => {
    setLoading(true);
    try {
      const allProperties = await propertyService.getAllProperties();
      setProperties(allProperties);

      if (allProperties.length > 0) {
        setSelectedProperty(allProperties[0].id);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Failed to load properties",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPricingRules = async (propertyId: string) => {
    try {
      const rules = await availabilityService.getPricingRules(propertyId);
      setPricingRules(rules);
    } catch (error) {
      console.error("Error loading pricing rules:", error);
      toast({
        title: "Error",
        description: "Failed to load pricing rules",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      propertyId: selectedProperty,
      startDate: "",
      endDate: "",
      price: "",
      priceType: "base",
      description: "",
    });
    setEditingRule(null);
  };

  const handleCreateRule = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleEditRule = (rule: PricingRule) => {
    setFormData({
      propertyId: rule.propertyId,
      startDate: rule.startDate,
      endDate: rule.endDate,
      price: rule.price.toString(),
      priceType: rule.priceType,
      description: rule.description || "",
    });
    setEditingRule(rule);
    setDialogOpen(true);
  };

  const handleDeleteRule = async (ruleId: string) => {
    if (!confirm("Are you sure you want to delete this pricing rule?")) {
      return;
    }

    try {
      await availabilityService.deletePricingRule(ruleId);
      await loadPricingRules(selectedProperty);
      toast({
        title: "Success",
        description: "Pricing rule deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting pricing rule:", error);
      toast({
        title: "Error",
        description: "Failed to delete pricing rule",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.propertyId ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.price
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid price",
        variant: "destructive",
      });
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast({
        title: "Error",
        description: "End date must be after start date",
        variant: "destructive",
      });
      return;
    }

    try {
      const ruleData = {
        propertyId: formData.propertyId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        price,
        priceType: formData.priceType,
        isActive: true,
        description: formData.description,
      };

      if (editingRule) {
        await availabilityService.updatePricingRule(editingRule.id, ruleData);
        toast({
          title: "Success",
          description: "Pricing rule updated successfully",
        });
      } else {
        await availabilityService.createPricingRule(ruleData);
        toast({
          title: "Success",
          description: "Pricing rule created successfully",
        });
      }

      setDialogOpen(false);
      resetForm();
      await loadPricingRules(selectedProperty);
    } catch (error) {
      console.error("Error saving pricing rule:", error);
      toast({
        title: "Error",
        description: "Failed to save pricing rule",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPriceTypeColor = (type: string) => {
    switch (type) {
      case "peak":
        return "bg-red-100 text-red-800";
      case "seasonal":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const selectedPropertyData = properties.find(
    (p) => p.id === selectedProperty
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] via-white to-[#DAF1DE]/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#8EB69B] mx-auto mb-4" />
          <p className="text-[#235347]">Loading pricing management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] via-white to-[#DAF1DE]/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#163832] mb-2">
                Pricing Management
              </h1>
              <p className="text-[#235347]/70">
                Set and manage pricing rules for your properties
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleCreateRule}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Pricing Rule
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {editingRule ? "Edit" : "Create"} Pricing Rule
                    </DialogTitle>
                    <DialogDescription>
                      Set custom pricing for specific date ranges
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={formData.startDate}
                          onChange={(e) =>
                            handleInputChange("startDate", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="endDate">End Date</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={formData.endDate}
                          onChange={(e) =>
                            handleInputChange("endDate", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Price per Night</Label>
                        <Input
                          id="price"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="199.00"
                          value={formData.price}
                          onChange={(e) =>
                            handleInputChange("price", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="priceType">Price Type</Label>
                        <Select
                          value={formData.priceType}
                          onValueChange={(value) =>
                            handleInputChange("priceType", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="base">Base Price</SelectItem>
                            <SelectItem value="peak">Peak Season</SelectItem>
                            <SelectItem value="seasonal">Seasonal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">
                        Description (Optional)
                      </Label>
                      <Input
                        id="description"
                        placeholder="e.g., Summer peak season, Holiday rates..."
                        value={formData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                      />
                    </div>

                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">
                        <Save className="h-4 w-4 mr-2" />
                        {editingRule ? "Update" : "Create"} Rule
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Property Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Select Property
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="propertySelect">Property</Label>
                <Select
                  value={selectedProperty}
                  onValueChange={setSelectedProperty}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a property" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.title} - {property.location.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedPropertyData && (
                <div className="space-y-2">
                  <Label>Base Price</Label>
                  <div className="text-2xl font-bold text-[#8EB69B]">
                    {formatCurrency(selectedPropertyData.pricing.basePrice)} /
                    night
                  </div>
                  <p className="text-sm text-[#235347]/70">
                    Current base pricing for this property
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pricing Rules Table */}
        {selectedProperty && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing Rules
              </CardTitle>
              <CardDescription>
                Custom pricing rules for {selectedPropertyData?.title}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pricingRules.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-[#235347]/30 mx-auto mb-4" />
                  <p className="text-[#235347]/70 mb-4">
                    No pricing rules set for this property
                  </p>
                  <Button onClick={handleCreateRule}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Rule
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date Range</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pricingRules.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">
                              {formatDate(rule.startDate)} -{" "}
                              {formatDate(rule.endDate)}
                            </div>
                            <div className="text-[#235347]/70">
                              {Math.ceil(
                                (new Date(rule.endDate).getTime() -
                                  new Date(rule.startDate).getTime()) /
                                  (1000 * 60 * 60 * 24)
                              )}{" "}
                              days
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-lg">
                            {formatCurrency(rule.price)}
                          </div>
                          <div className="text-xs text-[#235347]/70">
                            per night
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getPriceTypeColor(
                              rule.priceType
                            )} text-xs`}
                          >
                            {rule.priceType.charAt(0).toUpperCase() +
                              rule.priceType.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {rule.description || "-"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={rule.isActive ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {rule.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditRule(rule)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteRule(rule.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
