import { useEffect, useRef } from 'react'
import { Search, Menu } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import NotificationDropdown from './header/NotificationDropdown'
import UserDropdown from './header/UserDropdown'
import { useSidebar } from '../context/SidebarContext'

export default function Header() {
  const { toggleSidebar } = useSidebar()
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
    <header className="flex items-center h-14 px-4 md:px-6 border-b border-border-default bg-bg-surface gap-3 flex-shrink-0">
      <button
        onClick={toggleSidebar}
        className="flex items-center justify-center w-8 h-8 rounded-lg text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors lg:hidden cursor-pointer"
      >
        <Menu size={18} />
      </button>

      <div className="flex-1 flex items-center gap-2">
        <div className="relative max-w-md w-full">
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
      </div>

      <div className="flex items-center gap-1">
        <NotificationDropdown />
        <ThemeToggle />
        <UserDropdown />
      </div>
    </header>
  )
}
