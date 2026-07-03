import { useState } from 'react'
import { Outlet } from 'react-router'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-surface-base flex">
      <Sidebar open={sidebarOpen} />
      <div className={`flex flex-col flex-1 min-w-0 transition-all duration-300 ease-in-out ${sidebarOpen ? 'lg:ml-0' : 'lg:ml-0'}`}>
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          <div className="mx-auto max-w-(--breakpoint-2xl) animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
