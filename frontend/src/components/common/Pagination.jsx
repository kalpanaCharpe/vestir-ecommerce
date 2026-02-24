import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-12">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="p-2 text-obsidian-500 hover:text-obsidian-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <FiChevronLeft size={18} />
      </button>

      {pages.map((p, i) => (
        <button
          key={i}
          onClick={() => typeof p === 'number' && onPageChange(p)}
          disabled={p === '...'}
          className={`w-9 h-9 text-sm font-mono transition-colors ${
            p === page
              ? 'bg-obsidian-900 text-cream'
              : p === '...'
              ? 'text-obsidian-300 cursor-default'
              : 'text-obsidian-600 hover:bg-obsidian-100'
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="p-2 text-obsidian-500 hover:text-obsidian-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <FiChevronRight size={18} />
      </button>
    </div>
  )
}
