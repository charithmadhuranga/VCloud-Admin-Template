import { useEffect, useRef } from 'react'

export default function Dropdown({ isOpen, onClose, children, className = '', align = 'right' }) {
  const ref = useRef()

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target) && !e.target.closest('.dropdown-toggle')) {
        onClose()
      }
    }
    if (isOpen) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={ref}
      className={`absolute z-50 mt-2 min-w-[220px] rounded-xl border border-border-default bg-bg-card shadow-lg animate-fade-in ${
        align === 'right' ? 'right-0 sm:right-0 max-sm:left-4 max-sm:right-4' : 'left-0'
      } ${className}`}
    >
      {children}
    </div>
  )
}

export function DropdownItem({ children, onClick, className = '', icon: Icon, danger }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors cursor-pointer ${
        danger ? 'text-grafana-red hover:bg-grafana-red/5' : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
      } ${className}`}
    >
      {Icon && <Icon size={15} />}
      {children}
    </button>
  )
}
