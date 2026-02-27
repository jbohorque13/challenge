import React, { useState, useCallback, memo } from 'react'
import { XStack, Button, Tooltip, styled } from 'tamagui'
import { ThumbsUp, ThumbsDown, Copy, RotateCcw, Check } from '@tamagui/lucide-icons'
import * as Clipboard from 'expo-clipboard'
import * as Haptics from 'expo-haptics'

type Props = {
  content: string
  onRegenerate?: () => void
}

const ActionButton = styled(Button, {
  size: '$2',
  circular: true,
  background: 'transparent',
  borderWidth: 0,
  opacity: 0.6,
  pressStyle: { opacity: 1, scale: 0.92, background: '$surface2' },
  hoverStyle: { opacity: 1, background: '$surface2' },
})

/**
 * MessageActions - AI Response Toolbar
 * 
 * UX Rationale:
 * Actions are presented with low visual weight to avoid cluttering 
 * the chat, but provide clear feedback (icon change, haptics) upon interaction.
 */
const MessageActions = ({ content, onRegenerate }: Props) => {
  const [liked, setLiked] = useState<boolean | null>(null)
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    await Clipboard.setStringAsync(content)
    setCopied(true)
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    setTimeout(() => setCopied(false), 1200)
  }, [content])

  const handleLike = useCallback(() => {
    setLiked(prev => prev === true ? null : true)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }, [])

  const handleDislike = useCallback(() => {
    setLiked(prev => prev === false ? null : false)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }, [])

  const handleRegenerate = useCallback(() => {
    onRegenerate?.()
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
  }, [onRegenerate])

  return (
    <XStack gap="$1.5" mt="$2" ml="$2">
      <ActionButton
        icon={<ThumbsUp color={liked === true ? '$blue10' : '$color'} />}
        opacity={liked === true ? 1 : 0.6}
        onPress={handleLike}
      />
      <ActionButton
        icon={<ThumbsDown color={liked === false ? '$red10' : '$color'} />}
        opacity={liked === false ? 1 : 0.6}
        onPress={handleDislike}
      />
      <ActionButton
        icon={<Copy color={copied ? '$green10' : '$color'} />}
        onPress={handleCopy}
      />
      <ActionButton
        icon={RotateCcw}
        onPress={handleRegenerate}
      />
    </XStack>
  )
}

export default memo(MessageActions)
