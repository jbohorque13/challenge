note because this is in a monorepo had to remove react, react-dom, and react-native-web deps and change metro.config.js a bit.

# AI used: 
- Antigravity + mode: fash + model: gemini 3.1 pro (low)
- Chatgpt 4.0 (low)

## Prompts used

### First Prompt:
```
I have an existing Expo + React Native + Tamagui v5 project using defaultConfig.

I want to evolve the visual system into a modern minimal Gemini-inspired design.

Do NOT break:

Existing TamaguiProvider

Babel config

Expo Router structure

PHASE 1 GOAL:
Refactor tamagui.config.ts to create a proper design system foundation.

Requirements:

Replace the current light/dark themes with a neutral-based palette:

No pure black (#000)

No pure white (#fff)

Use soft grays and slightly warm neutrals

Add proper tokens:

radius scale (sm, md, lg, xl, full)

space scale refinement

subtle surface levels (surface1, surface2)

Dark theme should feel like:
background: deep neutral gray (not black)
surfaces slightly lighter than background

Light theme:
slightly off-white background
very soft border colors

Keep strong TypeScript typing.

Output:

Updated tamagui.config.ts only.

Do not create UI yet.

Keep changes minimal but professional.
```

### Second Prompt:

```Now create the base Chat layout.

Context:

Expo Router project

Put the screen in app/(tabs)/index.tsx

Use Tamagui components only

PHASE 2 GOAL:
Create a minimal modern chat screen layout inspired by Gemini.

Requirements:

Full screen container using theme background.

Scrollable messages area.

Bottom floating input bar:

Rounded (xl radius)

Surface background (surface2 token)

Subtle border

Padding with space tokens

No animations yet.

No AI logic yet.

Just static UI structure.

Output:

Updated index.tsx

No backend logic

Clean layout only
```

### Third Prompt:

```
Create reusable ChatBubble component.

Requirements:

Variant: "user" | "ai"

User bubble:

Slightly tinted accent color

Align right

AI bubble:

surface1 background

Align left

Radius large

Padding using tokens

Max width 75%

Proper TypeScript props

Memoized to prevent unnecessary re-renders

Place in:
components/chat/ChatBubble.tsx
```

### Fourth Prompt:

```
Add subtle microinteractions using React Native Reanimated.

Message fade + translateY on mount.

Press feedback on bubbles.

Animated typing indicator (3 dots).

Keep animations subtle.
No exaggerated motion.

Avoid unnecessary re-renders.
Use memo where needed.
```

### Fifth Prompt:

``` 

Create a production-ready ChatScreen layout in:

app/(tabs)/index.tsx

📐 Layout Requirements:

Full screen container using theme background.

Messages area:

ScrollView (or FlatList if more appropriate)

Takes full available height

Content aligned to bottom

Prepared to append streaming messages without layout shift

Floating Input Bar (Gemini style):

Positioned at bottom

Wrapped in KeyboardAvoidingView

behavior:
iOS → "padding"
Android → "height"

SafeArea aware (useSafeAreaInsets)

Large border radius (xl token)

Surface-based background (not raw color)

Subtle border

Horizontal padding using space tokens

Vertical padding using space tokens

Slight elevation / shadow

Input field:

Expands vertically (multiline)

Max height constraint

Clean minimal placeholder

No logic yet

Send button:

Circular

Subtle press feedback

Aligned inside the input container

📦 Architecture Requirements:

Separate components:
components/chat/ChatInput.tsx
components/chat/ChatLayout.tsx

Strong TypeScript typing.

Memoize components where appropriate.

No unnecessary re-renders.

Do not implement AI logic yet.

Prepare state structure for streaming:

type Message = {
id: string
role: 'user' | 'assistant'
content: string
}

🚫 Avoid:

Manual keyboard animations with Reanimated.

Hardcoded pixel values.

Pure black (#000) or pure white (#fff).

Inline styles if possible.

💎 Visual Direction:

Inspired by Google Gemini.

Minimal.

Generous spacing.

Modern rounded surfaces.

Calm neutral palette.

Output:

ChatLayout component

ChatInput component

Updated index.tsx

Clean, production-level layout only.

No backend yet.

Think like a senior React Native developer building a scalable chat UI.

```

### Sixth Prompt:

