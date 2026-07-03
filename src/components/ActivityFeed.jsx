import { Activity, AlertTriangle, CheckCircle, Info } from 'lucide-react'

const events = [
  { icon: AlertTriangle, color: 'text-grafana-yellow', bg: 'bg-grafana-yellow/10', text: 'CPU threshold exceeded on k8s-node-02', time: '2m ago' },
  { icon: CheckCircle, color: 'text-grafana-green', bg: 'bg-grafana-green/10', text: 'Deployment fleet-api v3.2.1 rolled out successfully', time: '8m ago' },
  { icon: Activity, color: 'text-grafana-blue', bg: 'bg-grafana-blue/10', text: 'Auto-scaling triggered: +3 pods in us-east-1', time: '15m ago' },
  { icon: Info, color: 'text-grafana-purple', bg: 'bg-grafana-purple/10', text: 'SSL certificate renewed for *.fleet.example.com', time: '1h ago' },
  { icon: AlertTriangle, color: 'text-grafana-red', bg: 'bg-grafana-red/10', text: 'Disk usage at 94% on db-primary-01 (threshold: 90%)', time: '1h ago' },
  { icon: CheckCircle, color: 'text-grafana-green', bg: 'bg-grafana-green/10', text: 'Recovery: db-primary-01 read replicas back online', time: '2h ago' },
  { icon: Info, color: 'text-grafana-blue', bg: 'bg-grafana-blue/10', text: 'New node k8s-node-03 joined the cluster', time: '3h ago' },
]

export default function ActivityFeed() {
  return (
    <div className="rounded-xl border border-(--color-border) bg-(--color-surface-elevated)">
      <div className="px-5 py-3 border-b border-(--color-border)">
        <h3 className="text-sm font-semibold text-(--color-text-primary)">Recent Activity</h3>
      </div>
      <div className="divide-y divide-(--color-border)">
        {events.map((evt, i) => {
          const Icon = evt.icon
          return (
            <div key={i} className="flex items-start gap-3 px-5 py-3 hover:bg-(--color-surface-hover)/30 transition-colors">
              <div className={`w-7 h-7 rounded-lg ${evt.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <Icon size={14} className={evt.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-(--color-text-primary) leading-snug">{evt.text}</p>
              </div>
              <span className="text-xs text-(--color-text-muted) whitespace-nowrap flex-shrink-0">{evt.time}</span>
            </div>
          )
        })}
      </div>
      <button className="w-full px-5 py-2.5 text-xs font-medium text-grafana-blue hover:bg-(--color-surface-hover)/40 transition-colors border-t border-(--color-border) cursor-pointer">
        View all activity
      </button>
    </div>
  )
}
