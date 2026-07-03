import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import {
  ArrowLeft, Activity, Terminal, Box, Shell, BarChart3, Folder,
  Cpu, MemoryStick, HardDrive, Server, Radio, Monitor, Play, Square, RotateCcw, Info
} from 'lucide-react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Spinner from '../components/ui/Spinner'
import AreaChart from '../components/charts/AreaChart'
import BarChart from '../components/charts/BarChart'

const agentMeta = {
  stack: { label: 'Stack Agent', icon: Server, color: 'text-grafana-blue' },
  tunnel: { label: 'Tunnel Agent', icon: Radio, color: 'text-grafana-purple' },
  edgex: { label: 'EdgeX Agent', icon: Monitor, color: 'text-grafana-yellow' },
  manager: { label: 'Manager Agent', icon: Server, color: 'text-grafana-green' },
}

const statusBadgeColor = (s) => {
  switch (s) {
    case 'online': return 'green'
    case 'offline': return 'gray'
    case 'error': return 'red'
    default: return 'orange'
  }
}

const tabs = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'agents', label: 'Agents', icon: Terminal },
  { id: 'containers', label: 'Containers', icon: Box },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'files', label: 'Files', icon: Folder },
  { id: 'shell', label: 'Shell', icon: Shell },
]

const devices = {
  'd-01': { id: 'd-01', name: 'k8s-master-01', ip: '10.0.1.10', status: 'online', os: 'Ubuntu 22.04', arch: 'x86_64', cpu_cores: 8, mem_total: '32 GB', disk_total: '512 GB', docker: '24.0.7', kernel: '6.2.0-1014-gcp', last_seen: new Date().toISOString(), cpu_usage: '23.5', mem_usage: '42.1', disk_usage: '50.2', stack_agent_status: 'online', edgex_agent_status: 'online', tunnel_agent_status: 'online', manager_agent_status: 'online' },
  'd-02': { id: 'd-02', name: 'k8s-node-01', ip: '10.0.1.11', status: 'online', os: 'Ubuntu 22.04', arch: 'x86_64', cpu_cores: 8, mem_total: '32 GB', disk_total: '512 GB', docker: '24.0.7', kernel: '6.2.0-1014-gcp', last_seen: new Date().toISOString(), cpu_usage: '68.2', mem_usage: '39.0', disk_usage: '80.1', stack_agent_status: 'online', edgex_agent_status: 'offline', tunnel_agent_status: 'online', manager_agent_status: 'online' },
  'd-05': { id: 'd-05', name: 'redis-cache-01', ip: '10.0.1.30', status: 'offline', os: 'Ubuntu 22.04', arch: 'x86_64', cpu_cores: 4, mem_total: '16 GB', disk_total: '256 GB', docker: '24.0.7', kernel: '6.2.0-1014-gcp', last_seen: new Date(Date.now() - 7200000).toISOString(), cpu_usage: null, mem_usage: null, disk_usage: '38.0', stack_agent_status: 'offline', edgex_agent_status: 'offline', tunnel_agent_status: 'offline', manager_agent_status: 'online' },
}

const hours = Array.from({ length: 12 }, (_, i) => `${String(i * 2).padStart(2, '0')}:00`)

