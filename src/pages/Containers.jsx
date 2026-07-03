import { useState } from 'react'
import { Search, Play, Square, RefreshCw } from 'lucide-react'
import PageBreadCrumb from '../components/ui/PageBreadCrumb'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

const containers = [
  { id: 'c-01', name: 'fleet-api', image: 'fleet/api:v3.2.1', status: 'Running', cpu: '12.4%', memory: '256 MB', port: '8080', created: '2d ago', node: 'k8s-node-01' },
  { id: 'c-02', name: 'fleet-worker', image: 'fleet/worker:v2.1.0', status: 'Running', cpu: '34.8%', memory: '512 MB', port: '—', created: '5d ago', node: 'k8s-node-02' },
  { id: 'c-03', name: 'redis-cache', image: 'redis:7.2-alpine', status: 'Running', cpu: '8.2%', memory: '128 MB', port: '6379', created: '12d ago', node: 'redis-cache-01' },
  { id: 'c-04', name: 'postgres-primary', image: 'postgres:16', status: 'Running', cpu: '45.1%', memory: '2.1 GB', port: '5432', created: '30d ago', node: 'db-primary-01' },
  { id: 'c-05', name: 'nginx-proxy', image: 'nginx:1.25', status: 'Running', cpu: '3.2%', memory: '64 MB', port: '443', created: '7d ago', node: 'k8s-master-01' },
  { id: 'c-06', name: 'prometheus', image: 'prom/prometheus:v2.52', status: 'Stopped', cpu: '0%', memory: '0 B', port: '9090', created: '1d ago', node: 'k8s-node-03' },
  { id: 'c-07', name: 'grafana', image: 'grafana/grafana:11.0', status: 'Running', cpu: '6.7%', memory: '192 MB', port: '3000', created: '3d ago', node: 'k8s-node-01' },
  { id: 'c-08', name: 'kafka-broker', image: 'confluent/kafka:7.6', status: 'Running', cpu: '28.3%', memory: '1.5 GB', port: '9092', created: '10d ago', node: 'k8s-node-02' },
]

export default function Containers() {
  const [filter, setFilter] = useState('')
  const filtered = containers.filter(c =>
    Object.values(c).some(v => String(v).toLowerCase().includes(filter.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div>
        <PageBreadCrumb items={['Fleet Admin', 'Infrastructure', 'Containers']} />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-text-primary">Containers</h1>
            <p className="text-sm text-text-secondary mt-0.5">{containers.length} containers across the cluster</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" icon={RefreshCw}>Refresh</Button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border-default bg-bg-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border-default flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-primary">Container List</h3>
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input type="text" value={filter} onChange={e => setFilter(e.target.value)}
              placeholder="Filter..." className="w-44 h-8 pl-8 pr-2 rounded-md bg-bg-input border border-border-subtle text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-grafana-blue/30" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-default bg-bg-hover/50">
                {['Name', 'Image', 'Status', 'CPU', 'Memory', 'Port', 'Created', 'Node', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id} className={`border-b border-border-default hover:bg-bg-hover/40 ${i % 2 === 0 ? '' : 'bg-bg-hover/20'}`}>
                  <td className="px-4 py-2.5">
                    <span className="font-medium text-text-primary">{c.name}</span>
                  </td>
                  <td className="px-4 py-2.5 text-text-secondary text-xs font-mono">{c.image}</td>
                  <td className="px-4 py-2.5">
                    <Badge variant={c.status === 'Running' ? 'success' : 'error'} size="sm" dot>{c.status}</Badge>
                  </td>
                  <td className="px-4 py-2.5 text-text-primary">{c.cpu}</td>
                  <td className="px-4 py-2.5 text-text-primary">{c.memory}</td>
                  <td className="px-4 py-2.5 text-text-secondary font-mono text-xs">{c.port}</td>
                  <td className="px-4 py-2.5 text-text-tertiary text-xs">{c.created}</td>
                  <td className="px-4 py-2.5 text-text-secondary text-xs">{c.node}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex gap-1">
                      {c.status === 'Running' ? (
                        <button className="w-7 h-7 rounded-md flex items-center justify-center text-text-tertiary hover:text-grafana-red hover:bg-grafana-red/10 cursor-pointer">
                          <Square size={12} />
                        </button>
                      ) : (
                        <button className="w-7 h-7 rounded-md flex items-center justify-center text-text-tertiary hover:text-grafana-green hover:bg-grafana-green/10 cursor-pointer">
                          <Play size={12} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border-default bg-bg-card p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Container Status Distribution</h3>
          <div className="space-y-3">
            {[{ label: 'Running', count: 7, color: 'bg-grafana-green', pct: 87.5 },
              { label: 'Stopped', count: 1, color: 'bg-grafana-red', pct: 12.5 },
            ].map(s => (
              <div key={s.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-text-primary">{s.label}</span>
                  <span className="text-text-secondary">{s.count} containers</span>
                </div>
                <div className="h-2 rounded-full bg-border-subtle overflow-hidden">
                  <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border-default bg-bg-card p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Resource Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Total Containers', value: '8' },
              { label: 'Active', value: '7' },
              { label: 'Total CPU', value: '142%' },
              { label: 'Total Memory', value: '4.7 GB' },
            ].map(s => (
              <div key={s.label} className="rounded-lg border border-border-default p-3 text-center">
                <p className="text-xs text-text-tertiary">{s.label}</p>
                <p className="text-lg font-semibold text-text-primary mt-1">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
