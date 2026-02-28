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
 * ChatLayout - Smart Scroll Interface
 * 
 * Logic:
 * - Auto-scroll on user send.
 * - Auto-scroll on assistant arrival ONLY if user is already near bottom.
 * - Uses inverted list: y=0 is bottom.
 */
const ChatLayout = ({ messages, isTyping, onRegenerate, onStreamEnd, renderInput }: ChatLayoutProps) => {
  const insets = useSafeAreaInsets()
  const headerHeight = useHeaderHeight()
  const flatListRef = useRef<FlatList>(null)
  const isNearBottomRef = useRef(true)
  const [showScrollButton, setShowScrollButton] = useState(false)

  // Smart scroll logic
  useEffect(() => {
    if (messages.length === 0) return

    const lastMessage = messages[0] // Inverted list, first item is latest
    const isUserMessage = lastMessage.role === 'user'

    // Always scroll on user send, or if assistant arrives while near bottom
    if (isUserMessage || isNearBottomRef.current) {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true })
    }
  }, [messages.length])

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const yOffset = event.nativeEvent.contentOffset.y
    // In inverted lists, y = 0 is bottom.
    isNearBottomRef.current = yOffset < 50
    setShowScrollButton(yOffset > 100)
  }, [])

  const scrollToBottom = useCallback(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true })
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
            inverted
            removeClippedSubviews={Platform.OS === 'android'}
            initialNumToRender={15}
            windowSize={10}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ padding: 16 }}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            ListHeaderComponent={isTyping ? <TypingIndicator /> : null}
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