import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function DatePicker({ value, onChange, placeholder = "Select date", className }) {
  const [open, setOpen] = React.useState(false)
  const [viewDate, setViewDate] = React.useState(() => {
    if (value) return new Date(value)
    return new Date()
  })
  const containerRef = React.useRef(null)

  const selectedDate = value ? new Date(value) : null

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()

    const days = []

    // Previous month days
    const prevMonth = new Date(year, month, 0)
    const prevMonthDays = prevMonth.getDate()
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthDays - i)
      })
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i)
      })
    }

    // Next month days
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i)
      })
    }

    return days
  }

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))
  }

  const handleSelectDate = (date) => {
    const formatted = date.toISOString().split('T')[0]
    onChange(formatted)
    setOpen(false)
  }

  const isSelected = (date) => {
    if (!selectedDate) return false
    return date.toDateString() === selectedDate.toDateString()
  }

  const isToday = (date) => {
    return date.toDateString() === new Date().toDateString()
  }

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const calendarDays = getDaysInMonth(viewDate)

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-10 w-full items-center justify-between px-3 text-xs",
          "transition-colors focus:outline-none",
          className
        )}
        style={{
          background: 'var(--color-bg-tertiary)',
          border: '1px solid var(--color-border-subtle)',
          color: value ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
        }}
      >
        <span>{value ? formatDisplayDate(value) : placeholder}</span>
        <Calendar
          size={14}
          style={{ color: 'var(--color-text-muted)' }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute z-50 mt-1 w-64 p-3 shadow-lg"
            style={{
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border-default)',
            }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 transition-colors hover:opacity-70"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <ChevronLeft size={14} />
              </button>
              <span
                className="text-xs font-medium"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {months[viewDate.getMonth()]} {viewDate.getFullYear()}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 transition-colors hover:opacity-70"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Days header */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {days.map((day) => (
                <div
                  key={day}
                  className="text-center text-[0.6rem] font-medium py-1"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectDate(item.date)}
                  className={cn(
                    "h-7 w-7 text-[0.65rem] transition-colors",
                    "flex items-center justify-center"
                  )}
                  style={{
                    color: isSelected(item.date)
                      ? 'var(--color-accent)'
                      : item.isCurrentMonth
                        ? 'var(--color-text-primary)'
                        : 'var(--color-text-muted)',
                    background: isSelected(item.date)
                      ? 'var(--color-accent-glow)'
                      : isToday(item.date)
                        ? 'var(--color-bg-tertiary)'
                        : 'transparent',
                    opacity: item.isCurrentMonth ? 1 : 0.5,
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected(item.date)) {
                      e.currentTarget.style.background = 'var(--color-bg-tertiary)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected(item.date) && !isToday(item.date)) {
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}
                >
                  {item.day}
                </button>
              ))}
            </div>

            {/* Today button */}
            <button
              type="button"
              onClick={() => handleSelectDate(new Date())}
              className="w-full mt-2 py-1.5 text-[0.65rem] font-medium transition-colors"
              style={{
                color: 'var(--color-accent)',
                background: 'var(--color-accent-glow)',
              }}
            >
              Today
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export { DatePicker }
