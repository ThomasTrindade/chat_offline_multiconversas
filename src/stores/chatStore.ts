import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { Author, ChatMessage } from '../types/message'

export type ConversationHistory = Record<string, ChatMessage[]>

export type ChatStoreState = {
  conversations: ConversationHistory
  activeConversationId: string | null
  createConversation: () => string
  selectConversation: (conversationId: string) => boolean
  deleteConversation: (conversationId: string) => boolean
  addMessage: (content: string, author: Author) => ChatMessage | null
  addMessageToConversation: (conversationId: string, message: ChatMessage) => void
  getConversationIds: () => string[]
  getConversationMessages: (conversationId: string) => ChatMessage[]
}

const STORAGE_KEY = 'react-chat-offline:conversations'

const createBrowserStorage = () => ({
  getItem: () => {
    if (typeof window === 'undefined') {
      return null
    }

    return window.localStorage.getItem(STORAGE_KEY)
  },
  setItem: (_name: string, value: string) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, value)
    }
  },
  removeItem: () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  },
})

const createConversationId = () => crypto.randomUUID()

export const useChatStore = create<ChatStoreState>()(
  persist(
    (set, get) => ({
      conversations: {},
      activeConversationId: null,

      createConversation: () => {
        const conversationId = createConversationId()

        set((state) => ({
          conversations: {
            ...state.conversations,
            [conversationId]: [],
          },
          activeConversationId: conversationId,
        }))

        return conversationId
      },

      selectConversation: (conversationId) => {
        const conversationExists = Object.prototype.hasOwnProperty.call(
          get().conversations,
          conversationId,
        )

        if (!conversationExists) {
          return false
        }

        set({ activeConversationId: conversationId })
        return true
      },

      deleteConversation: (conversationId) => {
        const conversationExists = Object.prototype.hasOwnProperty.call(
          get().conversations,
          conversationId,
        )

        if (!conversationExists) {
          return false
        }

        set((state) => {
          const nextConversations = { ...state.conversations }
          delete nextConversations[conversationId]

          return {
            conversations: nextConversations,
            activeConversationId:
              state.activeConversationId === conversationId ? null : state.activeConversationId,
          }
        })

        return true
      },

      addMessage: (content, author) => {
        const trimmedContent = content.trim()
        const { activeConversationId } = get()

        if (!trimmedContent || !activeConversationId) {
          return null
        }

        const nextMessage: ChatMessage = {
          id: crypto.randomUUID(),
          author,
          content: trimmedContent,
        }

        set((state) => ({
          conversations: {
            ...state.conversations,
            [activeConversationId]: [...(state.conversations[activeConversationId] ?? []), nextMessage],
          },
        }))

        return nextMessage
      },

      addMessageToConversation: (conversationId, message) => {
        set((state) => ({
          conversations: {
            ...state.conversations,
            [conversationId]: [...(state.conversations[conversationId] ?? []), message],
          },
        }))
      },

      getConversationIds: () => Object.keys(get().conversations),

      getConversationMessages: (conversationId) => get().conversations[conversationId] ?? [],
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => createBrowserStorage()),
      partialize: (state) => ({
        conversations: state.conversations,
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState ?? {}),
        activeConversationId: null,
      }),
    },
  ),
)
