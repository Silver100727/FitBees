import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all duration-250 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-accent to-accent-dark text-bg-primary hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(212,175,55,0.3)] active:translate-y-0",
        destructive:
          "bg-error/10 text-error border border-error/30 hover:bg-error/20",
        outline:
          "border border-border-default bg-transparent text-text-secondary hover:bg-bg-tertiary hover:text-text-primary hover:border-border-accent",
        secondary:
          "bg-bg-tertiary border border-border-default text-text-secondary hover:bg-bg-hover hover:text-text-primary",
        ghost:
          "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary",
        link:
          "text-accent underline-offset-4 hover:underline hover:text-accent-light",
      },
      size: {
        default: "h-10 px-6 py-2 rounded-md",
        sm: "h-8 px-4 text-xs rounded-md",
        lg: "h-12 px-8 rounded-lg text-base",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
