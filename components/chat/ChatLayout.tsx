import React, { memo, useCallback, useRef } from 'react'
import { YStack, styled } from 'tamagui'
import { FlatList, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { KeyboardAvoidingView } from 'react-native-keyboard-controller'
import { useHeaderHeight } from '@react-navigation/elements'
import ChatBubble from './ChatBubble'
import TypingIndicator from './TypingIndicator'

export type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export type ChatLayoutProps = {
  messages: Message[]
  isTyping?: boolean
  renderInput: () => React.ReactNode
}

const RootContainer = styled(YStack, {
  name: 'ChatRoot',
  flex: 1,
  background: '$background',
})

/**
 * ChatLayout - Production-grade Chat Layout
 * 
 * Architecture decisions:
 * 1. Inverted FlatList: Standard for high-performance chat. Index 0 is the bottom.
 *    New messages are prepended to the data array. This avoids layout recalculations
 *    for existing items and keeps the scroll position synced naturally.
 * 2. KeyboardAvoidingView: Uses react-native-keyboard-controller for native sync.
 *    Vertical offset accounts for the navigation header height.
 * 3. flex: 1 throughout: Ensures the container fills the screen correctly.
 * 4. Safe Area: Handled via insets at the root and bottom of the input container.
 */
const ChatLayout = ({ messages, isTyping, renderInput }: ChatLayoutProps) => {
  const insets = useSafeAreaInsets()
  const headerHeight = useHeaderHeight()
  const flatListRef = useRef<FlatList>(null)

  const renderItem = useCallback(({ item }: { item: Message }) => {
    return (
      <ChatBubble
        variant={item.role === 'user' ? 'user' : 'ai'}
        message={item.content}
      />
    )
  }, [])

  return (
    <RootContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={headerHeight}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          inverted // ChatGPT-style: grows from bottom to top
          removeClippedSubviews={Platform.OS === 'android'}
          initialNumToRender={15}
          maxToRenderPerBatch={10}
          windowSize={10}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            padding: 16,
          }}
          // If inverted, ListHeaderComponent is at the bottom, 
          // perfect for the typing indicator.
          ListHeaderComponent={isTyping ? <TypingIndicator /> : null}
        />
        
        {/* Input container with bottom safe area padding */}
        <YStack pb={insets.bottom}>
          {renderInput()}
        </YStack>
      </KeyboardAvoidingView>
    </RootContainer>
  )
}

export default memo(ChatLayout)