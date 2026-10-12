import { useEffect, useRef, type Dispatch, type KeyboardEvent, type SetStateAction } from 'react'

import type { Author } from '../types/message'
import SenderToggle from './SenderToggle'

type ChatInputProps = {
  author: Author
  draft: string
  disabled: boolean
  setDraft: Dispatch<SetStateAction<string>>
  onAuthorChange: (value: Author) => void
  onSubmit: () => void
}

export default function ChatInput({
  author,
  draft,
  disabled,
  setDraft,
  onAuthorChange,
  onSubmit,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isRobot = author === 'robot'
  const isDisabled = draft.trim().length === 0 || disabled

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 144)}px`
  }, [draft])

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      if (!isDisabled) {
        onSubmit()
      }
    }
  }

  return (
    <div
      className={[
        'shrink-0 border-t border-stone-200 bg-[#f9f7f5] px-3 pb-3 pt-3 transition-opacity duration-200 sm:px-4',
        disabled ? 'opacity-50' : 'opacity-100',
      ].join(' ')}
    >
      <form
        className={[
          'rounded-2xl border bg-white p-3 shadow-sm transition-colors duration-200 sm:p-4',
          isRobot ? 'border-violet-500 ring-2 ring-violet-200' : 'border-stone-200',
        ].join(' ')}
        onSubmit={(event) => {
          event.preventDefault()
          if (!isDisabled) {
            onSubmit()
          }
        }}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <SenderToggle author={author} disabled={disabled} onChange={onAuthorChange} />

          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              aria-label="Mensagem"
              placeholder={disabled ? 'Selecione ou crie uma conversa' : 'Digite sua mensagem...'}
              disabled={disabled}
              className="max-h-36 min-h-[44px] w-full resize-none overflow-y-auto rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm leading-6 text-stone-800 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-violet-200 disabled:cursor-not-allowed disabled:opacity-80"
            />
            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={isDisabled}
                className="rounded-xl bg-stone-900 px-4 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:bg-stone-300 disabled:text-stone-500 hover:bg-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
