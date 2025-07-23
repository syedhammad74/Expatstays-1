"use client";

import Header from "@/components/layout/Header";
import ServicesOverviewSection from "@/components/sections/ServicesOverviewSection";
import { motion } from "framer-motion";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] via-white to-[#DAF1DE]/30">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-20 md:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ServicesOverviewSection />
        </motion.div>
      </div>
    </div>
  );
}
