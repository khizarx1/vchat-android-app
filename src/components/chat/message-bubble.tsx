/**
 * MessageBubble — one chat bubble.
 *
 * Same component for both sides; the `sentByMe` flag drives everything: which
 * side it sits on, the bubble color (seagreen accent vs. neutral surface), and
 * the text color. One "tail" corner is squared off for that classic chat look.
 */

import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Message } from '@/types/chat';

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function MessageBubbleComponent({ message }: { message: Message }) {
  const theme = useTheme();
  const mine = message.sentByMe;

  return (
    <View style={[styles.row, { justifyContent: mine ? 'flex-end' : 'flex-start' }]}>
      <View
        style={[
          styles.bubble,
          mine
            ? { backgroundColor: theme.accent, borderBottomRightRadius: 4 }
            : { backgroundColor: theme.backgroundElement, borderBottomLeftRadius: 4 },
        ]}>
        <ThemedText style={{ color: mine ? theme.onAccent : theme.text }}>
          {message.text}
        </ThemedText>
        <ThemedText
          type="small"
          style={[styles.time, { color: mine ? theme.onAccent : theme.textSecondary }]}>
          {formatTime(message.createdAt)}
        </ThemedText>
      </View>
    </View>
  );
}

export const MessageBubble = memo(MessageBubbleComponent);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginVertical: 3,
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 20,
  },
  time: {
    alignSelf: 'flex-end',
    fontSize: 11,
    marginTop: 2,
    opacity: 0.7,
  },
});
