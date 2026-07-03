import clsx from 'clsx'

const sizes = {
  sm: 'w-7 h-7 text-[10px]',
  md: 'w-8 h-8 text-xs',
  lg: 'w-10 h-10 text-sm',
  xl: 'w-12 h-12 text-base',
}

const colors = [
  'bg-grafana-blue/20 text-grafana-blue',
  'bg-grafana-green/20 text-grafana-green',
  'bg-grafana-purple/20 text-grafana-purple',
  'bg-grafana-orange/20 text-grafana-orange',
  'bg-grafana-red/20 text-grafana-red',
  'bg-grafana-yellow/20 text-grafana-yellow',
]

export default function Avatar({ src, name, size = 'md', className }) {
  const initials = name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
  const colorIdx = name ? name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length : 0

  if (src) {
    return (
      <img src={src} alt={name} className={clsx('rounded-full object-cover ring-2 ring-border-default', sizes[size], className)} />
    )
  }

  return (
    <div className={clsx('rounded-full flex items-center justify-center font-semibold ring-2 ring-border-default', sizes[size], colors[colorIdx], className)}>
      {initials}
    </div>
  )
}
