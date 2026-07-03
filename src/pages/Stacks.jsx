import { useState, useMemo, useRef } from 'react'
import { Layers, Play, Square, Trash2, Code2, Plus, Upload, Loader2, Terminal, ExternalLink, Search, CheckCircle2, XCircle, AlertCircle, Clock, Puzzle } from 'lucide-react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import ErrorMessage from '../components/ui/ErrorMessage'
import { useTheme } from '../context/ThemeContext'

const STATUS_CONFIG = {
  running: { label: 'Running', icon: CheckCircle2, color: 'green', bg: 'bg-grafana-green/10', iconColor: 'text-grafana-green' },
  stopped: { label: 'Stopped', icon: Square, color: 'gray', bg: 'bg-(--color-surface-hover)', iconColor: 'text-(--color-text-muted)' },
  failed: { label: 'Failed', icon: XCircle, color: 'red', bg: 'bg-grafana-red/10', iconColor: 'text-grafana-red' },
  pending: { label: 'Pending', icon: Clock, color: 'orange', bg: 'bg-grafana-orange/10', iconColor: 'text-grafana-orange' },
  deploying: { label: 'Deploying', icon: Loader2, color: 'blue', bg: 'bg-grafana-blue/10', iconColor: 'text-grafana-blue' },
  starting: { label: 'Starting', icon: Loader2, color: 'blue', bg: 'bg-grafana-blue/10', iconColor: 'text-grafana-blue' },
  pulling_images: { label: 'Pulling Images', icon: Loader2, color: 'purple', bg: 'bg-grafana-purple/10', iconColor: 'text-grafana-purple' },
}

const FILTER_TABS = [
  { key: '', label: 'All' },
  { key: 'running', label: 'Running' },
  { key: 'stopped', label: 'Stopped' },
  { key: 'failed', label: 'Failed' },
]

const CATEGORIES = [
  { key: '', label: 'All' },
  { key: 'monitoring', label: 'Monitoring' },
  { key: 'database', label: 'Database' },
  { key: 'iot', label: 'IoT / Messaging' },
  { key: 'infrastructure', label: 'Infrastructure' },
]

const templates = [
  { id: 'grafana', name: 'Grafana', description: 'Metrics dashboard and analytics with rich visualizations. Pre-configured with Prometheus data source.', category: 'monitoring', has_logo: false, env_schema: [{ key: 'GF_SECURITY_ADMIN_PASSWORD', label: 'Admin Password', default: 'admin', required: true }, { key: 'GF_INSTALL_PLUGINS', label: 'Plugins', default: '', required: false }] },
  { id: 'prometheus', name: 'Prometheus', description: 'Monitoring system and time-series database for metrics collection and alerting.', category: 'monitoring', has_logo: false, env_schema: [] },
  { id: 'influxdb', name: 'InfluxDB', description: 'Time-series database designed for high-write-volume metrics and events storage.', category: 'database', has_logo: false, env_schema: [{ key: 'INFLUXDB_DB', label: 'Database Name', default: 'telegraf', required: true }, { key: 'INFLUXDB_ADMIN_PASSWORD', label: 'Admin Password', default: 'admin', required: true }] },
  { id: 'postgres', name: 'PostgreSQL', description: 'Advanced open-source relational database with robust SQL support.', category: 'database', has_logo: false, env_schema: [{ key: 'POSTGRES_PASSWORD', label: 'Password', default: 'postgres', required: true }, { key: 'POSTGRES_DB', label: 'Database Name', default: 'postgres', required: false }] },
  { id: 'redis', name: 'Redis', description: 'In-memory data structure store used as cache, message broker, and database.', category: 'database', has_logo: false, env_schema: [{ key: 'REDIS_PASSWORD', label: 'Password', default: '', required: false }] },
  { id: 'nodered', name: 'Node-RED', description: 'Flow-based visual programming tool for wiring IoT devices and APIs.', category: 'iot', has_logo: false, env_schema: [] },
  { id: 'mosquitto', name: 'Mosquitto MQTT', description: 'Lightweight MQTT broker for IoT messaging and device communication.', category: 'iot', has_logo: false, env_schema: [{ key: 'MOSQUITTO_USERNAME', label: 'Username', default: 'admin', required: false }, { key: 'MOSQUITTO_PASSWORD', label: 'Password', default: 'password', required: false }] },
  { id: 'homeassistant', name: 'Home Assistant', description: 'Open-source home automation platform with device integration and automation engine.', category: 'iot', has_logo: false, env_schema: [] },
  { id: 'portainer', name: 'Portainer', description: 'Container management UI for Docker environments with RBAC and templates.', category: 'infrastructure', has_logo: false, env_schema: [] },
  { id: 'nginx', name: 'Nginx', description: 'High-performance web server, reverse proxy, and load balancer.', category: 'infrastructure', has_logo: false, env_schema: [] },
]

