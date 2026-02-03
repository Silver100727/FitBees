import * as React from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const DialogContext = React.createContext({
  open: false,
  onOpenChange: () => {},
})

function Dialog({ open, onOpenChange, children }) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  )
}

function DialogTrigger({ children, asChild }) {
  const { onOpenChange } = React.useContext(DialogContext)

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: (e) => {
        children.props.onClick?.(e)
        onOpenChange(true)
      },
    })
  }

  return (
    <button onClick={() => onOpenChange(true)}>
      {children}
    </button>
  )
}

function DialogPortal({ children }) {
  const { open } = React.useContext(DialogContext)

  if (typeof window === 'undefined') return null

  return createPortal(
    <AnimatePresence>{open && children}</AnimatePresence>,
    document.body
  )
}

function DialogOverlay({ className, ...props }) {
  const { onOpenChange } = React.useContext(DialogContext)

  return (
    <motion.div
      className={cn(
        "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={() => onOpenChange(false)}
      {...props}
    />
  )
}

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => {
  const { onOpenChange } = React.useContext(DialogContext)

  return (
    <DialogPortal>
      <DialogOverlay />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={() => onOpenChange(false)}
      >
        <motion.div
          ref={ref}
          className={cn(
            "relative w-full max-w-lg shadow-2xl",
            className
          )}
          style={{
            background: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border-default)',
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          {children}
          <button
            className="absolute right-2 top-2 p-1 transition-colors hover:opacity-70"
            style={{ color: 'var(--color-text-muted)' }}
            onClick={() => onOpenChange(false)}
          >
            <X size={14} />
            <span className="sr-only">Close</span>
          </button>
        </motion.div>
      </div>
    </DialogPortal>
  )
})
DialogContent.displayName = "DialogContent"

function DialogHeader({ className, ...props }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 px-5 py-4",
        className
      )}
      style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }) {
  return (
    <div
      className={cn(
        "flex justify-end gap-2 px-5 py-4",
        className
      )}
      style={{ borderTop: '1px solid var(--color-border-subtle)' }}
      {...props}
    />
  )
}

function DialogTitle({ className, ...props }) {
  return (
    <h2
      className={cn(
        "font-display text-base font-semibold",
        className
      )}
      style={{ color: 'var(--color-text-primary)' }}
      {...props}
    />
  )
}

function DialogDescription({ className, ...props }) {
  return (
    <p
      className={cn("text-xs", className)}
      style={{ color: 'var(--color-text-muted)' }}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
