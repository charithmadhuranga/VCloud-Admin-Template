import { useState } from 'react'
import { Shield, ShieldCheck, Globe, Clock, Plus, X, Copy, ExternalLink, RefreshCw, Server, Key, Settings } from 'lucide-react'
import PageBreadCrumb from '../components/ui/PageBreadCrumb'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import ComponentCard from '../components/ui/ComponentCard'

const activeSessions = [
  { id: 'ts-01', device: 'k8s-node-01', service: 'Grafana Dashboard', url: 'https://tunnel.fleet.io/ts-01', port: 3000, created: '2m ago', expires: '58m', status: 'active' },
  { id: 'ts-02', device: 'db-primary-01', service: 'Node-RED Editor', url: 'https://tunnel.fleet.io/ts-02', port: 1880, created: '15m ago', expires: '45m', status: 'active' },
  { id: 'ts-03', device: 'k8s-node-02', service: 'Kafka UI', url: 'https://tunnel.fleet.io/ts-03', port: 8080, created: '1h ago', expires: 'Expired', status: 'expired' },
]

export default function Tunnel() {
  const [copied, setCopied] = useState(null)

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <PageBreadCrumb items={['Fleet Admin', 'IoT', 'Tunnel']} />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-text-primary">Secure Tunnels</h1>
            <p className="text-sm text-text-secondary mt-0.5">Time-limited FRP encrypted tunnels to edge device services</p>
          </div>
          <div className="flex-shrink-0 self-start sm:self-auto"><Button variant="primary" size="sm" icon={Plus}>New Tunnel</Button></div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Active Tunnels', value: '2', icon: ShieldCheck, color: 'text-grafana-green', desc: 'Currently open' },
          { label: 'Total Sessions (24h)', value: '14', icon: Globe, color: 'text-grafana-blue', desc: 'Created today' },
          { label: 'Avg Duration', value: '38m', icon: Clock, color: 'text-grafana-purple', desc: 'Per session' },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-border-default bg-bg-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <s.icon size={15} className={s.color} />
              <span className="text-xs text-text-secondary">{s.label}</span>
            </div>
            <p className="text-xl font-semibold text-text-primary">{s.value}</p>
            <p className="text-[10px] text-text-tertiary mt-0.5">{s.desc}</p>
          </div>
        ))}
      </div>

      <ComponentCard title="Active Tunnel Sessions" desc="Time-limited encrypted tunnels to edge device services">
        <div className="space-y-3">
          {activeSessions.map(session => (
            <div key={session.id} className={`rounded-xl border p-4 transition-all ${
              session.status === 'active' ? 'border-grafana-green/30 bg-grafana-green/[0.02]' : 'border-border-default bg-bg-body'
            }`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    session.status === 'active' ? 'bg-grafana-green/10' : 'bg-border-default/50'
                  }`}>
                    {session.status === 'active' ? <ShieldCheck size={16} className="text-grafana-green" /> : <Shield size={16} className="text-text-tertiary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-text-primary">{session.service}</span>
                      <Badge variant={session.status === 'active' ? 'success' : 'neutral'} size="sm" dot>
                        {session.status === 'active' ? 'Active' : 'Expired'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-text-tertiary flex-wrap">
                      <span className="flex items-center gap-1"><Server size={11} /> {session.device}</span>
                      <span>Port :{session.port}</span>
                      <span className="flex items-center gap-1"><Clock size={11} /> Expires in {session.expires}</span>
                    </div>
                    {session.status === 'active' && (
                      <div className="mt-2 flex items-center gap-2">
                        <code className="px-2 py-1 rounded bg-bg-hover text-[11px] text-text-secondary font-mono truncate max-w-[300px]">
                          {session.url}
                        </code>
                        <button onClick={() => handleCopy(session.url)}
                          className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-text-tertiary hover:text-grafana-blue hover:bg-grafana-blue/10 cursor-pointer transition-colors">
                          {copied === session.url ? <span className="text-[10px] text-grafana-green">Done</span> : <Copy size={12} />}
                        </button>
                        <a href={session.url} target="_blank" rel="noopener noreferrer"
                          className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-text-tertiary hover:text-grafana-blue hover:bg-grafana-blue/10 transition-colors">
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                {session.status === 'active' && (
                  <button className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-text-tertiary hover:text-grafana-red hover:bg-grafana-red/10 cursor-pointer transition-colors">
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard title="Tunnel Agent Configuration" desc="FRP client settings for edge devices">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Server Address', value: 'tunnel.fleet.io', icon: Globe },
              { label: 'Server Port', value: '7000', icon: Key },
              { label: 'Encryption', value: 'TLS 1.3 (mTLS)', icon: Shield },
              { label: 'Auth Token', value: '••••••••••••••••', icon: Key },
            ].map(f => (
              <div key={f.label} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-bg-hover/30">
                <f.icon size={14} className="text-text-tertiary" />
                <div className="flex-1">
                  <p className="text-[10px] text-text-tertiary">{f.label}</p>
                  <p className="text-xs text-text-primary font-mono">{f.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" icon={RefreshCw}>Reconnect</Button>
            <Button variant="primary" size="sm" icon={Settings}>Configure</Button>
          </div>
        </div>
      </ComponentCard>
    </div>
  )
}
