"use client";

/**
 * Critical CSS component for above-the-fold content
 * Inlines essential styles to prevent render blocking
 */
export default function CriticalCSS() {
  return (
    <style jsx global>{`
      /* Critical Layout Styles */
      * {
        box-sizing: border-box;
      }

      html {
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
          "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
        line-height: 1.5;
        -webkit-text-size-adjust: 100%;
        -moz-tab-size: 4;
        tab-size: 4;
      }

      body {
        margin: 0;
        background-color: #ffffff;
        color: #051f20;
        font-feature-settings: normal;
        font-variation-settings: normal;
      }

      /* Critical Hero Section */
      .hero-section {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #8eb69b 0%, #163832 100%);
      }

      /* Critical Navigation */
      .nav-header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 50;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(139, 182, 155, 0.2);
      }

      /* Critical Button Styles */
      .btn-primary {
        background-color: #163832;
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        border: none;
        font-weight: 600;
        transition: background-color 0.15s ease;
        cursor: pointer;
      }

      .btn-primary:hover {
        background-color: #235347;
      }

      /* Critical Loading States */
      .skeleton {
        background: linear-gradient(
          90deg,
          #f0f0f0 25%,
          #e0e0e0 50%,
          #f0f0f0 75%
        );
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
      }

      @keyframes loading {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }

      /* Critical Image Styles */
      .responsive-image {
        width: 100%;
        height: auto;
        display: block;
      }

      /* Critical Grid */
      .property-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
      }

      @media (max-width: 640px) {
        .property-grid {
          grid-template-columns: 1fr;
          gap: 1rem;
        }
      }

      /* Critical Typography */
      .heading-xl {
        font-size: 3rem;
        font-weight: 700;
        line-height: 1.1;
        color: #051f20;
      }

      @media (max-width: 640px) {
        .heading-xl {
          font-size: 2rem;
        }
      }

      /* Critical Utilities */
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
      }

      @media (min-width: 640px) {
        .container {
          padding: 0 2rem;
        }
      }
    `}</style>
  );
}
