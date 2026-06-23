/**
 * Avatar — shows a profile photo, or colored initials when there's no photo.
 *
 * A great example of a small, reusable "leaf" component: it knows nothing about
 * conversations or screens. Give it a name (and optionally an image), and it
 * renders a circle. We'll reuse this exact component in the chat header later.
 */

import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type AvatarProps = {
  name: string;
  uri?: string;
  size?: number;
  /** Shows a green "online" dot in the corner when true. */
  online?: boolean;
};

// A bright palette for the initials fallback, anchored around seagreen.
const PALETTE = ['#16C79A', '#2EE6B6', '#20BFA0', '#34C7C7', '#4DD18A', '#3BAFDA', '#5AC8A8'];

/** Take the first letters of the first two words: "Sarah Chen" → "SC". */
function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
}

/** Deterministically pick a palette color from the name (same name → same color). */
function colorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export function Avatar({ name, uri, size = 56, online = false }: AvatarProps) {
  const theme = useTheme();
  const radius = size / 2;
  const dotSize = Math.max(12, size * 0.26);

  return (
    <View style={{ width: size, height: size }}>
      {uri ? (
        <Image
          source={uri}
          style={{ width: size, height: size, borderRadius: radius }}
          contentFit="cover"
          transition={250}
        />
      ) : (
        <View
          style={[
            styles.initialsCircle,
            { width: size, height: size, borderRadius: radius, backgroundColor: colorFromName(name) },
          ]}>
          <Text style={[styles.initialsText, { fontSize: size * 0.38 }]}>{getInitials(name)}</Text>
        </View>
      )}

      {online && (
        <View
          style={[
            styles.onlineDot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: theme.online,
              // A ring in the background color makes the dot "pop" off the avatar.
              borderColor: theme.background,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  initialsCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  onlineDot: {
    position: 'absolute',
    right: -1,
    bottom: -1,
    borderWidth: 2,
  },
});
