import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-sm bg-gradient-to-r from-bg-tertiary via-bg-hover to-bg-tertiary bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
