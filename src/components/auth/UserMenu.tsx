"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Calendar, Settings, LogOut, Loader2 } from "lucide-react";

export function UserMenu() {
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setLoggingOut(false);
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full p-0 hover:ring-2 hover:ring-[#8EB69B]/30 hover:ring-offset-2 hover:ring-offset-white transition-all duration-300 ease-out focus-visible:ring-2 focus-visible:ring-[#8EB69B] focus-visible:ring-offset-2 group
            sm:h-10 sm:w-10
            md:h-10 md:w-10
            lg:h-10 lg:w-10"
        >
          <Avatar className="h-10 w-10 sm:h-10 sm:w-10 md:h-10 md:w-10 lg:h-10 lg:w-10 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#8EB69B]/25">
            <AvatarImage
              src={user?.photoURL || undefined}
              alt={user?.displayName || "User"}
              className="transition-all duration-300"
            />
            <AvatarFallback className="bg-gradient-to-br from-[#8EB69B] to-[#0B2B26] text-white text-lg sm:text-lg md:text-lg lg:text-lg font-bold transition-all duration-300 group-hover:from-[#0B2B26] group-hover:to-[#8EB69B]">
              {user?.displayName ? getInitials(user.displayName) : "U"}
            </AvatarFallback>
          </Avatar>
          {/* Online indicator */}
          <div className="absolute -bottom-0 -right-0 w-3 h-3 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-2 border-white shadow-lg"></div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[92vw] max-w-xs left-1 !right-auto rounded-2xl border border-[#8EB69B]/20 shadow-2xl bg-white/95 backdrop-blur-xl p-0 mt-3 overflow-hidden
          sm:w-64 sm:left-auto sm:right-0 sm:rounded-xl sm:p-0"
        align="end"
        forceMount
        sideOffset={8}
      >
        {/* Header section with gradient background */}
        <div className="relative bg-gradient-to-br from-[#8EB69B]/10 via-[#DAF1DE]/20 to-[#8EB69B]/5 p-4 border-b border-[#8EB69B]/10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iIzhFQjY5QiIgZmlsbC1vcGFjaXR5PSIwLjEiLz4KPC9zdmc+')] opacity-30" />
          <DropdownMenuLabel className="font-normal relative z-10 p-0">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12 ring-2 ring-white/50 shadow-lg">
                <AvatarImage
                  src={user?.photoURL || undefined}
                  alt={user?.displayName || "User"}
                />
                <AvatarFallback className="bg-gradient-to-br from-[#8EB69B] to-[#0B2B26] text-white text-sm font-bold">
                  {user?.displayName ? getInitials(user.displayName) : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-base font-bold leading-tight truncate text-[#163832]">
                  {user?.displayName || "User"}
                </p>
                <p className="text-xs leading-tight text-[#8EB69B]/80 truncate font-medium">
                  {user?.email}
                </p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></div>
                  <span className="text-xs text-[#235347]/70 font-medium">
                    Online
                  </span>
                </div>
              </div>
            </div>
          </DropdownMenuLabel>
        </div>

        {/* Menu items */}
        <div className="p-2">
          <DropdownMenuItem
            asChild
            className="group rounded-xl px-3 py-3 text-base sm:text-sm cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-[#8EB69B]/10 hover:to-[#DAF1DE]/20 hover:scale-[1.02] hover:shadow-lg border border-transparent hover:border-[#8EB69B]/20"
          >
            <Link href="/profile" className="flex items-center w-full">
              <div className="mr-3 p-2 rounded-lg bg-gradient-to-br from-[#8EB69B]/20 to-[#0B2B26]/20 group-hover:from-[#8EB69B]/30 group-hover:to-[#0B2B26]/30 transition-all duration-300">
                <User className="h-4 w-4 text-[#8EB69B] group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="font-medium text-[#163832] group-hover:text-[#0B2B26] transition-colors duration-300">
                Profile
              </span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            asChild
            className="group rounded-xl px-3 py-3 text-base sm:text-sm cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-[#8EB69B]/10 hover:to-[#DAF1DE]/20 hover:scale-[1.02] hover:shadow-lg border border-transparent hover:border-[#8EB69B]/20"
          >
            <Link href="/my-bookings" className="flex items-center w-full">
              <div className="mr-3 p-2 rounded-lg bg-gradient-to-br from-[#8EB69B]/20 to-[#0B2B26]/20 group-hover:from-[#8EB69B]/30 group-hover:to-[#0B2B26]/30 transition-all duration-300">
                <Calendar className="h-4 w-4 text-[#8EB69B] group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="font-medium text-[#163832] group-hover:text-[#0B2B26] transition-colors duration-300">
                My Bookings
              </span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            asChild
            className="group rounded-xl px-3 py-3 text-base sm:text-sm cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-[#8EB69B]/10 hover:to-[#DAF1DE]/20 hover:scale-[1.02] hover:shadow-lg border border-transparent hover:border-[#8EB69B]/20"
          >
            <Link href="/profile/settings" className="flex items-center w-full">
              <div className="mr-3 p-2 rounded-lg bg-gradient-to-br from-[#8EB69B]/20 to-[#0B2B26]/20 group-hover:from-[#8EB69B]/30 group-hover:to-[#0B2B26]/30 transition-all duration-300">
                <Settings className="h-4 w-4 text-[#8EB69B] group-hover:scale-110 group-hover:rotate-90 transition-all duration-300" />
              </div>
              <span className="font-medium text-[#163832] group-hover:text-[#0B2B26] transition-colors duration-300">
                Settings
              </span>
            </Link>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="mx-2 bg-gradient-to-r from-transparent via-[#8EB69B]/30 to-transparent" />

        <div className="p-2">
          <DropdownMenuItem
            className="group rounded-xl px-3 py-3 text-base sm:text-sm cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:scale-[1.02] hover:shadow-lg border border-transparent hover:border-red-200"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            <div className="mr-3 p-2 rounded-lg bg-gradient-to-br from-red-100/50 to-red-200/50 group-hover:from-red-200/70 group-hover:to-red-300/70 transition-all duration-300">
              {loggingOut ? (
                <Loader2 className="h-4 w-4 text-red-600 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4 text-red-600 group-hover:scale-110 group-hover:translate-x-1 transition-all duration-300" />
              )}
            </div>
            <span className="font-medium text-red-700 group-hover:text-red-800 transition-colors duration-300">
              {loggingOut ? "Logging out..." : "Log out"}
            </span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
