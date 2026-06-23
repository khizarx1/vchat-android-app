/**
 * New Chat — a modal contact picker (opened by the "+" on the home screen).
 *
 * Teaches: a FlatList with a ListHeaderComponent (the "New Group / New Contact"
 * actions scroll with the list), filtering + sorting derived data with useMemo,
 * and — the key bit — navigating to the chat thread with `router.replace` while
 * passing the contact's name/avatar as route PARAMS, so the chat header is correct
 * even for someone you've never messaged before.
 */

import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@/components/chat/avatar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Icon } from '@/components/ui/icon';
import { Spacing } from '@/constants/theme';
import { CONTACTS } from '@/data/contacts';
import { useTheme } from '@/hooks/use-theme';
import type { Contact } from '@/types/chat';

export default function NewChatScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  // Sort alphabetically, then filter by the search query.
  const contacts = useMemo(() => {
    const sorted = [...CONTACTS].sort((a, b) => a.name.localeCompare(b.name));
    const q = query.trim().toLowerCase();
    return q ? sorted.filter((c) => c.name.toLowerCase().includes(q)) : sorted;
  }, [query]);

  const openChatWith = (contact: Contact) => {
    // `replace` (not push) so this modal is swapped OUT for the chat — going back
    // from the chat returns home, not to this picker. We pass name/avatar as
    // params so the chat header shows them immediately.
    router.replace({
      pathname: '/chat/[id]',
      params: { id: contact.id, name: contact.name, avatar: contact.avatarUri ?? '' },
    });
  };

  return (
    <ThemedView style={styles.screen}>
      {/* Top bar (this is a headerless modal). */}
      <View style={[styles.topBar, { paddingTop: insets.top + Spacing.two }]}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <ThemedText themeColor="textSecondary">Cancel</ThemedText>
        </Pressable>
        <ThemedText style={styles.topTitle}>New Chat</ThemedText>
        {/* Spacer balances the "Cancel" width so the title stays centered. */}
        <View style={styles.spacer} />
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <View style={[styles.searchBar, { backgroundColor: theme.backgroundElement }]}>
          <Icon name="search" color={theme.textSecondary} size={18} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search contacts"
            placeholderTextColor={theme.textSecondary}
            style={[styles.searchInput, { color: theme.text }]}
            autoCorrect={false}
          />
        </View>
      </View>

      <FlatList
        data={contacts}
        keyExtractor={(c) => c.id}
        ListHeaderComponent={<QuickActions />}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => openChatWith(item)}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
            <Avatar name={item.name} uri={item.avatarUri} size={48} />
            <View style={styles.rowText}>
              <ThemedText style={styles.name} numberOfLines={1}>
                {item.name}
              </ThemedText>
              {item.about ? (
                <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
                  {item.about}
                </ThemedText>
              ) : null}
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <ThemedText themeColor="textSecondary">No contacts found</ThemedText>
          </View>
        }
        contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.four }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

/** The two action rows + section label that sit above the contact list. */
function QuickActions() {
  const theme = useTheme();
  const soon = (label: string) => () => Alert.alert(label, 'Coming soon.');

  return (
    <View style={styles.actions}>
      <Pressable onPress={soon('New Group')} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
        <View style={[styles.actionIcon, { backgroundColor: theme.accent }]}>
          <Icon name="people" color={theme.onAccent} size={22} />
        </View>
        <ThemedText style={styles.name}>New Group</ThemedText>
      </Pressable>

      <Pressable onPress={soon('New Contact')} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
        <View style={[styles.actionIcon, { backgroundColor: theme.accent }]}>
          <Icon name="person-add" color={theme.onAccent} size={20} />
        </View>
        <ThemedText style={styles.name}>New Contact</ThemedText>
      </Pressable>

      <ThemedText type="small" themeColor="textSecondary" style={styles.sectionLabel}>
        CONTACTS
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two,
  },
  topTitle: { fontWeight: '700', fontSize: 16 },
  spacer: { width: 50 },
  searchWrap: { paddingHorizontal: Spacing.three, paddingBottom: Spacing.two },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    height: 44,
    borderRadius: 22,
  },
  searchInput: { flex: 1, fontSize: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  rowText: { flex: 1, gap: 1 },
  name: { fontWeight: '600', fontSize: 16 },
  pressed: { opacity: 0.6 },
  actions: { paddingBottom: Spacing.one },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabel: {
    marginTop: Spacing.three,
    marginBottom: Spacing.one,
    marginLeft: Spacing.four,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  empty: { alignItems: 'center', paddingVertical: Spacing.six },
});
