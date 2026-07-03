import { useState, useMemo } from 'react'
import { Search, Download } from 'lucide-react'
import PageBreadCrumb from '../components/ui/PageBreadCrumb'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

const logs = [
  { id: 1, action: 'user.login', user: 'john@fleet.io', resource: 'Web UI', detail: 'Login from 10.0.1.5', timestamp: '2026-07-03 09:42:15', severity: 'info' },
  { id: 2, action: 'cluster.scale', user: 'jane@fleet.io', resource: 'Deployment/fleet-api', detail: 'Scaled from 6 to 12 replicas', timestamp: '2026-07-03 09:38:22', severity: 'info' },
  { id: 3, action: 'alert.acknowledge', user: 'john@fleet.io', resource: 'Alert/CPU-89%', detail: 'Acknowledged alert on k8s-node-02', timestamp: '2026-07-03 09:15:00', severity: 'warning' },
  { id: 4, action: 'config.update', user: 'admin@fleet.io', resource: 'ConfigMap/prometheus', detail: 'Updated alerting rules', timestamp: '2026-07-03 08:52:33', severity: 'info' },
  { id: 5, action: 'auth.failure', user: 'svc-deploy-bot', resource: 'API/v1/telemtry', detail: 'Invalid API key', timestamp: '2026-07-03 08:30:18', severity: 'warning' },
  { id: 6, action: 'deployment.rollout', user: 'ci-cd@system', resource: 'Deployment/fleet-worker', detail: 'v2.1.0 rolled out (12/12)', timestamp: '2026-07-03 07:45:00', severity: 'info' },
  { id: 7, action: 'node.cordon', user: 'admin@fleet.io', resource: 'Node/k8s-node-02', detail: 'Cordoned for maintenance', timestamp: '2026-07-03 06:30:12', severity: 'warning' },
  { id: 8, action: 'secret.rotate', user: 'cert-manager', resource: 'Secret/tls-fleet', detail: 'Auto-rotated SSL certificate', timestamp: '2026-07-03 06:00:00', severity: 'info' },
  { id: 9, action: 'rbac.bind', user: 'admin@fleet.io', resource: 'RoleBinding/viewer', detail: 'Granted viewer access to sarah@fleet.io', timestamp: '2026-07-02 22:15:44', severity: 'info' },
  { id: 10, action: 'pod.evicted', user: 'kubelet', resource: 'Pod/fleet-api-7d8f2', detail: 'Evicted due to memory pressure on node-02', timestamp: '2026-07-02 21:48:30', severity: 'critical' },
  { id: 11, action: 'backup.complete', user: 'system', resource: 'ETCD Backup', detail: 'Snapshot saved to s3://fleet-backup/', timestamp: '2026-07-02 20:00:00', severity: 'info' },
  { id: 12, action: 'user.logout', user: 'mike@fleet.io', resource: 'Web UI', detail: 'Logout from 10.0.1.42', timestamp: '2026-07-02 19:30:15', severity: 'info' },
]

const actionColors = {
  'user.login': 'info',
  'cluster.scale': 'info',
  'alert.acknowledge': 'warning',
  'config.update': 'info',
  'auth.failure': 'warning',
  'deployment.rollout': 'success',
  'node.cordon': 'warning',
  'secret.rotate': 'info',
  'rbac.bind': 'info',
  'pod.evicted': 'error',
  'backup.complete': 'success',
  'user.logout': 'info',
}

export default function AuditLog() {
  const [filter, setFilter] = useState('')
  const filtered = useMemo(() =>
    logs.filter(l => Object.values(l).some(v => String(v).toLowerCase().includes(filter.toLowerCase()))),
    [filter]
  )

  return (
    <div className="space-y-6">
      <div>
        <PageBreadCrumb items={['Fleet Admin', 'Configuration', 'Audit Log']} />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-text-primary">Audit Log</h1>
            <p className="text-sm text-text-secondary mt-0.5">Track every action across the fleet</p>
          </div>
          <div className="flex-shrink-0 self-start sm:self-auto"><Button variant="secondary" size="sm" icon={Download}>Export</Button></div>
        </div>
      </div>

      <div className="rounded-xl border border-border-default bg-bg-card overflow-hidden">
        <div className="px-4 sm:px-5 py-3 border-b border-border-default flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="text-sm font-semibold text-text-primary">Event Log</h3>
          <div className="relative w-full sm:w-auto">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input type="text" value={filter} onChange={e => setFilter(e.target.value)}
              placeholder="Search log..." className="w-full sm:w-44 h-8 pl-8 pr-2 rounded-md bg-bg-input border border-border-subtle text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-grafana-blue/30" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-default bg-bg-hover/50">
                {['Timestamp', 'Action', 'User', 'Resource', 'Detail'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((l, i) => (
                <tr key={l.id} className={`border-b border-border-default hover:bg-bg-hover/40 ${i % 2 === 0 ? '' : 'bg-bg-hover/20'}`}>
                  <td className="px-4 py-2.5 text-xs text-text-tertiary font-mono">{l.timestamp}</td>
                  <td className="px-4 py-2.5">
                    <Badge variant={actionColors[l.action] || 'neutral'} size="sm">{l.action}</Badge>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-text-primary font-mono">{l.user}</td>
                  <td className="px-4 py-2.5 text-xs text-text-secondary font-mono">{l.resource}</td>
                  <td className="px-4 py-2.5 text-sm text-text-primary">{l.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-2.5 border-t border-border-default text-xs text-text-tertiary flex items-center justify-between">
          <span>Showing {filtered.length} of {logs.length} events</span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">Previous</Button>
            <Button variant="ghost" size="sm">Next</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
