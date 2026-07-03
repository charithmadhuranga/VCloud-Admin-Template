export default function ComponentCard({ title, desc, children, className = '' }) {
  return (
    <div className={`rounded-xl border border-(--color-border) bg-(--color-surface-elevated) ${className}`}>
      <div className="px-5 py-4">
        <h3 className="text-sm font-semibold text-(--color-text-primary)">{title}</h3>
        {desc && <p className="mt-1 text-xs text-(--color-text-muted)">{desc}</p>}
      </div>
      <div className="border-t border-(--color-border) px-5 py-4">
        {children}
      </div>
    </div>
  )
}
