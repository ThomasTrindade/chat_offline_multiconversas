import type { RefObject } from 'react'
import type { ChatMessage } from '../types/message'
import MessageBubble from './MessageBubble'

type ChatHistoryProps = {
  messages: ChatMessage[]
  listRef: RefObject<HTMLDivElement | null>
  emptyMessage?: string
}

export default function ChatHistory({
  messages,
  listRef,
  emptyMessage = 'Nenhuma mensagem ainda.',
}: ChatHistoryProps) {
  return (
    <div
      ref={listRef}
      role="log"
      aria-live="polite"
      aria-label="Histórico de mensagens"
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-6 pt-4 sm:px-4"
    >
      {messages.length === 0 ? (
        <div className="flex h-full min-h-[200px] items-center justify-center text-center text-sm text-stone-500">
          {emptyMessage}
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>
      )}
    </div>
  )
}
