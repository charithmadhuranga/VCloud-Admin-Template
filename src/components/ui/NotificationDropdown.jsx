import { useState } from 'react'
import { useNavigate } from 'react-router'
import { X, Bell, AlertTriangle, Shield, Activity, Monitor } from 'lucide-react'
import Dropdown from './Dropdown'

const notifications = [
  {
    id: 1,
    icon: AlertTriangle,
    color: 'text-grafana-orange',
    bg: 'bg-grafana-orange/10',
    title: 'Device R3-200L latency spike',
    description: 'Latency exceeded 500ms threshold',
    time: '2 min ago',
  },
  {
    id: 2,
    icon: Shield,
    color: 'text-grafana-red',
    bg: 'bg-grafana-red/10',
    title: 'Tunnel edge-01 connection lost',
    description: 'Auto-reconnect initiated',
    time: '15 min ago',
  },
  {
    id: 3,
    icon: Monitor,
    color: 'text-grafana-green',
    bg: 'bg-grafana-green/10',
    title: 'Firmware update complete',
    description: '3 devices updated to v2.4.1',
    time: '1 hr ago',
  },
  {
    id: 4,
    icon: Activity,
    color: 'text-grafana-blue',
    bg: 'bg-grafana-blue/10',
    title: 'Stack production-deploy scaled',
    description: 'Replicas: 4 → 6',
    time: '2 hr ago',
  },
]

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifying, setNotifying] = useState(true)
  const navigate = useNavigate()

  const toggle = () => {
    setIsOpen(!isOpen)
    setNotifying(false)
  }

  const handleViewAll = () => {
    setIsOpen(false)
    navigate('/alerts')
  }

  return (
    <div className="relative">
      <button
        onClick={toggle}
        className="relative p-2 rounded-lg text-(--color-text-secondary) hover:text-(--color-text-primary) hover:bg-(--color-surface-hover) transition-colors cursor-pointer dropdown-toggle"
        title="Notifications"
      >
        <Bell size={18} />
        {notifying && (
          <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-grafana-red">
            <span className="absolute inset-0 rounded-full bg-grafana-red animate-ping" />
          </span>
        )}
      </button>

      <Dropdown isOpen={isOpen} onClose={() => setIsOpen(false)} className="w-[360px] p-0 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-(--color-border)">
          <h5 className="text-sm font-semibold text-(--color-text-primary)">Notifications</h5>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md text-(--color-text-muted) hover:text-(--color-text-primary) hover:bg-(--color-surface-hover) transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <ul className="max-h-[360px] overflow-y-auto">
          {notifications.map((n) => (
            <li key={n.id}>
              <button
                onClick={() => { setIsOpen(false); navigate('/alerts'); }}
                className="w-full flex gap-3 px-4 py-3 border-b border-(--color-border) hover:bg-(--color-surface-hover) transition-colors text-left cursor-pointer"
              >
                <div className={`shrink-0 w-9 h-9 rounded-lg ${n.bg} flex items-center justify-center ${n.color}`}>
                  <n.icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-(--color-text-primary) truncate">{n.title}</p>
                  <p className="text-xs text-(--color-text-secondary) truncate">{n.description}</p>
                  <p className="text-[11px] text-(--color-text-muted) mt-0.5">{n.time}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>

        <div className="p-3">
          <button
            onClick={handleViewAll}
            className="w-full py-2 text-sm font-medium text-grafana-blue hover:text-grafana-blue/80 bg-(--color-surface-hover) rounded-lg transition-colors cursor-pointer"
          >
            View All Notifications
          </button>
        </div>
      </Dropdown>
    </div>
  )
}