```

The floating ChatInput is still partially covered by the keyboard.

I need you to properly fix the keyboard handling in a production-ready way.

⚠️ Constraints:

Do NOT use Reanimated for keyboard movement.

Do NOT introduce third-party keyboard libraries.

Must work correctly on iOS and Android.

Must respect SafeArea.

Must work with Expo Router header enabled.

🎯 Goal:
Ensure the floating ChatInput is always fully visible above the keyboard.

✅ Required Implementation:

Wrap the entire screen with KeyboardAvoidingView.

Use:
behavior:
iOS → "padding"
Android → "height"

Use useSafeAreaInsets().

Properly calculate keyboardVerticalOffset:

It must account for:

SafeArea top inset

Expo Router header height

Keep the ChatInput positioned:
position="absolute"
bottom={insets.bottom}

Ensure ScrollView has enough paddingBottom so content is not hidden behind the floating input.

🚫 Avoid:

Hardcoded random numbers without explanation.

Removing SafeArea logic.

Manual translateY animations.

Output:

Updated ChatLayout implementation only.

Clean, production-level solution.

Explain briefly why the offset value was chosen.

```

### Seventh Prompt:

```

The iOS native keyboard is covering the floating ChatInput.

I need a robust production-level fix.

⚠️ Constraints:

Do NOT use Reanimated for keyboard movement.

Do NOT use third-party keyboard libraries.

Must work correctly on iOS and Android.

Must work with Expo Router header enabled.

Must respect SafeArea.

No magic hardcoded numbers.

🎯 GOAL:
Ensure the floating ChatInput is always fully visible above the iOS keyboard.

✅ REQUIRED IMPLEMENTATION:

Use:
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useHeaderHeight } from '@react-navigation/elements'

Wrap the entire screen in KeyboardAvoidingView.

Set:

behavior={Platform.OS === 'ios' ? 'padding' : 'height'}

Calculate keyboardVerticalOffset dynamically:

const insets = useSafeAreaInsets()
const headerHeight = useHeaderHeight()

keyboardVerticalOffset = headerHeight

(Do NOT manually add arbitrary values)

Keep ChatInput positioned:

position="absolute"
bottom={insets.bottom}

Ensure ScrollView has:

contentContainerStyle={{
paddingBottom: inputHeight + insets.bottom + spacingToken
}}

❗ Important:

The issue must be solved without layout jumping.
The input must smoothly move above the keyboard.

Output:

Updated ChatLayout implementation

Clean explanation of why headerHeight is used

```

### Eighth Prompt:

``` 

I want to refactor my existing Expo + React Native + Tamagui chat screen to achieve a Gemini-style floating input with perfectly smooth keyboard animation.

The current implementation works but feels jumpy because it uses layout-based keyboard handling.

🎯 Goal

Implement a fully fluid, production-level keyboard animation using:

react-native-reanimated

useAnimatedKeyboard

Absolute floating input

No layout jumps

No flickering

No hacks

It must work correctly on iOS and Android.

⚠️ Constraints

Do NOT use KeyboardAvoidingView

Do NOT use manual Keyboard.addListener

Do NOT use setTimeout

Do NOT hardcode keyboard heights

Do NOT introduce third-party keyboard libraries

Must respect SafeArea insets

Must not break existing streaming message behavior

Must not cause unnecessary re-renders

```


### Others prompts 

---

## 1️⃣ Implementing Real-time Streaming (XMLHttpRequest)

We need to refactor our existing `chatService` to support real streaming in React Native (Expo SDK 54) using `XMLHttpRequest`, because `fetch` does not support streaming (`response.body` is undefined in RN).

Important architectural requirement:

- Streaming must be fully encapsulated inside `chatService`
- UI must NOT know about:
  - SSE
  - `text/event-stream`
  - chunk parsing
  - `[DONE]`
  - XMLHttpRequest internals
- UI should only receive callbacks
- Must support real cancellation
- Must work with our existing Vercel SSE backend

Backend behavior:

Header:
Content-Type: text/event-stream

Stream format:

data: token1

data: token2

data: token3

data: [DONE]

Required API:

```ts
sendMessageStream(options: {
  userId: string
  conversationId: string
  message: string
  onToken: (token: string) => void
  onComplete: () => void
  onError: (error: Error) => void
}): { cancel: () => void }
```

Behavioral requirements:

1. Must use `XMLHttpRequest`
2. Must use `xhr.onprogress` to read incremental data
3. Must parse SSE format manually
4. Must handle partial chunk boundaries correctly
5. Must accumulate buffer text safely
6. Must detect `[DONE]`
7. Must call:
   - `onToken(token)` for every token received
   - `onComplete()` when `[DONE]`
   - `onError(error)` if network fails
8. Must support cancellation via `xhr.abort()`
9. If aborted manually:
   - Do NOT call `onError`
   - Do NOT call `onComplete`
   - Silent stop
