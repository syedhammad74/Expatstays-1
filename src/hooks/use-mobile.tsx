import * as React from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    // Match Tailwind's lg: breakpoint (1024px) for consistency
    // Mobile/tablet: < 1024px, Desktop: >= 1024px
    const mql = window.matchMedia(`(max-width: 1023px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < 1024);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
