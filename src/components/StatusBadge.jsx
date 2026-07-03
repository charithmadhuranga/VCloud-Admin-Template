const variants = {
  success: { bg: 'bg-grafana-green/10', dot: 'bg-grafana-green', text: 'text-grafana-green' },
  warning: { bg: 'bg-grafana-yellow/10', dot: 'bg-grafana-yellow', text: 'text-grafana-yellow' },
  error: { bg: 'bg-grafana-red/10', dot: 'bg-grafana-red', text: 'text-grafana-red' },
  info: { bg: 'bg-grafana-blue/10', dot: 'bg-grafana-blue', text: 'text-grafana-blue' },
  neutral: { bg: 'bg-(--color-surface-hover)', dot: 'bg-(--color-text-muted)', text: 'text-(--color-text-secondary)' },
}

export default function StatusBadge({ variant = 'neutral', label }) {
  const v = variants[variant] || variants.neutral
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${v.bg} ${v.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${v.dot}`} />
      {label}
    </span>
  )
}
