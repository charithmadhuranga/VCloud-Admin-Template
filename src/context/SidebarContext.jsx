import { createContext, useContext, useState, useEffect } from 'react'

const SidebarContext = createContext()

export function SidebarProvider({ children }) {
  const [expanded, setExpanded] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (mobile) setExpanded(false)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const toggleSidebar = () => {
    if (isMobile) setMobileOpen(prev => !prev)
    else setExpanded(prev => !prev)
  }

  const showLabels = expanded || hovered || mobileOpen

  return (
    <SidebarContext.Provider value={{
      expanded: isMobile ? false : expanded,
      mobileOpen,
      hovered,
      showLabels,
      setHovered,
      toggleSidebar,
      setMobileOpen,
      isMobile,
    }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider')
  return ctx
}
