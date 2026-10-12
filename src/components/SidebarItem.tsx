type SidebarItemProps = {
  conversationId: string
  isActive: boolean
  onSelect: (conversationId: string) => void
}

export default function SidebarItem({ conversationId, isActive, onSelect }: SidebarItemProps) {
  return (
    <button
      type="button"
      aria-current={isActive ? 'page' : undefined}
      onClick={() => onSelect(conversationId)}
      className={[
        'w-full rounded-xl border px-3 py-3 text-left text-xs leading-relaxed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500',
        isActive
          ? 'border-violet-300 bg-violet-50 text-violet-950'
          : 'border-transparent bg-white text-stone-700 hover:border-stone-200 hover:bg-stone-50',
      ].join(' ')}
    >
      <span className="break-all">{conversationId}</span>
    </button>
  )
}
