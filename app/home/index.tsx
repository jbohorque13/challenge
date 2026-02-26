import { Send } from '@tamagui/lucide-icons'
import { YStack, XStack, ScrollView, Input, Button, Text } from 'tamagui'

export default function ChatScreen() {
  return (
    <YStack flex={1} bg="$background">
      {/* Scrollable messages area */}
      <ScrollView flex={1} contentContainerStyle={{ p: '$4', gap: '$4' }}>
        <YStack bg="$surface1" p="$4" rounded="$lg" self="flex-start" maxW="85%">
          <Text color="$color">Hello! I am ready to help you.</Text>
        </YStack>

        <YStack bg="$background" p="$4" rounded="$lg" borderWidth={1} borderColor="$surface2" self="flex-end" maxW="85%">
          <Text color="$color">Let's build a clean and minimal Gemini-style layout.</Text>
        </YStack>
      </ScrollView>

      {/* Bottom floating input bar */}
      <YStack pt="$2" px="$4" pb="$6">
        <XStack
          bg="$surface2"
          rounded="$xl"
          borderWidth={1}
          borderColor="$borderColor"
          px="$4"
          py="$2"
          items="center"
          gap="$3"
        >
          <Input
            flex={1}
            borderWidth={0}
            bg="transparent"
            color="$color"
            placeholder="Message..."
            placeholderTextColor="$color"
            focusStyle={{ outlineWidth: 0 }}
            fontSize={16}
            p={0}
          />
          <Button
            size="$3"
            circular
            icon={Send}
            bg="$background"
            borderWidth={1}
            borderColor="$borderColor"
            hoverStyle={{ bg: '$surface1' }}
          />
        </XStack>
      </YStack>
    </YStack>
  )
}
