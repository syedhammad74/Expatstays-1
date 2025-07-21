"use client";

import Footer from "./Footer";
import { usePathname } from "next/navigation";

export default function ConditionalFooter() {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  if (isAuthPage) {
    return null;
  }

  return <Footer />;
}
