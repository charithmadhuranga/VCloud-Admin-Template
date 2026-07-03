import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router'
import {
  Search, Monitor, Box, Shield, Cpu, Trash2, PlusCircle, Copy, Check, Terminal, X
} from 'lucide-react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'

const devices = [
  { id: 'd-01', name: 'k8s-master-01', ip: '10.0.1.10', status: 'online', reg: 'active', cpu: 34, mem: 42, disk: 50, os: 'Ubuntu 22.04', arch: 'x86_64', docker: '24.0.7', last_seen: new Date().toISOString(), stack_agent_status: 'online', edgex_agent_status: 'online', tunnel_agent_status: 'online', manager_agent_status: 'online', device_type: 'device' },
  { id: 'd-02', name: 'k8s-node-01', ip: '10.0.1.11', status: 'online', reg: 'active', cpu: 68, mem: 39, disk: 80, os: 'Ubuntu 22.04', arch: 'x86_64', docker: '24.0.7', last_seen: new Date().toISOString(), stack_agent_status: 'online', edgex_agent_status: 'offline', tunnel_agent_status: 'online', manager_agent_status: 'online', device_type: 'device' },
  { id: 'd-03', name: 'raspberry-pi-01', ip: '10.0.1.40', status: 'online', reg: 'active', cpu: 22, mem: 34, disk: 45, os: 'Debian 12', arch: 'arm64', docker: '24.0.6', last_seen: new Date().toISOString(), stack_agent_status: 'online', edgex_agent_status: 'online', tunnel_agent_status: 'online', manager_agent_status: 'online', device_type: 'device' },
  { id: 'd-04', name: 'db-primary-01', ip: '10.0.1.20', status: 'online', reg: 'active', cpu: 94, mem: 91, disk: 87, os: 'Debian 12', arch: 'x86_64', docker: '24.0.6', last_seen: new Date(Date.now() - 30000).toISOString(), stack_agent_status: 'online', edgex_agent_status: 'online', tunnel_agent_status: 'online', manager_agent_status: 'online', device_type: 'device' },
  { id: 'd-05', name: 'redis-cache-01', ip: '10.0.1.30', status: 'offline', reg: 'active', cpu: 0, mem: 0, disk: 38, os: 'Ubuntu 22.04', arch: 'x86_64', docker: '24.0.7', last_seen: new Date(Date.now() - 7200000).toISOString(), stack_agent_status: 'offline', edgex_agent_status: 'offline', tunnel_agent_status: 'offline', manager_agent_status: 'online', device_type: 'device' },
  { id: 'd-06', name: 'demo-device-01', ip: '10.0.1.50', status: 'online', reg: 'active', cpu: 8, mem: 12, disk: 15, os: 'Raspbian 11', arch: 'armv7l', docker: '20.10.24', last_seen: new Date().toISOString(), stack_agent_status: 'online', edgex_agent_status: 'online', tunnel_agent_status: 'online', manager_agent_status: 'online', device_type: 'demo' },
  { id: 'd-07', name: 'cache-node-02', ip: '10.0.1.31', status: 'error', reg: 'pending_script', cpu: 0, mem: 0, disk: 25, os: 'Ubuntu 22.04', arch: 'arm64', docker: null, last_seen: new Date(Date.now() - 86400000).toISOString(), stack_agent_status: 'unknown', edgex_agent_status: 'unknown', tunnel_agent_status: 'unknown', manager_agent_status: 'unknown', device_type: 'device' },
]

const STATUS_COLOR = { online: 'green', offline: 'gray', error: 'red' }
const AGENT_STATUS_COLOR = { online: 'green', offline: 'gray', error: 'red', unknown: 'orange' }
const DEVICE_TYPE_COLOR = { device: 'blue', demo: 'orange' }

function AgentBadge({ status }) {
  return <Badge color={AGENT_STATUS_COLOR[status] || 'gray'}>{status}</Badge>
}

