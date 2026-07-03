export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && <Icon size={40} className="text-text-muted mb-3" />}
      <h3 className="text-sm font-semibold text-text-primary mb-1">{title}</h3>
      {description && <p className="text-sm text-text-secondary mb-4">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  )
}
