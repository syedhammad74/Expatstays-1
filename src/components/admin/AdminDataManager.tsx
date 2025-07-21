"use client";

import React, { useState, useEffect } from "react";
import {
  AdminDataService,
  AdminDataItem,
  RealtimeAdminData,
} from "@/lib/services/admin-data";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Activity,
  Database,
  Cloud,
  Search,
  Loader2,
  CheckCircle,
  Archive,
  Clock,
  Tags,
  FileText,
  Settings,
  X,
  Home,
  Zap,
} from "lucide-react";

interface AdminDataManagerProps {
  className?: string;
}

const adminDataService = AdminDataService.getInstance();

export function AdminDataManager({ className }: AdminDataManagerProps) {
  const { toast } = useToast();

  // State management
  const [firestoreData, setFirestoreData] = useState<AdminDataItem[]>([]);
  const [activityFeed, setActivityFeed] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [firestoreConnected, setFirestoreConnected] = useState(false);
  const [realtimeConnected, setRealtimeConnected] = useState(false);

  // UI state
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AdminDataItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    data: "",
    priority: "medium" as "low" | "medium" | "high",
    status: "active" as "active" | "inactive" | "archived",
    tags: "",
    image: "" as string, // new field for image URL or base64
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Statistics
  const [statistics, setStatistics] = useState({
    totalItems: 0,
    itemsByCategory: {} as Record<string, number>,
    itemsByStatus: {} as Record<string, number>,
    itemsByPriority: {} as Record<string, number>,
    recentActivity: 0,
  });

  useEffect(() => {
    initializeDataManager();
    loadData();
    setupSubscriptions();
  }, []);

  const initializeDataManager = () => {
    setLoading(true);

    // Simulate connection status
    setTimeout(() => {
      setFirestoreConnected(true);
      setRealtimeConnected(true);
    }, 1000);
  };

  const loadData = async () => {
    try {
      const [firestoreItems, stats] = await Promise.all([
        adminDataService.getAllAdminData(),
        adminDataService.getStatistics(),
      ]);

      setFirestoreData(firestoreItems);
      setStatistics(stats);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const setupSubscriptions = () => {
    try {
      // Subscribe to Firestore data
      const unsubscribeFirestore = adminDataService.subscribeToFirestoreData(
        (data) => {
          setFirestoreData(data);
        }
      );

      // Subscribe to Realtime Database
      const unsubscribeRealtime = adminDataService.subscribeToRealtimeData(
        (data) => {
          // setRealtimeData(data); // This variable is no longer used
        }
      );

      // Subscribe to activity feed
      const unsubscribeActivity = adminDataService.subscribeToActivityFeed(
        (activities) => {
          setActivityFeed(activities.slice(0, 20)); // Show last 20 activities
        }
      );

      // Cleanup subscriptions
      return () => {
        unsubscribeFirestore();
        unsubscribeRealtime();
        unsubscribeActivity();
      };
    } catch (error) {
      console.error("Error setting up subscriptions:", error);
    }
  };

  const handleCreate = async () => {
    if (!formData.title || !formData.description || !formData.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const dataToCreate = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        data: formData.data ? JSON.parse(formData.data) : {},
        priority: formData.priority,
        status: formData.status,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        image: formData.image, // Include image in the data
        createdBy: "admin", // In a real app, this would be the current user
      };

      await adminDataService.createAdminData(dataToCreate);

      resetForm();
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Data created successfully in both databases",
      });

      loadData(); // Refresh data
    } catch (error) {
      console.error("Error creating data:", error);
      toast({
        title: "Error",
        description: "Failed to create data",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async () => {
    if (!selectedItem || !formData.title) {
      return;
    }

    try {
      const updates = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        data: formData.data ? JSON.parse(formData.data) : {},
        priority: formData.priority,
        status: formData.status,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        image: formData.image, // Include image in the updates
        createdBy: "admin",
      };

      await adminDataService.updateAdminData(selectedItem.id!, updates);

      resetForm();
      setIsEditDialogOpen(false);
      setSelectedItem(null);
      toast({
        title: "Success",
        description: "Data updated successfully in both databases",
      });

      loadData(); // Refresh data
    } catch (error) {
      console.error("Error updating data:", error);
      toast({
        title: "Error",
        description: "Failed to update data",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminDataService.deleteAdminData(id);
      toast({
        title: "Success",
        description: "Data deleted successfully from both databases",
      });
      loadData(); // Refresh data
    } catch (error) {
      console.error("Error deleting data:", error);
      toast({
        title: "Error",
        description: "Failed to delete data",
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) {
      toast({
        title: "Error",
        description: "Please select items to delete",
        variant: "destructive",
      });
      return;
    }

    try {
      await adminDataService.bulkDeleteAdminData(Array.from(selectedItems));
      setSelectedItems(new Set());
      toast({
        title: "Success",
        description: `${selectedItems.size} items deleted successfully`,
      });
      loadData(); // Refresh data
    } catch (error) {
      console.error("Error bulk deleting data:", error);
      toast({
        title: "Error",
        description: "Failed to delete selected items",
        variant: "destructive",
      });
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await adminDataService.syncDatabases();
      toast({
        title: "Success",
        description: "Databases synchronized successfully",
      });
      loadData(); // Refresh data
    } catch (error) {
      console.error("Error syncing databases:", error);
      toast({
        title: "Error",
        description: "Failed to sync databases",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  const handlePopulateDemoData = async () => {
    try {
      const { populateDemoData } = await import("@/utils/demo-admin-data");
      await populateDemoData();
      toast({
        title: "Success",
        description: "Admin demo data populated successfully",
      });
      loadData(); // Refresh data
    } catch (error) {
      console.error("Error populating demo data:", error);
      toast({
        title: "Error",
        description: "Failed to populate demo data",
        variant: "destructive",
      });
    }
  };

  const handlePopulatePropertyDemoData = async () => {
    try {
      const { populatePropertyDemoData } = await import(
        "@/utils/populate-property-demo-data"
      );
      await populatePropertyDemoData();
      toast({
        title: "Success",
        description:
          "Property demo data populated successfully! Check the Properties section.",
      });
    } catch (error) {
      console.error("Error populating property demo data:", error);
      toast({
        title: "Error",
        description: "Failed to populate property demo data",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      data: "",
      priority: "medium",
      status: "active",
      tags: "",
      image: "",
    });
    setImagePreview(null);
  };

  const openEditDialog = (item: AdminDataItem) => {
    setSelectedItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      data: JSON.stringify(item.data, null, 2),
      priority: item.priority,
      status: item.status,
      tags: item.tags.join(", "),
      image: item.image || "", // Set image preview
    });
    setIsEditDialogOpen(true);
  };

  // Filter data based on search and filters
  const filteredData = firestoreData.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || item.priority === priorityFilter;

    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  const categories = [...new Set(firestoreData.map((item) => item.category))];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500 text-white";
      case "medium":
        return "bg-[#8EB69B] text-white";
      case "low":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-[#8EB69B] text-white";
      case "inactive":
        return "bg-yellow-500 text-white";
      case "archived":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#8EB69B] mx-auto" />
          <p className="text-[#235347]">Loading Data Manager...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Connection Status */}
      <Card className="bg-gradient-to-r from-[#DAF1DE]/30 to-white border-[#8EB69B]/20 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-[#051F20] flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#8EB69B]/10 flex items-center justify-center">
                  <Database className="h-5 w-5 text-[#8EB69B]" />
                </div>
                Admin Data Manager
              </CardTitle>
              <CardDescription className="text-[#235347]/70 mt-2">
                Manage data across both Firestore and Realtime Database with
                real-time synchronization
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              {/* Connection Status */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      firestoreConnected ? "bg-[#8EB69B]" : "bg-red-500"
                    }`}
                  />
                  <span className="text-sm text-[#235347]">Firestore</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      realtimeConnected ? "bg-[#8EB69B]" : "bg-red-500"
                    }`}
                  />
                  <span className="text-sm text-[#235347]">Realtime DB</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-[#8EB69B]/20 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#235347]">
                    Total Items
                  </p>
                  <p className="text-3xl font-bold text-[#051F20]">
                    {statistics.totalItems}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-[#8EB69B]/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-[#8EB69B]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-[#8EB69B]/20 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#235347]">
                    Categories
                  </p>
                  <p className="text-3xl font-bold text-[#051F20]">
                    {categories.length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Tags className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-[#8EB69B]/20 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#235347]">
                    Active Items
                  </p>
                  <p className="text-3xl font-bold text-[#051F20]">
                    {statistics.itemsByStatus.active || 0}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-[#8EB69B]/20 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#235347]">
                    Recent Activity
                  </p>
                  <p className="text-3xl font-bold text-[#051F20]">
                    {activityFeed.length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Controls */}
      <Card className="bg-white/80 backdrop-blur-sm border-[#8EB69B]/20">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg text-[#235347]">
                Data Management
              </CardTitle>
              <CardDescription>
                Create, edit, and manage your admin data
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Create Button */}
              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-[#8EB69B] to-[#235347] hover:from-[#235347] hover:to-[#051F20] text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Data
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[700px] bg-gradient-to-br from-white via-[#FAFAFA] to-[#DAF1DE]/20 border-[#8EB69B]/30 shadow-2xl backdrop-blur-sm">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <DialogHeader className="border-b border-[#8EB69B]/20 pb-4 mb-6">
                      <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#051F20] to-[#235347] bg-clip-text text-transparent flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#8EB69B]/20 to-[#235347]/20 flex items-center justify-center">
                          <Plus className="h-5 w-5 text-[#8EB69B]" />
                        </div>
                        Create New Data Entry
                      </DialogTitle>
                      <DialogDescription className="text-[#235347]/70 text-lg">
                        Add new data that will be synchronized across both
                        Firestore and Realtime Database instantly
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                      {/* Main Information Section */}
                      <div className="bg-gradient-to-r from-[#DAF1DE]/30 to-white/50 rounded-xl p-6 border border-[#8EB69B]/20">
                        <h3 className="text-lg font-semibold text-[#235347] mb-4 flex items-center gap-2">
                          <FileText className="h-5 w-5 text-[#8EB69B]" />
                          Basic Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label
                              htmlFor="title"
                              className="text-[#235347] font-medium flex items-center gap-2"
                            >
                              <span className="text-red-500">*</span>
                              Title
                            </Label>
                            <Input
                              id="title"
                              value={formData.title}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  title: e.target.value,
                                }))
                              }
                              placeholder="Enter a descriptive title"
                              className="border-[#8EB69B]/30 focus:border-[#8EB69B] focus:ring-[#8EB69B]/20 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-[#8EB69B]/50"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor="category"
                              className="text-[#235347] font-medium flex items-center gap-2"
                            >
                              <span className="text-red-500">*</span>
                              Category
                            </Label>
                            <Input
                              id="category"
                              value={formData.category}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  category: e.target.value,
                                }))
                              }
                              placeholder="e.g., analytics, pricing, policies"
                              className="border-[#8EB69B]/30 focus:border-[#8EB69B] focus:ring-[#8EB69B]/20 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-[#8EB69B]/50"
                            />
                          </div>
                        </div>
                        <div className="mt-6 space-y-2">
                          <Label
                            htmlFor="description"
                            className="text-[#235347] font-medium flex items-center gap-2"
                          >
                            <span className="text-red-500">*</span>
                            Description
                          </Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            placeholder="Provide a detailed description of this data entry..."
                            className="border-[#8EB69B]/30 focus:border-[#8EB69B] focus:ring-[#8EB69B]/20 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-[#8EB69B]/50 min-h-[100px]"
                            rows={4}
                          />
                        </div>
                      </div>

                      {/* Configuration Section */}
                      <div className="bg-gradient-to-r from-[#DAF1DE]/20 to-white/30 rounded-xl p-6 border border-[#8EB69B]/20">
                        <h3 className="text-lg font-semibold text-[#235347] mb-4 flex items-center gap-2">
                          <Settings className="h-5 w-5 text-[#8EB69B]" />
                          Configuration
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label
                              htmlFor="priority"
                              className="text-[#235347] font-medium"
                            >
                              Priority Level
                            </Label>
                            <Select
                              value={formData.priority}
                              onValueChange={(
                                value: "low" | "medium" | "high"
                              ) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  priority: value,
                                }))
                              }
                            >
                              <SelectTrigger className="border-[#8EB69B]/30 focus:border-[#8EB69B] bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-[#8EB69B]/50">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-white/95 backdrop-blur-md border-[#8EB69B]/30">
                                <SelectItem
                                  value="low"
                                  className="focus:bg-[#DAF1DE]/30"
                                >
                                  <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                    Low Priority
                                  </div>
                                </SelectItem>
                                <SelectItem
                                  value="medium"
                                  className="focus:bg-[#DAF1DE]/30"
                                >
                                  <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#8EB69B]"></div>
                                    Medium Priority
                                  </div>
                                </SelectItem>
                                <SelectItem
                                  value="high"
                                  className="focus:bg-[#DAF1DE]/30"
                                >
                                  <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    High Priority
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor="status"
                              className="text-[#235347] font-medium"
                            >
                              Status
                            </Label>
                            <Select
                              value={formData.status}
                              onValueChange={(
                                value: "active" | "inactive" | "archived"
                              ) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  status: value,
                                }))
                              }
                            >
                              <SelectTrigger className="border-[#8EB69B]/30 focus:border-[#8EB69B] bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-[#8EB69B]/50">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-white/95 backdrop-blur-md border-[#8EB69B]/30">
                                <SelectItem
                                  value="active"
                                  className="focus:bg-[#DAF1DE]/30"
                                >
                                  <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-[#8EB69B]" />
                                    Active
                                  </div>
                                </SelectItem>
                                <SelectItem
                                  value="inactive"
                                  className="focus:bg-[#DAF1DE]/30"
                                >
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-yellow-500" />
                                    Inactive
                                  </div>
                                </SelectItem>
                                <SelectItem
                                  value="archived"
                                  className="focus:bg-[#DAF1DE]/30"
                                >
                                  <div className="flex items-center gap-2">
                                    <Archive className="h-4 w-4 text-gray-500" />
                                    Archived
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Metadata Section */}
                      <div className="bg-gradient-to-r from-[#DAF1DE]/15 to-white/20 rounded-xl p-6 border border-[#8EB69B]/20">
                        <h3 className="text-lg font-semibold text-[#235347] mb-4 flex items-center gap-2">
                          <Tags className="h-5 w-5 text-[#8EB69B]" />
                          Metadata & Content
                        </h3>
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <Label
                              htmlFor="tags"
                              className="text-[#235347] font-medium"
                            >
                              Tags (comma-separated)
                            </Label>
                            <Input
                              id="tags"
                              value={formData.tags}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  tags: e.target.value,
                                }))
                              }
                              placeholder="analytics, data, reporting, dashboard"
                              className="border-[#8EB69B]/30 focus:border-[#8EB69B] focus:ring-[#8EB69B]/20 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-[#8EB69B]/50"
                            />
                            <p className="text-xs text-[#235347]/70">
                              Add relevant tags separated by commas for better
                              organization
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor="data"
                              className="text-[#235347] font-medium"
                            >
                              JSON Data (optional)
                            </Label>
                            <Textarea
                              id="data"
                              value={formData.data}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  data: e.target.value,
                                }))
                              }
                              placeholder='{\n  "example": "value",\n  "metrics": {\n    "views": 1250,\n    "conversion": 0.85\n  }\n}'
                              className="border-[#8EB69B]/30 focus:border-[#8EB69B] focus:ring-[#8EB69B]/20 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-[#8EB69B]/50 font-mono text-sm"
                              rows={6}
                            />
                            <p className="text-xs text-[#235347]/70">
                              Enter valid JSON data for structured information
                              storage
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Image Upload Section */}
                      <div className="bg-gradient-to-r from-[#DAF1DE]/15 to-white/20 rounded-xl p-6 border border-[#8EB69B]/20">
                        <h3 className="text-lg font-semibold text-[#235347] mb-4 flex items-center gap-2">
                          <Cloud className="h-5 w-5 text-[#8EB69B]" />
                          Image Upload
                        </h3>
                        <div className="space-y-2">
                          <Label className="text-[#235347] font-medium">
                            Image (optional)
                          </Label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                          {imagePreview && (
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="mt-2 rounded-lg w-32 h-32 object-cover border"
                            />
                          )}
                          <p className="text-xs text-[#235347]/70">
                            Upload an image to visually represent this data
                            entry.
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end gap-3 pt-6 border-t border-[#8EB69B]/20">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsCreateDialogOpen(false);
                            resetForm();
                          }}
                          className="border-[#8EB69B]/30 text-[#235347] hover:bg-[#8EB69B]/10 hover:border-[#8EB69B] transition-all duration-300"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleCreate}
                          className="bg-gradient-to-r from-[#8EB69B] to-[#235347] hover:from-[#235347] hover:to-[#051F20] text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create Data Entry
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </DialogContent>
              </Dialog>

              {/* Sync Button */}
              <Button
                onClick={handleSync}
                disabled={syncing}
                className="bg-[#8EB69B] hover:bg-[#235347] text-white"
              >
                {syncing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Sync DBs
              </Button>

              {/* Demo Data Button */}
              <Button
                onClick={handlePopulateDemoData}
                variant="outline"
                className="border-[#8EB69B]/30 text-[#235347] hover:bg-[#8EB69B]/10"
              >
                <Zap className="h-4 w-4 mr-2" />
                Admin Demo
              </Button>

              {/* Property Demo Data Button */}
              <Button
                onClick={handlePopulatePropertyDemoData}
                variant="outline"
                className="border-[#8EB69B]/30 text-[#235347] hover:bg-[#8EB69B]/10"
              >
                <Home className="h-4 w-4 mr-2" />
                Property Demo
              </Button>

              {/* Bulk Delete Button */}
              {selectedItems.size > 0 && (
                <Button
                  onClick={handleBulkDelete}
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete ({selectedItems.size})
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card className="bg-white/80 backdrop-blur-sm border-[#8EB69B]/20">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="search" className="text-[#235347]">
                Search
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#235347]/70" />
                <Input
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search data..."
                  className="pl-10 border-[#8EB69B]/30 focus:border-[#8EB69B]"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="category-filter" className="text-[#235347]">
                Category
              </Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="border-[#8EB69B]/30">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status-filter" className="text-[#235347]">
                Status
              </Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-[#8EB69B]/30">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority-filter" className="text-[#235347]">
                Priority
              </Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="border-[#8EB69B]/30">
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("all");
                  setStatusFilter("all");
                  setPriorityFilter("all");
                }}
                variant="outline"
                className="w-full border-[#8EB69B]/30 text-[#235347] hover:bg-[#8EB69B]/10"
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card className="bg-white/80 backdrop-blur-sm border-[#8EB69B]/20">
        <CardContent className="p-0">
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-gradient-to-r from-[#DAF1DE]/30 to-[#8EB69B]/10">
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={
                        selectedItems.size === filteredData.length &&
                        filteredData.length > 0
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems(
                            new Set(filteredData.map((item) => item.id!))
                          );
                        } else {
                          setSelectedItems(new Set());
                        }
                      }}
                      className="rounded border-[#8EB69B]/30 text-[#8EB69B] focus:ring-[#8EB69B]"
                    />
                  </TableHead>
                  <TableHead className="text-[#235347] font-semibold">
                    Title
                  </TableHead>
                  <TableHead className="text-[#235347] font-semibold">
                    Category
                  </TableHead>
                  <TableHead className="text-[#235347] font-semibold">
                    Priority
                  </TableHead>
                  <TableHead className="text-[#235347] font-semibold">
                    Status
                  </TableHead>
                  <TableHead className="text-[#235347] font-semibold">
                    Tags
                  </TableHead>
                  <TableHead className="text-[#235347] font-semibold">
                    Created
                  </TableHead>
                  <TableHead className="text-[#235347] font-semibold text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <Database className="h-12 w-12 text-[#8EB69B]/30" />
                        <div className="text-center">
                          <p className="text-[#235347] font-medium">
                            No data found
                          </p>
                          <p className="text-[#235347]/70 text-sm">
                            Create your first data item to get started
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((item) => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-[#DAF1DE]/10 transition-colors duration-200"
                    >
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedItems.has(item.id!)}
                          onChange={(e) => {
                            const newSelected = new Set(selectedItems);
                            if (e.target.checked) {
                              newSelected.add(item.id!);
                            } else {
                              newSelected.delete(item.id!);
                            }
                            setSelectedItems(newSelected);
                          }}
                          className="rounded border-[#8EB69B]/30 text-[#8EB69B] focus:ring-[#8EB69B]"
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-[#051F20]">
                            {item.title}
                          </p>
                          <p className="text-sm text-[#235347]/70 truncate max-w-xs">
                            {item.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-[#8EB69B]/30 text-[#235347] bg-[#DAF1DE]/20"
                        >
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${getPriorityColor(
                            item.priority
                          )} text-xs`}
                        >
                          {item.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${getStatusColor(item.status)} text-xs`}
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {item.tags.slice(0, 2).map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs bg-[#8EB69B]/10 text-[#235347]"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {item.tags.length > 2 && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-[#8EB69B]/10 text-[#235347]"
                            >
                              +{item.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-[#235347]/70">
                          {item.createdAt instanceof Date
                            ? item.createdAt.toLocaleDateString()
                            : new Date(
                                item.createdAt || ""
                              ).toLocaleDateString()}
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(item)}
                            className="h-8 w-8 p-0 border-[#8EB69B]/30 hover:bg-[#8EB69B]/10"
                          >
                            <Edit className="h-4 w-4 text-[#235347]" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(item.id!)}
                            className="h-8 w-8 p-0 border-red-200 hover:bg-red-50 text-red-600"
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
        </CardContent>
      </Card>

      {/* Activity Feed */}
      <Card className="bg-white/80 backdrop-blur-sm border-[#8EB69B]/20">
        <CardHeader>
          <CardTitle className="text-lg text-[#235347] flex items-center gap-2">
            <Activity className="h-5 w-5 text-[#8EB69B]" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {activityFeed.length === 0 ? (
              <p className="text-center text-[#235347]/70 py-4">
                No recent activity
              </p>
            ) : (
              activityFeed.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-[#DAF1DE]/20 to-white border border-[#8EB69B]/10"
                >
                  <div className="h-8 w-8 rounded-full bg-[#8EB69B]/10 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-[#8EB69B]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#051F20]">
                      {activity.title}
                    </p>
                    <p className="text-xs text-[#235347]/70">
                      {activity.description}
                    </p>
                  </div>
                  <div className="text-xs text-[#235347]/50">
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[700px] bg-gradient-to-br from-white via-[#FAFAFA] to-[#DAF1DE]/20 border-[#8EB69B]/30 shadow-2xl backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader className="border-b border-[#8EB69B]/20 pb-4 mb-6">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#051F20] to-[#235347] bg-clip-text text-transparent flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#8EB69B]/20 to-[#235347]/20 flex items-center justify-center">
                  <Edit className="h-5 w-5 text-[#8EB69B]" />
                </div>
                Edit Data Entry
              </DialogTitle>
              <DialogDescription className="text-[#235347]/70 text-lg">
                Update data entry with synchronization across both Firestore and
                Realtime Database
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Main Information Section */}
              <div className="bg-gradient-to-r from-[#DAF1DE]/30 to-white/50 rounded-xl p-6 border border-[#8EB69B]/20">
                <h3 className="text-lg font-semibold text-[#235347] mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#8EB69B]" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="edit-title"
                      className="text-[#235347] font-medium flex items-center gap-2"
                    >
                      <span className="text-red-500">*</span>
                      Title
                    </Label>
                    <Input
                      id="edit-title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="Enter a descriptive title"
                      className="border-[#8EB69B]/30 focus:border-[#8EB69B] focus:ring-[#8EB69B]/20 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-[#8EB69B]/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="edit-category"
                      className="text-[#235347] font-medium flex items-center gap-2"
                    >
                      <span className="text-red-500">*</span>
                      Category
                    </Label>
                    <Input
                      id="edit-category"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      placeholder="e.g., analytics, pricing, policies"
                      className="border-[#8EB69B]/30 focus:border-[#8EB69B] focus:ring-[#8EB69B]/20 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-[#8EB69B]/50"
                    />
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  <Label
                    htmlFor="edit-description"
                    className="text-[#235347] font-medium flex items-center gap-2"
                  >
                    <span className="text-red-500">*</span>
                    Description
                  </Label>
                  <Textarea
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Provide a detailed description of this data entry..."
                    className="border-[#8EB69B]/30 focus:border-[#8EB69B] focus:ring-[#8EB69B]/20 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-[#8EB69B]/50 min-h-[100px]"
                    rows={4}
                  />
                </div>
              </div>

              {/* Configuration Section */}
              <div className="bg-gradient-to-r from-[#DAF1DE]/20 to-white/30 rounded-xl p-6 border border-[#8EB69B]/20">
                <h3 className="text-lg font-semibold text-[#235347] mb-4 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-[#8EB69B]" />
                  Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="edit-priority"
                      className="text-[#235347] font-medium"
                    >
                      Priority Level
                    </Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value: "low" | "medium" | "high") =>
                        setFormData((prev) => ({ ...prev, priority: value }))
                      }
                    >
                      <SelectTrigger className="border-[#8EB69B]/30 focus:border-[#8EB69B] bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-[#8EB69B]/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-md border-[#8EB69B]/30">
                        <SelectItem
                          value="low"
                          className="focus:bg-[#DAF1DE]/30"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            Low Priority
                          </div>
                        </SelectItem>
                        <SelectItem
                          value="medium"
                          className="focus:bg-[#DAF1DE]/30"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#8EB69B]"></div>
                            Medium Priority
                          </div>
                        </SelectItem>
                        <SelectItem
                          value="high"
                          className="focus:bg-[#DAF1DE]/30"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            High Priority
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="edit-status"
                      className="text-[#235347] font-medium"
                    >
                      Status
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(
                        value: "active" | "inactive" | "archived"
                      ) => setFormData((prev) => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger className="border-[#8EB69B]/30 focus:border-[#8EB69B] bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-[#8EB69B]/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-md border-[#8EB69B]/30">
                        <SelectItem
                          value="active"
                          className="focus:bg-[#DAF1DE]/30"
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-[#8EB69B]" />
                            Active
                          </div>
                        </SelectItem>
                        <SelectItem
                          value="inactive"
                          className="focus:bg-[#DAF1DE]/30"
                        >
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-yellow-500" />
                            Inactive
                          </div>
                        </SelectItem>
                        <SelectItem
                          value="archived"
                          className="focus:bg-[#DAF1DE]/30"
                        >
                          <div className="flex items-center gap-2">
                            <Archive className="h-4 w-4 text-gray-500" />
                            Archived
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Metadata Section */}
              <div className="bg-gradient-to-r from-[#DAF1DE]/15 to-white/20 rounded-xl p-6 border border-[#8EB69B]/20">
                <h3 className="text-lg font-semibold text-[#235347] mb-4 flex items-center gap-2">
                  <Tags className="h-5 w-5 text-[#8EB69B]" />
                  Metadata & Content
                </h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="edit-tags"
                      className="text-[#235347] font-medium"
                    >
                      Tags (comma-separated)
                    </Label>
                    <Input
                      id="edit-tags"
                      value={formData.tags}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          tags: e.target.value,
                        }))
                      }
                      placeholder="analytics, data, reporting, dashboard"
                      className="border-[#8EB69B]/30 focus:border-[#8EB69B] focus:ring-[#8EB69B]/20 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-[#8EB69B]/50"
                    />
                    <p className="text-xs text-[#235347]/70">
                      Add relevant tags separated by commas for better
                      organization
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="edit-data"
                      className="text-[#235347] font-medium"
                    >
                      JSON Data (optional)
                    </Label>
                    <Textarea
                      id="edit-data"
                      value={formData.data}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          data: e.target.value,
                        }))
                      }
                      placeholder='{\n  "example": "value",\n  "metrics": {\n    "views": 1250,\n    "conversion": 0.85\n  }\n}'
                      className="border-[#8EB69B]/30 focus:border-[#8EB69B] focus:ring-[#8EB69B]/20 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:border-[#8EB69B]/50 font-mono text-sm"
                      rows={6}
                    />
                    <p className="text-xs text-[#235347]/70">
                      Enter valid JSON data for structured information storage
                    </p>
                  </div>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="bg-gradient-to-r from-[#DAF1DE]/15 to-white/20 rounded-xl p-6 border border-[#8EB69B]/20">
                <h3 className="text-lg font-semibold text-[#235347] mb-4 flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-[#8EB69B]" />
                  Image Upload
                </h3>
                <div className="space-y-2">
                  <Label className="text-[#235347] font-medium">
                    Image (optional)
                  </Label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mt-2 rounded-lg w-32 h-32 object-cover border"
                    />
                  )}
                  <p className="text-xs text-[#235347]/70">
                    Upload an image to visually represent this data entry.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-[#8EB69B]/20">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    resetForm();
                  }}
                  className="border-[#8EB69B]/30 text-[#235347] hover:bg-[#8EB69B]/10 hover:border-[#8EB69B] transition-all duration-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleEdit}
                  className="bg-gradient-to-r from-[#8EB69B] to-[#235347] hover:from-[#235347] hover:to-[#051F20] text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Update Entry
                </Button>
              </div>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
