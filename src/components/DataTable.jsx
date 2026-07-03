import { useState, useMemo } from 'react'
import { ChevronDown, ChevronUp, ChevronsUpDown, Search } from 'lucide-react'
import StatusBadge from './StatusBadge'

const statusMap = {
  Running: 'success',
  Warning: 'warning',
  Critical: 'error',
  Pending: 'info',
  Stopped: 'neutral',
}

const initialData = [
  { id: 'node-01', host: 'k8s-master-01', status: 'Running', cpu: '34.2%', memory: '6.8/16 GB', disk: '128/256 GB', uptime: '48d 12h', region: 'us-east-1', pods: 24 },
  { id: 'node-02', host: 'k8s-node-01', status: 'Running', cpu: '67.8%', memory: '12.4/32 GB', disk: '412/512 GB', uptime: '32d 6h', region: 'us-east-1', pods: 42 },
  { id: 'node-03', host: 'k8s-node-02', status: 'Warning', cpu: '89.2%', memory: '28.1/32 GB', disk: '489/512 GB', uptime: '32d 6h', region: 'us-west-2', pods: 38 },
  { id: 'node-04', host: 'redis-cache-01', status: 'Running', cpu: '12.1%', memory: '3.2/8 GB', disk: '24/64 GB', uptime: '91d 3h', region: 'eu-west-1', pods: 6 },
  { id: 'node-05', host: 'db-primary-01', status: 'Critical', cpu: '94.5%', memory: '58.2/64 GB', disk: '892/1024 GB', uptime: '180d 9h', region: 'us-east-1', pods: 12 },
  { id: 'node-06', host: 'k8s-node-03', status: 'Running', cpu: '45.0%', memory: '14.8/32 GB', disk: '256/512 GB', uptime: '15d 2h', region: 'ap-southeast-1', pods: 34 },
  { id: 'node-07', host: 'cache-node-02', status: 'Pending', cpu: '0%', memory: '0/4 GB', disk: '8/32 GB', uptime: '0d 0h', region: 'eu-west-1', pods: 0 },
]

const columns = [
  { key: 'host', label: 'Host', sortable: true },
  { key: 'status', label: 'Status', sortable: true, render: (v) => <StatusBadge variant={statusMap[v]} label={v} /> },
  { key: 'cpu', label: 'CPU', sortable: true },
  { key: 'memory', label: 'Memory', sortable: true },
  { key: 'disk', label: 'Disk', sortable: true },
  { key: 'uptime', label: 'Uptime', sortable: true },
  { key: 'region', label: 'Region', sortable: true },
  { key: 'pods', label: 'Pods', sortable: true },
]

export default function DataTable() {
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')
  const [filter, setFilter] = useState('')

  const sorted = useMemo(() => {
    let data = initialData
    if (filter) {
      data = data.filter(r =>
        Object.values(r).some(v => String(v).toLowerCase().includes(filter.toLowerCase()))
      )
    }
    if (sortKey) {
      data = [...data].sort((a, b) => {
        const av = a[sortKey], bv = b[sortKey]
        const cmp = typeof av === 'string' ? av.localeCompare(bv) : (av - bv)
        return sortDir === 'asc' ? cmp : -cmp
      })
    }
    return data
  }, [sortKey, sortDir, filter])

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return (
    <div className="rounded-xl border border-(--color-border) bg-(--color-surface-elevated) overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-5 py-3 border-b border-(--color-border) gap-3">
        <h3 className="text-sm font-semibold text-(--color-text-primary)">Node Metrics</h3>
        <div className="relative w-full sm:w-auto">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-(--color-text-muted)" />
          <input
            type="text"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="Filter..."
            className="w-full sm:w-44 h-8 pl-8 pr-2 rounded-md bg-(--color-surface-elevated) border border-(--color-border) text-xs text-(--color-text-primary) 
                       placeholder:text-(--color-text-muted) focus:outline-none focus:ring-2 focus:ring-grafana-blue/30 transition-colors"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-(--color-border) bg-(--color-surface-hover)/50">
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`px-4 py-3 text-left text-xs font-semibold text-(--color-text-secondary) tracking-wider uppercase ${
                    col.sortable ? 'cursor-pointer hover:text-(--color-text-primary) select-none' : ''
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      <span className="inline-flex flex-col">
                        {sortKey === col.key ? (
                          sortDir === 'asc' ? <ChevronUp size={10} /> : <ChevronDown size={10} />
                        ) : (
                          <ChevronsUpDown size={10} className="opacity-30" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr
                key={row.id}
                className={`border-b border-(--color-border) transition-colors hover:bg-(--color-surface-hover)/40 ${
                  i % 2 === 0 ? 'bg-transparent' : 'bg-(--color-surface-hover)/20'
                }`}
              >
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-2.5 text-(--color-text-primary) text-sm whitespace-nowrap">
                    {col.render ? col.render(row[col.key]) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-5 py-2.5 border-t border-(--color-border) text-xs text-(--color-text-muted) flex items-center justify-between">
        <span>{sorted.length} of {initialData.length} nodes</span>
        <span>Updated 2m ago</span>
      </div>
    </div>
  )
}
