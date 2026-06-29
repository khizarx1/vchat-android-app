/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#0A1F1A',
    background: '#FFFFFF',
    backgroundElement: '#E3F5EE',
    backgroundSelected: '#D2EDE3',
    textSecondary: '#4F6B62',
    // Accent = the bright seagreen we use for unread badges, ticks, active states.
    accent: '#16C79A',
    accentSoft: 'rgba(22, 199, 154, 0.14)',
    onAccent: '#ffffff',
    online: '#1FD18A',
    // A translucent card surface used as the glass fallback on Android/web.
    glassFallback: 'rgba(22, 199, 154, 0.08)',
    separator: 'rgba(20, 80, 65, 0.12)',
  },
  dark: {
    text: '#EAFBF5',
    // A deep seagreen-tinted dark, brighter and warmer than pure black.
    background: '#0B1A16',
    backgroundElement: '#16302A',
    backgroundSelected: '#1F4339',
    textSecondary: '#8FB6AB',
    accent: '#2EE6B6',
    accentSoft: 'rgba(46, 230, 182, 0.18)',
    onAccent: '#06251D',
    online: '#2EE6B6',
    glassFallback: 'rgba(46, 230, 182, 0.12)',
    separator: 'rgba(143, 182, 171, 0.20)',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
