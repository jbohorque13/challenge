import React, { useState, useCallback, useRef, useEffect } from 'react'
import { YStack, useToastController } from 'tamagui'
import ChatLayout, { type Message } from 'components/chat/ChatLayout'
import ChatInput from 'components/chat/ChatInput'
import { chatService, ChatStream } from 'services/chatService'

/**
 * ChatScreen - Phase 2: Real-time Streaming Integration
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

  // Phase 1 Identifiers (Still hardcoded per requirements)
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

    // 1. Append User Message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
    }

    setMessages((prev) => [userMessage, ...prev])
    setInputValue('')
    setIsGenerating(true)

    // 2. Prepare Placeholder AI Message for Streaming
    const aiMessageId = (Date.now() + 1).toString()
    const aiPlaceholder: Message = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      isStreaming: true,
    }
    
    setMessages((prev) => [aiPlaceholder, ...prev])

    // 3. Initiate Stream via chatService
    activeStreamRef.current = chatService.sendMessageStream({
      userId,
      conversationId,
      message: trimmed,
      onToken: (token) => {
        setMessages((prev) => 
          prev.map((msg) => 
            msg.id === aiMessageId 
              ? { ...msg, content: msg.content + token } 
              : msg
          )
        )
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
        
        // Remove the failed AI message or mark it
        setMessages((prev) => prev.filter(m => m.id !== aiMessageId))
      }
    })
  }, [inputValue, isGenerating, toast, userId, conversationId])

  const handleRegenerate = useCallback(() => {
    const lastUser = messages.find(m => m.role === 'user')
    if (lastUser) handleSend(lastUser.content)
  }, [messages, handleSend])

  const handleStreamEnd = useCallback((id: string) => {
    // This now simply ensures the UI knows streaming is done if not already set
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
        isTyping={isGenerating && messages[0]?.content === ''}
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
