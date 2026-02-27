import React, { useState, useCallback } from 'react'
import { YStack } from 'tamagui'
import ChatLayout, { type Message } from 'components/chat/ChatLayout'
import ChatInput from 'components/chat/ChatInput'

/**
 * ChatScreen - Main Business Logic & State Container
 * 
 * Architecture decisions:
 * 1. State Management: Using local state for messages for demonstration. 
 *    In a larger app, this would be handled by a Store (Zustand/Redux) or React Query.
 * 2. Message Order: Since we use an inverted list for production performance, 
 *    we prepend new messages to the beginning of the array.
 * 3. Separation of Concerns: This component handles logic, while ChatLayout handles the complex UI.
 */
export default function ChatScreen() {
  // Initial messages are reversed to match the logic of an inverted list (index 0 = bottom)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '10',
      role: 'user',
      content: 'I want to build a chat app.'
    },
    {
      id: '9',
      role: 'user',
      content: 'I want to build a chat app.'
    },
    {
      id: '8',
      role: 'user',
      content: 'I want to build a chat app.'
    },
    {
      id: '7',
      role: 'assistant',
      content: "I'm ready to help you.",
    },
    {
      id: '6',
      role: 'user',
      content: "Let's build a clean and minimal Gemini-style layout.",
    },
    {
      id: '5',
      role: 'assistant',
      content: "I'm ready to help you.",
    },
    {
      id: '4',
      role: 'user',
      content: "Let's build a clean and minimal Gemini-style layout.",
    },
    {
      id: '3',
      role: 'assistant',
      content: "I'm ready to help you.",
    },
    {
      id: '2',
      role: 'user',
      content: "Let's build a clean and minimal Gemini-style layout.",
    },
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am ready to help you.',
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const handleSend = useCallback(() => {
    const trimmed = inputValue.trim()
    if (!trimmed || isTyping) return

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
    }

    // Inverted list: prepend to stay at the bottom
    setMessages((prev) => [newMessage, ...prev])
    setInputValue('')
    
    // Simulate AI response orchestration
    setIsTyping(true)
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `As a Senior AI Architect, I've implemented your ${trimmed.length > 20 ? 'complex' : 'simple'} request using a scalable, inverted FlatList architecture optimized for 60FPS. How else can I assist with your infrastructure?`
      }
      setIsTyping(false)
      setMessages((prev) => [response, ...prev])
    }, 1500)
  }, [inputValue, isTyping])

  return (
    <YStack flex={1}>
      <ChatLayout
        messages={messages}
        isTyping={isTyping}
        renderInput={() => (
          <ChatInput
            value={inputValue}
            onChangeText={setInputValue}
            onSend={handleSend}
            disabled={isTyping}
            placeholder="Escribe un mensaje..."
          />
        )}
      />
    </YStack>
  )
}
