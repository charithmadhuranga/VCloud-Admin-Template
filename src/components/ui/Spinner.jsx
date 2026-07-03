export default function Spinner({ size = 20, className = '' }) {
  return (
    <div
      className={`border-2 border-current border-t-transparent animate-spin ${className}`}
      style={{ width: size, height: size, borderRadius: '50%' }}
    />
  )
}
