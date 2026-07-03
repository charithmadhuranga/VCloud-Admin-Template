import { ChevronRight } from 'lucide-react'

export default function PageBreadCrumb({ items }) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-(--color-text-muted) mb-3">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={10} />}
          <span className={i === items.length - 1 ? 'text-(--color-text-primary) font-medium' : ''}>{item}</span>
        </span>
      ))}
    </nav>
  )
}
