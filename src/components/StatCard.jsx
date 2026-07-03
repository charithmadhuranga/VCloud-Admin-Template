import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatCard({ title, value, change, changeLabel, icon: Icon, chart }) {
  const isPositive = change >= 0
  return (
    <div className="rounded-xl border border-border-default bg-bg-card p-5 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium tracking-wide text-text-secondary uppercase">{title}</span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-grafana-blue/10 flex items-center justify-center">
            <Icon size={16} className="text-grafana-blue" />
          </div>
        )}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-semibold tracking-tight text-text-primary">{value}</div>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-1">
              <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${isPositive ? 'text-grafana-green' : 'text-grafana-red'}`}>
                {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {Math.abs(change)}%
              </span>
              {changeLabel && <span className="text-xs text-text-tertiary">{changeLabel}</span>}
            </div>
          )}
        </div>
        {chart && <div className="ml-4">{chart}</div>}
      </div>
    </div>
  )
}
