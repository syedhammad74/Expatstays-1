import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-buttons text-sm font-medium ring-offset-background transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-minimal hover:shadow-primary",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-minimal hover:shadow-minimal-hover",
        outline:
          "border border-border bg-card hover:bg-accent hover:text-accent-foreground shadow-minimal hover:shadow-minimal-hover",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-minimal hover:shadow-minimal-hover",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        minimal: "bg-forest-light text-forest-dark hover:bg-forest-medium hover:text-white shadow-minimal hover:shadow-minimal-hover",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-minimal hover:shadow-primary",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 rounded-buttons px-4 text-sm",
        lg: "h-14 rounded-large px-8 text-base",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
