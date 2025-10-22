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
import { useIsMobile } from "@/hooks/use-mobile";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const navLinks = [
  { href: "/properties", label: "Properties" },
  { href: "/services", label: "Services" },
  { href: "/experiences", label: "Experiences" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

interface NavLinkProps {
  href: string;
  label: string;
  onClick?: () => void;
  isMobile?: boolean;
}

const NavLink = React.memo(
  ({ href, label, onClick, isMobile = false }: NavLinkProps) => {
    const pathname = usePathname();
    const isActive =
      pathname === href || (href !== "/" && pathname.startsWith(href));

    return (
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          "relative px-4 py-2.5 text-sm font-medium transition-all duration-200",
          "hover:text-[#8EB69B] hover:bg-[#8EB69B]/5 rounded-lg",
          "focus:outline-none focus:ring-2 focus:ring-[#8EB69B]/20 focus:ring-offset-2",
          isActive
            ? "text-[#0B2B26] font-semibold bg-[#8EB69B]/10"
            : "text-[#235347]",
          isMobile && "block w-full text-left py-4 text-lg"
        )}
        aria-current={isActive ? "page" : undefined}
      >
        {label}
        {isActive && !isMobile && (
          <div className="absolute left-0 right-0 h-0.5 bg-[#8EB69B] rounded-full -bottom-1" />
        )}
      </Link>
    );
  }
);

