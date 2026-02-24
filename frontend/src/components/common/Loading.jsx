export function Spinner({ size = 'md', color = 'obsidian' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }
  const colors = { obsidian: 'border-obsidian-900', gold: 'border-gold-500', white: 'border-white' }
  return (
    <div className={`${sizes[size]} border-2 ${colors[color]} border-t-transparent rounded-full animate-spin`} />
  )
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="text-center space-y-4">
        <div className="text-3xl font-display font-bold text-obsidian-900 tracking-wide">VESTIR</div>
        <Spinner size="md" />
      </div>
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="skeleton aspect-[3/4] w-full" />
      <div className="skeleton h-4 w-3/4" />
      <div className="skeleton h-3 w-1/2" />
      <div className="skeleton h-4 w-1/4" />
    </div>
  )
}

export function EmptyState({ icon, title, desc, action }) {
  return (
    <div className="text-center py-20 space-y-4">
      {icon && <div className="text-5xl text-obsidian-200 flex justify-center">{icon}</div>}
      <h3 className="text-xl font-display text-obsidian-700">{title}</h3>
      {desc && <p className="text-sm text-obsidian-400 max-w-xs mx-auto">{desc}</p>}
      {action}
    </div>
  )
}
