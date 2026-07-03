import { useState } from 'react'
import { Layers, Play, Square, RefreshCw, Trash2, Plus, Search, ExternalLink, Server } from 'lucide-react'
import PageBreadCrumb from '../components/ui/PageBreadCrumb'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

const stacks = [
  { id: 's-01', name: 'fleet-api-stack', device: 'k8s-node-01', status: 'running', services: 4, images: ['fleet/api:v3.2.1', 'fleet/nginx:1.25', 'redis:7.2', 'postgres:16'], port: 8080, cpu: '12.4%', mem: '856 MB', created: '2d ago', error: null },
  { id: 's-02', name: 'monitoring-stack', device: 'k8s-node-02', status: 'running', services: 3, images: ['prom/prometheus:v2.52', 'grafana/grafana:11.0', 'prom/node-exporter:1.7'], port: 3000, cpu: '18.6%', mem: '1.2 GB', created: '5d ago', error: null },
  { id: 's-03', name: 'kafka-cluster', device: 'k8s-node-02', status: 'pulling', services: 3, images: ['confluent/kafka:7.6', 'confluent/zookeeper:7.6', 'provectus/kafka-ui:latest'], port: 9092, cpu: '—', mem: '—', created: '10m ago', error: null },
  { id: 's-04', name: 'edgex-stack', device: 'db-primary-01', status: 'running', services: 8, images: ['edgexfoundry/core-data:4.0', 'edgexfoundry/core-metadata:4.0', 'edgexfoundry/core-command:4.0', 'edgexfoundry/support-scheduler:4.0', 'edgexfoundry/support-notifications:4.0', 'redis:7.2-alpine', 'edgexfoundry/device-virtual:4.0', 'edgexfoundry/app-service:4.0'], port: 59880, cpu: '42.3%', mem: '2.1 GB', created: '12d ago', error: null },
  { id: 's-05', name: 'legacy-webapp', device: 'k8s-node-01', status: 'failed', services: 2, images: ['nginx:1.24', 'app:legacy'], port: null, cpu: '—', mem: '—', created: '1d ago', error: 'Image pull failed: app:legacy not found' },
  { id: 's-06', name: 'cache-cluster', device: 'redis-cache-01', status: 'stopped', services: 2, images: ['redis:7.2-alpine', 'redis-exporter:1.58'], port: 6379, cpu: '—', mem: '—', created: '3d ago', error: null },
]

const statusConfig = {
  running: { badge: 'success', label: 'Running', icon: Play },
  pulling: { badge: 'info', label: 'Pulling', icon: RefreshCw },
  stopped: { badge: 'neutral', label: 'Stopped', icon: Square },
  failed: { badge: 'error', label: 'Failed', icon: Trash2 },
  deploying: { badge: 'warning', label: 'Deploying', icon: RefreshCw },
}

export default function Stacks() {
  const [filter, setFilter] = useState('')
  const filtered = stacks.filter(s =>
    Object.values(s).some(v => String(v).toLowerCase().includes(filter.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div>
        <PageBreadCrumb items={['Fleet Admin', 'Edge Management', 'Stacks']} />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-text-primary">Docker Stacks</h1>
            <p className="text-sm text-text-secondary mt-0.5">Deploy and manage Docker Compose stacks on edge devices</p>
          </div>
          <div className="flex-shrink-0 self-start sm:self-auto"><Button variant="primary" size="sm" icon={Plus}>Deploy Stack</Button></div>
        </div>
      </div>

      <div className="rounded-xl border border-border-default bg-bg-card overflow-hidden">
        <div className="px-4 sm:px-5 py-3 border-b border-border-default flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="text-sm font-semibold text-text-primary">All Stacks ({stacks.length})</h3>
          <div className="relative w-full sm:w-auto">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input type="text" value={filter} onChange={e => setFilter(e.target.value)}
              placeholder="Search stacks..." className="w-full sm:w-56 h-8 pl-8 pr-2 rounded-md bg-bg-input border border-border-subtle text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-grafana-blue/30" />
          </div>
        </div>
        <div className="p-4 sm:p-5 space-y-3">
          {filtered.map(stack => {
            const sc = statusConfig[stack.status]
            const Icon = sc.icon
            return (
              <div key={stack.id} className="rounded-xl border border-border-default bg-bg-body p-4 hover:border-grafana-blue/30 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      stack.status === 'running' ? 'bg-grafana-green/10' : stack.status === 'failed' ? 'bg-grafana-red/10' : 'bg-border-default/50'
                    }`}>
                      <Layers size={16} className={
                        stack.status === 'running' ? 'text-grafana-green' : stack.status === 'failed' ? 'text-grafana-red' : 'text-text-tertiary'
                      } />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-text-primary">{stack.name}</span>
                        <Badge variant={sc.badge} size="sm" dot>{sc.label}</Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-text-tertiary flex-wrap">
                        <span className="flex items-center gap-1"><Server size={11} /> {stack.device}</span>
                        <span>{stack.services} services</span>
                        {stack.port && <span className="flex items-center gap-1"><ExternalLink size={11} /> :{stack.port}</span>}
                        <span>{stack.created}</span>
                      </div>
                      {stack.error && (
                        <div className="mt-2 px-2.5 py-1.5 rounded-lg bg-grafana-red/5 border border-grafana-red/20 text-xs text-grafana-red">
                          {stack.error}
                        </div>
                      )}
                      {stack.status !== 'failed' && stack.status !== 'stopped' && (
                        <div className="flex items-center gap-3 mt-2 text-[10px] text-text-tertiary">
                          <span>CPU {stack.cpu}</span>
                          <span>MEM {stack.mem}</span>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {stack.images.slice(0, 4).map(img => (
                          <span key={img} className="px-1.5 py-0.5 rounded bg-bg-hover text-[10px] text-text-secondary font-mono">{img.split('/').pop()}</span>
                        ))}
                        {stack.images.length > 4 && (
                          <span className="px-1.5 py-0.5 rounded bg-bg-hover text-[10px] text-text-tertiary">+{stack.images.length - 4}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    {stack.status === 'running' && <>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-text-tertiary hover:text-grafana-yellow hover:bg-grafana-yellow/10 cursor-pointer transition-colors" title="Stop"><Square size={14} /></button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-text-tertiary hover:text-grafana-blue hover:bg-grafana-blue/10 cursor-pointer transition-colors" title="Redeploy"><RefreshCw size={14} /></button>
                    </>}
                    {stack.status === 'stopped' && (
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center text-text-tertiary hover:text-grafana-green hover:bg-grafana-green/10 cursor-pointer transition-colors" title="Start"><Play size={14} /></button>
                    )}
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-text-tertiary hover:text-grafana-red hover:bg-grafana-red/10 cursor-pointer transition-colors" title="Delete"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <Layers size={32} className="mx-auto text-text-tertiary mb-3" />
              <p className="text-sm text-text-secondary">No stacks match your search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
