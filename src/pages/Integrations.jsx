import { Webhook, Database, Mail, Cloud, Code2, MessageSquare, Bell, Palette } from 'lucide-react'
import PageBreadCrumb from '../components/ui/PageBreadCrumb'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

const integrations = [
  { name: 'Slack', desc: 'Post alerts and notifications to channels', icon: MessageSquare, status: 'Connected', color: 'text-[#E01E5A]' },
  { name: 'PagerDuty', desc: 'Escalate critical alerts to on-call engineers', icon: Bell, status: 'Connected', color: 'text-grafana-green' },
  { name: 'GitHub', desc: 'Deployment events and PR tracking', icon: Code2, status: 'Connected', color: 'text-text-primary' },
  { name: 'AWS CloudWatch', desc: 'Import AWS infrastructure metrics', icon: Cloud, status: 'Disconnected', color: 'text-grafana-orange' },
  { name: 'Datadog', desc: 'Correlate fleet metrics with Datadog APM', icon: Database, status: 'Available', color: 'text-grafana-purple' },
  { name: 'SendGrid', desc: 'Email notifications for alerting', icon: Mail, status: 'Connected', color: 'text-grafana-blue' },
  { name: 'Grafana', desc: 'Embed Grafana dashboards and panels', icon: Palette, status: 'Connected', color: 'text-grafana-orange' },
  { name: 'Webhook', desc: 'Custom HTTP webhooks for event triggers', icon: Webhook, status: 'Available', color: 'text-text-secondary' },
]

export default function Integrations() {
  return (
    <div className="space-y-6">
      <div>
        <PageBreadCrumb items={['Fleet Admin', 'Configuration', 'Integrations']} />
        <h1 className="text-lg font-semibold text-text-primary">Integrations</h1>
        <p className="text-sm text-text-secondary mt-0.5">Connect external services to the fleet platform</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {integrations.map(int => (
          <div key={int.name} className="rounded-xl border border-border-default bg-bg-card p-5 hover:bg-bg-hover/30 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-bg-hover flex items-center justify-center">
                <int.icon size={20} className={int.color} />
              </div>
              <Badge variant={int.status === 'Connected' ? 'success' : int.status === 'Disconnected' ? 'error' : 'neutral'} size="sm" dot>
                {int.status}
              </Badge>
            </div>
            <h3 className="text-sm font-semibold text-text-primary mb-1">{int.name}</h3>
            <p className="text-xs text-text-tertiary mb-4">{int.desc}</p>
            <Button variant={int.status === 'Connected' ? 'outline' : 'primary'} size="sm" className="w-full">
              {int.status === 'Connected' ? 'Configure' : int.status === 'Disconnected' ? 'Reconnect' : 'Connect'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
