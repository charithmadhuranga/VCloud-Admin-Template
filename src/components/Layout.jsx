import { Outlet } from 'react-router'
import Sidebar from './Sidebar'
import Header from './Header'
import { SidebarProvider } from '../context/SidebarContext'

export default function Layout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-bg-body">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="max-w-(--breakpoint-2xl) mx-auto animate-fade-in">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
