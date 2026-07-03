import { useNavigate } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import Button from '../components/ui/Button'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h1 className="text-6xl font-bold text-text-muted mb-2">404</h1>
      <p className="text-sm text-text-secondary mb-6">Page not found</p>
      <Button variant="primary" size="sm" onClick={() => navigate('/dashboard')}>
        <ArrowLeft size={14} /> Back to Dashboard
      </Button>
    </div>
  )
}
