"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../../../public/logo.png";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, Search, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { UserMenu } from "@/components/auth/UserMenu";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const navLinks = [
  { href: "/properties", label: "Properties" },
  { href: "/services", label: "Services" },
  { href: "/experiences", label: "Experiences" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "AboutUs" },
  { href: "/contact", label: "Contact" },
];

const NavLink = ({ href, label }: { href: string; label: string }) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <motion.div
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="relative"
    >
      <Link
        href={href}
        className={cn(
          "px-3 py-2 text-sm font-medium transition-all duration-300 relative",
          "hover:text-[#8EB69B] hover:bg-[#8EB69B]/5 rounded-lg",
          isActive
            ? "text-[#0B2B26] font-semibold bg-[#8EB69B]/10"
            : "text-[#235347]"
        )}
      >
        {label}
        <AnimatePresence>
          {isActive && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute left-0 right-0 h-0.5 bg-[#8EB69B] rounded-full"
              style={{ bottom: "-5px" }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          )}
        </AnimatePresence>
      </Link>
    </motion.div>
  );
};

const Header = () => {
  const [isSticky, setIsSticky] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(true);
  const [scrollDelta, setScrollDelta] = React.useState(0);
  const [lockout, setLockout] = React.useState(false);
  const { user, loading } = useAuth();

  React.useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          setIsSticky(currentY > 12);

          // Always show header near top
          if (currentY < 50) {
            setIsVisible(true);
            setScrollDelta(0);
            lastY = currentY;
            ticking = false;
            return;
          }

          // Debounce lockout to prevent rapid toggling
          if (lockout) {
            lastY = currentY;
            ticking = false;
            return;
          }

          const delta = currentY - lastY;
          const newDelta = scrollDelta + delta;

          // Hide header if scrolled down more than 32px
          if (delta > 0 && newDelta > 32 && isVisible) {
            setIsVisible(false);
            setScrollDelta(0);
            setLockout(true);
            setTimeout(() => setLockout(false), 300);
          }
          // Show header if scrolled up more than 16px
          else if (delta < 0 && Math.abs(newDelta) > 16 && !isVisible) {
            setIsVisible(true);
            setScrollDelta(0);
            setLockout(true);
            setTimeout(() => setLockout(false), 300);
          } else {
            setScrollDelta(newDelta);
          }

          lastY = currentY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isVisible, lockout, scrollDelta]);

  // Ensure header is visible when at top of page
  React.useEffect(() => {
    if (window.scrollY < 50) {
      setIsVisible(true);
    }
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className="sticky top-0 left-0 right-0 z-50 w-full px-4 pt-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        >
          <motion.header
            className={cn(
              "w-auto mx-auto",
              "bg-white/95 backdrop-blur-xl border border-[#EBEBEB]/50",
              "rounded-full shadow-lg",
              isSticky ? "shadow-xl" : "shadow-md"
            )}
            style={{
              WebkitBackdropFilter: "blur(16px)",
              backdropFilter: "blur(16px)",
            }}
            animate={isSticky ? { scale: 0.98 } : { scale: 1 }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
              type: "spring",
              stiffness: 400,
              damping: 40,
            }}
          >
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                {/* Logo */}
                <Link
                  href="/"
                  className="flex items-center space-x-2 sm:space-x-1"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center space-x-1 sm:space-x-3"
                  >
                    <Image
                      src={Logo}
                      alt="Expat Stays"
                      className="h-6 w-auto sm:h-8"
                    />
                    <span className="text-lg sm:text-xl lg:text-2xl font-bold text-[#0B2B26]">
                      Expat Stays
                    </span>
                  </motion.div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden xl:flex items-center space-x-1">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.1,
                        ease: "easeOut",
                      }}
                    >
                      <NavLink href={link.href} label={link.label} />
                    </motion.div>
                  ))}
                </nav>

                {/* Desktop Actions */}
                <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-[#235347] hover:bg-[#F2F2F2] hover:text-[#8EB69B] transition-all duration-200"
                      aria-label="Search"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-[#235347] hover:bg-[#F2F2F2] hover:text-[#8EB69B] relative transition-all duration-200"
                      aria-label="Notifications"
                    >
                      <Bell className="h-4 w-4" />
                      <motion.span
                        className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#8EB69B] rounded-full"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </Button>
                  </motion.div>

                  <motion.div
                    className="h-6 w-px bg-[#EBEBEB]"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  />

                  <motion.div
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <Button
                      className="bg-[#8EB69B] text-[#0B2B26] hover:bg-[#7AA589] font-medium transition-all duration-200"
                      asChild
                    >
                      <Link href="/properties">Find A House</Link>
                    </Button>
                  </motion.div>

                  {!loading &&
                    (user ? (
                      <UserMenu />
                    ) : (
                      <motion.div
                        className="flex items-center space-x-2 xl:space-x-3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.05, y: -1 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                          <Link href="/auth/signin">
                            <Button
                              variant="ghost"
                              className="text-[#235347] font-medium hover:bg-[#F2F2F2] hover:text-[#8EB69B] transition-all duration-200"
                            >
                              Sign In
                            </Button>
                          </Link>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.05, y: -1 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                          <Link href="/auth/signup">
                            <Button className="bg-[#0B2B26] text-white hover:bg-[#163832] font-medium transition-all duration-200">
                              Sign Up
                            </Button>
                          </Link>
                        </motion.div>
                      </motion.div>
                    ))}
                </div>

                {/* Mobile Menu */}
                <div className="lg:hidden">
                  <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                    <SheetTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.05, y: -1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-[#235347] hover:bg-[#F2F2F2] transition-all duration-200"
                          aria-label="Open menu"
                        >
                          <AnimatePresence mode="wait">
                            {isMenuOpen ? (
                              <motion.div
                                key="close"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <X className="h-5 w-5" />
                              </motion.div>
                            ) : (
                              <motion.div
                                key="menu"
                                initial={{ rotate: 90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Menu className="h-5 w-5" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Button>
                      </motion.div>
                    </SheetTrigger>
                    <SheetContent
                      side="right"
                      className="w-[300px] sm:w-[350px] bg-white/95 backdrop-blur-xl border-l border-[#EBEBEB]"
                    >
                      <motion.div
                        className="p-6 h-full flex flex-col"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.div
                          className="mb-6"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.1 }}
                        ></motion.div>
                        <nav className="flex-1">
                          <div className="space-y-2">
                            {navLinks.map((link, index) => (
                              <motion.div
                                key={link.href}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  duration: 0.3,
                                  delay: 0.2 + index * 0.1,
                                }}
                              >
                                <Link
                                  href={link.href}
                                  onClick={() => setIsMenuOpen(false)}
                                  className="block px-3 py-2 text-base font-medium text-[#235347] hover:bg-[#F2F2F2] hover:text-[#8EB69B] rounded-md transition-all duration-200"
                                >
                                  {link.label}
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        </nav>
                        <motion.div
                          className="border-t border-[#EBEBEB] pt-4 space-y-3"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.3 }}
                        >
                          <motion.div
                            whileHover={{ scale: 1.05, y: -1 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                          >
                            <Button
                              className="w-full bg-[#8EB69B] text-[#0B2B26] hover:bg-[#7AA589] font-medium transition-all duration-200"
                              onClick={() => setIsMenuOpen(false)}
                              asChild
                            >
                              <Link href="/properties">Find A House</Link>
                            </Button>
                          </motion.div>
                          {!loading && !user && (
                            <motion.div
                              className="space-y-2"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3, delay: 0.4 }}
                            >
                              <motion.div
                                whileHover={{ scale: 1.05, y: -1 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                              >
                                <Link href="/auth/signin">
                                  <Button
                                    variant="outline"
                                    className="w-full border-[#8EB69B] text-[#8EB69B] hover:bg-[#8EB69B] hover:text-[#0B2B26] transition-all duration-200"
                                    onClick={() => setIsMenuOpen(false)}
                                  >
                                    Sign In
                                  </Button>
                                </Link>
                              </motion.div>
                              <motion.div
                                whileHover={{ scale: 1.05, y: -1 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                              >
                                <Link href="/auth/signup">
                                  <Button
                                    className="w-full bg-[#0B2B26] text-white hover:bg-[#163832] transition-all duration-200"
                                    onClick={() => setIsMenuOpen(false)}
                                  >
                                    Sign Up
                                  </Button>
                                </Link>
                              </motion.div>
                            </motion.div>
                          )}
                          {user && (
                            <motion.div
                              className="pt-3 border-t border-[#EBEBEB]"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3, delay: 0.5 }}
                            >
                              <UserMenu />
                            </motion.div>
                          )}
                        </motion.div>
                      </motion.div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </div>
          </motion.header>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Header;
