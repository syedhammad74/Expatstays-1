"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface PropertiesLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function PropertiesLink({ 
  href, 
  children, 
  className, 
  onClick 
}: PropertiesLinkProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    // Call custom onClick if provided
    if (onClick) {
      onClick();
    }

    // If navigating to properties page, scroll to properties section
    if (href === "/properties" || href.startsWith("/properties?")) {
      e.preventDefault();
      router.push(href);
      
      // Scroll to properties section after navigation
      setTimeout(() => {
        const propertiesSection = document.getElementById('properties-section');
        if (propertiesSection) {
          propertiesSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 100);
    }
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
