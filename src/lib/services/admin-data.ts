import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp as firestoreServerTimestamp,
  Timestamp,
  where,
} from "firebase/firestore";
import {
  ref,
  push,
  set,
  onValue,
  off,
  serverTimestamp as realtimeServerTimestamp,
  remove,
  update,
} from "firebase/database";
import { db, realtimeDb } from "@/lib/firebase";

export interface AdminDataItem {
  id?: string;
  title: string;
  description: string;
  category: string;
  data: any;
  createdAt?: string | Timestamp;
  updatedAt?: string | Timestamp;
  createdBy: string;
  priority: "low" | "medium" | "high";
  status: "active" | "inactive" | "archived";
  tags: string[];
}

export interface RealtimeAdminData {
  [key: string]: {
    title: string;
    description: string;
    category: string;
    data: any;
    createdAt: number;
    updatedAt: number;
    createdBy: string;
    priority: "low" | "medium" | "high";
    status: "active" | "inactive" | "archived";
    tags: string[];
  };
}

export class AdminDataService {
  private static instance: AdminDataService;
  private firestoreCollection = collection(db, "admin_data");
  private realtimeRef = ref(realtimeDb, "admin_data");
  private subscribers: Map<string, () => void> = new Map();

  static getInstance(): AdminDataService {
    if (!AdminDataService.instance) {
      AdminDataService.instance = new AdminDataService();
    }
    return AdminDataService.instance;
  }

  // Create data in both databases
  async createAdminData(
    data: Omit<AdminDataItem, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    try {
      const timestamp = new Date().toISOString();
      const realtimeTimestamp = Date.now();

      // Prepare data for Firestore
      const firestoreData = {
        ...data,
        createdAt: firestoreServerTimestamp(),
        updatedAt: firestoreServerTimestamp(),
      };

      // Prepare data for Realtime Database
      const realtimeData = {
        ...data,
        createdAt: realtimeTimestamp,
        updatedAt: realtimeTimestamp,
      };

      // Write to Firestore
      const firestoreDoc = await addDoc(
        this.firestoreCollection,
        firestoreData
      );
      const docId = firestoreDoc.id;

      // Write to Realtime Database with the same ID
      const realtimeDocRef = ref(realtimeDb, `admin_data/${docId}`);
      await set(realtimeDocRef, realtimeData);

      // Also add to real-time activity feed
      await this.addToActivityFeed({
        type: "data_created",
        title: `New ${data.category} created`,
        description: data.title,
        category: data.category,
        priority: data.priority,
        createdBy: data.createdBy,
        timestamp: realtimeTimestamp,
      });

      return docId;
    } catch (error) {
      console.error("Error creating admin data:", error);
      throw error;
    }
  }

  // Update data in both databases
  async updateAdminData(
    id: string,
    updates: Partial<AdminDataItem>
  ): Promise<void> {
    try {
      const timestamp = new Date().toISOString();
      const realtimeTimestamp = Date.now();

      // Prepare updates for Firestore
      const firestoreUpdates = {
        ...updates,
        updatedAt: firestoreServerTimestamp(),
      };

      // Prepare updates for Realtime Database
      const realtimeUpdates = {
        ...updates,
        updatedAt: realtimeTimestamp,
      };

      // Update Firestore
      await updateDoc(doc(this.firestoreCollection, id), firestoreUpdates);

      // Update Realtime Database
      const realtimeDocRef = ref(realtimeDb, `admin_data/${id}`);
      await update(realtimeDocRef, realtimeUpdates);

      // Add to activity feed
      await this.addToActivityFeed({
        type: "data_updated",
        title: `${updates.category || "Item"} updated`,
        description: updates.title || `ID: ${id}`,
        category: updates.category || "general",
        priority: updates.priority || "medium",
        createdBy: updates.createdBy || "system",
        timestamp: realtimeTimestamp,
      });
    } catch (error) {
      console.error("Error updating admin data:", error);
      throw error;
    }
  }

  // Delete data from both databases
  async deleteAdminData(id: string): Promise<void> {
    try {
      // Delete from Firestore
      await deleteDoc(doc(this.firestoreCollection, id));

      // Delete from Realtime Database
      const realtimeDocRef = ref(realtimeDb, `admin_data/${id}`);
      await remove(realtimeDocRef);

      // Add to activity feed
      await this.addToActivityFeed({
        type: "data_deleted",
        title: "Item deleted",
        description: `ID: ${id}`,
        category: "general",
        priority: "medium",
        createdBy: "admin",
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("Error deleting admin data:", error);
      throw error;
    }
  }

  // Get all data from Firestore
  async getAllAdminData(): Promise<AdminDataItem[]> {
    try {
      const q = query(this.firestoreCollection, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as AdminDataItem)
      );
    } catch (error) {
      console.error("Error getting admin data:", error);
      throw error;
    }
  }

  // Get data by category
  async getAdminDataByCategory(category: string): Promise<AdminDataItem[]> {
    try {
      const q = query(
        this.firestoreCollection,
        where("category", "==", category),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as AdminDataItem)
      );
    } catch (error) {
      console.error("Error getting admin data by category:", error);
      throw error;
    }
  }

  // Real-time subscription to Realtime Database
  subscribeToRealtimeData(
    callback: (data: RealtimeAdminData) => void
  ): () => void {
    const unsubscribeId = `realtime_${Date.now()}`;

    const unsubscribe = onValue(this.realtimeRef, (snapshot) => {
      const data = snapshot.val() || {};
      callback(data);
    });

    this.subscribers.set(unsubscribeId, unsubscribe);

    return () => {
      const unsub = this.subscribers.get(unsubscribeId);
      if (unsub) {
        unsub();
        this.subscribers.delete(unsubscribeId);
      }
    };
  }

