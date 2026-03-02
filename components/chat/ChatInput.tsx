import React, { memo, useEffect, useState } from 'react'
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
 * ChatInput - Auto-growing premium input
 */
const ChatInput = ({ 
  value, 
  onChangeText, 
  onSend, 
  disabled, 
  placeholder = 'Message...' 
}: ChatInputProps) => {

  const handleSend = () => {
    onSend()
  }

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
        py="$1" 
        items="center" 
        gap="$3"
        elevation={1}
        style={{ minHeight: 48 }}
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
          px={0}
          mx={0}
          value={value}
          onChangeText={onChangeText}
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
          onPress={handleSend}
          disabled={disabled || !value.trim()}
          opacity={disabled || !value.trim() ? 0.4 : 1}
          pressStyle={{ scale: 0.92, opacity: 0.8 }}
        />
      </XStack>
    </YStack>
  )
}

export default memo(ChatInput)
