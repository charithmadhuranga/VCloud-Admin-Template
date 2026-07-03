import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

const variantStyles = {
  primary: 'bg-grafana-blue text-white hover:brightness-110 active:brightness-95 disabled:opacity-40',
  secondary: 'bg-surface-elevated border border-border text-text-primary hover:bg-surface-hover disabled:opacity-40',
  destructive: 'bg-grafana-red text-white hover:brightness-110 active:brightness-95 disabled:opacity-40',
  ghost: 'text-text-secondary hover:text-text-primary hover:bg-surface-hover disabled:opacity-40',
}

const sizeStyles = {
  sm: 'px-2 py-1.5 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
}

const Button = forwardRef(({ variant = 'primary', size = 'md', loading, className = '', children, disabled, ...props }, ref) => (
  <button
    ref={ref}
    disabled={disabled || loading}
    className={`inline-flex items-center justify-center gap-2 font-medium rounded-grafana transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grafana-blue ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    {...props}
  >
    {loading && <Loader2 size={size === 'sm' ? 12 : 14} className="animate-spin" />}
    {children}
  </button>
))

Button.displayName = 'Button'
export default Button
