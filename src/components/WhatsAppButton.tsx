"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WhatsAppButton = () => {
  const phoneNumber = "+923087496089";
  const message = encodeURIComponent(
    "Hello! I'm interested in learning more about Expat Stays."
  );
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(
    /[^0-9]/g,
    ""
  )}?text=${message}`;

  return (
    <Button
      asChild
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#20BD5A] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
      aria-label="Contact us on WhatsApp"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center"
      >
        <MessageCircle className="h-6 w-6 text-white group-hover:animate-pulse" />
      </a>
    </Button>
  );
};

export default WhatsAppButton;
