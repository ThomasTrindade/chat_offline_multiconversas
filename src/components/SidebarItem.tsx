type SidebarItemProps = {
  conversationId: string
  isActive: boolean
  onSelect: (conversationId: string) => void
  onDelete: (conversationId: string) => void
}

export default function SidebarItem({ conversationId, isActive, onSelect, onDelete }: SidebarItemProps) {
  return (
    <div
      className={[
        'flex items-center gap-2 rounded-xl border px-2 py-2 transition-colors',
        isActive
          ? 'border-violet-300 bg-violet-50 text-violet-950'
          : 'border-transparent bg-white text-stone-700 hover:border-stone-200 hover:bg-stone-50',
      ].join(' ')}
    >
      <button
        type="button"
        aria-current={isActive ? 'page' : undefined}
        onClick={() => onSelect(conversationId)}
        className="min-w-0 flex-1 rounded-lg px-2 py-2 text-left text-xs leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
      >
        <span className="block break-all">{conversationId}</span>
      </button>

      <button
        type="button"
        aria-label={`Excluir conversa ${conversationId}`}
        title="Excluir conversa"
        onClick={() => onDelete(conversationId)}
        className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 7h16" />
          <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7" />
          <path d="M7 7l1 12.5A1.5 1.5 0 0 0 9.5 21h5A1.5 1.5 0 0 0 16 19.5L17 7" />
          <path d="M10 11v5M14 11v5" />
          <path d="M9 7h6" />
        </svg>
      </button>
    </div>
  )
}
