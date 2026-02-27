import React, { memo, useCallback, useRef, useState } from 'react'
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
 * ChatLayout - High-performance AI Interface
 * 
 * UX Decisions:
 * 1. Inverted FlatList: Standard for chat, ensures bottom-aligned growth and 
 *    frame-perfect keyboard push-up.
 * 2. Scrolled-Up detection: In an inverted list, y=0 is bottom. We show the 
 *    jump-to-bottom button if y > 100.
 */
const ChatLayout = ({ messages, isTyping, onRegenerate, onStreamEnd, renderInput }: ChatLayoutProps) => {
  const insets = useSafeAreaInsets()
  const headerHeight = useHeaderHeight()
  const flatListRef = useRef<FlatList>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const yOffset = event.nativeEvent.contentOffset.y
    // In inverted lists, y > 0 means the user has scrolled away from the bottom (top of the view)
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

          {/* Floating Scroll to Bottom - Positioned above input */}
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