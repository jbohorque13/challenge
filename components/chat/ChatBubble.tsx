import React, { memo } from 'react'
import { YStack, Text, type YStackProps } from 'tamagui'
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { Pressable } from 'react-native'

export type ChatBubbleProps = {
  message: string
  variant: 'user' | 'ai'
} & YStackProps

const AnimatedYStack = Animated.createAnimatedComponent(YStack)

const ChatBubble = ({ message, variant, ...rest }: ChatBubbleProps) => {
  const isUser = variant === 'user'
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  return (
    <AnimatedYStack
      entering={FadeInUp.duration(220)} // sin springify
      self={isUser ? 'flex-end' : 'flex-start'}
      maxW="75%"
      style={animatedStyle}
    >
      <Pressable
        onPressIn={() => {
          scale.value = withSpring(0.97, { damping: 15 })
        }}
        onPressOut={() => {
          scale.value = withSpring(1)
        }}
      >
        <YStack
          p="$4"
          m="$2"
          rounded="$lg"
          bg={isUser ? '$surface2' : '$surface1'}
          borderWidth={isUser ? 1 : 0}
          borderColor="$borderColor"
          {...rest}
        >
          <Text fontSize="$4">
            {message}
          </Text>
        </YStack>
      </Pressable>
    </AnimatedYStack>
  )
}

export default memo(ChatBubble)