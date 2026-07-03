import { createContext, useContext, useState, useEffect } from 'react'

const SidebarContext = createContext()

export function SidebarProvider({ children }) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (!mobile) setIsMobileOpen(false)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleSidebar = () => {
    if (isMobile) setIsMobileOpen(prev => !prev)
    else setIsExpanded(prev => !prev)
  }

  const toggleMobileSidebar = () => {
    setIsMobileOpen(prev => !prev)
  }

  const showLabels = isExpanded || isMobileOpen

  return (
    <SidebarContext.Provider value={{
      isExpanded: isMobile ? false : isExpanded,
      isMobileOpen,
      showLabels,
      toggleSidebar,
      toggleMobileSidebar,
      setIsMobileOpen,
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
