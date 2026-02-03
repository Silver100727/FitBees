import * as React from "react"
import { cn } from "@/lib/utils"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-none border px-3 py-2 text-xs! ring-offset-background",
        "placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-1",
        "focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50",
        "bg-bg-tertiary border-border-default text-text-primary",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