  // Real-time subscription to Firestore
  subscribeToFirestoreData(
    callback: (data: AdminDataItem[]) => void
  ): () => void {
    const q = query(this.firestoreCollection, orderBy("createdAt", "desc"));

    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as AdminDataItem)
      );
      callback(data);
    });
  }

  // Activity feed management
  private async addToActivityFeed(activity: {
    type: string;
    title: string;
    description: string;
    category: string;
    priority: string;
    createdBy: string;
    timestamp: number;
  }): Promise<void> {
    try {
      const activityRef = ref(realtimeDb, "admin_activity");
      await push(activityRef, activity);
    } catch (error) {
      console.error("Error adding to activity feed:", error);
    }
  }

  // Subscribe to activity feed
  subscribeToActivityFeed(callback: (activities: any[]) => void): () => void {
    const activityRef = ref(realtimeDb, "admin_activity");

    const unsubscribe = onValue(activityRef, (snapshot) => {
      const data = snapshot.val() || {};
      const activities = Object.entries(data)
        .map(([key, value]) => ({ id: key, ...(value as any) }))
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 50); // Keep only latest 50 activities
      callback(activities);
    });

    return unsubscribe;
  }

  // Bulk operations
  async bulkCreateAdminData(
    items: Omit<AdminDataItem, "id" | "createdAt" | "updatedAt">[]
  ): Promise<string[]> {
    try {
      const createdIds: string[] = [];

      for (const item of items) {
        const id = await this.createAdminData(item);
        createdIds.push(id);
      }

      return createdIds;
    } catch (error) {
      console.error("Error bulk creating admin data:", error);
      throw error;
    }
  }

  async bulkUpdateAdminData(
    updates: Array<{ id: string; data: Partial<AdminDataItem> }>
  ): Promise<void> {
    try {
      for (const { id, data } of updates) {
        await this.updateAdminData(id, data);
      }
    } catch (error) {
      console.error("Error bulk updating admin data:", error);
      throw error;
    }
  }

  async bulkDeleteAdminData(ids: string[]): Promise<void> {
    try {
      for (const id of ids) {
        await this.deleteAdminData(id);
      }
    } catch (error) {
      console.error("Error bulk deleting admin data:", error);
      throw error;
    }
  }

  // Sync data between databases
  async syncDatabases(): Promise<void> {
    try {
      console.log("Starting database sync...");

      // Get all data from Firestore
      const firestoreData = await this.getAllAdminData();

      // Clear Realtime Database and repopulate
      await set(this.realtimeRef, null);

      for (const item of firestoreData) {
        if (item.id) {
          const realtimeData = {
            title: item.title,
            description: item.description,
            category: item.category,
            data: item.data,
            createdAt:
              item.createdAt instanceof Timestamp
                ? item.createdAt.toMillis()
                : Date.parse(item.createdAt as string),
            updatedAt:
              item.updatedAt instanceof Timestamp
                ? item.updatedAt.toMillis()
                : Date.parse(item.updatedAt as string),
            createdBy: item.createdBy,
            priority: item.priority,
            status: item.status,
            tags: item.tags,
          };

          const realtimeDocRef = ref(realtimeDb, `admin_data/${item.id}`);
          await set(realtimeDocRef, realtimeData);
        }
      }

      console.log("Database sync completed successfully");
    } catch (error) {
      console.error("Error syncing databases:", error);
      throw error;
    }
  }

  // Statistics
  async getStatistics(): Promise<{
    totalItems: number;
    itemsByCategory: Record<string, number>;
    itemsByStatus: Record<string, number>;
    itemsByPriority: Record<string, number>;
    recentActivity: number;
  }> {
    try {
      const allData = await this.getAllAdminData();

      const stats = {
        totalItems: allData.length,
        itemsByCategory: {} as Record<string, number>,
        itemsByStatus: {} as Record<string, number>,
        itemsByPriority: {} as Record<string, number>,
        recentActivity: 0,
      };

      // Calculate statistics
      allData.forEach((item) => {
        // By category
        stats.itemsByCategory[item.category] =
          (stats.itemsByCategory[item.category] || 0) + 1;

        // By status
        stats.itemsByStatus[item.status] =
          (stats.itemsByStatus[item.status] || 0) + 1;

        // By priority
        stats.itemsByPriority[item.priority] =
          (stats.itemsByPriority[item.priority] || 0) + 1;

        // Recent activity (last 24 hours)
        const itemDate =
          item.createdAt instanceof Timestamp
            ? item.createdAt.toDate()
            : new Date(item.createdAt as string);
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
        if (itemDate > yesterday) {
          stats.recentActivity++;
        }
      });

      return stats;
    } catch (error) {
      console.error("Error getting statistics:", error);
      throw error;
    }
  }

  // Cleanup old data
  async cleanupOldData(daysOld: number = 90): Promise<number> {
    try {
      const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
      const q = query(
        this.firestoreCollection,
        where("createdAt", "<", cutoffDate),
        where("status", "==", "archived")
      );

      const querySnapshot = await getDocs(q);
      let deletedCount = 0;

      for (const docSnapshot of querySnapshot.docs) {
        await this.deleteAdminData(docSnapshot.id);
        deletedCount++;
      }

      return deletedCount;
    } catch (error) {
      console.error("Error cleaning up old data:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const adminDataService = AdminDataService.getInstance();