const mockStacks = [
  { id: 's-01', name: 'fleet-api-stack', device_id: 'k8s-node-01', status: 'running', web_ui_port: 8080, error_log: null, services: 4, created: '2d ago' },
  { id: 's-02', name: 'monitoring-stack', device_id: 'k8s-node-02', status: 'running', web_ui_port: 3000, error_log: null, services: 3, created: '5d ago' },
  { id: 's-03', name: 'kafka-cluster', device_id: 'k8s-node-02', status: 'pulling_images', web_ui_port: null, error_log: null, services: 3, created: '10m ago' },
  { id: 's-04', name: 'edgex-stack', device_id: 'db-primary-01', status: 'running', web_ui_port: 59880, error_log: null, services: 8, created: '12d ago' },
  { id: 's-05', name: 'legacy-webapp', device_id: 'k8s-node-01', status: 'failed', web_ui_port: null, error_log: 'Image pull failed: app:legacy not found', services: 2, created: '1d ago' },
  { id: 's-06', name: 'cache-cluster', device_id: 'redis-cache-01', status: 'stopped', web_ui_port: 6379, error_log: null, services: 2, created: '3d ago' },
  { id: 's-07', name: 'mqtt-broker', device_id: 'gw-iot-01', status: 'running', web_ui_port: 1883, error_log: null, services: 1, created: '6h ago' },
  { id: 's-08', name: 'influx-data-pipeline', device_id: 'gw-iot-01', status: 'deploying', web_ui_port: null, error_log: null, services: 2, created: '2m ago' },
]

const mockDevices = [
  { id: 'd-01', name: 'k8s-node-01', status: 'online' },
  { id: 'd-02', name: 'k8s-node-02', status: 'online' },
  { id: 'd-03', name: 'db-primary-01', status: 'online' },
  { id: 'd-04', name: 'redis-cache-01', status: 'online' },
  { id: 'd-05', name: 'gw-iot-01', status: 'online' },
  { id: 'd-06', name: 'gateway-alpha', status: 'offline' },
]

const composeExamples = {
  grafana: `version: "3.8"
services:
  grafana:
    image: grafana/grafana:11.0
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=\${GF_SECURITY_ADMIN_PASSWORD:-admin}
    volumes:
      - grafana-data:/var/lib/grafana
volumes:
  grafana-data:`,
}

