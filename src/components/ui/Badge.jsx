import clsx from 'clsx'

const variants = {
  success: 'bg-grafana-green/10 text-grafana-green',
  warning: 'bg-grafana-yellow/10 text-grafana-yellow',
  error: 'bg-grafana-red/10 text-grafana-red',
  info: 'bg-grafana-blue/10 text-grafana-blue',
  neutral: 'bg-bg-hover text-text-secondary',
  purple: 'bg-grafana-purple/10 text-grafana-purple',
  orange: 'bg-grafana-orange/10 text-grafana-orange',
}

const sizes = {
  sm: 'px-1.5 py-0.5 text-[10px]',
  md: 'px-2 py-0.5 text-xs',
  lg: 'px-2.5 py-1 text-sm',
}

export default function Badge({ variant = 'neutral', size = 'md', dot, children, className }) {
  return (
    <span className={clsx('inline-flex items-center gap-1.5 rounded-full font-medium', variants[variant], sizes[size], className)}>
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full', variants[variant].split(' ')[1].replace('text-', 'bg-'))} />}
      {children}
    </span>
  )
}
