import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full px-3 py-2 text-xs!",
        "transition-all duration-200",
        "focus:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className
      )}
      style={{
        background: 'var(--color-bg-tertiary)',
        border: '1px solid var(--color-border-default)',
        color: 'var(--color-text-primary)',
        fontSize: '0.75rem',
      }}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
