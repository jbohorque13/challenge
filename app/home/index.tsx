import { Send } from '@tamagui/lucide-icons'
import { YStack, XStack, ScrollView, Input, Button } from 'tamagui'
import ChatBubble from 'components/chat/ChatBubble'

export default function ChatScreen() {
  return (
    <YStack flex={1} bg="$background">
      {/* Scrollable messages area */}
      <ScrollView flex={1} contentContainerStyle={{ p: '$4', gap: '$4' }}>
        <ChatBubble variant="ai" message="Hello! I am ready to help you." />
        <ChatBubble variant="user" message="Let's build a clean and minimal Gemini-style layout." />
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
