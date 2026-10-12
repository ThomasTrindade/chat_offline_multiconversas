import { useEffect, useRef, useState } from 'react'
import ChatComposer from './components/ChatComposer'
import ChatHistory from './components/ChatHistory'
import { useChatStore } from './stores'
import type { Author, ChatMessage } from './types/message'

const EMPTY_MESSAGES: ChatMessage[] = []

export default function App() {
  const activeConversationId = useChatStore((state) => state.activeConversationId)
  const addMessage = useChatStore((state) => state.addMessage)
  const conversations = useChatStore((state) => state.conversations)
  const createConversation = useChatStore((state) => state.createConversation)
  const selectConversation = useChatStore((state) => state.selectConversation)
  const conversationIds = Object.keys(conversations)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const messages = useChatStore((state) => {
    return state.activeConversationId
      ? state.conversations[state.activeConversationId] ?? EMPTY_MESSAGES
      : EMPTY_MESSAGES
  })

  const [draft, setDraft] = useState('')
  const [author, setAuthor] = useState<Author>('user')
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = listRef.current
    if (!container) return

    container.scrollTop = container.scrollHeight
  }, [messages])

  const handleSubmit = () => {
    if (!activeConversationId) {
      return
    }

    const trimmed = draft.trim()
    if (!trimmed) return

    addMessage(trimmed, author)
    setDraft('')
  }

  return (
    <div className="relative min-h-[var(--viewport-height)] bg-[#f1e4d2] p-3 text-stone-800 sm:p-4">
      <button
        type="button"
        aria-label={isSidebarOpen ? 'Fechar conversas' : 'Abrir conversas'}
        aria-expanded={isSidebarOpen}
        onClick={() => setIsSidebarOpen((isOpen) => !isOpen)}
        className="absolute left-5 top-5 z-30 flex size-10 items-center justify-center rounded-xl border border-stone-200 bg-white text-xl shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 md:hidden"
      >
        {isSidebarOpen ? '×' : '☰'}
      </button>

      <div className="mx-auto flex h-[calc(var(--viewport-height)-2rem)] w-full max-w-6xl overflow-hidden rounded-2xl border border-stone-200 bg-[#f9f5f1] shadow-sm">
        <aside
          aria-label="Conversas"
          className={[
            'fixed inset-y-0 left-0 z-20 flex w-[min(20rem,85vw)] flex-col border-r border-stone-200 bg-[#f9f5f1] shadow-xl transition-transform duration-200 md:relative md:inset-auto md:z-auto md:w-72 md:shrink-0 md:translate-x-0 md:shadow-none',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          ].join(' ')}
        >
          <div className="border-b border-stone-200 px-4 pb-4 pt-16 md:pt-5">
            <h1 className="text-lg font-semibold">Conversas</h1>
            <button
              type="button"
              onClick={() => createConversation()}
              className="mt-3 w-full rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
            >
              Nova conversa
            </button>
          </div>

          <nav aria-label="Lista de conversas" className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
            {conversationIds.length === 0 ? (
              <p className="px-2 py-3 text-sm text-stone-500">Nenhuma conversa criada.</p>
            ) : (
              conversationIds.map((conversationId) => {
                const isActive = conversationId === activeConversationId
                return (
                  <button
                    key={conversationId}
                    type="button"
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => selectConversation(conversationId)}
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
              })
            )}
          </nav>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <header className="flex min-h-14 items-center border-b border-stone-200 px-4 pl-14 md:pl-4">
            <p className="break-all text-sm font-medium text-stone-600">
              {activeConversationId ?? 'Selecione ou crie uma conversa'}
            </p>
          </header>
          <ChatHistory
            messages={messages}
            listRef={listRef}
            emptyMessage={
              activeConversationId
                ? 'Nenhuma mensagem ainda.'
                : 'Crie uma conversa ou selecione uma existente para começar.'
            }
          />
          <ChatComposer
            author={author}
            draft={draft}
            disabled={!activeConversationId}
            setDraft={setDraft}
            onAuthorChange={setAuthor}
            onSubmit={handleSubmit}
          />
        </main>
      </div>
    </div>
  )
}