export default function Devices() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [regFilter, setRegFilter] = useState('')
  const [selected, setSelected] = useState(new Set())
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [registerOpen, setRegisterOpen] = useState(false)
  const [regName, setRegName] = useState('')
  const [regResult, setRegResult] = useState(null)
  const [copied, setCopied] = useState(false)

  const filtered = useMemo(() => {
    let data = devices
    if (search) {
      const q = search.toLowerCase()
      data = data.filter(d => d.name.toLowerCase().includes(q) || d.ip.includes(q) || d.os.toLowerCase().includes(q))
    }
    if (statusFilter) data = data.filter(d => d.status === statusFilter)
    if (regFilter) data = data.filter(d => d.reg === regFilter)
    return data
  }, [search, statusFilter, regFilter])

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) setSelected(new Set())
    else setSelected(new Set(filtered.map(d => d.id)))
  }

  const handleCopy = () => {
    navigator.clipboard.writeText('curl -fsSL https://get.vedge.io/install.sh | sh -s -- --key=xxxx')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-semibold text-text-primary">Devices</h1>
        <Button variant="primary" size="sm" onClick={() => { setRegisterOpen(!registerOpen); setRegResult(null); setRegName(''); }}>
          <PlusCircle size={14} />
          Register Device
        </Button>
      </div>
      <p className="text-sm text-text-secondary mb-6">
        Manage your fleet of edge devices. Click a row to view device details and manage agents.
      </p>

      {registerOpen && (
        <div className="mb-6">
          {!regResult ? (
            <Card className="max-w-lg p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Device Name</label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. production-nodered-01"
                    className="w-full bg-surface-base border border-border rounded-grafana px-3 py-1.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-grafana-blue"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={() => setRegResult({ name: regName, id: 'd-new', device_key: 'vdk-xxxx-xxxx-xxxx', install_command: 'curl -fsSL https://get.vedge.io/install.sh | sh -s -- --key=vdk-xxxx-xxxx-xxxx' })} disabled={!regName.trim()}>
                    <Monitor size={16} />
                    Generate Install Command
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => setRegisterOpen(false)}>Cancel</Button>
                </div>
              </div>
            </Card>
          ) : (
            <div className="space-y-4 max-w-2xl">
              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-grafana bg-grafana-green/10 flex items-center justify-center shrink-0">
                    <Check size={16} className="text-grafana-green" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-sm text-text-primary">Device "{regResult.name}" registered</h3>
                    <p className="text-xs text-text-muted mt-1 font-mono">ID: {regResult.id}</p>
                    <p className="text-xs text-text-muted mt-1">
                      Device key: <span className="font-mono text-grafana-orange">{regResult.device_key}</span>
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <Terminal size={16} className="text-text-secondary mt-0.5" />
                  <p className="text-sm text-text-secondary">
                    Run this command on the edge device to install and start agents:
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute top-3 right-3 z-10">
                    <Button variant="secondary" size="sm" onClick={handleCopy}>
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      {copied ? 'Copied' : 'Copy'}
                    </Button>
                  </div>
                  <pre className="bg-surface-elevated text-text-primary rounded-grafana border border-border p-4 pr-20 text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap break-all">
                    <code>{regResult.install_command}</code>
                  </pre>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-xs text-text-secondary mt-3">
                  <li>Connects to the VEdge Manager and downloads agent images</li>
                  <li>Starts agents (Stack, EdgeX, Tunnel, Manager) and Node-RED</li>
                  <li>Agents authenticate using the device key and report their status</li>
                </ol>
                <Button variant="secondary" size="sm" onClick={() => { setRegisterOpen(false); setRegResult(null); }} className="mt-2">
                  Done
                </Button>
              </Card>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search devices..."
            className="w-full pl-9 pr-3 py-1.5 text-sm bg-surface-elevated border border-border rounded-grafana text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-grafana-blue"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-surface-elevated border border-border rounded-grafana px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-grafana-blue"
        >
          <option value="">All status</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
          <option value="error">Error</option>
        </select>
        <select
          value={regFilter}
          onChange={(e) => setRegFilter(e.target.value)}
          className="bg-surface-elevated border border-border rounded-grafana px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-grafana-blue"
        >
          <option value="">All registration</option>
          <option value="active">Active</option>
          <option value="pending_script">Pending Script</option>
          <option value="registered">Registered</option>
        </select>
      </div>

      {selected.size > 0 && (
        <div className="mb-4 flex items-center gap-3 px-4 py-2.5 bg-grafana-blue/5 border border-grafana-blue/20 rounded-grafana">
          <span className="text-sm text-text-primary font-medium">{selected.size} selected</span>
          <Button variant="destructive" size="sm" onClick={() => setSelected(new Set())}>
            <Trash2 size={14} />
            Delete Selected
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>
            <X size={14} />
            Clear
          </Button>
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={Monitor}
          title="No devices found"
          description={search || statusFilter || regFilter ? 'Try different filters.' : 'Register a device to get started.'}
        />
      ) : (
        <div className="bg-surface-elevated border border-border rounded-grafana overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-text-muted text-xs uppercase tracking-wider">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.size === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-border accent-grafana-blue"
                  />
                </th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">
                  <span className="flex items-center gap-1"><Box size={12} /> Stack</span>
                </th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">
                  <span className="flex items-center gap-1"><Shield size={12} /> Tunnel</span>
                </th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">
                  <span className="flex items-center gap-1"><Cpu size={12} /> EdgeX</span>
                </th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Type</th>
                <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">IP</th>
                <th className="w-10 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr
                  key={d.id}
                  className="border-b border-border last:border-0 hover:bg-surface-hover transition-colors cursor-pointer"
                  onClick={() => navigate(`/devices/${d.id}`)}
                >
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selected.has(d.id)}
                      onChange={() => toggleSelect(d.id)}
                      className="rounded border-border accent-grafana-blue"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Badge color={STATUS_COLOR[d.status]}>{d.status}</Badge>
                  </td>
                  <td className="px-4 py-3 font-medium text-text-primary">{d.name}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <AgentBadge status={d.stack_agent_status} />
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <AgentBadge status={d.tunnel_agent_status} />
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <AgentBadge status={d.edgex_agent_status} />
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <Badge color={DEVICE_TYPE_COLOR[d.device_type] || 'blue'}>{d.device_type || 'device'}</Badge>
                  </td>
                  <td className="px-4 py-3 text-text-secondary hidden sm:table-cell">
                    {d.ip || '\u2014'}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteTarget(d); }}
                      className="text-text-muted hover:text-grafana-red transition-colors"
                      title="Delete device"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete device"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" size="sm" onClick={() => setDeleteTarget(null)}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-text-secondary">
          Are you sure you want to delete <span className="font-semibold text-text-primary">{deleteTarget?.name}</span>?
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}
