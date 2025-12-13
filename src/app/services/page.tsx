"use client";

import Header from "@/components/layout/Header";
import ServicesOverviewSection from "@/components/sections/ServicesOverviewSection";
// Removed framer-motion for performance

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#FAFDFA] to-[#F3F9F4]">
      <Header />
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 ">
        <div
        >
          <ServicesOverviewSection />
        </div>
      </div>
    </div>
  );
}
