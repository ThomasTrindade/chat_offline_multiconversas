import Chat from './components/Chat'
import { useChatStore } from './stores'

export default function App() {
  const activeConversationId = useChatStore((state) => state.activeConversationId)
  const addMessage = useChatStore((state) => state.addMessage)
  const conversations = useChatStore((state) => state.conversations)
  const createConversation = useChatStore((state) => state.createConversation)
  const selectConversation = useChatStore((state) => state.selectConversation)
  const deleteConversation = useChatStore((state) => state.deleteConversation)

  return (
    <Chat
      activeConversationId={activeConversationId}
      conversations={conversations}
      createConversation={createConversation}
      selectConversation={selectConversation}
      deleteConversation={deleteConversation}
      addMessage={addMessage}
    />
  )
}