10. Must preserve:
   - Authorization header
   - API_BASE_URL usage
   - Environment variables

Parsing requirements:

- Maintain an internal buffer string
- Append new `xhr.responseText` delta
- Only process new text since last progress event
- Split by `\n\n`
- For each chunk:
  - Ignore empty lines
  - Remove `"data: "` prefix
  - If value === "[DONE]" → call onComplete()
  - Else call onToken(value)

Error handling:

- If status !== 200 → parse JSON error and call onError
- If xhr.onerror → call onError
- If aborted → silent termination
- Avoid duplicate onComplete calls

Constraints:

Do NOT:
- Use fetch
- Use EventSource
- Use WebSocket
- Expose SSE details to UI
- Return a Promise
- Move logic to UI

Return full production-ready TypeScript implementation of:

```ts
export const chatService = {
  sendMessageStream(...)
}
```

Return only final code.

---

## 2️⃣ FlatList Chat Refactor – Remove `inverted`, Performance First

We need to refactor our Chat screen architecture in React Native (Expo SDK 54) to remove `inverted` from FlatList and implement a clean, document-style chat behavior with streaming.

Performance is the top priority.
No scroll jitter.
No unnecessary re-renders.
No hacks.

Goals:

1. Remove `inverted` from FlatList.
2. Messages must render in chronological ascending order.
3. Messages must grow downward naturally.
4. When user sends a message → auto scroll to end.
5. During AI streaming → DO NOT auto scroll.
6. Streaming must update only the last message efficiently.
7. Avoid excessive FlatList re-renders.
8. Clean and production-ready TypeScript.

FlatList must:

- NOT use `inverted`
- Use `keyExtractor={(item) => item.id}`
- Use `initialNumToRender`
- Use `windowSize`
- Use `removeClippedSubviews` on Android
- Not use `maintainVisibleContentPosition`

Example structure:

```tsx
<FlatList
  ref={flatListRef}
  data={messages}
  keyExtractor={(item) => item.id}
  renderItem={renderItem}
  initialNumToRender={15}
  windowSize={10}
  removeClippedSubviews={Platform.OS === 'android'}
  keyboardShouldPersistTaps="handled"
  contentContainerStyle={{ padding: 16 }}
/>
```

Message ordering:

Messages must be stored as:

```ts
[
  oldestMessage,
  ...
  newestMessage
]
```

New user messages must be appended like:

```ts
setMessages(prev => [...prev, newMessage])
```

NOT:

```ts
[newMessage, ...prev]
```

Scroll behavior rules:

When user sends message:

```ts
flatListRef.current?.scrollToEnd({ animated: true })
```

This is the ONLY automatic scroll allowed.

During AI streaming:

- Do NOT call scrollToEnd
- Do NOT call scrollToOffset
- Do NOT manipulate scroll position
- Respect user scroll position

Streaming update optimization:

```ts
setMessages(prev => {
  const updated = [...prev]
  const lastIndex = updated.length - 1

  updated[lastIndex] = {
    ...updated[lastIndex],
    content: updated[lastIndex].content + token
  }

  return updated
})
```

Performance requirements:

- `renderItem` must be wrapped in `useCallback`
- `MessageBubble` must use `React.memo`
- No inline functions inside render
- No unnecessary state changes
- Avoid triggering FlatList re-render on every token if possible

Return:

1. Full refactored ChatScreen component
2. Proper TypeScript types
3. Optimized renderItem
4. Clean scroll logic
5. No inverted usage
6. No scroll jitter
7. Production-ready code

Return only final code.

---

## 3️⃣ Keyboard Migration – react-native-keyboard-controller

Migrate keyboard handling from `useAnimatedKeyboard` to `react-native-keyboard-controller`.

Requirements:

- Install `react-native-keyboard-controller`
- Ensure native linking via `npx expo prebuild --platform ios`
- Wrap app with `<KeyboardProvider>`
- Replace `useAnimatedKeyboard` with `useReanimatedKeyboardAnimation`
- Use `height` shared value for 60 FPS sync
- Animate input container using `transform: translateY`
- Use Animated spacer inside FlatList instead of manual padding
- Ensure safe area bottom is respected
- No layout jumps
- No manual keyboard height calculations
- No setTimeout hacks
- Must support interactive dismissal on iOS

FlatList must remain optimized:

- removeClippedSubviews
- initialNumToRender
- maxToRenderPerBatch
- windowSize
- No unnecessary renders

Return full updated ChatLayout component with production-ready code.
Return only final code.
