import React, { memo } from 'react'
import { XStack, YStack, Button, TextArea } from 'tamagui'
import { Send } from '@tamagui/lucide-icons'

export type ChatInputProps = {
  value: string
  onChangeText: (text: string) => void
  onSend: () => void
  disabled?: boolean
  placeholder?: string
}

/**
 * ChatInput Component
 * 
 * Design Aesthetics:
 * - Minimalist, modern borderless style within the wrapper.
 * - Subtle elevation and shadows for the input bar.
 * - Dynamic button opacity for disabled states.
 * - Optimized for smooth text entry and multiline growth.
 */
const ChatInput = ({ 
  value, 
  onChangeText, 
  onSend, 
  disabled, 
  placeholder = 'Message...' 
}: ChatInputProps) => {
  return (
    <YStack 
      bg="$background" 
      px="$4" 
      py="$3" 
      borderTopWidth={1} 
      borderTopColor="$borderColor"
    >
      <XStack 
        bg="$surface2" 
        rounded="$xl" 
        borderWidth={1} 
        borderColor="$borderColor" 
        px="$4" 
        py="$2" 
        items="center" 
        gap="$3"
        elevation={1}
        shadowColor="$shadowColor"
        shadowOpacity={0.05}
        shadowRadius={8}
      >
        <TextArea
          flex={1}
          borderWidth={0}
          bg="transparent"
          color="$color"
          placeholder={placeholder}
          placeholderTextColor="$color"
          focusStyle={{ outlineWidth: 0, bg: 'transparent' }}
          fontSize={16}
          p={0}
          value={value}
          onChangeText={onChangeText}
          rows={1}
          maxH={120}
          multiline
          autoComplete="off"
          autoCorrect={false}
        />
        <Button
          size="$3"
          circular
          icon={Send}
          bg="$background"
          borderWidth={1}
          borderColor="$borderColor"
          hoverStyle={{ bg: '$surface1' }}
          pressStyle={{ scale: 0.92, opacity: 0.8 }}
          onPress={onSend}
          disabled={disabled || !value.trim()}
          opacity={disabled || !value.trim() ? 0.4 : 1}
        />
      </XStack>
    </YStack>
  )
}

export default memo(ChatInput)
