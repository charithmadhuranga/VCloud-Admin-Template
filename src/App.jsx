import { BrowserRouter, Routes, Route } from 'react-router'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import MetricsOverview from './pages/metrics/Overview'
import MetricsCPU from './pages/metrics/CPU'
import MetricsMemory from './pages/metrics/Memory'
import MetricsNetwork from './pages/metrics/Network'
import Alerts from './pages/Alerts'
import Nodes from './pages/Nodes'
import Containers from './pages/Containers'
import Security from './pages/Security'
import Users from './pages/Users'
import Settings from './pages/Settings'
import AuditLog from './pages/AuditLog'
import Integrations from './pages/Integrations'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="metrics" element={<MetricsOverview />} />
            <Route path="metrics/cpu" element={<MetricsCPU />} />
            <Route path="metrics/memory" element={<MetricsMemory />} />
            <Route path="metrics/network" element={<MetricsNetwork />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="nodes" element={<Nodes />} />
            <Route path="containers" element={<Containers />} />
            <Route path="security" element={<Security />} />
            <Route path="users" element={<Users />} />
            <Route path="settings" element={<Settings />} />
            <Route path="audit" element={<AuditLog />} />
            <Route path="integrations" element={<Integrations />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
