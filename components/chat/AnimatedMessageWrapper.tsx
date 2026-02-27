import React, { useEffect } from 'react'
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  Easing 
} from 'react-native-reanimated'

type Props = {
  children: React.ReactNode
  enabled?: boolean
}

/**
 * AnimatedMessageWrapper - High-Speed Content Emergence
 * 
 * Specs:
 * - Duration: 200ms
 * - Delay: 0ms (Instant feedback)
 * - Easing: Cubic Bezier (0.22, 1, 0.36, 1)
 * - TranslateY: 3px -> 0
 * 
 * UX Rationale:
 * While we want a "materializing" feel, the bubble background MUST 
 * appear instantly to avoid any perceived lag before streaming starts.
 */
const AnimatedMessageWrapper = ({ children, enabled = true }: Props) => {
  const opacity = useSharedValue(enabled ? 0 : 1)
  const translateY = useSharedValue(enabled ? 3 : 0)

  useEffect(() => {
    if (!enabled) return

    const config = {
      duration: 200,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
    }

    opacity.value = withTiming(1, config)
    translateY.value = withTiming(0, config)
  }, [enabled, opacity, translateY])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }))

  return (
    <Animated.View style={enabled ? animatedStyle : undefined}>
      {children}
    </Animated.View>
  )
}

export default React.memo(AnimatedMessageWrapper)
