import React, { memo, useCallback, useRef, useState, useEffect } from 'react'
import { YStack, styled, ZStack } from 'tamagui'
import { FlatList, Platform, type NativeSyntheticEvent, type NativeScrollEvent } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'
import { useHeaderHeight } from '@react-navigation/elements'
import ChatBubble from './ChatBubble'
import TypingIndicator from './TypingIndicator'
import ScrollToBottomButton from './ScrollToBottomButton'

export type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

export type ChatLayoutProps = {
  messages: Message[]
  isTyping?: boolean
  onRegenerate?: () => void
  onStreamEnd?: (id: string) => void
  renderInput: () => React.ReactNode
}

const RootContainer = styled(YStack, {
  name: 'ChatRoot',
  flex: 1,
  background: '$background',
})

/**
 * ChatLayout - Standard Chronological Interface (Non-Inverted)
 * 
 * Performance Specs:
 * - Chronological ordering (Oldest -> Newest).
 * - Downward growth.
 * - Minimal re-renders.
 */
const ChatLayout = ({ messages, isTyping, onRegenerate, onStreamEnd, renderInput }: ChatLayoutProps) => {
  const insets = useSafeAreaInsets()
  const headerHeight = useHeaderHeight()
  const flatListRef = useRef<FlatList>(null)
  const isAtBottomRef = useRef(true)
  const [showScrollButton, setShowScrollButton] = useState(false)

  // Auto-scroll on user send is handled by the parent calling scrollToEnd if needed,
  // or detectable here by message length change and role check.
  useEffect(() => {
    if (messages.length === 0) return
    
    const latestMessage = messages[messages.length - 2]
    
    // Rule: Auto-scroll ONLY when user sends a message.
    // AI streaming updates (content changes) won't trigger this unless length or id changes.
    if (latestMessage?.role === 'user') {
      // Use a small timeout to ensure layout has updated
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true })
      }, 100)
    }
  }, [messages.length])

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent
    const paddingToBottom = 50
    const isAtBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom
    
    isAtBottomRef.current = isAtBottom
    setShowScrollButton(!isAtBottom && contentOffset.y > 200)
  }, [])

  const scrollToBottom = useCallback(() => {
    flatListRef.current?.scrollToEnd({ animated: true })
  }, [])

  const renderItem = useCallback(({ item }: { item: Message }) => {
    return (
      <ChatBubble
        variant={item.role === 'user' ? 'user' : 'ai'}
        message={item.content}
        isStreaming={item.isStreaming}
        onRegenerate={onRegenerate}
        onStreamEnd={() => onStreamEnd?.(item.id)}
      />
    )
  }, [onRegenerate, onStreamEnd])

  return (
    <RootContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={headerHeight}
      >
        <ZStack flex={1}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            inverted={false} // Requirement: No inverted
            removeClippedSubviews={Platform.OS === 'android'}
            initialNumToRender={15}
            windowSize={10}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ 
              padding: 16,
            }}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            ListFooterComponent={isTyping ? <TypingIndicator /> : null} // Footer for standard list
          />

          <YStack 
            pointerEvents="box-none"
            style={{
              position: 'absolute', 
              bottom: 16, 
              right: 16,
              zIndex: 100,
            }}
          >
            <ScrollToBottomButton 
              visible={showScrollButton} 
              onPress={scrollToBottom} 
            />
          </YStack>
        </ZStack>

        <YStack pb={insets.bottom}>
          {renderInput()}
        </YStack>
      </KeyboardAvoidingView>
    </RootContainer>
  )
}

export default memo(ChatLayout)