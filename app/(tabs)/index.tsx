import React, { useState, useCallback } from 'react'
import { YStack, useToastController } from 'tamagui'
import ChatLayout, { type Message } from 'components/chat/ChatLayout'
import ChatInput from 'components/chat/ChatInput'
import { chatService } from 'services/chatService'

/**
 * ChatScreen - Implementation for Phase 1 + Markdown Support
 */
export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am connected to the backend and I can now render **Markdown**. \n\n### Capabilities:\n- Lists\n- **Bold text**\n- `Code blocks`\n- Tables',
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToastController()

  // Phase 1 Identifiers
  const userId = '1'
  const conversationId = 'default'

  const handleSend = useCallback(async (text = inputValue) => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
    }

    setMessages((prev) => [userMessage, ...prev])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await chatService.sendMessage(userId, conversationId, trimmed)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.reply,
        isStreaming: false,
      }

      setMessages((prev) => [aiMessage, ...prev])
    } catch (error: any) {
      toast.show('Error', {
        message: error.message || 'Failed to connect to AI',
        type: 'error'
      })
      console.error('[ChatScreen] Send Error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [inputValue, isLoading, toast, userId, conversationId])

  const handleRegenerate = useCallback(() => {
    const lastUser = messages.find(m => m.role === 'user')
    if (lastUser) handleSend(lastUser.content)
  }, [messages, handleSend])

  const handleStreamEnd = useCallback(() => {}, [])

  return (
    <YStack flex={1}>
      <ChatLayout
        messages={messages}
        isTyping={isLoading}
        onRegenerate={handleRegenerate}
        onStreamEnd={handleStreamEnd}
        renderInput={() => (
          <ChatInput
            value={inputValue}
            onChangeText={setInputValue}
            onSend={() => handleSend()}
            disabled={isLoading}
            placeholder="Ask me anything..."
          />
        )}
      />
    </YStack>
  )
}
