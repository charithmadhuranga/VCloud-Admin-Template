import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { User, LogOut, Settings, ChevronDown, Menu, X } from 'lucide-react'
import { useSidebar } from '../context/SidebarContext'
import ThemeToggle from './ThemeToggle'
import NotificationDropdown from './ui/NotificationDropdown'

export default function Header() {
  const navigate = useNavigate()
  const { isMobileOpen, toggleSidebar } = useSidebar()
  const [userOpen, setUserOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setUserOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="h-14 border-b border-border bg-surface-elevated flex items-center px-4 lg:px-6 shrink-0 gap-2">
      <button
        onClick={toggleSidebar}
        className="flex items-center justify-center w-8 h-8 rounded-lg text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors cursor-pointer lg:mr-1"
        aria-label="Toggle Sidebar"
      >
        {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      <div className="flex-1" />

      <NotificationDropdown />

      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>

      <div className="relative" ref={ref}>
        <button
          onClick={() => setUserOpen(!userOpen)}
          className="flex items-center gap-2 pl-2 pr-1.5 py-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors cursor-pointer"
        >
          <div className="w-7 h-7 rounded-full bg-grafana-blue flex items-center justify-center">
            <User size={14} className="text-white" />
          </div>
          <span className="text-sm font-medium text-text-primary hidden sm:inline">Admin</span>
          <ChevronDown size={14} className={`transition-transform ${userOpen ? 'rotate-180' : ''}`} />
        </button>

        {userOpen && (
          <div className="absolute right-0 top-full mt-1 w-52 bg-surface-elevated border border-border rounded-grafana shadow-lg py-1 z-50">
            <div className="px-3 py-2 border-b border-border">
              <p className="text-sm font-medium text-text-primary">Admin User</p>
              <p className="text-xs text-text-muted">admin@vedge.io</p>
            </div>
            <button
              onClick={() => { setUserOpen(false); navigate('/settings'); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors cursor-pointer"
            >
              <Settings size={14} />
              Settings
            </button>
            <button
              onClick={() => setUserOpen(false)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors cursor-pointer"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
