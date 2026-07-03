import { useEffect, useRef } from 'react'
import { Search, Menu, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import NotificationDropdown from './header/NotificationDropdown'
import UserDropdown from './header/UserDropdown'
import { useSidebar } from '../context/SidebarContext'

export default function Header() {
  const { isMobileOpen, toggleSidebar } = useSidebar()
  const inputRef = useRef()

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  return (
    <header className="sticky top-0 flex items-center h-14 px-3 sm:px-4 md:px-6 border-b border-border-default bg-bg-surface gap-2 sm:gap-3 flex-shrink-0 z-30">
      <button
        onClick={toggleSidebar}
        className="flex items-center justify-center w-8 h-8 rounded-lg text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors cursor-pointer"
        aria-label="Toggle Sidebar"
      >
        {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      <div className="relative max-w-md w-full hidden sm:block sm:flex-1">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search metrics, dashboards..."
          className="w-full h-9 pl-9 pr-14 rounded-lg bg-bg-input border border-border-subtle 
                     text-text-primary text-sm placeholder:text-text-tertiary
                     focus:outline-none focus:ring-2 focus:ring-grafana-blue/30 focus:border-grafana-blue
                     transition-colors"
        />
        <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center px-1.5 py-0.5 rounded 
                      border border-border-default bg-bg-hover text-[10px] text-text-tertiary font-medium">
          ⌘K
        </kbd>
      </div>

      {/* Mobile search icon button */}
      <button className="sm:hidden flex items-center justify-center w-8 h-8 rounded-lg text-text-secondary hover:bg-bg-hover cursor-pointer">
        <Search size={16} />
      </button>

      <div className="flex items-center gap-0.5 sm:gap-1 ml-auto">
        <ThemeToggle />
        <NotificationDropdown />
        <UserDropdown />
      </div>
    </header>
  )
}
