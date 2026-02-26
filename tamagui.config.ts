import { defaultConfig } from '@tamagui/config/v5'
import { createTamagui } from 'tamagui'

export const config = createTamagui({
  ...defaultConfig,
  tokens: {
    ...defaultConfig.tokens,
    space: {
      ...defaultConfig.tokens.space,
      1: 4,
      2: 8,
      3: 12,
      4: 16,
      5: 24,
      6: 32,
      7: 48,
      8: 64,
      9: 96,
      10: 128,
    },
    radius: {
      ...defaultConfig.tokens.radius,
      sm: 4,
      md: 8,
      lg: 12,
      xl: 16,
      full: 9999,
    },
  },
  media: {
    ...defaultConfig.media,
    sm: { maxWidth: 660 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1536 },
  },
  themes: {
    ...defaultConfig.themes,
    light: {
      ...defaultConfig.themes.light,
      background: '#f7f7f6',
      color: '#2d2c2c',
      borderColor: '#e8e7e5',
      surface1: '#fcfcfb',
      surface2: '#f2f1ef',
    },
    dark: {
      ...defaultConfig.themes.dark,
      background: '#1a1a1a',
      color: '#f0f0f0',
      borderColor: '#333333',
      surface1: '#222222',
      surface2: '#2a2a2a',
    },
  },
})

export default config

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
