import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import {
  LayoutDashboard, BarChart3, Activity, Bell, Settings, Server, Cpu, Shield, Users,
  ChevronDown, ChevronRight, X, FileText, Radio
} from 'lucide-react'
import { useSidebar } from '../context/SidebarContext'

const navGroups = [
  {
    section: 'Monitor',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
      { label: 'Analytics', icon: BarChart3, path: '/analytics' },
      {
        label: 'Metrics', icon: Activity, children: [
          { label: 'Overview', path: '/metrics' },
          { label: 'CPU', path: '/metrics/cpu' },
          { label: 'Memory', path: '/metrics/memory' },
          { label: 'Network', path: '/metrics/network' },
        ],
      },
      { label: 'Alerts', icon: Bell, path: '/alerts', badge: '12' },
    ],
  },
  {
    section: 'Infrastructure',
    items: [
      { label: 'Nodes', icon: Server, path: '/nodes' },
      { label: 'Containers', icon: Cpu, path: '/containers' },
      { label: 'Security', icon: Shield, path: '/security' },
      { label: 'Users', icon: Users, path: '/users' },
    ],
  },
  {
    section: 'Configuration',
    items: [
      { label: 'Settings', icon: Settings, path: '/settings' },
      { label: 'Audit Log', icon: FileText, path: '/audit' },
      { label: 'Integrations', icon: Radio, path: '/integrations' },
    ],
  },
]

export default function Sidebar() {
  const { expanded, mobileOpen, hovered, showLabels, setHovered, toggleSidebar, setMobileOpen } = useSidebar()
  const [expandedMenus, setExpandedMenus] = useState({})
  const location = useLocation()
  const sidebarW = expanded || hovered ? 'w-60' : 'w-16'

  const isActivePath = (path) => {
    if (!path) return false
    if (path === '/') return location.pathname === '/'
    if (path.startsWith('/metrics')) return location.pathname.startsWith(path)
    return location.pathname === path
  }

  const isChildActive = (children) => children?.some(c => isActivePath(c.path))

  const toggleMenu = (id) => {
    setExpandedMenus(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const sidebarContent = (
    <aside
      className={`flex flex-col bg-sidebar-bg border-r border-border-default h-full transition-all duration-300 ${sidebarW}`}
      onMouseEnter={() => !expanded && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center h-14 px-4 border-b border-border-default gap-3 flex-shrink-0">
        <div className="w-7 h-7 rounded-md bg-grafana-blue flex items-center justify-center flex-shrink-0">
          <Activity size={14} className="text-white" />
        </div>
        {showLabels && (
          <span className="font-semibold text-sm tracking-tight text-text-primary truncate flex-1">
            Fleet Admin
          </span>
        )}
        <button onClick={toggleSidebar} className="lg:hidden text-text-secondary hover:text-text-primary cursor-pointer">
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-5 custom-scrollbar">
        {navGroups.map((group) => (
          <div key={group.section}>
            {showLabels && (
              <p className="px-2 mb-1.5 text-[10px] font-semibold tracking-widest text-text-tertiary uppercase">
                {group.section}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                if (item.children) {
                  const open = expandedMenus[item.label] ?? isChildActive(item.children)
                  return (
                    <div key={item.label}>
                      <button
                        onClick={() => toggleMenu(item.label)}
                        className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                          open ? 'bg-sidebar-active text-grafana-blue' : 'text-text-secondary hover:bg-sidebar-hover hover:text-text-primary'
                        }`}
                      >
                        <item.icon size={18} className="flex-shrink-0" />
                        {showLabels && <span className="truncate flex-1 text-left">{item.label}</span>}
                        {showLabels && (
                          open ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                        )}
                      </button>
                      <div className={`overflow-hidden transition-all duration-200 ${open ? 'mt-0.5 max-h-96' : 'max-h-0'}`}>
                        <div className="ml-7 space-y-0.5 border-l border-border-default pl-2 pt-0.5">
                          {item.children.map(child => (
                            <Link
                              key={child.path}
                              to={child.path}
                              onClick={() => mobileOpen && setMobileOpen(false)}
                              className={`block px-2 py-1.5 rounded-lg text-xs transition-colors ${
                                isActivePath(child.path) ? 'text-grafana-blue font-medium bg-sidebar-active' : 'text-text-secondary hover:text-text-primary hover:bg-sidebar-hover'
                              }`}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                }

                const active = isActivePath(item.path)
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => mobileOpen && setMobileOpen(false)}
                    className={`flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-colors ${
                      active
                        ? 'bg-sidebar-active text-grafana-blue font-medium'
                        : 'text-text-secondary hover:bg-sidebar-hover hover:text-text-primary'
                    }`}
                  >
                    <item.icon size={18} className="flex-shrink-0" />
                    {showLabels && <span className="truncate flex-1">{item.label}</span>}
                    {showLabels && item.badge && (
                      <span className="px-1.5 py-0.5 rounded-full bg-grafana-red/15 text-grafana-red text-[10px] font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}
      <div className={`hidden lg:flex flex-shrink-0 ${sidebarW} transition-all duration-300`}>
        {sidebarContent}
      </div>
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </div>
    </>
  )
}