function OverviewTab({ device }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'CPU Usage', value: parseFloat(device.cpu_usage) || 0, color: '#6f96d9', title: device.cpu_usage ? `${device.cpu_usage}%` : 'N/A' },
          { label: 'Memory Usage', value: parseFloat(device.mem_usage) || 0, color: '#967bde', title: device.mem_usage ? `${device.mem_usage}%` : 'N/A' },
          { label: 'Disk Usage', value: parseFloat(device.disk_usage) || 0, color: '#6fbf73', title: device.disk_usage ? `${device.disk_usage}%` : 'N/A' },
          { label: 'Uptime', value: 0, color: '#f5c542', title: '—' },
        ].map(g => (
          <Card key={g.label} className="p-4 text-center">
            <p className="text-xs text-text-muted mb-2">{g.label}</p>
            <p className="text-2xl font-semibold text-text-primary mb-2">{g.title}</p>
            <div className="h-1.5 rounded-full bg-border overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${Math.min(g.value, 100)}%`, backgroundColor: g.color }} />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">CPU & Memory (24h)</h3>
          <AreaChart
            data={[
              { name: 'CPU %', data: [45, 48, 42, 47, 44, 52, 58, 55, 50, 46, 43, 47] },
              { name: 'Memory %', data: [35, 38, 42, 39, 43, 41, 45, 48, 44, 40, 38, 42] },
            ]}
            categories={hours}
            colors={['#6f96d9', '#967bde']}
          />
        </Card>
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-3">System Info</h3>
          <div className="space-y-2">
            {[
              { label: 'OS', value: device.os },
              { label: 'Architecture', value: device.arch },
              { label: 'CPU Cores', value: `${device.cpu_cores} vCPUs` },
              { label: 'Memory', value: device.mem_total },
              { label: 'Disk', value: device.disk_total },
              { label: 'Docker', value: device.docker },
              { label: 'Kernel', value: device.kernel },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between py-1.5">
                <span className="text-xs text-text-muted">{s.label}</span>
                <span className="text-xs text-text-primary font-mono">{s.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-3">Network Interfaces</h3>
        <div className="space-y-3">
          {[
            { iface: 'eth0', ip: '10.0.1.11/24', rx: '245 MB/s', tx: '189 MB/s' },
            { iface: 'eth1', ip: '192.168.1.11/24', rx: '12 MB/s', tx: '8 MB/s' },
            { iface: 'lo', ip: '127.0.0.1/8', rx: '2 MB/s', tx: '2 MB/s' },
          ].map(n => (
            <div key={n.iface} className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface-hover">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-grafana-green" />
                <span className="text-xs font-mono font-medium text-text-primary">{n.iface}</span>
                <span className="text-[10px] text-text-muted">{n.ip}</span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-text-muted">
                <span>&darr; {n.rx}</span>
                <span>&uarr; {n.tx}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function AgentsTab({ device }) {
  const agents = [
    { type: 'manager', status: device.manager_agent_status, version: '2.1.0', desc: 'Device orchestration & health', uptime: '32d 6h', mem: '32 MB' },
    { type: 'stack', status: device.stack_agent_status, version: '2.1.0', desc: 'Manages Docker Compose stacks', uptime: '32d 6h', mem: '24 MB' },
    { type: 'tunnel', status: device.tunnel_agent_status, version: '2.0.3', desc: 'FRP tunnel management', uptime: '15d 2h', mem: '12 MB' },
    { type: 'edgex', status: device.edgex_agent_status, version: '2.1.0', desc: 'EdgeX IoT device management', uptime: '32d 6h', mem: '18 MB' },
  ]
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {agents.map(a => {
        const meta = agentMeta[a.type]
        const Icon = meta.icon
        return (
          <Card key={a.type} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-hover flex items-center justify-center">
                  <Icon size={15} className={meta.color} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{meta.label}</p>
                  <p className="text-[10px] text-text-muted">v{a.version}</p>
                </div>
              </div>
              <Badge color={statusBadgeColor(a.status)}>{a.status}</Badge>
            </div>
            <p className="text-xs text-text-secondary mb-3">{a.desc}</p>
            <div className="flex items-center gap-4 text-[10px] text-text-muted">
              <span className="flex items-center gap-1"><Activity size={10} /> {a.uptime}</span>
              <span className="flex items-center gap-1"><MemoryStick size={10} /> {a.mem}</span>
            </div>
            <div className="mt-3 pt-3 border-t border-border flex gap-2">
              <Button variant="ghost" size="sm"><RotateCcw size={12} /> Restart</Button>
              <Button variant="ghost" size="sm"><Terminal size={12} /> Logs</Button>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

function ContainersTab() {
  const containers = [
    { name: 'fleet-api', image: 'fleet/api:v3.2.1', status: 'running', cpu: '12.4%', mem: '256 MB', ports: '8080' },
    { name: 'fleet-worker', image: 'fleet/worker:v2.1.0', status: 'running', cpu: '34.8%', mem: '512 MB', ports: '\u2014' },
    { name: 'redis-cache', image: 'redis:7.2-alpine', status: 'running', cpu: '8.2%', mem: '128 MB', ports: '6379' },
    { name: 'prometheus', image: 'prom/prometheus:v2.52', status: 'running', cpu: '6.7%', mem: '192 MB', ports: '9090' },
  ]
  return (
    <Card className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-hover">
            {['Name', 'Image', 'Status', 'CPU', 'Memory', 'Ports', ''].map(h => (
              <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {containers.map((c) => (
            <tr key={c.name} className="border-b border-border hover:bg-surface-hover transition-colors last:border-0">
              <td className="px-4 py-3 font-medium text-text-primary">{c.name}</td>
              <td className="px-4 py-3 text-xs text-text-secondary font-mono">{c.image}</td>
              <td className="px-4 py-3"><Badge color={statusBadgeColor(c.status)}>{c.status}</Badge></td>
              <td className="px-4 py-3 text-text-primary">{c.cpu}</td>
              <td className="px-4 py-3 text-text-primary">{c.mem}</td>
              <td className="px-4 py-3 text-text-secondary font-mono text-xs">{c.ports}</td>
              <td className="px-4 py-3">
                <div className="flex gap-1">
                  <button className="w-7 h-7 rounded-md flex items-center justify-center text-text-muted hover:text-grafana-red hover:bg-grafana-red/10 cursor-pointer"><Square size={12} /></button>
                  <button className="w-7 h-7 rounded-md flex items-center justify-center text-text-muted hover:text-grafana-blue hover:bg-grafana-blue/10 cursor-pointer"><Terminal size={12} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}

function AnalyticsTab() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">CPU Usage Trend</h3>
          <AreaChart data={[{ name: 'CPU %', data: [45, 48, 42, 47, 44, 52, 58, 55, 50, 46, 43, 47] }]} categories={hours} colors={['#6f96d9']} />
        </Card>
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Memory Usage Trend</h3>
          <AreaChart data={[{ name: 'Memory %', data: [35, 38, 42, 39, 43, 41, 45, 48, 44, 40, 38, 42] }]} categories={hours} colors={['#967bde']} />
        </Card>
      </div>
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Disk Usage by Partition</h3>
        <BarChart data={[{ name: 'Usage', data: [50, 80, 95, 38, 25] }]} categories={['/dev/sda1 (/)', '/dev/sdb1 (/data)', '/dev/sdc1 (/var)', '/dev/sdd1 (/backup)', '/dev/sde1 (/tmp)']} colors={['#6fbf73']} />
      </Card>
    </div>
  )
}

function FilesTab() {
  const files = [
    { name: 'config.yaml', size: '2.4 KB', modified: '2h ago', perms: '-rw-r--r--' },
    { name: 'docker-compose.yml', size: '1.1 KB', modified: '1d ago', perms: '-rw-r--r--' },
    { name: 'logs/', size: '\u2014', modified: 'Just now', perms: 'drwxr-xr-x' },
    { name: 'metrics.db', size: '128 MB', modified: '5m ago', perms: '-rw-------' },
    { name: '.env', size: '512 B', modified: '3d ago', perms: '-rw-------' },
  ]
  return (
    <Card className="overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">File Browser</h3>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">New File</Button>
          <Button variant="ghost" size="sm">Upload</Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-hover">
              {['Name', 'Size', 'Modified', 'Permissions', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {files.map((f) => (
              <tr key={f.name} className="border-b border-border hover:bg-surface-hover transition-colors last:border-0">
                <td className="px-4 py-2.5">
                  <span className={`text-sm font-mono ${f.name.endsWith('/') ? 'text-grafana-blue' : 'text-text-primary'}`}>{f.name}</span>
                </td>
                <td className="px-4 py-2.5 text-xs text-text-muted">{f.size}</td>
                <td className="px-4 py-2.5 text-xs text-text-muted">{f.modified}</td>
                <td className="px-4 py-2.5 text-xs text-text-muted font-mono">{f.perms}</td>
                <td className="px-4 py-2.5"><Button variant="ghost" size="sm">Edit</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function ShellTab() {
  return (
    <Card className="overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">Interactive Terminal</h3>
        <Button variant="secondary" size="sm"><RotateCcw size={12} /> Reconnect</Button>
      </div>
      <div className="p-5 bg-[#0d1117] font-mono text-xs text-[#c9d1d9] leading-relaxed min-h-[320px] overflow-x-auto">
        <div className="space-y-1">
          <p><span className="text-grafana-green">root@device</span><span className="text-text-muted">:</span><span className="text-grafana-blue">~</span><span className="text-text-muted">$</span> ./status.sh</p>
          <p className="text-text-muted">  Uptime: 32 days 6 hours 12 minutes</p>
          <p className="text-text-muted">  CPU: 68.2% used (8 cores)</p>
          <p className="text-text-muted">  Memory: 12.4 GB / 32 GB used</p>
          <p className="text-text-muted">  Disk: 256 GB / 512 GB used (ext4)</p>
          <p className="text-text-muted">  Docker: 24.0.7 \u00b7 4 running, 0 stopped</p>
          <p className="text-text-muted">  Agents: All 4 online</p>
          <p><span className="text-grafana-green">root@device</span><span className="text-text-muted">:</span><span className="text-grafana-blue">~</span><span className="text-text-muted">$</span> <span className="animate-pulse">&#9608;</span></p>
        </div>
      </div>
    </Card>
  )
}

const tabComponents = { overview: OverviewTab, agents: AgentsTab, containers: ContainersTab, analytics: AnalyticsTab, files: FilesTab, shell: ShellTab }

export default function DeviceDetail() {
  const { deviceId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const device = devices[deviceId] || { id: deviceId, name: deviceId || 'Unknown', ip: '\u2014', status: 'unknown', os: '\u2014', arch: '\u2014', cpu_cores: '\u2014', mem_total: '\u2014', disk_total: '\u2014', docker: '\u2014', kernel: '\u2014', last_seen: null, cpu_usage: null, mem_usage: null, disk_usage: null, stack_agent_status: 'unknown', edgex_agent_status: 'unknown', tunnel_agent_status: 'unknown', manager_agent_status: 'unknown' }
  const ActiveComponent = tabComponents[activeTab]

  if (!devices[deviceId]) {
    return (
      <div className="py-16 text-center">
        <p className="text-text-muted text-sm">Device not found.</p>
        <Button variant="ghost" size="sm" onClick={() => navigate('/devices')} className="mt-4">
          <ArrowLeft size={14} /> Back to Devices
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-6">
      <div className="flex items-center gap-3 shrink-0">
        <Button variant="ghost" size="sm" onClick={() => navigate('/devices')}>
          <ArrowLeft size={16} />
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-text-primary">{device.name}</h1>
            <Badge color={statusBadgeColor(device.status)}>{device.status}</Badge>
          </div>
          <p className="text-sm text-text-muted">
            {device.ip ? `${device.ip} \u00b7 ` : ''}
            {device.last_seen
              ? `Last seen ${new Date(device.last_seen).toLocaleString()}`
              : 'Not seen yet'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 bg-surface-elevated border border-border rounded-grafana p-0.5 w-fit overflow-x-auto shrink-0">
        {tabs.map((t) => {
          const Icon = t.icon
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-grafana capitalize transition-colors cursor-pointer ${
                activeTab === t.id ? 'bg-grafana-blue text-white' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon size={14} />
              {t.label}
            </button>
          )
        })}
      </div>

      <ActiveComponent device={device} />
    </div>
  )
}
