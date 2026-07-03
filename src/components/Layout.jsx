import { Outlet } from 'react-router'
import { SidebarProvider } from '../context/SidebarContext'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout() {
  return (
    <SidebarProvider>
      <div className="h-screen bg-surface-base flex">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <Header />
          <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
            <div className="mx-auto max-w-(--breakpoint-2xl) animate-fade-in">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
