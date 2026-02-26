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


