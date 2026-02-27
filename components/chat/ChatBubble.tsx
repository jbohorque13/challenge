import React, { memo } from 'react'
import { YStack, styled } from 'tamagui'
import AnimatedMessageWrapper from './AnimatedMessageWrapper'
import MessageActions from './MessageActions'
import StreamingText from './StreamingText'

export type ChatBubbleProps = {
  message: string
  variant: 'user' | 'ai'
  isStreaming?: boolean
  onRegenerate?: () => void
  onStreamEnd?: () => void
}

const BubbleContainer = styled(YStack, {
  name: 'BubbleContainer',
  p: '$4',
  rounded: '$lg',
})

/**
 * ChatBubble - Streaming-ready AI Interface
 * 
 * UX Rationale:
 * 1. Bubble background appears immediately via AnimatedMessageWrapper 
 *    (low delay for AI, instant for User).
 * 2. StreamingText handles the progressive generation of AI content.
 * 3. User messages are rendered instantly without streaming logic.
 */
const ChatBubble = ({ 
  message, 
  variant, 
  isStreaming, 
  onRegenerate, 
  onStreamEnd 
}: ChatBubbleProps) => {
  const isUser = variant === 'user'

  return (
    <AnimatedMessageWrapper enabled={!isUser}>
      <YStack 
        self={isUser ? 'flex-end' : 'flex-start'} 
        my="$1.5"
        style={{ maxWidth: '85%' }}
      >
        <BubbleContainer
          bg={isUser ? '$surface2' : '$surface1'}
          borderWidth={isUser ? 1 : 0}
          borderColor="$borderColor"
          {...(isUser ? { borderBottomRightRadius: '$1' } : { borderBottomLeftRadius: '$1' })}
        >
          <StreamingText 
            content={message} 
            isStreaming={!isUser && isStreaming} 
            onStreamEnd={onStreamEnd}
          />
        </BubbleContainer>
        
        {!isUser && !isStreaming && (
          <MessageActions content={message} onRegenerate={onRegenerate} />
        )}
      </YStack>
    </AnimatedMessageWrapper>
  )
}

export default memo(ChatBubble)