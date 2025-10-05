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
// Removed framer-motion for performance
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
    <div className="relative hover-lift">
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
        {isActive && (
          <div
            className="absolute left-0 right-0 h-0.5 bg-[#8EB69B] rounded-full"
            style={{ bottom: "-5px" }}
          />
        )}
      </Link>
    </div>
  );
};

const Header = () => {
  const [isSticky, setIsSticky] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(true);
  const [isMobile, setIsMobile] = React.useState(false);
  const { user, loading } = useAuth();

  // Detect mobile device
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  React.useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          setIsSticky(currentY > 12);

          // Simplified mobile behavior - always show header on mobile
          if (isMobile) {
            setIsVisible(true);
            lastY = currentY;
            ticking = false;
            return;
          }

          // Desktop behavior - hide/show on scroll
          if (currentY < 50) {
            setIsVisible(true);
            lastY = currentY;
            ticking = false;
            return;
          }

          const delta = currentY - lastY;

          // Hide header if scrolled down more than 100px
          if (delta > 0 && currentY > lastY + 100 && isVisible) {
            setIsVisible(false);
          }
          // Show header if scrolled up more than 50px
          else if (delta < 0 && currentY < lastY - 50 && !isVisible) {
            setIsVisible(true);
          }

          lastY = currentY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isVisible, isMobile]);

  // Ensure header is visible when at top of page
  React.useEffect(() => {
    if (window.scrollY < 50) {
      setIsVisible(true);
    }
  }, []);

  return (
    <>
      {isVisible && (
        <div
          className={cn(
            "sticky top-0 left-0 right-0 z-50 w-full",
            isMobile ? "px-2 pt-2" : "px-4 pt-6"
          )}
        >
          <header
            className={cn(
              "w-auto mx-auto",
              "bg-white/95 backdrop-blur-xl border border-[#EBEBEB]/50",
              isMobile ? "rounded-2xl" : "rounded-full",
              "shadow-lg",
              isSticky ? "shadow-xl" : "shadow-md"
            )}
            style={{
              WebkitBackdropFilter: "blur(16px)",
              backdropFilter: "blur(16px)",
            }}
          >
            <div className={cn("px-4 sm:px-6 lg:px-8", isMobile ? "px-3" : "")}>
              <div
                className={cn(
                  "flex items-center justify-between",
                  isMobile ? "h-14" : "h-16"
                )}
              >
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <Image
                      src={Logo}
                      alt="Expat Stays"
                      className={cn("w-auto", isMobile ? "h-5" : "h-6 sm:h-8")}
                    />
                    <span
                      className={cn(
                        "font-bold text-[#0B2B26]",
                        isMobile
                          ? "text-base"
                          : "text-lg sm:text-xl lg:text-2xl"
                      )}
                    >
                      Expat Stays
                    </span>
                  </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden xl:flex items-center space-x-1">
                  {navLinks.map((link, index) => (
                    <div key={link.href}>
                      <NavLink href={link.href} label={link.label} />
                    </div>
                  ))}
                </nav>

                {/* Desktop Actions */}
                <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
                  <div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-[#235347] hover:bg-[#F2F2F2] hover:text-[#8EB69B] transition-all duration-200"
                      aria-label="Search"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>

                  <div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-[#235347] hover:bg-[#F2F2F2] hover:text-[#8EB69B] relative transition-all duration-200"
                      aria-label="Notifications"
                    >
                      <Bell className="h-4 w-4" />
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#8EB69B] rounded-full animate-pulse" />
                    </Button>
                  </div>

                  <div className="h-6 w-px bg-[#EBEBEB]" />

                  <div>
                    <Button
                      className="bg-[#8EB69B] text-[#0B2B26] hover:bg-[#7AA589] font-medium transition-all duration-200"
                      asChild
                    >
                      <Link href="/properties">Find A House</Link>
                    </Button>
                  </div>

                  {!loading &&
                    (user ? (
                      <UserMenu />
                    ) : (
                      <div className="flex items-center space-x-2 xl:space-x-3">
                        <div>
                          <Link href="/auth/signin">
                            <Button
                              variant="ghost"
                              className="text-[#235347] font-medium hover:bg-[#F2F2F2] hover:text-[#8EB69B] transition-all duration-200"
                            >
                              Sign In
                            </Button>
                          </Link>
                        </div>
                        <div>
                          <Link href="/auth/signup">
                            <Button className="bg-[#0B2B26] text-white hover:bg-[#163832] font-medium transition-all duration-200">
                              Sign Up
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Mobile Menu */}
                <div className="lg:hidden">
                  <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                    <SheetTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 text-[#235347] hover:bg-[#F2F2F2] active:bg-[#E5E5E5] touch-manipulation"
                        aria-label="Open menu"
                      >
                        {isMenuOpen ? (
                          <X className="h-5 w-5" />
                        ) : (
                          <Menu className="h-5 w-5" />
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      side="right"
                      className="w-[280px] sm:w-[320px] bg-white border-l border-[#EBEBEB] p-0"
                    >
                      <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-[#EBEBEB]">
                          <span className="text-lg font-semibold text-[#0B2B26]">
                            Menu
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMenuOpen(false)}
                            className="h-8 w-8 text-[#235347] hover:bg-[#F2F2F2]"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 p-4">
                          <div className="space-y-1">
                            {navLinks.map((link) => (
                              <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="block px-3 py-3 text-base font-medium text-[#235347] hover:bg-[#F2F2F2] active:bg-[#E5E5E5] rounded-lg transition-colors duration-150 touch-manipulation"
                              >
                                {link.label}
                              </Link>
                            ))}
                          </div>
                        </nav>

                        {/* Actions */}
                        <div className="border-t border-[#EBEBEB] p-4 space-y-3">
                          <Button
                            className="w-full bg-[#8EB69B] text-[#0B2B26] hover:bg-[#7AA589] active:bg-[#6A9A79] font-medium py-3 touch-manipulation"
                            onClick={() => setIsMenuOpen(false)}
                            asChild
                          >
                            <Link href="/properties">Find A House</Link>
                          </Button>

                          {!loading && !user && (
                            <div className="space-y-2">
                              <Link href="/auth/signin">
                                <Button
                                  variant="outline"
                                  className="w-full border-[#8EB69B] text-[#8EB69B] hover:bg-[#8EB69B] hover:text-[#0B2B26] active:bg-[#7AA589] active:text-[#0B2B26] py-3 touch-manipulation"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  Sign In
                                </Button>
                              </Link>
                              <Link href="/auth/signup">
                                <Button
                                  className="w-full bg-[#0B2B26] text-white hover:bg-[#163832] active:bg-[#0F1F1E] py-3 touch-manipulation"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  Sign Up
                                </Button>
                              </Link>
                            </div>
                          )}

                          {user && (
                            <div className="pt-2">
                              <UserMenu />
                            </div>
                          )}
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </div>
          </header>
        </div>
      )}
    </>
  );
};

export default Header;