NavLink.displayName = "NavLink";

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const isMobile = useIsMobile();
  const { user, loading } = useAuth();

  // Optimized scroll handler with useCallback
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    setIsSticky(currentScrollY > 20);

    // Mobile: always show header
    if (isMobile) {
      setIsVisible(true);
      setLastScrollY(currentScrollY);
      return;
    }

    // Desktop: hide/show logic
    if (currentScrollY < 50) {
      setIsVisible(true);
    } else if (currentScrollY > lastScrollY + 100 && isVisible) {
      setIsVisible(false);
    } else if (currentScrollY < lastScrollY - 50 && !isVisible) {
      setIsVisible(true);
    }

    setLastScrollY(currentScrollY);
  }, [isMobile, lastScrollY, isVisible]);

  // Single scroll effect
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [usePathname()]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  return (
    <>
      {isVisible && (
        <div
          className={cn(
            "sticky top-0 left-0 right-0 z-50 w-full transition-all duration-300",
            isMobile ? "px-4 pt-3" : "px-6 pt-4"
          )}
        >
          <header
            className={cn(
              "w-full max-w-7xl py-1 flex justify-center items-center mx-auto",
              "bg-white/95 backdrop-blur-xl border border-[#EBEBEB]/50",
              "shadow-lg transition-shadow duration-300",
              isMobile ? "rounded-2xl" : "rounded-full",
              isSticky && "shadow-xl"
            )}
            style={{
              WebkitBackdropFilter: "blur(16px)",
              backdropFilter: "blur(16px)",
            }}
          >
            <div className={cn(" ", isMobile && "px-6")}>
              <div
                className={cn(
                  "flex items-center justify-between",
                  isMobile ? "h-14" : "h-16"
                )}
              >
                {/* Logo */}
                <Link
                  href="/"
                  className="flex items-center "
                  aria-label="Expat Stays - Home"
                >
                  <Image
                    src={Logo}
                    alt="Expat Stays"
                    className={cn("w-auto", isMobile ? "h-7" : "h-8 sm:h-9")}
                    priority
                    width={36}
                    height={36}
                  />
                  <span
                    className={cn(
                      "font-bold text-[#0B2B26] transition-colors pr-1 -left-3",
                      isMobile ? "text-lg" : "text-xl sm:text-2xl"
                    )}
                  >
                    Expat Stays
                  </span>
                </Link>

                {/* Desktop Navigation */}
                <nav
                  className="hidden xl:flex items-center px-8"
                  role="navigation"
                  aria-label="Main navigation"
                >
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.href}
                      href={link.href}
                      label={link.label}
                    />
                  ))}
                </nav>

                {/* Desktop Actions */}
                <div className="hidden lg:flex items-center space-x-3 ">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 text-[#235347] hover:bg-[#F2F2F2] hover:text-[#8EB69B] transition-all duration-200"
                    aria-label="Search properties"
                  >
                    <Search className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 text-[#235347] hover:bg-[#F2F2F2] hover:text-[#8EB69B] relative transition-all duration-200"
                    aria-label="Notifications"
                  >
                    <Bell className="h-4 w-4" />
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#8EB69B] rounded-full animate-pulse" />
                  </Button>

                  <div className="h-6 w-px " />

                  <Button className=" text-white bg-[#7AA589] hover:bg-[#6A9A79] hover:shadow-black/30 font-medium px-7 py-2.5">
                    <Link href="/properties">Find A House</Link>
                  </Button>

                  {!loading &&
                    (user ? (
                      <UserMenu />
                    ) : (
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="ghost"
                          className="text-[#235347] font-medium hover:bg-[#F2F2F2] hover:text-[#8EB69B] transition-all duration-200 px-4 py-2"
                          asChild
                        >
                          <Link href="/auth/signin">Sign In</Link>
                        </Button>
                        <Button
                          className="bg-[#0B2B26] text-white hover:shadow-black/20 hover:bg-[#163832] font-medium transition-all duration-200 px-5 py-2"
                          asChild
                        >
                          <Link href="/auth/signup">Sign Up</Link>
                        </Button>
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
                        className="h-12 w-12 text-[#235347] hover:bg-[#F2F2F2] active:bg-[#E5E5E5] touch-manipulation"
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        onClick={toggleMenu}
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
                      className="w-[320px] sm:w-[380px] bg-white border-l border-[#EBEBEB] p-0"
                    >
                      <div className="flex flex-col h-full">
                        {/* Mobile Header */}
                        <div className="flex items-center justify-between p-8 border-b border-[#EBEBEB]">
                          <span className="text-2xl font-semibold text-[#0B2B26]">
                            Menu
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMenuOpen(false)}
                            className="h-10 w-10 text-[#235347] hover:bg-[#F2F2F2]"
                            aria-label="Close menu"
                          >
                            <X className="h-5 w-5" />
                          </Button>
                        </div>

                        {/* Mobile Navigation */}
                        <nav
                          className="flex-1 p-8"
                          role="navigation"
                          aria-label="Mobile navigation"
                        >
                          <div className="space-y-3">
                            {navLinks.map((link) => (
                              <NavLink
                                key={link.href}
                                href={link.href}
                                label={link.label}
                                onClick={() => setIsMenuOpen(false)}
                                isMobile
                              />
                            ))}
                          </div>
                        </nav>

                        {/* Mobile Actions */}
                        <div className="border-t border-[#EBEBEB] p-8 space-y-5">
                          <Button
                            className="w-full bg-[#7AA589] text-[white] hover:bg-[#5A8A69] active:bg-[#5A8A69] hover:shadow-black/30 font-medium py-4 touch-manipulation text-lg"
                            onClick={() => setIsMenuOpen(false)}
                            asChild
                          >
                            <Link href="/properties">Find A House</Link>
                          </Button>

                          {!loading && !user && (
                            <div className="space-y-4">
                              <Button
                                variant="outline"
                                className="w-full border-[#7AA589] text-[#7AA589] hover:bg-[#7AA589] hover:text-[#0B2B26] active:bg-[#6A9A79] active:text-[#0B2B26] py-4 touch-manipulation text-lg"
                                onClick={() => setIsMenuOpen(false)}
                                asChild
                              >
                                <Link href="/auth/signin">Sign In</Link>
                              </Button>
                              <Button
                                className="w-full bg-[#0B2B26] text-white hover:shadow-black/20 hover:bg-[#163832] active:bg-[#0F1F1E] py-4 touch-manipulation text-lg"
                                onClick={() => setIsMenuOpen(false)}
                                asChild
                              >
                                <Link href="/auth/signup">Sign Up</Link>
                              </Button>
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

export default React.memo(Header);
