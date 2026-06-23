/**
 * ConversationRow — a single row in the chat list.
 *
 * This is a "presentational" component: it receives one `Conversation` plus an
 * `onPress` callback and renders it. It holds no state and fetches no data. That
 * makes it easy to reason about and reuse, and lets the *screen* own behavior
 * like navigation.
 */

import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/chat/avatar';
import { GlassSurface } from '@/components/glass-surface';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Conversation } from '@/types/chat';
import { formatConversationTime } from '@/utils/time';

type ConversationRowProps = {
  conversation: Conversation;
  onPress: (conversation: Conversation) => void;
};

function ConversationRowComponent({ conversation, onPress }: ConversationRowProps) {
  const theme = useTheme();
  const { name, avatarUri, lastMessage, lastMessageAt, unreadCount, isOnline, sentByMe, deliveryStatus } =
    conversation;

  const hasUnread = unreadCount > 0;

  return (
    <Pressable
      onPress={() => onPress(conversation)}
      // The function form of `style` lets us react to the pressed state —
      // a tiny opacity dip gives that satisfying "tap" feel.
      style={({ pressed }) => [styles.pressable, styles.shadow, pressed && styles.pressed]}>
      <GlassSurface style={[styles.card, { backgroundColor: hasUnread ? theme.accentSoft : '#FFFFFF' }]}> 
        <Avatar name={name} uri={avatarUri} online={isOnline} size={56} />

        <View style={styles.body}>
          {/* Top line: name on the left, timestamp on the right. */}
          <View style={styles.topLine}>
            <ThemedText type="default" style={styles.name} numberOfLines={1}>
              {name}
            </ThemedText>
            <ThemedText
              type="small"
              themeColor="textSecondary"
              style={[styles.time, hasUnread && { color: theme.accent }]}>
              {formatConversationTime(lastMessageAt)}
            </ThemedText>
          </View>

          {/* Bottom line: last-message preview on the left, unread badge on the right. */}
          <View style={styles.bottomLine}>
            <View style={styles.previewWrap}>
              {sentByMe && (
                <ThemedText
                  type="small"
                  style={{
                    color: deliveryStatus === 'read' ? theme.accent : theme.textSecondary,
                  }}>
                  {'✓✓ '}
                </ThemedText>
              )}
              <ThemedText
                type="small"
                themeColor="textSecondary"
                numberOfLines={1}
                style={styles.preview}>
                {lastMessage}
              </ThemedText>
            </View>

            {hasUnread && (
              <View style={[styles.badge, { backgroundColor: theme.accent }]}>
                <ThemedText type="small" style={[styles.badgeText, { color: theme.onAccent }]}>
                  {unreadCount}
                </ThemedText>
              </View>
            )}
          </View>
        </View>
      </GlassSurface>
    </Pressable>
  );
}

/**
 * `memo` skips re-rendering a row when its props haven't changed. In a long list
 * that scrolls and filters, this keeps things smooth — a real-world list habit.
 */
export const ConversationRow = memo(ConversationRowComponent);

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 22,
    // On iOS the glass material is clipped to this radius via the card below.
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.985 }],
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: 22,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E5',
    // `overflow: hidden` keeps the glass + children inside the rounded corners.
    overflow: 'hidden',
  },
  shadow: {
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 3 },
    elevation: 0,
  },
  body: {
    flex: 1,
    gap: Spacing.half,
  },
  topLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  name: {
    flex: 1,
    fontWeight: '700',
  },
  time: {
    fontWeight: '600',
  },
  bottomLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  previewWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  preview: {
    flex: 1,
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontWeight: '700',
    fontSize: 12,
    lineHeight: 16,
  },
});