export default function Stacks() {
  const { theme } = useTheme();
  const [stacks, setStacks] = useState(mockStacks)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [actionLoading, setActionLoading] = useState(null)
  const [templateCatalog, setTemplateCatalog] = useState(templates)

  const [categoryFilter, setCategoryFilter] = useState('')
  const [mainTab, setMainTab] = useState('installed')
  const [templateSearch, setTemplateSearch] = useState('')
  const [newStackOpen, setNewStackOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailTab, setDetailTab] = useState('compose')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const [stackName, setStackName] = useState('')
  const [selectedTemplateId, setSelectedTemplateId] = useState('')
  const [composeYaml, setComposeYaml] = useState('')
  const [envValues, setEnvValues] = useState({})
  const [selectedDeviceId, setSelectedDeviceId] = useState('')
  const [deploying, setDeploying] = useState(false)
  const [deployError, setDeployError] = useState(null)
  const [stackNameError, setStackNameError] = useState('')
  const [composeYamlError, setComposeYamlError] = useState('')
  const [deviceError, setDeviceError] = useState('')

  const [detailStackId, setDetailStackId] = useState(null)
  const [editYaml, setEditYaml] = useState('')
  const [editEnvValues, setEditEnvValues] = useState({})
  const [redeploying, setRedeploying] = useState(false)
  const [stackLogs, setStackLogs] = useState(null)
  const [logsLoading, setLogsLoading] = useState(false)

  const fileInputRef = useRef(null)

  const selectedTemplate = useMemo(
    () => templateCatalog.find((t) => t.id === selectedTemplateId),
    [templateCatalog, selectedTemplateId]
  )

  const filteredStacks = useMemo(() => {
    let result = stacks
    if (statusFilter) result = result.filter((s) => s.status === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((s) => s.name.toLowerCase().includes(q) || s.device_id.toLowerCase().includes(q))
    }
    return result
  }, [stacks, statusFilter, search])

  const stats = useMemo(() => {
    const total = stacks.length
    const running = stacks.filter((s) => s.status === 'running').length
    const failed = stacks.filter((s) => s.status === 'failed').length
    return { total, running, failed }
  }, [stacks])

  const handleOpenNewStack = () => {
    setStackName('')
    setSelectedTemplateId('')
    setComposeYaml('')
    setEnvValues({})
    setSelectedDeviceId('')
    setDeployError(null)
    setStackNameError('')
    setComposeYamlError('')
    setDeviceError('')
    setNewStackOpen(true)
  }

  const handleTemplateSelect = (id) => {
    setSelectedTemplateId(id)
    if (id) {
      const t = templateCatalog.find((x) => x.id === id)
      if (t) {
        setStackName(t.name)
        setComposeYaml(composeExamples[id] || `# ${t.name} compose configuration\nservices:\n  app:\n    image: ${id}:latest\n    ports:\n      - "80:80"\n`)
        const defaults = {}
        if (t.env_schema) t.env_schema.forEach((f) => { defaults[f.key] = f.default })
        setEnvValues(defaults)
      }
    } else {
      setStackName('')
      setComposeYaml('')
      setEnvValues({})
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => { setComposeYaml(ev.target?.result || '') }
    reader.readAsText(file)
    e.target.value = ''
  }

  const canDeploy = () => {
    if (!selectedDeviceId) return false
    if (selectedTemplateId) return true
    return !!(stackName.trim() && composeYaml.trim())
  }

  const handleDeploy = () => {
    if (!selectedDeviceId) { setDeviceError('Device selection is required'); return }
    if (!selectedTemplateId && !stackName.trim()) { setStackNameError('Stack name is required'); return }
    if (!selectedTemplateId && !composeYaml.trim()) { setComposeYamlError('Compose YAML is required'); return }
    setDeploying(true)
    setTimeout(() => {
      const newStack = {
        id: 's-' + Date.now(),
        name: stackName || selectedTemplate?.name || 'custom-stack',
        device_id: selectedDeviceId,
        status: 'deploying',
        web_ui_port: null,
        error_log: null,
        services: 1,
        created: 'just now',
      }
      setStacks((prev) => [newStack, ...prev])
      setDeploying(false)
      setNewStackOpen(false)
    }, 800)
  }

  const handleViewDetail = (stack) => {
    setDetailStackId(stack.id)
    setDetailTab('compose')
    setEditYaml(`# ${stack.name}\nservices:\n  app:\n    image: ${stack.name}:latest\n    ports:\n      - "80:80"\n`)
    setEditEnvValues({})
    setStackLogs(null)
    setDetailOpen(true)
  }

  const handleFetchLogs = () => {
    if (!detailStackId) return
    setLogsLoading(true)
    setStackLogs(null)
    setTimeout(() => {
      setStackLogs(`[INFO]  Starting stack services...\n[INFO]  Pulling images...\n[INFO]  Creating network...\n[INFO]  Starting containers...\n[INFO]  Stack is running.\n[INFO]  All services healthy.`)
      setLogsLoading(false)
    }, 600)
  }

  const handleRedeploy = () => {
    setRedeploying(true)
    setTimeout(() => {
      setRedeploying(false)
      setDetailOpen(false)
      setDetailStackId(null)
    }, 600)
  }

  const handleDeleteConfirm = () => {
    setDeleting(true)
    setTimeout(() => {
      setStacks((prev) => prev.filter((s) => s.id !== deleteTarget.id))
      setDeleting(false)
      setDeleteTarget(null)
    }, 400)
  }

  const handleAction = (fn, id) => {
    setActionLoading(id)
    setTimeout(() => {
      fn(id)
      setActionLoading(null)
    }, 400)
  }

  const stopStack = (id) => setStacks((prev) => prev.map((s) => s.id === id ? { ...s, status: 'stopped' } : s))
  const startStack = (id) => setStacks((prev) => prev.map((s) => s.id === id ? { ...s, status: 'running' } : s))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-grafana-purple/10 flex items-center justify-center">
            <Layers size={20} className="text-grafana-purple" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-(--color-text-primary)">Stacks</h1>
            <p className="text-sm text-(--color-text-secondary)">Deploy and manage Docker Compose stacks on your devices.</p>
          </div>
        </div>
        <Button variant="primary" size="sm" onClick={handleOpenNewStack}>
          <Plus size={14} />
          New Stack
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-(--color-text-muted)">Total Stacks</p>
          <p className="text-2xl font-bold text-(--color-text-primary) mt-1">{stats.total}</p>
        </div>
        <div className="bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-(--color-text-muted)">Running</p>
          <p className="text-2xl font-bold text-grafana-green mt-1">{stats.running}</p>
        </div>
        <div className="bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-(--color-text-muted)">Failed</p>
          <p className="text-2xl font-bold text-grafana-red mt-1">{stats.failed}</p>
        </div>
      </div>

      {/* Main tabs: Installed | Catalog */}
      <div className="flex items-center gap-1 bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana p-0.5 w-fit">
        <button onClick={() => setMainTab('installed')}
          className={`px-4 py-1.5 text-sm font-medium rounded-grafana transition-colors cursor-pointer ${
            mainTab === 'installed' ? 'bg-grafana-blue text-white' : 'text-(--color-text-secondary) hover:text-(--color-text-primary)'
          }`}>Installed</button>
        <button onClick={() => setMainTab('catalog')}
          className={`px-4 py-1.5 text-sm font-medium rounded-grafana transition-colors cursor-pointer ${
            mainTab === 'catalog' ? 'bg-grafana-blue text-white' : 'text-(--color-text-secondary) hover:text-(--color-text-primary)'
          }`}>Catalog</button>
      </div>

      {mainTab === 'installed' && (
        <>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-muted)" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search stacks..."
                className="w-full pl-8 pr-3 py-2 text-xs bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana text-(--color-text-primary) placeholder:text-(--color-text-muted)/50 focus:outline-none focus:border-grafana-blue"
              />
            </div>
            <div className="flex items-center gap-1 bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana p-0.5">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setStatusFilter(tab.key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-grafana transition-colors cursor-pointer ${
                    statusFilter === tab.key
                      ? 'bg-grafana-blue text-white'
                      : 'text-(--color-text-secondary) hover:text-(--color-text-primary)'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {filteredStacks.length === 0 ? (
            <EmptyState
              icon={Layers}
              title={search || statusFilter ? 'No stacks match your filters' : 'No stacks deployed'}
              description={search || statusFilter ? 'Try adjusting your search or filter criteria.' : 'Deploy a new stack from a template or custom compose file to get started.'}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {filteredStacks.map((s) => {
                const sc = STATUS_CONFIG[s.status] || STATUS_CONFIG.pending
                const Icon = sc.icon
                return (
                  <div key={s.id} className="bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana hover:border-text-muted/30 transition-colors flex flex-col">
                    <div className="p-4 flex-1">
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-lg ${sc.bg} flex items-center justify-center shrink-0`}>
                          <Icon size={16} className={`${sc.iconColor} ${s.status === 'deploying' || s.status === 'starting' || s.status === 'pulling_images' ? 'animate-spin' : ''}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-(--color-text-primary) truncate">{s.name}</h3>
                            <Badge color={sc.color}>{sc.label}</Badge>
                          </div>
                          <p className="text-[10px] text-(--color-text-muted) font-mono mt-0.5 truncate">{s.device_id}</p>
                        </div>
                      </div>
                      {s.error_log && s.status === 'failed' && (
                        <div className="mt-3 flex items-start gap-1.5 p-2 bg-grafana-red/5 border border-grafana-red/20 rounded-lg">
                          <AlertCircle size={11} className="text-grafana-red shrink-0 mt-0.5" />
                          <p className="text-[10px] text-grafana-red leading-relaxed line-clamp-2">{s.error_log}</p>
                        </div>
                      )}
                      {s.web_ui_port && s.status === 'running' && (
                        <div className="mt-3">
                          <button
                            onClick={() => window.open(`http://localhost:${s.web_ui_port}`, '_blank', 'noopener,noreferrer')}
                            className="flex items-center gap-1.5 text-[10px] text-grafana-blue hover:text-grafana-blue/80 transition-colors"
                          >
                            <ExternalLink size={10} />
                            Open Web UI (port {s.web_ui_port})
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="px-4 py-2.5 border-t border-(--color-border) flex items-center gap-1">
                      {s.status === 'running' ? (
                        <Button variant="ghost" size="sm" onClick={() => handleAction(stopStack, s.id)} className="text-grafana-orange hover:text-grafana-orange/80">
                          <Square size={12} /> Stop
                        </Button>
                      ) : s.status !== 'failed' ? (
                        <Button variant="ghost" size="sm" onClick={() => handleAction(startStack, s.id)} className="text-grafana-green hover:text-grafana-green/80">
                          <Play size={12} /> Start
                        </Button>
                      ) : null}
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetail(s)}><Code2 size={12} /> Edit</Button>
                      <Button variant="ghost" size="sm" onClick={() => { handleViewDetail(s); setDetailTab('logs'); setTimeout(() => handleFetchLogs(), 100); }}><Terminal size={12} /> Logs</Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(s)} className="text-grafana-red hover:text-grafana-red/80 ml-auto"><Trash2 size={12} /></Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {mainTab === 'catalog' && (
        <>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-muted)" />
              <input type="text" value={templateSearch} onChange={(e) => setTemplateSearch(e.target.value)}
                placeholder="Search templates..."
                className="w-full pl-8 pr-3 py-2 text-xs bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana text-(--color-text-primary) placeholder:text-(--color-text-muted)/50 focus:outline-none focus:border-grafana-blue" />
            </div>
            <div className="flex items-center gap-1 bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana p-0.5">
              {CATEGORIES.map((cat) => (
                <button key={cat.key || 'all'} onClick={() => setCategoryFilter(cat.key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-grafana transition-colors cursor-pointer ${
                    categoryFilter === cat.key ? 'bg-grafana-blue text-white' : 'text-(--color-text-secondary) hover:text-(--color-text-primary)'
                  }`}>{cat.label}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {templateCatalog
              .filter((t) => (!categoryFilter || t.category === categoryFilter) && (!templateSearch || t.name.toLowerCase().includes(templateSearch.toLowerCase()) || t.description.toLowerCase().includes(templateSearch.toLowerCase())))
              .map((t) => (
              <Card key={t.id} hover onClick={() => { handleTemplateSelect(t.id); setNewStackOpen(true); }}>
                <div className="flex items-start gap-3 p-4">
                  <div className="w-8 h-8 rounded-grafana bg-grafana-blue/10 flex items-center justify-center shrink-0">
                    <Puzzle size={16} className="text-grafana-blue" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-sm text-(--color-text-primary) truncate">{t.name}</h3>
                    <p className="text-xs text-(--color-text-secondary) mt-0.5 line-clamp-2">{t.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      <Modal
        open={newStackOpen}
        onClose={() => { setDeployError(null); setNewStackOpen(false); }}
        title={selectedTemplateId ? `Deploy: ${selectedTemplate?.name || ''}` : 'New Stack'}
        className="max-w-3xl"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setNewStackOpen(false)} disabled={deploying}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" loading={deploying} onClick={handleDeploy} disabled={!canDeploy()}>
              <Layers size={14} />
              Deploy
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {deployError && <ErrorMessage message={deployError} onDismiss={() => setDeployError(null)} />}

          <div>
            <label className="block text-xs font-medium text-(--color-text-secondary) mb-1">Template (optional)</label>
            <select
              value={selectedTemplateId}
              onChange={(e) => handleTemplateSelect(e.target.value)}
              className="w-full bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana px-3 py-1.5 text-sm text-(--color-text-primary) focus:outline-none focus:ring-1 focus:ring-grafana-blue"
            >
              <option value="">Custom (no template)...</option>
              {templateCatalog.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          {!selectedTemplateId && (
            <div>
              <label className="block text-xs font-medium text-(--color-text-secondary) mb-1">Stack Name *</label>
              <input
                type="text"
                value={stackName}
                onChange={(e) => { setStackName(e.target.value); if (e.target.value.trim()) setStackNameError('') }}
                placeholder="my-custom-stack"
                className={`w-full bg-(--color-surface-elevated) border rounded-grafana px-3 py-1.5 text-sm text-(--color-text-primary) focus:outline-none focus:ring-1 focus:ring-grafana-blue ${stackNameError ? 'border-grafana-red' : 'border-(--color-border)'}`}
              />
              {stackNameError && <p className="text-xs text-grafana-red mt-1">{stackNameError}</p>}
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-(--color-text-secondary)">Compose YAML *</label>
              <input ref={fileInputRef} type="file" accept=".yml,.yaml" onChange={handleFileUpload} className="hidden" />
              <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()}>
                <Upload size={12} />
                Upload File
              </Button>
            </div>
            <div className={`border rounded-grafana overflow-hidden ${composeYamlError ? 'border-grafana-red' : 'border-(--color-border)'}`}>
              <textarea
                value={composeYaml}
                onChange={(e) => { setComposeYaml(e.target.value); if (e.target.value.trim()) setComposeYamlError('') }}
              className={`w-full ${theme === 'dark' ? 'bg-[#1e1e1e] text-[#d4d4d4]' : 'bg-(--color-surface-elevated) text-(--color-text-primary) border-0'} font-mono text-xs p-3 focus:outline-none resize-vertical`}
                  style={{ minHeight: '200px', tabSize: 2 }}
                spellCheck={false}
              />
            </div>
            {composeYamlError && <p className="text-xs text-grafana-red mt-1">{composeYamlError}</p>}
          </div>

          {selectedTemplate?.env_schema && selectedTemplate.env_schema.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-(--color-text-secondary) mb-1">Environment Variables</label>
              <div className="space-y-2">
                {selectedTemplate.env_schema.map((field) => (
                  <div key={field.key} className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
                    <label className="text-sm text-(--color-text-primary) w-full sm:w-1/3">
                      {field.label}
                      {field.required && <span className="text-grafana-red ml-1">*</span>}
                    </label>
                    <input
                      type="text"
                      value={envValues[field.key] ?? ''}
                      onChange={(e) => setEnvValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={field.default}
                      className="flex-1 bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana px-3 py-1.5 text-sm text-(--color-text-primary) focus:outline-none focus:ring-1 focus:ring-grafana-blue"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-(--color-text-secondary) mb-1">Device *</label>
            <select
              value={selectedDeviceId}
              onChange={(e) => { setSelectedDeviceId(e.target.value); if (e.target.value) setDeviceError('') }}
              className={`w-full bg-(--color-surface-elevated) border rounded-grafana px-3 py-1.5 text-sm text-(--color-text-primary) focus:outline-none focus:ring-1 focus:ring-grafana-blue ${deviceError ? 'border-grafana-red' : 'border-(--color-border)'}`}
            >
              <option value="">Select a device...</option>
              {mockDevices.map((d) => (
                <option key={d.id} value={d.id}>{d.name} ({d.status})</option>
              ))}
            </select>
            {deviceError && <p className="text-xs text-grafana-red mt-1">{deviceError}</p>}
          </div>
        </div>
      </Modal>

      <Modal
        open={detailOpen}
        onClose={() => { setDetailOpen(false); setDetailStackId(null); }}
        title={`Stack: ${stacks.find((s) => s.id === detailStackId)?.name || ''}`}
        className="max-w-4xl"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => { setDetailOpen(false); setDetailStackId(null); }} disabled={redeploying}>
              Close
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { setDetailTab('logs'); handleFetchLogs(); }}>
              <Terminal size={14} />
              Refresh Logs
            </Button>
            <Button variant="primary" size="sm" loading={redeploying} onClick={handleRedeploy} disabled={detailTab !== 'compose'}>
              <Layers size={14} />
              Redeploy
            </Button>
          </>
        }
      >
        <div className="border-b border-(--color-border) mb-4">
          <div className="flex gap-0">
            <button
              onClick={() => setDetailTab('compose')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                detailTab === 'compose'
                  ? 'border-grafana-blue text-(--color-text-primary)'
                  : 'border-transparent text-(--color-text-secondary) hover:text-(--color-text-primary)'
              }`}
            >
              Compose
            </button>
            <button
              onClick={() => { setDetailTab('logs'); handleFetchLogs(); }}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                detailTab === 'logs'
                  ? 'border-grafana-blue text-(--color-text-primary)'
                  : 'border-transparent text-(--color-text-secondary) hover:text-(--color-text-primary)'
              }`}
            >
              Logs
            </button>
          </div>
        </div>

        {detailTab === 'compose' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-(--color-text-secondary) mb-1">Compose YAML</label>
              <div className="border border-(--color-border) rounded-grafana overflow-hidden">
                <textarea
                  value={editYaml}
                  onChange={(e) => setEditYaml(e.target.value)}
                  className={`w-full ${theme === 'dark' ? 'bg-[#1e1e1e] text-[#d4d4d4]' : 'bg-(--color-surface-elevated) text-(--color-text-primary) border-0'} font-mono text-xs p-3 focus:outline-none resize-vertical`}
                  style={{ minHeight: '250px', tabSize: 2 }}
                  spellCheck={false}
                />
              </div>
            </div>
            {Object.keys(editEnvValues).length > 0 && (
              <div>
                <label className="block text-xs font-medium text-(--color-text-secondary) mb-1">Environment Variables</label>
                <div className="space-y-2">
                  {Object.entries(editEnvValues).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <label className="text-sm text-(--color-text-primary) w-1/3">{key}</label>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => setEditEnvValues((prev) => ({ ...prev, [key]: e.target.value }))}
                        className="flex-1 bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana px-3 py-1.5 text-sm text-(--color-text-primary) focus:outline-none focus:ring-1 focus:ring-grafana-blue"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {detailTab === 'logs' && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-medium text-(--color-text-secondary)">Container Logs</label>
            </div>
            <pre className="w-full bg-(--color-surface-elevated) border border-(--color-border) rounded-grafana px-4 py-3 text-sm text-(--color-text-primary) font-mono whitespace-pre-wrap overflow-auto max-h-[500px]">
              {logsLoading ? 'Fetching logs from device...' : (stackLogs || 'No logs available.')}
            </pre>
          </div>
        )}
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        title="Delete stack"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setDeleteTarget(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" loading={deleting} onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-(--color-text-secondary)">
          Are you sure you want to delete <span className="font-semibold text-(--color-text-primary)">{deleteTarget?.name}</span>?
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}
