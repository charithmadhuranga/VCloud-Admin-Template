import { Search } from 'lucide-react'
import PageBreadCrumb from '../components/ui/PageBreadCrumb'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import ComponentCard from '../components/ui/ComponentCard'
import { Shield, AlertTriangle, CheckCircle, Users, Key, Lock } from 'lucide-react'

const policies = [
  { rule: 'All API traffic must use TLS 1.3', scope: 'Cluster-wide', status: 'Enforced', compliance: '98%' },
  { rule: 'Container images must be signed', scope: 'All namespaces', status: 'Enforced', compliance: '94%' },
  { rule: 'RBAC: least-privilege access', scope: 'Users & ServiceAccounts', status: 'Audit', compliance: '87%' },
  { rule: 'Network policies restrict egress', scope: 'Production', status: 'Enforced', compliance: '100%' },
  { rule: 'Secrets must be encrypted at rest', scope: 'Cluster-wide', status: 'Enforced', compliance: '100%' },
  { rule: 'Pod security standards: restricted', scope: 'All namespaces', status: 'Audit', compliance: '91%' },
]

const recentEvents = [
  { event: 'Failed login attempt', user: 'svc-deploy-bot', source: '10.0.12.84', time: '2m ago', severity: 'warning' },
  { event: 'Pod security violation', user: 'kube-system', source: 'k8s-node-02', time: '15m ago', severity: 'critical' },
  { event: 'Certificate rotation', user: 'cert-manager', source: 'cluster', time: '1h ago', severity: 'info' },
  { event: 'RBAC role binding modified', user: 'admin@fleet.io', source: '10.0.1.5', time: '3h ago', severity: 'info' },
  { event: 'Cluster audit log export', user: 'system', source: 's3-bucket', time: '6h ago', severity: 'info' },
]

export default function Security() {
  return (
    <div className="space-y-6">
      <div>
        <PageBreadCrumb items={['Fleet Admin', 'Infrastructure', 'Security']} />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-text-primary">Security</h1>
            <p className="text-sm text-text-secondary mt-0.5">Security policies, compliance, and events</p>
          </div>
          <div className="flex-shrink-0 self-start sm:self-auto"><Button variant="primary" size="sm" icon={Shield}>Run Audit</Button></div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Policies Enforced', value: '4/6', icon: Lock, color: 'text-grafana-green' },
          { label: 'Compliance Score', value: '95%', icon: CheckCircle, color: 'text-grafana-green' },
          { label: 'Open Violations', value: '3', icon: AlertTriangle, color: 'text-grafana-red' },
          { label: 'Active Users', value: '24', icon: Users, color: 'text-grafana-blue' },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-border-default bg-bg-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <s.icon size={15} className={s.color} />
              <span className="text-xs text-text-secondary">{s.label}</span>
            </div>
            <p className="text-xl font-semibold text-text-primary">{s.value}</p>
          </div>
        ))}
      </div>

      <ComponentCard title="Security Policies" desc="Active policies and their compliance status">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-default">
                {['Policy', 'Scope', 'Status', 'Compliance'].map(h => (
                  <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-text-secondary uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {policies.map((p, i) => (
                <tr key={i} className="border-b border-border-default">
                  <td className="px-3 py-2.5 text-text-primary text-sm">{p.rule}</td>
                  <td className="px-3 py-2.5 text-text-secondary text-xs">{p.scope}</td>
                  <td className="px-3 py-2.5">
                    <Badge variant={p.status === 'Enforced' ? 'success' : 'warning'} size="sm">{p.status}</Badge>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-border-subtle overflow-hidden max-w-[80px]">
                        <div className={`h-full rounded-full ${parseInt(p.compliance) >= 95 ? 'bg-grafana-green' : parseInt(p.compliance) >= 85 ? 'bg-grafana-yellow' : 'bg-grafana-red'}`}
                          style={{ width: p.compliance }} />
                      </div>
                      <span className="text-xs text-text-secondary">{p.compliance}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ComponentCard>

      <ComponentCard title="Recent Security Events" desc="Latest security-relevant events">
        <div className="space-y-2">
          {recentEvents.map((e, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-bg-hover/40 transition-colors">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                e.severity === 'critical' ? 'bg-grafana-red/10' : e.severity === 'warning' ? 'bg-grafana-yellow/10' : 'bg-grafana-blue/10'
              }`}>
                {e.severity === 'critical' ? <AlertTriangle size={13} className="text-grafana-red" /> :
                 e.severity === 'warning' ? <AlertTriangle size={13} className="text-grafana-yellow" /> :
                 <Shield size={13} className="text-grafana-blue" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary">{e.event}</p>
                <p className="text-xs text-text-tertiary">{e.user} · {e.source}</p>
              </div>
              <span className="text-xs text-text-tertiary flex-shrink-0">{e.time}</span>
            </div>
          ))}
        </div>
      </ComponentCard>
    </div>
  )
}
