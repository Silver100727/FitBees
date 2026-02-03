import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-accent-glow text-accent border border-transparent",
        secondary:
          "bg-bg-tertiary text-text-secondary border border-border-default",
        success:
          "bg-success/10 text-success",
        warning:
          "bg-warning/10 text-warning",
        error:
          "bg-error/10 text-error",
        info:
          "bg-info/10 text-info",
        outline:
          "text-text-secondary border border-border-default",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
