import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useLocation } from 'react-router'
import {
  LayoutDashboard, BarChart3, Activity, Bell, Settings, Server, Cpu, Shield, Users,
  ChevronDown, FileText, Radio, X
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
  const { isExpanded, isMobileOpen, showLabels, toggleSidebar, setIsMobileOpen, isMobile } = useSidebar()
  const [openSubmenu, setOpenSubmenu] = useState(null)
  const [subMenuHeight, setSubMenuHeight] = useState({})
  const subMenuRefs = useRef({})
  const location = useLocation()

  const isActive = useCallback((path) => {
    if (!path) return false
    if (path === '/') return location.pathname === '/'
    if (path.startsWith('/metrics')) return location.pathname.startsWith(path)
    return location.pathname === path
  }, [location.pathname])

  useEffect(() => {
    let matched = false
    navGroups.forEach((group, gi) => {
      group.items.forEach((item, ii) => {
        if (item.children) {
          item.children.forEach(child => {
            if (isActive(child.path)) {
              setOpenSubmenu(`${gi}-${ii}`)
              matched = true
            }
          })
        }
      })
    })
    if (!matched) setOpenSubmenu(null)
  }, [location.pathname, isActive])

  useEffect(() => {
    if (openSubmenu) {
      const el = subMenuRefs.current[openSubmenu]
      if (el) {
        setSubMenuHeight(prev => ({
          ...prev,
          [openSubmenu]: el.scrollHeight,
        }))
      }
    }
  }, [openSubmenu])

  const handleSubmenuToggle = (id) => {
    setOpenSubmenu(prev => prev === id ? null : id)
  }

  const renderItems = (items, groupIndex) => (
    <ul className="flex flex-col gap-1">
      {items.map((item, index) => {
        const id = `${groupIndex}-${index}`
        if (item.children) {
          const isSubOpen = openSubmenu === id
          const active = !isSubOpen && item.children.some(c => isActive(c.path))
          return (
            <li key={item.label}>
              <button
                onClick={() => handleSubmenuToggle(id)}
                className={`menu-item group cursor-pointer ${
                  !showLabels ? 'lg:justify-center' : 'lg:justify-start'
                } ${isSubOpen || active ? 'menu-item-active' : 'menu-item-inactive'}`}
              >
                <span className={`menu-item-icon-size ${isSubOpen || active ? 'menu-item-icon-active' : 'menu-item-icon-inactive'}`}>
                  <item.icon size={20} />
                </span>
                {showLabels && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}
                {showLabels && (
                  <ChevronDown size={14}
                    className={`flex-shrink-0 transition-transform duration-200 ${
                      isSubOpen ? 'rotate-180 text-grafana-blue' : ''
                    }`}
                  />
                )}
              </button>
              {showLabels && (
                <div
                  ref={el => { subMenuRefs.current[id] = el }}
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{ height: isSubOpen ? `${subMenuHeight[id] || 0}px` : '0px' }}
                >
                  <ul className="mt-1 space-y-0.5 ml-9">
                    {item.children.map(child => (
                      <li key={child.path}>
                        <Link
                          to={child.path}
                          onClick={() => isMobileOpen && setIsMobileOpen(false)}
                          className={`menu-dropdown-item ${
                            isActive(child.path) ? 'menu-dropdown-item-active' : 'menu-dropdown-item-inactive'
                          }`}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          )
        }

        const active = isActive(item.path)
        return (
          <li key={item.path}>
            <Link
              to={item.path}
              onClick={() => isMobileOpen && setIsMobileOpen(false)}
              className={`menu-item group ${
                !showLabels ? 'lg:justify-center' : 'lg:justify-start'
              } ${active ? 'menu-item-active' : 'menu-item-inactive'}`}
            >
              <span className={`menu-item-icon-size ${active ? 'menu-item-icon-active' : 'menu-item-icon-inactive'}`}>
                <item.icon size={20} />
              </span>
              {showLabels && (
                <span className="truncate flex-1">{item.label}</span>
              )}
              {showLabels && item.badge && (
                <span className="flex-shrink-0 px-1.5 py-0.5 rounded-full bg-grafana-red/15 text-grafana-red text-[10px] font-semibold">
                  {item.badge}
                </span>
              )}
            </Link>
          </li>
        )
      })}
    </ul>
  )

  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsMobileOpen(false)} />
      )}
      <aside
        className={`fixed top-0 left-0 h-screen z-50 flex flex-col bg-sidebar-bg border-r border-border-default transition-all duration-300 ease-in-out
          ${isExpanded || isMobileOpen ? 'w-[290px]' : 'w-[90px]'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0`}
      >
        <div className={`flex items-center h-14 px-4 border-b border-border-default flex-shrink-0 gap-3 ${
          !showLabels ? 'lg:justify-center' : 'justify-start'
        }`}>
          <div className="w-7 h-7 rounded-md bg-grafana-blue flex items-center justify-center flex-shrink-0">
            <Activity size={14} className="text-white" />
          </div>
          {showLabels && (
            <span className="font-semibold text-sm tracking-tight text-text-primary truncate flex-1">
              Fleet Admin
            </span>
          )}
          {isMobileOpen && (
            <button onClick={toggleSidebar} className="lg:hidden text-text-secondary hover:text-text-primary cursor-pointer flex-shrink-0">
              <X size={18} />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 no-scrollbar">
          <nav className="space-y-6">
            {navGroups.map((group, gi) => (
              <div key={group.section}>
                <h2 className={`mb-3 text-[10px] font-semibold tracking-widest text-text-tertiary uppercase flex items-center ${
                  showLabels ? 'justify-start' : 'lg:justify-center'
                }`}>
                  {showLabels ? group.section : <span className="size-1.5 rounded-full bg-text-tertiary" />}
                </h2>
                {renderItems(group.items, gi)}
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  )
}
