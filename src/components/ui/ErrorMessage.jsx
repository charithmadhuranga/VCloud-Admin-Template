import { AlertCircle, X } from 'lucide-react'

export default function ErrorMessage({ message, onDismiss }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3 bg-(--color-surface-elevated) border-l-2 border-grafana-red rounded-grafana">
      <AlertCircle size={16} className="text-grafana-red flex-shrink-0 mt-0.5" />
      <p className="text-sm text-(--color-text-primary) flex-1">{message}</p>
      {onDismiss && (
        <button onClick={onDismiss} className="text-(--color-text-muted) hover:text-(--color-text-primary) flex-shrink-0">
          <X size={14} />
        </button>
      )}
    </div>
  )
}
