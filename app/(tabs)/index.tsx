import React, { useState, useCallback } from 'react'
import { YStack } from 'tamagui'
import ChatLayout, { type Message } from 'components/chat/ChatLayout'
import ChatInput from 'components/chat/ChatInput'

/**
 * ChatScreen - Principal State Orchestrator
 * 
 * Scalability:
 * - Simulated streaming behavior using chunked updates.
 * - Architectural readiness for real SSE/Streaming.
 */
export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am your premium AI assistant. I have implemented real-time chunked streaming for our conversation.',
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const handleSend = useCallback((text = inputValue) => {
    const trimmed = text.trim()
    if (!trimmed || isTyping) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
    }

    setMessages((prev) => [userMessage, ...prev])
    setInputValue('')
    
    // Simulate AI thinking and then streaming
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const aiMessageId = (Date.now() + 1).toString()
      const aiMessage: Message = {
        id: aiMessageId,
        role: 'assistant',
        content: `Analyzing your input: "${trimmed}". This response is being simulated with chunked streaming to demonstrate the high-performance UI architecture. Each chunk is materializing instantly without blocking the main thread or causing expensive list re-renders.`,
        isStreaming: true,
      }
      setMessages((prev) => [aiMessage, ...prev])
    }, 800)
  }, [inputValue, isTyping])

  const handleStreamEnd = useCallback((id: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, isStreaming: false } : msg
      )
    )
  }, [])

  const handleRegenerate = useCallback(() => {
    const lastUser = messages.find(m => m.role === 'user')
    if (lastUser) handleSend(lastUser.content)
  }, [messages, handleSend])

  return (
    <YStack flex={1}>
      <ChatLayout
        messages={messages}
        isTyping={isTyping}
        onRegenerate={handleRegenerate}
        onStreamEnd={handleStreamEnd}
        renderInput={() => (
          <ChatInput
            value={inputValue}
            onChangeText={setInputValue}
            onSend={() => handleSend()}
            disabled={isTyping}
            placeholder="Ask me anything..."
          />
        )}
      />
    </YStack>
  )
}
