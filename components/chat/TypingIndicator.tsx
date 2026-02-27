import React, { useEffect } from 'react'
import { XStack, YStack, Circle } from 'tamagui'
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withSequence, 
  withTiming, 
  withDelay 
} from 'react-native-reanimated'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

const Dot = ({ delay }: { delay: number }) => {
  const opacity = useSharedValue(0.3)

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 400 }),
          withTiming(0.3, { duration: 400 })
        ),
        -1,
        true
      )
    )
  }, [delay, opacity])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  return <AnimatedCircle size={6} bg="$color" style={animatedStyle} />
}

export const TypingIndicator = () => {
  return (
    <YStack bg="$surface1" p="$4" rounded="$lg" self="flex-start" maxW="75%">
      <XStack gap="$1.5" items="center">
        <Dot delay={0} />
        <Dot delay={150} />
        <Dot delay={300} />
      </XStack>
    </YStack>
  )
}

export default React.memo(TypingIndicator)
