export default function ComponentCard({ title, desc, children, className = '' }) {
  return (
    <div className={`rounded-xl border border-border-default bg-bg-card ${className}`}>
      <div className="px-5 py-4">
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
        {desc && <p className="mt-1 text-xs text-text-tertiary">{desc}</p>}
      </div>
      <div className="border-t border-border-default px-5 py-4">
        {children}
      </div>
    </div>
  )
}
