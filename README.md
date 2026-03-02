# AI Chat Challenge - High-Performance Streaming Mobile Interface

This project is a production-grade AI chat application built with Expo and Vercel. It implements real-time token-by-token streaming, persistent conversation history using Redis, and a fluid, Gemini-inspired mobile UI.

## Tech Stack Summary

- **Frontend**: Expo SDK 54, React Native, Tamagui UI, React Native Reanimated, React Native Keyboard Controller.
- **Backend**: Vercel Serverless Functions (Node.js), @google-cloud/vertexai, @upstash/redis.
- **Infrastructure**: Vercel (Deployment), Google Cloud Vertex AI (LLM), Upstash (Redis).

## Security Notes

- **Secrets Handling**: Never commit `.env` files or Service Account JSON files. These are ignored via `.gitignore`.
- **Authentication**: Communication between frontend and backend is secured via a `Bearer` token (`APP_SECRET`).
- **Client-Side Safety**: Only variables prefixed with `EXPO_PUBLIC_` are accessible in the frontend. Ensure no sensitive cloud credentials use this prefix.
- **Backend Security**: The backend validates the `APP_SECRET` before processing any Vertex AI or Redis requests.
- **Private Key Format**: The `VERTEX_PRIVATE_KEY` must be provided with escaped newlines (e.g., `\\n`) for proper parsing in the Node environment.

## Prerequisites

- **Node.js**: Version 18.x or higher.
- **Package Manager**: npm (standard) or yarn.
- **Expo CLI**: `npm install -g expo-cli`
- **Vercel CLI**: `npm install -g vercel` (for backend development).
- **Google Cloud**: A project with Vertex AI API enabled and a Service Account with "Vertex AI User" permissions.
- **Upstash**: A Redis database instance.

## Installation Steps

1. Clone the repository.
2. Install root and frontend dependencies:
   ```bash
   npm install
   ```
3. Install backend dependencies:
   ```bash
   cd backend && npm install
   ```

## Environment Variable Setup

### Frontend (`/`)
Create a `.env.local` or `.env` file in the root directory:
```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
EXPO_PUBLIC_APP_SECRET=your_generated_secret_string
```

### Backend (`/backend`)
Create a `.env` file in the `backend/` directory:
```env
VERTEX_PROJECT_ID=your-project-id
VERTEX_CLIENT_EMAIL=your-service-account-email
VERTEX_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
APP_SECRET=your_generated_secret_string
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

## Development Commands

### Start Backend
From the `backend/` directory:
```bash
npx vercel dev
```

### Start Frontend
From the root directory:
```bash
npx expo start
```

## iOS / Android / Web Instructions

- **Native Platforms**: This project uses native modules (`react-native-keyboard-controller`). You must use a Development Client.
- **Prebuild**: Run `npx expo prebuild` to generate the `ios` and `android` directories before building locally.
- **Web**: Run `npx expo start --web` (Ensure Tamagui web setup is finalized).

## Production Build Instructions

1. **Backend**: Deploy to Vercel using `vercel deploy`. Ensure all environment variables are set in the Vercel dashboard.
2. **Frontend**: Use Expo Application Services (EAS).
   ```bash
   eas build --platform ios
   eas build --platform android
   ```

## Native Module Warnings

- **Keyboard Controller**: This project relies on `react-native-keyboard-controller` for 60 FPS synchronized keyboard animations. This will NOT work in Expo Go. You MUST use `npx expo run:ios` or `npx expo run:android` after prebuild.

## Security Best Practices

- **Token Rotation**: Rotate `APP_SECRET` periodically.
- **Least Privilege**: Ensure the Vertex AI Service Account only has the necessary permissions.
- **Auditing**: Run `npm audit` regularly in both root and backend directories.
- **Lockfile**: Always commit `package-lock.json` to ensure dependency integrity across environments.

## Common Setup Mistakes

- **Private Key Newlines**: If you get a "PEM_read_bio_PrivateKey" error, ensure your `VERTEX_PRIVATE_KEY` handles newlines correctly.
- **CORS**: If the frontend cannot reach the backend in production, check Vercel's `vercel.json` and CORS settings.
- **Redis Connection**: Ensure the Upstash Redis URL is the REST URL, not the TCP URL.

## Deployment Considerations

- **Serverless Timeouts**: The backend is configured with a 30s timeout (`maxDuration`). For very long AI responses, consider optimizing context window size or usage patterns.
- **Edge vs Node**: This backend uses the Node.js runtime for compatibility with Google Cloud SDKs. Do not switch to Edge runtime without verifying SDK support.

-------------------------------


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

### Ninth Prompt:

```

# README Generation Prompt – Security-Aware Version (Edit Existing File)

Perform a complete repository analysis before making any changes.

You must inspect:

- package.json
- app.json
- expo configuration
- tamagui.config.ts
- babel.config.js
- metro.config.js
- tsconfig files
- Any native modules (e.g. keyboard controller)
- Any prebuild requirements
- Environment variable usage
- API integrations
- Scripts
- Lock files
- Any production build configuration
- Any references to secrets, tokens, or external services

Understand fully:

- Whether the project uses Expo Go or Dev Client
- If `expo prebuild` is required
- If native modules require rebuild
- Required Node version
- Required package manager (npm / yarn / bun)
- If .env is required
- If backend must run separately
- If production build differs from development

---

## GOAL

Edit the existing `README.md` file.

Insert a new section at the VERY TOP of the file.

Do NOT remove any existing content.
Do NOT rewrite existing content.
Only prepend the new documentation before everything else.

---

## The new README section must include:

1. Project Overview (short, technical)
2. Tech Stack Summary
3. Security Notes (important)
4. Prerequisites (Node version, package manager, Expo CLI, etc.)
5. Installation Steps
6. Environment Variable Setup
7. Development Commands
8. iOS / Android / Web instructions
9. Production Build Instructions
10. Native Module Warnings (if prebuild required)
11. Security Best Practices
12. Common Setup Mistakes
13. Deployment Considerations (if applicable)

---

## SECURITY REQUIREMENTS

The README must:

- Clearly state that no secrets should be committed
- Instruct developers to use `.env` properly
- Mention safe handling of API keys
- Warn about exposing tokens in client-side code
- Clarify if backend must protect sensitive keys
- Mention that production builds should use secure environment configs
- Mention dependency auditing (npm audit / bun audit)
- Mention lockfile integrity
- Avoid recommending `--force` unless strictly necessary
- Avoid insecure setup shortcuts

If any insecure pattern is detected in the repository,
briefly document it under a “Security Notes” section.

---

## Formatting Requirements

- Professional tone
- No emojis
- Clean markdown
- Clear step-by-step instructions
- No internal architecture explanations
- No unnecessary verbosity
- Assume intermediate developer audience
- Production-ready quality

---

## Output Requirements

Return:

The FULL updated README.md content,
including:

1. The new security-aware section at the top
2. The original README content preserved below

Do not explain your reasoning.
Do not describe analysis.
Return only the final README.md content.

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
