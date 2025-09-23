import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function useScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll to top when route changes - use instant scroll to prevent glitches
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
}
