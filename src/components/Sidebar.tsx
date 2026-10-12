import SidebarItem from './SidebarItem'

type SidebarProps = {
  conversations: Record<string, unknown[]>
  activeConversationId: string | null
  isOpen: boolean
  onCreateConversation: () => void
  onSelectConversation: (conversationId: string) => void
}

export default function Sidebar({
  conversations,
  activeConversationId,
  isOpen,
  onCreateConversation,
  onSelectConversation,
}: SidebarProps) {
  const conversationIds = Object.keys(conversations)

  return (
    <aside
      aria-label="Conversas"
      className={[
        'fixed inset-y-0 left-0 z-20 flex w-[min(20rem,85vw)] flex-col border-r border-stone-200 bg-[#f9f5f1] shadow-xl transition-transform duration-200 md:relative md:inset-auto md:z-auto md:w-72 md:shrink-0 md:translate-x-0 md:shadow-none',
        isOpen ? 'translate-x-0' : '-translate-x-full',
      ].join(' ')}
    >
      <div className="border-b border-stone-200 px-4 pb-4 pt-16 md:pt-5">
        <h1 className="text-lg font-semibold">Conversas</h1>
        <button
          type="button"
          onClick={onCreateConversation}
          className="mt-3 w-full rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
        >
          Nova conversa
        </button>
      </div>

      <nav aria-label="Lista de conversas" className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
        {conversationIds.length === 0 ? (
          <p className="px-2 py-3 text-sm text-stone-500">Nenhuma conversa criada.</p>
        ) : (
          conversationIds.map((conversationId) => (
            <SidebarItem
              key={conversationId}
              conversationId={conversationId}
              isActive={conversationId === activeConversationId}
              onSelect={onSelectConversation}
            />
          ))
        )}
      </nav>
    </aside>
  )
}
