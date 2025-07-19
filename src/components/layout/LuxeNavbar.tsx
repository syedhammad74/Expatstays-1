"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, Bell, Search } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/properties", label: "Properties" },
  { href: "/services", label: "Services" },
  { href: "/experiences", label: "Experiences" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

function LuxeNavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/" && pathname.startsWith(href));
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: "0 4px 16px #8EB69B22" }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="relative flex items-center"
    >
      <Link
        href={href}
        className={
          `relative px-4 py-2 text-base font-medium rounded-full transition-all duration-300 flex items-center ` +
          `hover:text-[#8EB69B] hover:bg-[#8EB69B]/10 ` +
          (isActive
            ? "text-[#163832] bg-[#8EB69B]/20 font-semibold shadow-sm"
            : "text-[#235347]")
        }
        style={{ letterSpacing: "-0.01em", whiteSpace: "nowrap" }}
      >
        {label}
        <span
          className={
            `absolute left-1/2 -bottom-1.5 h-1 w-0 rounded-full bg-[#8EB69B] transition-all duration-300 ` +
            (isActive
              ? "w-6 shadow-lg"
              : "group-hover:w-4 group-hover:opacity-80")
          }
          style={{ transform: "translateX(-50%)" }}
        />
      </Link>
    </motion.div>
  );
}

export default function LuxeNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <AnimatePresence>
      <motion.header
        initial={{ y: -32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -32, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={
          `fixed top-0 left-0 right-0 z-50 w-full glassmorphism ` +
          `backdrop-blur-2xl border-b border-[#8EB69B]/20 bg-white/80 shadow-xl`
        }
        style={{
          WebkitBackdropFilter: "blur(24px)",
          backdropFilter: "blur(24px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex h-20 items-center justify-between gap-0">
            {/* Logo - single line, smaller, centered */}
            <div className="flex items-center min-w-[160px] h-14">
              <Link href="/" className="flex items-center gap-2 group h-full">
                <span className="inline-flex items-center justify-center text-[#163832] h-full">
                  <Logo className="h-7 w-7" />
                </span>
                <span
                  className="ml-1 text-2xl font-extrabold tracking-tight leading-none text-[#163832] group-hover:text-[#8EB69B] transition-colors duration-200"
                  style={{ fontFamily: "Poppins, Inter, sans-serif" }}
                >
                  Expat Stays
                </span>
              </Link>
            </div>
            {/* Desktop Nav - reduced spacing, vibrant accent, no line breaks */}
            <nav className="hidden lg:flex items-center gap-0 h-14">
              <div className="flex items-center h-full gap-1 xl:gap-2">
                {navLinks.map((link) => (
                  <LuxeNavLink
                    key={link.href}
                    href={link.href}
                    label={link.label}
                  />
                ))}
              </div>
            </nav>
            {/* Desktop Actions - larger icons, aligned notification dot, visible divider */}
            <div className="hidden lg:flex items-center gap-2 h-14">
              <motion.div
                whileHover={{ scale: 1.08, boxShadow: "0 2px 12px #8EB69B22" }}
                className="flex items-center h-full"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-[#235347] hover:bg-[#8EB69B]/10 hover:text-[#8EB69B] transition-all duration-300 h-12 w-12 flex items-center justify-center"
                  aria-label="Search"
                >
                  <Search className="h-6 w-6" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.08, boxShadow: "0 2px 12px #8EB69B22" }}
                className="relative flex items-center h-full"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-[#235347] hover:bg-[#8EB69B]/10 hover:text-[#8EB69B] transition-all duration-300 h-12 w-12 flex items-center justify-center"
                  aria-label="Notifications"
                >
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-[#8EB69B] rounded-full border-2 border-white" />
                </Button>
              </motion.div>
              <div className="h-8 w-px bg-[#8EB69B]/30 mx-2" />
              <motion.div
                whileHover={{ scale: 1.04, boxShadow: "0 2px 16px #8EB69B33" }}
                className="flex items-center h-full"
              >
                <Button
                  className="rounded-full px-7 py-2 text-base font-semibold bg-[#8EB69B] text-[#051F20] shadow-lg hover:bg-[#235347] hover:text-[#DAF1DE] hover:shadow-[0_0_20px_#8EB69B55] transition-all duration-300 min-w-[140px] h-12 flex items-center justify-center"
                  asChild
                >
                  <Link href="/properties">Find A House</Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.04, boxShadow: "0 2px 16px #8EB69B33" }}
                className="flex items-center h-full"
              >
                <Button
                  className="rounded-full px-7 py-2 text-base font-semibold bg-[#163832] text-white shadow-lg hover:bg-[#235347] hover:text-[#DAF1DE] hover:shadow-[0_0_20px_#16383255] transition-all duration-300 min-w-[120px] h-12 flex items-center justify-center"
                  asChild
                >
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </motion.div>
            </div>
            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center h-14">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-[#8EB69B]/10 text-[#235347] transition-all duration-300 h-12 w-12 flex items-center justify-center"
                aria-label="Open menu"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="h-7 w-7" />
              </Button>
            </div>
          </div>
        </div>
        {/* Mobile Menu Overlay - glassy, bold, immersive */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="fixed inset-0 z-50 bg-white/80 glassmorphism backdrop-blur-2xl flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#8EB69B]/20 h-20">
                <Link href="/" className="flex items-center gap-2 group h-full">
                  <Logo className="h-7 w-7" />
                  <span
                    className="ml-1 text-2xl font-extrabold tracking-tight leading-none text-[#163832] group-hover:text-[#8EB69B] transition-colors duration-200"
                    style={{ fontFamily: "Poppins, Inter, sans-serif" }}
                  >
                    Expat Stays
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-[#8EB69B]/10 text-[#235347] h-12 w-12 flex items-center justify-center"
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                >
                  <X className="h-7 w-7" />
                </Button>
              </div>
              <nav className="flex-1 flex flex-col items-center justify-center gap-6">
                {navLinks.map((link) => (
                  <motion.div
                    key={link.href}
                    whileHover={{
                      scale: 1.08,
                      x: 8,
                      boxShadow: "0 2px 16px #8EB69B33",
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={
                        `block text-2xl font-bold rounded-full px-8 py-4 text-[#235347] hover:text-[#8EB69B] hover:bg-[#8EB69B]/10 transition-all duration-300` +
                        (pathname === link.href
                          ? " bg-[#8EB69B]/20 text-[#163832]"
                          : "")
                      }
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="flex flex-col gap-4 w-full px-8 mt-8">
                  <Button
                    className="w-full rounded-full bg-[#8EB69B] text-[#051F20] text-lg font-semibold shadow-lg hover:bg-[#235347] hover:text-[#DAF1DE] transition-all duration-300 min-h-[48px] h-12 flex items-center justify-center"
                    asChild
                  >
                    <Link
                      href="/properties"
                      onClick={() => setMobileOpen(false)}
                    >
                      Find A House
                    </Link>
                  </Button>
                  <Button
                    className="w-full rounded-full bg-[#163832] text-white text-lg font-semibold shadow-lg hover:bg-[#235347] hover:text-[#DAF1DE] transition-all duration-300 min-h-[48px] h-12 flex items-center justify-center"
                    asChild
                  >
                    <Link
                      href="/auth/signup"
                      onClick={() => setMobileOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </Button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </AnimatePresence>
  );
}
