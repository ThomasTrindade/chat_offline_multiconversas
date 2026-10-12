import { useEffect, useRef, useState } from 'react'

import type { Author } from '../types/message'

type SenderToggleProps = {
  author: Author
  disabled: boolean
  onChange: (value: Author) => void
}

export default function SenderToggle({ author, disabled, onChange }: SenderToggleProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const selectedButtonRef = useRef<HTMLButtonElement>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const isRobot = author === 'robot'

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isDialogOpen && !dialog.open) {
      dialog.showModal()
      selectedButtonRef.current?.focus()
    } else if (!isDialogOpen && dialog.open) {
      dialog.close()
    }
  }, [isDialogOpen])

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-label={`Autoria atual: ${isRobot ? 'Robô' : 'Usuário'}. Alterar autoria`}
        onClick={() => {
          if (!disabled) {
            setIsDialogOpen(true)
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

      <dialog
        ref={dialogRef}
        aria-labelledby="author-dialog-title"
        onCancel={() => setIsDialogOpen(false)}
        onClose={() => setIsDialogOpen(false)}
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
                ref={selected ? selectedButtonRef : undefined}
                type="button"
                aria-pressed={selected}
                disabled={disabled}
                onClick={() => {
                  onChange(option)
                  setIsDialogOpen(false)
                }}
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
    </>
  )
}
