import { useState } from 'react'
import { Save, Bell, Shield, Palette, Webhook } from 'lucide-react'
import Button from '../components/ui/Button'
import ComponentCard from '../components/ui/ComponentCard'
import PageBreadCrumb from '../components/ui/PageBreadCrumb'

export default function Settings() {
  const [notif, setNotif] = useState({ email: true, slack: false, pager: true })
  const [thresholds, setThresholds] = useState({ cpu: 85, memory: 80, disk: 90 })

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <PageBreadCrumb items={['Fleet Admin', 'Settings']} />
        <h1 className="text-lg font-semibold text-text-primary">Settings</h1>
        <p className="text-sm text-text-secondary mt-0.5">Configure system preferences and thresholds</p>
      </div>

      <ComponentCard title="Notification Channels" desc="Configure how alerts are delivered">
        <div className="space-y-3">
          {[
            { key: 'email', label: 'Email Notifications', desc: 'Send alerts to team@fleet.io', icon: Bell },
            { key: 'slack', label: 'Slack Integration', desc: 'Post alerts to #fleet-alerts', icon: Webhook },
            { key: 'pager', label: 'PagerDuty', desc: 'Escalate critical alerts to on-call', icon: Shield },
          ].map(item => (
            <label key={item.key} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-bg-hover flex items-center justify-center">
                  <item.icon size={15} className="text-text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{item.label}</p>
                  <p className="text-xs text-text-tertiary">{item.desc}</p>
                </div>
              </div>
              <div
                onClick={() => setNotif(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${
                  notif[item.key] ? 'bg-grafana-blue' : 'bg-border-default'
                }`}
              >
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  notif[item.key] ? 'translate-x-4' : ''
                }`} />
              </div>
            </label>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard title="Alert Thresholds" desc="Set resource usage thresholds for alerting">
        <div className="space-y-4">
          {[
            { key: 'cpu', label: 'CPU Threshold', value: thresholds.cpu, color: 'bg-grafana-blue' },
            { key: 'memory', label: 'Memory Threshold', value: thresholds.memory, color: 'bg-grafana-purple' },
            { key: 'disk', label: 'Disk Threshold', value: thresholds.disk, color: 'bg-grafana-orange' },
          ].map(item => (
            <div key={item.key}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm text-text-primary">{item.label}</label>
                <span className="text-sm font-medium text-text-primary">{item.value}%</span>
              </div>
              <input
                type="range"
                min={50}
                max={98}
                value={thresholds[item.key]}
                onChange={e => setThresholds(prev => ({ ...prev, [item.key]: Number(e.target.value) }))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-border-default accent-grafana-blue [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-grafana-blue [&::-webkit-slider-thumb]:shadow-sm"
              />
            </div>
          ))}
        </div>
      </ComponentCard>

      <div className="flex justify-end">
        <Button icon={Save}>Save Changes</Button>
      </div>
    </div>
  )
}
