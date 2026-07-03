import { forwardRef } from 'react'

const variants = {
  primary: 'bg-grafana-blue text-white hover:bg-grafana-blue/90 shadow-sm disabled:opacity-40',
  secondary: 'bg-bg-hover text-text-primary hover:bg-border-default border border-border-default disabled:opacity-40',
  danger: 'bg-grafana-red text-white hover:bg-grafana-red/90 disabled:opacity-40',
  ghost: 'text-text-secondary hover:text-text-primary hover:bg-bg-hover disabled:opacity-40',
  outline: 'border border-border-default text-text-primary hover:bg-bg-hover disabled:opacity-40',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-sm gap-2',
}

const Button = forwardRef(({ variant = 'primary', size = 'md', icon: Icon, children, className = '', ...props }, ref) => (
  <button
    ref={ref}
    className={`inline-flex items-center justify-center font-medium rounded-lg transition-colors cursor-pointer ${variants[variant]} ${sizes[size]} ${className}`}
    {...props}
  >
    {Icon && <Icon size={size === 'sm' ? 14 : 16} />}
    {children}
  </button>
))

Button.displayName = 'Button'
export default Button
