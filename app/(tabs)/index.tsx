import React, { useState, useCallback } from 'react'
import { YStack, Toast, useToastController } from 'tamagui'
import ChatLayout, { type Message } from 'components/chat/ChatLayout'
import ChatInput from 'components/chat/ChatInput'
import { chatService } from 'services/chatService'

/**
 * ChatScreen - Phase 1: Frontend ↔ Backend Integration
 * 
 * Objectives:
 * - Real API communication with Vercel backend.
 * - JSON-based request/response lifecycle.
 * - Robust error handling and loading states.
 */
export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am connected to the backend. How can I help you today?',
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToastController()

  // Phase 1 Hardcoded identifiers
  const userId = '1'
  const conversationId = 'default'

  const handleSend = useCallback(async (text = inputValue) => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return

    // 1. Create and append user message immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
    }

    setMessages((prev) => [userMessage, ...prev])
    setInputValue('')
    setIsLoading(true)

    try {
      // 2. Call the real backend via chatService
      const response = await chatService.sendMessage(userId, conversationId, trimmed)

      // 3. Append assistant message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.reply,
        isStreaming: false, // Explicitly false for Phase 1
      }

      setMessages((prev) => [aiMessage, ...prev])
    } catch (error: any) {
      // 4. Handle errors gracefully
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

  // onStreamEnd is not used in Phase 1 but kept for architectural compatibility
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
