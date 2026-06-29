/**
 * Chat thread screen — a single conversation.
 *
 * Route: app/chat/[id].tsx → reachable at /chat/3. The `[id]` is a route param we
 * read with useLocalSearchParams(). We look up the conversation (for the header)
 * and its messages (for the list), keep the messages in local state, and append
 * to them when you send.
 *
 * The list is `inverted`: it renders from the bottom up, so the newest message
 * sits at the bottom and the view auto-sticks there — exactly how chat feels.
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@/components/chat/avatar';
import { ChatInput } from '@/components/chat/chat-input';
import { MessageBubble } from '@/components/chat/message-bubble';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Icon } from '@/components/ui/icon';
import { Spacing } from '@/constants/theme';
import { CONVERSATIONS } from '@/data/conversations';
import { getMessages } from '@/data/messages';
import { useTheme } from '@/hooks/use-theme';
import type { Message } from '@/types/chat';

export default function ChatScreen() {
  // `name`/`avatar` params are passed by the New Chat screen for people we have
  // no existing conversation with yet.
  const { id, name, avatar } = useLocalSearchParams<{
    id: string;
    name?: string;
    avatar?: string;
  }>();
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const conversation = CONVERSATIONS.find((c) => c.id === id);
  // Prefer the real conversation, then the passed params, then a generic fallback.
  const displayName = conversation?.name ?? name ?? 'Chat';
  const displayAvatar = conversation?.avatarUri ?? (avatar || undefined);

  // Lazy initializer (() => ...) so getMessages runs once, on mount only.
  const [messages, setMessages] = useState<Message[]>(() => getMessages(id));

  // Inverted list wants newest-first; our state is oldest-first, so reverse a copy.
  const data = useMemo(() => [...messages].reverse(), [messages]);

  const handleSend = (text: string) => {
    const newMessage: Message = {
      id: `local-${Date.now()}`,
      text,
      sentByMe: true,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  // Open the call screen in the chosen mode, passing the contact's info along.
  const startCall = (mode: 'voice' | 'video') =>
    router.push({
      pathname: '/call/[id]',
      params: { id, name: displayName, avatar: displayAvatar ?? '', mode },
    });

  // Tapping the header opens the contact's profile (passing name/avatar through).
  const openProfile = () =>
    router.push({
      pathname: '/contact/[id]',
      params: { id, name: displayName, avatar: displayAvatar ?? '' },
    });

  return (
    <ThemedView style={styles.screen}>
      {/* Custom header (this screen has no native nav header). */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + Spacing.one, borderBottomColor: theme.separator },
        ]}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backBtn}>
          <Icon name="chevron-back" color={theme.accent} size={24} />
        </Pressable>

        <Pressable onPress={openProfile} style={styles.headerProfile}>
          <Avatar
            name={displayName}
            uri={displayAvatar}
            online={conversation?.isOnline}
            size={38}
          />

          <View style={styles.headerText}>
            <ThemedText style={styles.headerName} numberOfLines={1}>
              {displayName}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {conversation?.isOnline ? 'Online' : 'Offline'}
            </ThemedText>
          </View>
        </Pressable>

        <View style={styles.headerActions}>
          <Pressable hitSlop={6} onPress={() => startCall('video')} style={styles.iconBtn}>
            <Icon name="videocam-outline" color={theme.accent} size={24} />
          </Pressable>
          <Pressable hitSlop={6} onPress={() => startCall('voice')} style={styles.iconBtn}>
            <Icon name="call-outline" color={theme.accent} size={22} />
          </Pressable>
        </View>
      </View>

      {/* KAV lifts the input bar above the keyboard. */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}>
        <FlatList
          data={data}
          inverted
          style={styles.flex}
          keyExtractor={(m) => m.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          contentContainerStyle={[styles.listContent, { flexGrow: 1 }]}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="interactive"
        />

        <ChatInput onSend={handleSend} bottomInset={insets.bottom} />
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  headerProfile: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  headerText: { flex: 1 },
  headerName: { fontWeight: '700', fontSize: 16 },
  listContent: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
});
