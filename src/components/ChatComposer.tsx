import { useEffect, useRef, useState, type Dispatch, type KeyboardEvent, type SetStateAction } from 'react'
import type { Author } from '../types/message'

type ChatComposerProps = {
  author: Author
  draft: string
  disabled: boolean
  setDraft: Dispatch<SetStateAction<string>>
  onAuthorChange: (value: Author) => void
  onSubmit: () => void
}

export default function ChatComposer({
  author,
  draft,
  disabled,
  setDraft,
  onAuthorChange,
  onSubmit,
}: ChatComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const authorDialogRef = useRef<HTMLDialogElement>(null)
  const authorOptionRef = useRef<HTMLButtonElement>(null)
  const [isAuthorDialogOpen, setIsAuthorDialogOpen] = useState(false)
  const isRobot = author === 'robot'
  const isDisabled = draft.trim().length === 0 || disabled

  useEffect(() => {
    const dialog = authorDialogRef.current
    if (!dialog) return

    if (isAuthorDialogOpen && !dialog.open) {
      dialog.showModal()
      authorOptionRef.current?.focus()
    } else if (!isAuthorDialogOpen && dialog.open) {
      dialog.close()
    }
  }, [isAuthorDialogOpen])

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

  const handleAuthorSelection = (value: Author) => {
    if (disabled) {
      return
    }

    onAuthorChange(value)
    setIsAuthorDialogOpen(false)
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
          <button
            type="button"
            aria-haspopup="dialog"
            aria-label={`Autoria atual: ${isRobot ? 'Robô' : 'Usuário'}. Alterar autoria`}
            onClick={() => {
              if (!disabled) {
                setIsAuthorDialogOpen(true)
              }
            }}
            disabled={disabled}
            className="flex min-h-11 items-center gap-2 self-start rounded-full border border-stone-300 bg-white py-1 pl-1 pr-3 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span
              aria-hidden="true"
              className={`flex size-9 items-center justify-center rounded-full text-lg ${isRobot ? 'bg-violet-100' : 'bg-emerald-100'}`}
            >
              {isRobot ? '🤖' : '👤'}
            </span>
            {isRobot ? 'Robô' : 'Usuário'}
          </button>

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

      <dialog
        ref={authorDialogRef}
        aria-labelledby="author-dialog-title"
        onCancel={() => setIsAuthorDialogOpen(false)}
        onClose={() => setIsAuthorDialogOpen(false)}
        className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-stone-200 bg-white p-5 text-stone-800 shadow-xl backdrop:bg-stone-950/40"
      >
        <h2 id="author-dialog-title" className="text-lg font-semibold">
          Como deseja enviar?
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {(['user', 'robot'] as Author[]).map((option) => {
            const selected = author === option
            const label = option === 'user' ? 'Usuário' : 'Robô'
            return (
              <button
                key={option}
                ref={selected ? authorOptionRef : undefined}
                type="button"
                aria-pressed={selected}
                disabled={disabled}
                onClick={() => handleAuthorSelection(option)}
                className={`flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 disabled:cursor-not-allowed disabled:opacity-60 ${
                  selected
                    ? option === 'robot'
                      ? 'border-violet-400 bg-violet-50 text-violet-900'
                      : 'border-emerald-400 bg-emerald-50 text-emerald-900'
                    : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex size-12 items-center justify-center rounded-full text-2xl ${option === 'robot' ? 'bg-violet-100' : 'bg-emerald-100'}`}
                >
                  {option === 'robot' ? '🤖' : '👤'}
                </span>
                Enviar como {label}
              </button>
            )
          })}
        </div>
      </dialog>
    </div>
  )
}
