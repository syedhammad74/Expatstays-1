import React from "react";
import { Button } from "@/components/atomic";
import { Card, CardContent } from "@/components/atomic";
import { Bell, Settings, User, LogOut, RefreshCw } from "lucide-react";

export interface AdminHeaderProps {
  userName?: string;
  onRefresh?: () => void;
  onSettings?: () => void;
  onLogout?: () => void;
  notifications?: number;
  className?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  userName = "Admin",
  onRefresh,
  onSettings,
  onLogout,
  notifications = 0,
  className = "",
}) => {
  return (
    <Card className={`mb-6 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          {/* Left side - Title and user info */}
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600">Welcome back, {userName}</p>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-3">
            {/* Refresh button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>

            {/* Notifications */}
            <div className="relative">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                    {notifications > 9 ? "9+" : notifications}
                  </span>
                )}
              </Button>
            </div>

            {/* Settings */}
            <Button variant="ghost" size="icon" onClick={onSettings}>
              <Settings className="h-5 w-5" />
            </Button>

            {/* User menu */}
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600" />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
