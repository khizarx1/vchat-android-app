/**
 * Icon — the app's single icon component.
 *
 * Wraps Ionicons (@expo/vector-icons), which renders an identical, properly
 * centered glyph on iOS, Android and web — unlike expo-symbols, whose Android/web
 * fallback can't be centered. Because every screen imports THIS, swapping icon
 * libraries later would be a one-file change.
 *
 * Browse icon names at https://icons.expo.fyi (pick the "Ionicons" set).
 */

import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import type { StyleProp, TextStyle } from 'react-native';

/** All valid Ionicons names — gives you autocomplete + compile-time checking. */
export type IconName = ComponentProps<typeof Ionicons>['name'];

type IconProps = {
  name: IconName;
  size?: number;
  color: string;
  /** Optional style (e.g. a transform to rotate the glyph). */
  style?: StyleProp<TextStyle>;
};

export function Icon({ name, size = 24, color, style }: IconProps) {
  return <Ionicons name={name} size={size} color={color} style={style} />;
}
