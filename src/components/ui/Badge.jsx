const dotColors = {
  green: 'bg-grafana-green',
  gray: 'bg-text-muted',
  red: 'bg-grafana-red',
  orange: 'bg-grafana-orange',
  blue: 'bg-grafana-blue',
  purple: 'bg-grafana-purple',
}

const textColors = {
  green: 'text-grafana-green',
  gray: 'text-text-muted',
  red: 'text-grafana-red',
  orange: 'text-grafana-orange',
  blue: 'text-grafana-blue',
  purple: 'text-grafana-purple',
}

const variantAlias = {
  success: 'green',
  error: 'red',
  warning: 'orange',
  info: 'blue',
  neutral: 'gray',
}

export default function Badge({ color, variant, children, className = '' }) {
  const resolved = color || variantAlias[variant] || 'gray'
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${className}`}>
      <span className={`w-2 h-2 rounded-full ${dotColors[resolved] || dotColors.gray}`} />
      <span className={textColors[resolved] || textColors.gray}>{children}</span>
    </span>
  )
}
