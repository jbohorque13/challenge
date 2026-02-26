import React, { memo } from 'react'
import { YStack, Text, type YStackProps } from 'tamagui'

export type ChatBubbleProps = {
  message: string
  variant: 'user' | 'ai'
} & YStackProps

const ChatBubble = ({ message, variant, ...rest }: ChatBubbleProps) => {
  const isUser = variant === 'user'

  return (
    <YStack
      p="$4"
      rounded="$lg"
      maxW="75%"
      self={isUser ? 'flex-end' : 'flex-start'}
      bg={isUser ? '$surface2' : '$surface1'}
      borderWidth={isUser ? 1 : 0}
      borderColor="$borderColor"
      {...rest}
    >
      <Text color="$color" fontSize="$4">
        {message}
      </Text>
    </YStack>
  )
}

export default memo(ChatBubble)
