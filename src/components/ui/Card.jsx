import { forwardRef } from 'react'

const Card = forwardRef(({ hover, children, className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`bg-surface-elevated border border-border rounded-grafana ${hover ? 'hover:border-grafana-blue transition-colors cursor-pointer' : ''} ${className}`}
    {...props}
  >
    {children}
  </div>
))

Card.displayName = 'Card'
export default Card
