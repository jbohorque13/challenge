import React, { useEffect, memo } from 'react'
import { Button, styled } from 'tamagui'
import { ArrowDown } from '@tamagui/lucide-icons'
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  useSharedValue 
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'

type Props = {
  visible: boolean
  onPress: () => void
}

const StyledButton = styled(Button, {
  size: '$4',
  circular: true,
  background: '$background',
  elevation: 6,
  borderWidth: 1,
  borderColor: '$borderColor',
})

const AnimatedButton = Animated.createAnimatedComponent(StyledButton)

/**
 * ScrollToBottomButton - Navigation utility
 * 
 * UX Rationale:
 * A floating action button that appears only when contextually relevant 
 * (scrolled up). Uses spring physics for a high-quality feel.
 */
const ScrollToBottomButton = ({ visible, onPress }: Props) => {
  const scale = useSharedValue(0)
  const opacity = useSharedValue(0)

  useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, { damping: 12, stiffness: 100 })
      opacity.value = withTiming(1, { duration: 200 })
    } else {
      scale.value = withSpring(0, { damping: 15 })
      opacity.value = withTiming(0, { duration: 150 })
    }
  }, [visible, scale, opacity])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }))

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onPress()
  }

  return (
    <AnimatedButton
      icon={ArrowDown}
      style={animatedStyle}
      onPress={handlePress}
      pressStyle={{ scale: 0.9 }}
      {...(!visible && { pointerEvents: 'none' })}
    />
  )
}

export default memo(ScrollToBottomButton)
