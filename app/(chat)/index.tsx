import React, { useState, useCallback, useRef, useEffect } from 'react'
import { YStack, useToastController } from 'tamagui'
import ChatLayout, { type Message } from 'components/chat/ChatLayout'
import ChatInput from 'components/chat/ChatInput'
import { chatService, ChatStream } from 'services/chatService'

/**
 * ChatScreen - Refactored for Standard Document Flow (Non-Inverted)
 */
export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am connected via **Real-time Streaming**. How can I help you today?',
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  
  // Track current stream to allow cancellation
  const activeStreamRef = useRef<ChatStream | null>(null)
  const toast = useToastController()

  // Phase 1 Identifiers
  const userId = '1'
  const conversationId = 'default'

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      activeStreamRef.current?.cancel()
    }
  }, [])

  const handleSend = useCallback(async (text = inputValue) => {
    const trimmed = text.trim()
    if (!trimmed || isGenerating) return

    // 1. CHRONOLOGICAL ORDER: Append User Message to the end
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsGenerating(true)

    // 2. Prepare Placeholder AI Message for Streaming at the end
    const aiMessageId = (Date.now() + 1).toString()
    const aiPlaceholder: Message = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      isStreaming: true,
    }
    
    setMessages((prev) => [...prev, aiPlaceholder])

    // 3. Initiate Stream via chatService
    activeStreamRef.current = chatService.sendMessageStream({
      userId,
      conversationId,
      message: trimmed,
      onToken: (token) => {
        setMessages((prev) => {
          // OPTIMIZATION: Update only the last message if it matches ID
          const lastMsg = prev[prev.length - 1]
          if (lastMsg && lastMsg.id === aiMessageId) {
            const updated = [...prev]
            updated[updated.length - 1] = {
              ...lastMsg,
              content: lastMsg.content + token
            }
            return updated
          }
          return prev
        })
      },
      onComplete: () => {
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === aiMessageId 
              ? { ...msg, isStreaming: false } 
              : msg
          )
        )
        setIsGenerating(false)
        activeStreamRef.current = null
      },
      onError: (error) => {
        toast.show('Streaming Error', {
          message: error.message || 'Connection lost',
          type: 'error'
        })
        setIsGenerating(false)
        activeStreamRef.current = null
        
        // Cleanup failed message
        setMessages((prev) => prev.filter(m => m.id !== aiMessageId))
      }
    })
  }, [inputValue, isGenerating, toast, userId, conversationId])

  const handleRegenerate = useCallback(() => {
    const lastUser = [...messages].reverse().find(m => m.role === 'user')
    if (lastUser) handleSend(lastUser.content)
  }, [messages, handleSend])

  const handleStreamEnd = useCallback((id: string) => {
    setMessages((prev) => 
      prev.map((msg) => 
        msg.id === id ? { ...msg, isStreaming: false } : msg
      )
    )
  }, [])

  return (
    <YStack flex={1}>
      <ChatLayout
        messages={messages}
        isTyping={isGenerating && messages[messages.length - 1]?.content === ''}
        onRegenerate={handleRegenerate}
        onStreamEnd={handleStreamEnd}
        renderInput={() => (
          <ChatInput
            value={inputValue}
            onChangeText={setInputValue}
            onSend={() => handleSend()}
            disabled={isGenerating}
            placeholder="Ask me anything..."
          />
        )}
      />
    </YStack>
  )
}
