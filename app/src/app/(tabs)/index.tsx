/**
 * Home screen — the conversation list.
 *
 * Coming from React, the big new idea here is <FlatList>: instead of `.map()`-ing
 * an array into JSX (which renders everything at once), FlatList virtualizes the
 * list — it only mounts the rows near the viewport. That's how chat apps stay
 * smooth with thousands of conversations. You give it `data`, a `renderItem`, and
 * a `keyExtractor` (React Native's equivalent of React's `key`).
 */

import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ConversationRow } from '@/components/chat/conversation-row';
import { GlassSurface } from '@/components/glass-surface';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Icon } from '@/components/ui/icon';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { CONVERSATIONS } from '@/data/conversations';
import { useTheme } from '@/hooks/use-theme';
import type { Conversation } from '@/types/chat';

export default function HomeScreen() {
  const theme = useTheme();
  const safeAreaInsets = useSafeAreaInsets();
  const router = useRouter();

  // `useState` is identical to React-on-the-web. `query` holds the search text.
  const [query, setQuery] = useState('');

  // `useMemo` recomputes the filtered list only when the query (or data) changes,
  // not on every render — a good habit for derived data.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CONVERSATIONS;
    return CONVERSATIONS.filter(
      (c) => c.name.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q),
    );
  }, [query]);

  // Navigate to the chat thread for this conversation. With typed routes, dynamic
  // routes use the object form: the pathname names the file, params fill the [id].
  const handleOpenConversation = (conversation: Conversation) => {
    router.push({ pathname: '/chat/[id]', params: { id: conversation.id } });
  };

  return (
    <ThemedView style={styles.screen}>
      {/*
       * FIXED HEADER. Because this <View> is a SIBLING of the FlatList (not inside
       * it), it never scrolls. The safe-area top padding moved here from the list,
       * since this is now the topmost thing on screen.
       */}
      <View style={[styles.header, { paddingTop: safeAreaInsets.top + Spacing.two }]}>
        <View style={styles.titleRow}>
          <ThemedText type="title">Messages</ThemedText>
          {/* Top-right: compose a new chat (the "+" button). */}
          <Pressable
            onPress={() => router.push({ pathname: '/new-chat' })}
            style={({ pressed }) => [styles.headerButton, pressed && styles.pressed]}>
            <Icon name="add" color={theme.accent} size={50} />
          </Pressable>
        </View>

        {/* Glass search pill with live filtering. */}
        <GlassSurface style={styles.searchBar}>
          <Icon name="search" color={theme.textSecondary} size={18} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search"
            placeholderTextColor={theme.textSecondary}
            style={[styles.searchInput, { color: theme.text }]}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </GlassSurface>
      </View>

      {/* SCROLLING LIST. flex:1 makes it fill the space left under the header. */}
      <FlatList
        style={styles.list}
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ConversationRow conversation={item} onPress={handleOpenConversation} />
        )}
        // Space between rows without putting margins on the rows themselves.
        ItemSeparatorComponent={() => <View style={{ height: Spacing.two }} />}
        // Padding lives on the content, so the scroll indicator still reaches the edges.
        contentContainerStyle={[
          styles.listContent,
          {
            paddingTop: Spacing.two,
            paddingBottom: safeAreaInsets.bottom + BottomTabInset + Spacing.two,
          },
        ]}
        // Shown when the search filters everything out.
        ListEmptyComponent={
          <View style={styles.empty}>
            <ThemedText themeColor="textSecondary">No conversations found</ThemedText>
          </View>
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />

      {/*
       * FLOATING AI CHAT BUTTON (FAB).
       * position:'absolute' takes it OUT of the normal column flow and pins it to
       * the parent's edges (right + bottom). Being the LAST child, it paints on top
       * of the list. The `bottom` value lifts it above the safe area + tab bar.
       */}
      <Pressable
        onPress={() => router.push({ pathname: '/chat/ai' })}
        style={({ pressed }) => [
          styles.fab,
          {
            backgroundColor: theme.accent,
            bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.one,
          },
          pressed && styles.fabPressed,
        ]}>
        <Icon name="sparkles" color={theme.onAccent} size={26} />
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  // flex:1 = "fill the leftover height under the fixed header, then scroll inside it".
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.three,
    gap: 0,
    // Center the list on wide (web/tablet) screens, matching the project's pattern.
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  header: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
    // Match the list's centering on wide (web/tablet) screens.
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fab: {
    position: 'absolute',
    bottom: 0,
    right: Spacing.four,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    // Drop shadow so it floats above the list (iOS shadow* + Android elevation).
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  fabPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    // Android adds default vertical padding to TextInput; remove it for alignment.
    paddingVertical: Platform.OS === 'android' ? 0 : 4,
  },
  pressed: {
    opacity: 0.6,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: Spacing.six,
  },
});
