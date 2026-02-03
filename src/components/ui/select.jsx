import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const SelectContext = React.createContext({
  value: '',
  onValueChange: () => {},
  open: false,
  setOpen: () => {},
})

function Select({ value, onValueChange, children }) {
  const [open, setOpen] = React.useState(false)
  const containerRef = React.useRef(null)

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div ref={containerRef} className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

function SelectTrigger({ className, children, ...props }) {
  const { open, setOpen, value } = React.useContext(SelectContext)

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={cn(
        "flex h-10 w-full items-center justify-between px-3 text-sm",
        "transition-colors focus:outline-none",
        className
      )}
      style={{
        background: 'var(--color-bg-tertiary)',
        border: '1px solid var(--color-border-subtle)',
        color: value ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
      }}
      {...props}
    >
      {children}
      <ChevronDown
        size={14}
        className={cn(
          "transition-transform duration-200",
          open && "rotate-180"
        )}
        style={{ color: 'var(--color-text-muted)' }}
      />
    </button>
  )
}

function SelectValue({ placeholder }) {
  const { value } = React.useContext(SelectContext)
  return <span>{value || placeholder}</span>
}

function SelectContent({ className, children, ...props }) {
  const { open } = React.useContext(SelectContext)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={cn(
            "absolute z-50 mt-1 w-full overflow-hidden shadow-lg",
            className
          )}
          style={{
            background: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border-default)',
          }}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
          {...props}
        >
          <div className="py-1">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function SelectItem({ value: itemValue, children, className, ...props }) {
  const { value, onValueChange, setOpen } = React.useContext(SelectContext)
  const isSelected = value === itemValue

  return (
    <button
      type="button"
      onClick={() => {
        onValueChange(itemValue)
        setOpen(false)
      }}
      className={cn(
        "flex w-full items-center justify-between px-2.5 py-2 text-xs cursor-pointer",
        "transition-colors",
        className
      )}
      style={{
        color: isSelected ? 'var(--color-accent)' : 'var(--color-text-secondary)',
        background: isSelected ? 'var(--color-accent-glow)' : 'transparent',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) e.currentTarget.style.background = 'var(--color-bg-tertiary)'
      }}
      onMouseLeave={(e) => {
        if (!isSelected) e.currentTarget.style.background = 'transparent'
      }}
      {...props}
    >
      <div className="flex-1">{children}</div>
      {isSelected && (
        <Check size={12} style={{ color: 'var(--color-accent)' }} />
      )}
    </button>
  )
}

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
}
