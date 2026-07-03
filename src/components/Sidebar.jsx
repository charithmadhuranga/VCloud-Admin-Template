import { useState } from 'react'
import { NavLink } from 'react-router'
import {
  LayoutDashboard, Monitor, Layers, Cpu, Shield, BarChart3,
  AlertTriangle, History, Settings, Users, Menu, X, ChevronLeft, ChevronRight
} from 'lucide-react'

const links = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/devices', label: 'Devices', icon: Monitor },
  { to: '/stacks', label: 'Stacks', icon: Layers },
  { to: '/edgex', label: 'EdgeX', icon: Cpu },
  { to: '/tunnel', label: 'Tunnel', icon: Shield },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/alerts', label: 'Alerts', icon: AlertTriangle },
  { to: '/activity', label: 'Activity', icon: History },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ open = true }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const collapsed = !open

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 relative cursor-pointer
     before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-0.5 before:h-0 before:rounded-full before:transition-all before:duration-200
     ${isActive
       ? 'bg-grafana-blue/10 text-grafana-blue font-medium before:bg-grafana-blue before:h-5'
       : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover before:h-0'
     }`

  const navContent = (
    <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
      <div className="flex flex-col gap-1 px-3">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={linkClass}
            onClick={() => setMobileOpen(false)}
            title={collapsed ? label : undefined}
          >
            <Icon size={18} className="shrink-0" />
            <span
              className={`truncate transition-all duration-200 origin-left ${
                collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
              }`}
            >
              {label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  )

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-60 bg-surface-elevated border-r border-border flex flex-col transition-transform duration-300 ease-in-out shadow-2xl ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-grafana-blue flex items-center justify-center shrink-0 shadow-sm">
              <span className="text-white text-xs font-bold">VM</span>
            </div>
            <span className="text-sm font-semibold text-text-primary">VEdge Manager</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-text-secondary hover:text-text-primary p-1 rounded-md hover:bg-surface-hover transition-colors cursor-pointer"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>
        {navContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex border-r border-border bg-surface-elevated flex-col shrink-0 transition-all duration-300 ease-in-out min-h-screen ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        <div className="h-16 flex items-center gap-2.5 px-4 border-b border-border shrink-0">
          <div className="w-8 h-8 rounded-lg bg-grafana-blue flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-white text-xs font-bold">VM</span>
          </div>
          <span
            className={`text-sm font-semibold text-text-primary transition-all duration-200 origin-left whitespace-nowrap ${
              collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
            }`}
          >
            VEdge Manager
          </span>
        </div>

        {navContent}
      </aside>
    </>
  )
}
