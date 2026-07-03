import { useState } from 'react'
import { GitBranch, Upload, Download, Play, Trash2, Search, Server, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import PageBreadCrumb from '../components/ui/PageBreadCrumb'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

const snapshots = [
  { id: 'f-01', device: 'k8s-node-01', version: 12, status: 'deployed', nodes: 24, created: '2026-07-03 09:42:15', error: null },
  { id: 'f-02', device: 'k8s-node-02', version: 8, status: 'deployed', nodes: 18, created: '2026-07-03 08:30:00', error: null },
  { id: 'f-03', device: 'k8s-node-01', version: 11, status: 'failed', nodes: 0, created: '2026-07-02 22:15:44', error: 'Invalid flow JSON at line 142: unexpected token' },
  { id: 'f-04', device: 'db-primary-01', version: 5, status: 'deployed', nodes: 32, created: '2026-07-02 18:00:00', error: null },
  { id: 'f-05', device: 'k8s-node-03', version: 3, status: 'pending', nodes: 0, created: '2026-07-03 10:00:00', error: null },
  { id: 'f-06', device: 'k8s-node-02', version: 7, status: 'deployed', nodes: 15, created: '2026-07-01 14:30:00', error: null },
  { id: 'f-07', device: 'k8s-node-01', version: 10, status: 'deployed', nodes: 22, created: '2026-06-30 11:00:00', error: null },
]

const statusConfig = {
  deployed: { badge: 'success', label: 'Deployed', icon: CheckCircle },
  failed: { badge: 'error', label: 'Failed', icon: XCircle },
  pending: { badge: 'warning', label: 'Deploying', icon: AlertTriangle },
}

export default function Flows() {
  const [filter, setFilter] = useState('')
  const filtered = snapshots.filter(s =>
    Object.values(s).some(v => String(v).toLowerCase().includes(filter.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div>
        <PageBreadCrumb items={['Fleet Admin', 'Edge Management', 'Node-RED Flows']} />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-text-primary">Node-RED Flows</h1>
            <p className="text-sm text-text-secondary mt-0.5">Deploy and manage Node-RED flow configurations across edge devices</p>
          </div>
          <div className="flex gap-2 flex-shrink-0 self-start sm:self-auto">
            <Button variant="secondary" size="sm" icon={Upload}>Upload Flow</Button>
            <Button variant="primary" size="sm" icon={GitBranch}>Deploy</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Snapshots', value: snapshots.length, icon: GitBranch, color: 'text-grafana-blue' },
          { label: 'Deployed', value: snapshots.filter(s => s.status === 'deployed').length, icon: CheckCircle, color: 'text-grafana-green' },
          { label: 'Failed', value: snapshots.filter(s => s.status === 'failed').length, icon: XCircle, color: 'text-grafana-red' },
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

      <div className="rounded-xl border border-border-default bg-bg-card overflow-hidden">
        <div className="px-4 sm:px-5 py-3 border-b border-border-default flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="text-sm font-semibold text-text-primary">Flow Snapshots</h3>
          <div className="relative w-full sm:w-auto">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input type="text" value={filter} onChange={e => setFilter(e.target.value)}
              placeholder="Search snapshots..." className="w-full sm:w-56 h-8 pl-8 pr-2 rounded-md bg-bg-input border border-border-subtle text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-grafana-blue/30" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-default bg-bg-hover/50">
                {['Version', 'Device', 'Status', 'Nodes', 'Created', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => {
                const sc = statusConfig[s.status]
                const Icon = sc.icon
                return (
                  <tr key={s.id} className={`border-b border-border-default hover:bg-bg-hover/40 ${i % 2 === 0 ? '' : 'bg-bg-hover/20'}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <GitBranch size={14} className="text-text-tertiary" />
                        <span className="font-mono text-sm font-medium text-text-primary">v{s.version}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-text-secondary">{s.device}</td>
                    <td className="px-4 py-3">
                      <Badge variant={sc.badge} size="sm" dot>{sc.label}</Badge>
                      {s.error && (
                        <div className="mt-1 text-[10px] text-grafana-red max-w-[250px] truncate" title={s.error}>{s.error}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-text-primary font-mono">{s.nodes}</td>
                    <td className="px-4 py-3 text-xs text-text-tertiary">{s.created}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button className="w-7 h-7 rounded-md flex items-center justify-center text-text-tertiary hover:text-grafana-blue hover:bg-grafana-blue/10 cursor-pointer" title="Deploy"><Play size={12} /></button>
                        <button className="w-7 h-7 rounded-md flex items-center justify-center text-text-tertiary hover:text-grafana-blue hover:bg-grafana-blue/10 cursor-pointer" title="Download"><Download size={12} /></button>
                        <button className="w-7 h-7 rounded-md flex items-center justify-center text-text-tertiary hover:text-grafana-red hover:bg-grafana-red/10 cursor-pointer" title="Delete"><Trash2 size={12} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
