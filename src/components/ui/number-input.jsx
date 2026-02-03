import * as React from "react"
import { Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

function NumberInput({
  value,
  onChange,
  placeholder,
  min,
  max,
  step = 1,
  suffix,
  className
}) {
  const handleIncrement = () => {
    const current = parseFloat(value) || 0
    const newValue = max !== undefined ? Math.min(current + step, max) : current + step
    onChange(String(newValue))
  }

  const handleDecrement = () => {
    const current = parseFloat(value) || 0
    const newValue = min !== undefined ? Math.max(current - step, min) : current - step
    onChange(String(newValue))
  }

  const handleInputChange = (e) => {
    const val = e.target.value
    if (val === '' || /^-?\d*\.?\d*$/.test(val)) {
      onChange(val)
    }
  }

  return (
    <div
      className={cn(
        "flex items-center h-10",
        className
      )}
      style={{
        background: 'var(--color-bg-tertiary)',
        border: '1px solid var(--color-border-subtle)',
      }}
    >
      <button
        type="button"
        onClick={handleDecrement}
        className="flex items-center justify-center h-full w-8 transition-colors hover:opacity-70"
        style={{
          color: 'var(--color-text-muted)',
          borderRight: '1px solid var(--color-border-subtle)',
        }}
      >
        <Minus size={12} />
      </button>

      <div className="flex-1 flex items-center justify-center px-2">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full text-center text-xs bg-transparent focus:outline-none"
          style={{ color: 'var(--color-text-primary)' }}
        />
        {suffix && value && (
          <span
            className="text-[0.6rem] ml-0.5"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {suffix}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={handleIncrement}
        className="flex items-center justify-center h-full w-8 transition-colors hover:opacity-70"
        style={{
          color: 'var(--color-text-muted)',
          borderLeft: '1px solid var(--color-border-subtle)',
        }}
      >
        <Plus size={12} />
      </button>
    </div>
  )
}

export { NumberInput }
