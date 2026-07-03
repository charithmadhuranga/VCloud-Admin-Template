import { Outlet } from 'react-router'
import Sidebar from './Sidebar'
import Header from './Header'
import { SidebarProvider, useSidebar } from '../context/SidebarContext'

function LayoutContent() {
  const { isExpanded } = useSidebar()

  return (
    <div className="min-h-screen bg-bg-body flex flex-col">
      <Sidebar />
      <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
        isExpanded ? 'lg:ml-[290px]' : 'lg:ml-[90px]'
      }`}>
        <Header />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          <div className="mx-auto max-w-(--breakpoint-2xl) animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default function Layout() {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  )
}
