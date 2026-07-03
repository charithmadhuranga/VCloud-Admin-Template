import { AlertTriangle, CheckCircle, Info, XCircle, Filter } from 'lucide-react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import PageBreadCrumb from '../components/ui/PageBreadCrumb'

const alerts = [
  { severity: 'critical', title: 'Disk usage at 94% on db-primary-01', desc: 'Threshold is 90%. Auto-remediation triggered.', time: '2m ago', status: 'Acknowledged' },
  { severity: 'warning', title: 'CPU threshold exceeded on k8s-node-02', desc: 'Current: 89.2% — Threshold: 85%', time: '8m ago', status: 'Open' },
  { severity: 'info', title: 'Auto-scaling triggered in us-east-1', desc: '+3 pods added to fleet-api deployment', time: '15m ago', status: 'Resolved' },
  { severity: 'critical', title: 'SSL certificate expires in 7 days', desc: 'Certificate for *.fleet.example.com', time: '1h ago', status: 'Open' },
  { severity: 'warning', title: 'Memory pressure on cache-node-03', desc: 'Usage: 88.4% of 32 GB', time: '1h ago', status: 'Acknowledged' },
  { severity: 'info', title: 'Deployment fleet-api v3.2.1 complete', desc: 'Rollout finished — 12/12 pods healthy', time: '2h ago', status: 'Resolved' },
  { severity: 'warning', title: 'Network latency spike in ap-southeast-1', desc: 'P99 latency: 245ms (baseline: 120ms)', time: '3h ago', status: 'Open' },
]

const severityConfig = {
  critical: { icon: XCircle, badge: 'error', label: 'Critical' },
  warning: { icon: AlertTriangle, badge: 'warning', label: 'Warning' },
  info: { icon: Info, badge: 'info', label: 'Info' },
}

export default function Alerts() {
  return (
    <div className="space-y-6">
      <div>
        <PageBreadCrumb items={['Fleet Admin', 'Alerts']} />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-text-primary">Alerts</h1>
            <p className="text-sm text-text-secondary mt-0.5">Active and historical alerts across the fleet</p>
          </div>
          <Button variant="secondary" size="sm" icon={Filter}>Filter</Button>
        </div>
      </div>

      <div className="space-y-3">
        {alerts.map((alert, i) => {
          const cfg = severityConfig[alert.severity]
          const Icon = cfg.icon
          return (
            <div key={i} className="rounded-xl border border-border-default bg-bg-card p-4 hover:bg-bg-hover/30 transition-colors">
              <div className="flex gap-3">
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                  alert.severity === 'critical' ? 'bg-grafana-red/10' : alert.severity === 'warning' ? 'bg-grafana-yellow/10' : 'bg-grafana-blue/10'
                }`}>
                  <Icon size={15} className={
                    alert.severity === 'critical' ? 'text-grafana-red' : alert.severity === 'warning' ? 'text-grafana-yellow' : 'text-grafana-blue'
                  } />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-text-primary">{alert.title}</span>
                    <Badge variant={cfg.badge} size="sm">{cfg.label}</Badge>
                  </div>
                  <p className="text-xs text-text-secondary">{alert.desc}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[11px] text-text-tertiary">{alert.time}</span>
                    <Badge variant={alert.status === 'Resolved' ? 'success' : alert.status === 'Acknowledged' ? 'info' : 'warning'} size="sm" dot>
                      {alert.status}
                    </Badge>
                  </div>
                </div>
                {alert.severity !== 'info' && (
                  <div className="flex-shrink-0">
                    <Button variant="ghost" size="sm">Acknowledge</Button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
