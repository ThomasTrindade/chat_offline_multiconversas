import { useEffect, useRef, useState } from 'react'

import ChatInput from './ChatInput'
import MessageList from './MessageList'
import Sidebar from './Sidebar'
import type { Author, ChatMessage } from '../types/message'

type ChatProps = {
  activeConversationId: string | null
  conversations: Record<string, ChatMessage[]>
  createConversation: () => string
  selectConversation: (conversationId: string) => boolean
  addMessage: (content: string, author: Author) => ChatMessage | null
}

export default function Chat({
  activeConversationId,
  conversations,
  createConversation,
  selectConversation,
  addMessage,
}: ChatProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [author, setAuthor] = useState<Author>('user')
  const listRef = useRef<HTMLDivElement>(null)

  const messages = activeConversationId ? conversations[activeConversationId] ?? [] : []
  const lastMessageId = messages.at(-1)?.id

  useEffect(() => {
    const container = listRef.current
    if (!container) return

    container.scrollTop = container.scrollHeight
  }, [activeConversationId, lastMessageId])

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
        <Sidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          isOpen={isSidebarOpen}
          onCreateConversation={() => {
            const newConversationId = createConversation()
            setIsSidebarOpen(false)
            if (newConversationId) {
              selectConversation(newConversationId)
            }
          }}
          onSelectConversation={(conversationId) => {
            selectConversation(conversationId)
            setIsSidebarOpen(false)
          }}
        />

        <main className="flex min-w-0 flex-1 flex-col">
          <header className="flex min-h-14 items-center border-b border-stone-200 px-4 pl-14 md:pl-4">
            <p className="break-all text-sm font-medium text-stone-600">
              {activeConversationId ?? 'Selecione ou crie uma conversa'}
            </p>
          </header>

          <MessageList
            messages={messages}
            listRef={listRef}
            emptyMessage={
              activeConversationId
                ? 'Nenhuma mensagem ainda.'
                : 'Crie uma conversa ou selecione uma existente para começar.'
            }
          />

          <ChatInput
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
