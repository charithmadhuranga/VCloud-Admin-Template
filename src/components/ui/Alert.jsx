import { AlertTriangle, CheckCircle, Info, XCircle, X } from 'lucide-react'
import { useState } from 'react'

const config = {
  success: { icon: CheckCircle, bg: 'bg-grafana-green/8', border: 'border-grafana-green/25', text: 'text-grafana-green' },
  warning: { icon: AlertTriangle, bg: 'bg-grafana-yellow/8', border: 'border-grafana-yellow/25', text: 'text-grafana-yellow' },
  error: { icon: XCircle, bg: 'bg-grafana-red/8', border: 'border-grafana-red/25', text: 'text-grafana-red' },
  info: { icon: Info, bg: 'bg-grafana-blue/8', border: 'border-grafana-blue/25', text: 'text-grafana-blue' },
}

export default function Alert({ variant = 'info', title, children, dismissible }) {
  const [hidden, setHidden] = useState(false)
  if (hidden) return null

  const c = config[variant]
  const Icon = c.icon

  return (
    <div className={`rounded-xl border ${c.border} ${c.bg} p-4`}>
      <div className="flex gap-3">
        <Icon size={18} className={`${c.text} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          {title && <p className={`text-sm font-semibold ${c.text}`}>{title}</p>}
          <div className="text-sm text-(--color-text-secondary) mt-0.5">{children}</div>
        </div>
        {dismissible && (
          <button onClick={() => setHidden(true)} className="flex-shrink-0 text-(--color-text-muted) hover:text-(--color-text-primary) cursor-pointer">
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  )
}
