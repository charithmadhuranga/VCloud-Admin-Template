import { useState } from 'react'
import { Bell } from 'lucide-react'
import Dropdown from '../ui/Dropdown'
import Avatar from '../ui/Avatar'

const notifications = [
  { id: 1, user: 'Terry Franci', action: 'requested access to', target: 'Production Cluster', time: '5m ago', avatar: null },
  { id: 2, user: 'Alena Franci', action: 'deployed to', target: 'fleet-api v3.2', time: '12m ago', avatar: null },
  { id: 3, user: 'Jocelyn Kenter', action: 'escalated alert', target: 'CPU on node-02', time: '25m ago', avatar: null },
  { id: 4, user: 'Brandon Philips', action: 'joined', target: 'Infra Team', time: '1h ago', avatar: null },
  { id: 5, user: 'System', action: 'auto-scaled', target: '+3 pods in us-east-1', time: '2h ago', avatar: null },
]

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false)
  const [unread, setUnread] = useState(notifications.length)

  return (
    <div className="relative">
      <button
        className="dropdown-toggle relative w-9 h-9 rounded-lg flex items-center justify-center text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors cursor-pointer"
        onClick={() => { setOpen(!open); setUnread(0) }}
      >
        <Bell size={16} />
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-grafana-red ring-2 ring-bg-surface">
            <span className="absolute inset-0 rounded-full bg-grafana-red animate-ping opacity-75" />
          </span>
        )}
      </button>
      <Dropdown isOpen={open} onClose={() => setOpen(false)} className="w-[320px] sm:w-[360px] max-sm:!left-4 max-sm:!right-4 max-sm:w-auto p-3">
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-border-default">
          <h5 className="text-sm font-semibold text-text-primary">Notifications</h5>
          <span className="text-[11px] text-text-tertiary">{unread} unread</span>
        </div>
        <div className="max-h-[320px] overflow-y-auto space-y-1">
          {notifications.map(n => (
            <button
              key={n.id}
              onClick={() => setOpen(false)}
              className="w-full flex gap-3 px-3 py-2.5 rounded-lg hover:bg-bg-hover transition-colors text-left cursor-pointer"
            >
              <Avatar name={n.user} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text-secondary leading-relaxed">
                  <span className="font-medium text-text-primary">{n.user}</span>{' '}
                  {n.action}{' '}
                  <span className="font-medium text-text-primary">{n.target}</span>
                </p>
                <span className="text-[10px] text-text-tertiary">{n.time}</span>
              </div>
            </button>
          ))}
        </div>
        <button className="w-full mt-2 pt-2 border-t border-border-default text-xs font-medium text-grafana-blue text-center py-2 hover:text-grafana-blue/80 cursor-pointer">
          View all notifications
        </button>
      </Dropdown>
    </div>
  )
}
