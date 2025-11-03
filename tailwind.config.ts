import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontSize: {
      xs: "0.84rem",
      sm: "0.97rem",
      base: "1.1rem",
      lg: "1.23rem",
      xl: "1.41rem",
      "2xl": "1.67rem",
      "3xl": "2.02rem",
      "4xl": "2.46rem",
      "5xl": "2.99rem",
      "6xl": "3.52rem",
      "7xl": "4.14rem",
      "8xl": "4.75rem",
      "9xl": "5.37rem",
    },
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        body: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        headline: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        code: ["Fira Mono", "monospace"],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Professional Brand Colors (30% lighter for better visibility)
        brand: {
          dark: "#2A4A47", // Lighter deep green - headings, active states
          "medium-dark": "#3F5A54", // Lighter forest - primary buttons, important actions
          medium: "#547E75", // Lighter mid-tone - hover states
          primary: "#6B9B8D", // Lighter main brand - accents, links (30% lighter)
          light: "#8FB5A8", // Softer accent - subtle highlights
          "very-light": "#EAF4F1", // Subtle backgrounds - cards, sections
        },
        // Keep legacy forest for backwards compatibility
        forest: {
          dark: "#2A4A47",
          "medium-dark": "#3F5A54",
          medium: "#547E75",
          primary: "#6B9B8D",
          light: "#8FB5A8",
          "very-light": "#EAF4F1",
        },
      },
      borderRadius: {
        lg: "1rem", // 16px
        md: "0.75rem", // 12px
        sm: "0.5rem", // 8px
        components: "1rem", // 16px
        buttons: "0.75rem", // 12px
        large: "1.5rem", // 24px
        xl: "2rem", // 32px
        "2xl": "2.5rem", // 40px
      },
      boxShadow: {
        minimal: "0 2px 8px rgba(0, 0, 0, 0.04)",
        "minimal-hover": "0 4px 16px rgba(0, 0, 0, 0.08)",
        primary: "0 4px 12px hsl(var(--primary) / 0.3)",
        "primary-hover": "0 8px 24px hsl(var(--primary) / 0.4)",
        neumorph: "0 4px 24px 0 rgba(8, 32, 24, 0.12)",
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
      },
      animation: {
        "parallax-slow": "parallax-slow 20s ease-in-out infinite alternate",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
      },
      keyframes: {
        "parallax-slow": {
          "0%": {
            transform: "translateY(0px) scale(1.1)",
          },
          "100%": {
            transform: "translateY(-20px) scale(1.1)",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "slide-up": {
          "0%": {
            transform: "translateY(20px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      backgroundImage: {
        "hero-pattern":
          "url('/media/DSC01806 HDR June 25 2025/DSC01806-HDR.jpg')",
        "about-pattern":
          "url('/media/DSC01806 HDR June 25 2025/DSC01812-HDR.jpg')",
        "services-pattern":
          "url('/media/DSC01806 HDR June 25 2025/DSC01817-HDR.jpg')",
        "properties-pattern":
          "url('/media/DSC01806 HDR June 25 2025/DSC01822-HDR.jpg')",
      },
    },
  },
  plugins: [
    function ({ addUtilities }: { addUtilities: any }) {
      const newUtilities = {
        // Parallax utilities
        ".parallax-bg": {
          position: "relative",
          overflow: "hidden",
        },
        ".parallax-bg::before": {
          content: '""',
          position: "absolute",
          top: "-20%",
          left: "-20%",
          width: "140%",
          height: "140%",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: "0.05",
          zIndex: "-1",
          willChange: "transform",
        },
        ".parallax-bg.opacity-low::before": {
          opacity: "0.03",
        },
        ".parallax-bg.opacity-medium::before": {
          opacity: "0.08",
        },
        ".parallax-bg.opacity-high::before": {
          opacity: "0.12",
        },
        ".parallax-animate::before": {
          animation: "parallax-slow 20s ease-in-out infinite alternate",
        },
        // Standard component styles
        ".standard-card": {
          background: "white",
          border: "1px solid hsl(var(--border))",
          borderRadius: "0.375rem", // 6px - Reduced from 12px
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
          transition: "all 0.2s ease",
        },
        ".standard-card:hover": {
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
          transform: "translateY(-2px)",
        },
        ".btn-minimal": {
          borderRadius: "0.25rem", // 4px - Reduced from 8px
          padding: "0.75rem 1.5rem",
          fontWeight: "500",
          transition: "all 0.2s ease",
        },
        ".btn-minimal:hover": {
          transform: "translateY(-1px)",
        },
        // Transition utilities
        ".transition-smooth": {
          transition: "all 0.2s ease",
        },
        ".transition-smooth-slow": {
          transition: "all 0.3s ease",
        },
      };
      addUtilities(newUtilities);
    },
  ],
} satisfies Config;
