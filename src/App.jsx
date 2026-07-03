import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Devices from './pages/Devices'
import DeviceDetail from './pages/DeviceDetail'
import Flows from './pages/Flows'
import Stacks from './pages/Stacks'
import EdgeX from './pages/EdgeX'
import Tunnel from './pages/Tunnel'
import Analytics from './pages/Analytics'
import Alerts from './pages/Alerts'
import ActivityLog from './pages/ActivityLog'
import Users from './pages/Users'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="devices" element={<Devices />} />
            <Route path="devices/:deviceId" element={<DeviceDetail />} />
            <Route path="flows" element={<Flows />} />
            <Route path="stacks" element={<Stacks />} />
            <Route path="edgex" element={<EdgeX />} />
            <Route path="tunnel" element={<Tunnel />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="activity" element={<ActivityLog />} />
            <Route path="users" element={<Users />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
