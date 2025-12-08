"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../../../public/logo.png";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
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
          "relative px-3 py-2 text-sm font-medium transition-all duration-200",
          "hover:text-brand-primary hover:bg-brand-very-light rounded-full",
          "focus:outline-none focus:ring-2 focus:ring-brand-primary/20",
          isActive
            ? "text-brand-dark font-semibold bg-brand-very-light"
            : "text-brand-primary",
          isMobile && "block w-full text-left py-3 text-base px-4 rounded-xl"
        )}
        aria-current={isActive ? "page" : undefined}
      >
        {label}
        {isActive && !isMobile && (
          <div className="absolute left-3 right-3 h-0.5 bg-brand-primary rounded-full bottom-1" />
        )}
      </Link>
    );
  }
);

NavLink.displayName = "NavLink";

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isMobile = useIsMobile();
  const { user, loading } = useAuth();

  // Optimized scroll handler with useCallback
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setIsSticky(currentScrollY > 20);
  }, []);

  // Single scroll effect
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    },
    [isMenuOpen]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen, handleEscape]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  // Close mobile menu on route change
  const pathname = usePathname();
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isMenuOpen]);

  return (
    <>
      <div
        className={cn(
          "sticky top-0 left-0 right-0 z-[100] w-full transition-all duration-300",
          isMobile ? "px-4 pt-3 pb-2" : "px-6 pt-4 pb-2"
        )}
      >
        <header
          className={cn(
            "w-full max-w-7xl flex justify-center items-center mx-auto",
            "bg-white/95 backdrop-blur-xl border border-[#EBEBEB]/50",
            "shadow-lg transition-all duration-300",
            isMobile ? "rounded-2xl px-4 py-2" : "rounded-full px-6 py-2",
            isSticky && "shadow-xl"
          )}
          style={{
            WebkitBackdropFilter: "blur(16px)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div className="w-full">
            <div
              className={cn(
                "flex items-center justify-between gap-4",
                isMobile ? "h-14" : "h-16"
              )}
            >
              {/* Logo */}
              <Link
                href="/"
                className="flex items-center gap-2 flex-shrink-0 relative z-[120]"
                aria-label="Expat Stays - Home"
                onClick={() => setIsMenuOpen(false)}
              >
                <Image
                  src={Logo}
                  alt="Expat Stays"
                  className={cn("w-auto", isMobile ? "h-7" : "h-8")}
                  priority
                  width={36}
                  height={36}
                />
                <span
                  className={cn(
                    "font-bold text-brand-dark whitespace-nowrap",
                    isMobile ? "text-base" : "text-lg"
                  )}
                >
                  Expat Stays
                </span>
              </Link>

              {/* Desktop Navigation */}
              <nav
                className="hidden lg:flex items-center gap-1"
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
              <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
                <div className="h-6 w-px bg-gray-200 mx-1" />

                <Button
                  className="text-white bg-brand-primary hover:bg-brand-medium-dark hover:shadow-md font-medium px-5 py-2 rounded-full transition-all duration-200 text-sm"
                  asChild
                >
                  <Link href="/properties">Find A House</Link>
                </Button>

                {!loading &&
                  (user ? (
                    <UserMenu />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        className="text-brand-primary font-medium hover:bg-brand-very-light hover:text-brand-dark transition-all duration-200 px-4 py-2 rounded-full text-sm"
                        asChild
                      >
                        <Link href="/auth/signin">Sign In</Link>
                      </Button>
                      <Button
                        className="bg-brand-dark text-white hover:shadow-md hover:bg-brand-medium-dark font-medium transition-all duration-200 px-5 py-2 rounded-full text-sm"
                        asChild
                      >
                        <Link href="/auth/signup">Sign Up</Link>
                      </Button>
                    </div>
                  ))}
              </div>

              {/* Mobile Menu Toggle */}
              <div className="lg:hidden flex-shrink-0 z-[120]">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-[#235347] hover:bg-[#F2F2F2] active:bg-[#E5E5E5] touch-manipulation rounded-full"
                  aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                  onClick={toggleMenu}
                >
                  {isMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Custom Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-[110] bg-white lg:hidden flex flex-col pt-24 pb-6 px-6 overflow-y-auto animate-in fade-in slide-in-from-top-5 duration-300">
            {/* Mobile Navigation */}
            <nav
              className="flex-1"
              role="navigation"
              aria-label="Mobile navigation"
            >
              <div className="space-y-2">
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
            <div className="border-t border-[#EBEBEB] pt-6 mt-6 space-y-4">
              <Button
                className="w-full bg-[#7AA589] text-white hover:bg-[#6A9A79] active:bg-[#5A8A69] font-medium py-3.5 touch-manipulation text-base rounded-full"
                onClick={() => setIsMenuOpen(false)}
                asChild
              >
                <Link href="/properties">Find A House</Link>
              </Button>

              {!loading && !user && (
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full border-[#7AA589] text-[#7AA589] hover:bg-[#7AA589] hover:text-white active:bg-[#6A9A79] py-3.5 touch-manipulation text-base rounded-full"
                    onClick={() => setIsMenuOpen(false)}
                    asChild
                  >
                    <Link href="/auth/signin">Sign In</Link>
                  </Button>
                  <Button
                    className="w-full bg-[#0B2B26] text-white hover:bg-[#163832] active:bg-[#0F1F1E] py-3.5 touch-manipulation text-base rounded-full"
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
        )}
      </div>
    </>
  );
};

export default React.memo(Header);
