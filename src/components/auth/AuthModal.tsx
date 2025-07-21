"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";

export function AuthModal({
  isOpen,
  onClose,
  initialMode = "signin",
}: {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "signin" | "signup";
}) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);

  const toggleMode = () => {
    setMode((prev) => (prev === "signin" ? "signup" : "signin"));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0">
        <DialogTitle className="sr-only">
          {mode === "signin" ? "Sign In" : "Sign Up"}
        </DialogTitle>
        {mode === "signin" ? (
          <SignInForm onToggleMode={toggleMode} onClose={onClose} />
        ) : (
          <SignUpForm onToggleMode={toggleMode} onClose={onClose} />
        )}
      </DialogContent>
    </Dialog>
  );
}
