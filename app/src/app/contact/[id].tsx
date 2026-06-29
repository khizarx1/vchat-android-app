/**
 * Contact profile — the "Contact Info" screen for the person you're chatting with.
 *
 * Route: app/contact/[id].tsx. Opened by tapping the chat header. It looks the
 * person up in CONTACTS / CONVERSATIONS (falling back to the passed name/avatar
 * params), then shows a hero, quick-action buttons, an About card, and option
 * rows. Almost everything is a "coming soon" stub for now — this is the scaffold.
 */

import { useLocalSearchParams, useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@/components/chat/avatar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Icon, type IconName } from '@/components/ui/icon';
import { SettingsRow } from '@/components/ui/settings-row';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { CONTACTS } from '@/data/contacts';
import { CONVERSATIONS } from '@/data/conversations';
import { useTheme } from '@/hooks/use-theme';

const soon = (label: string) => () => Alert.alert(label, 'Coming soon.');

export default function ContactProfileScreen() {
  const { id, name, avatar } = useLocalSearchParams<{
    id: string;
    name?: string;
    avatar?: string;
  }>();
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const contact = CONTACTS.find((c) => c.id === id);
  const conversation = CONVERSATIONS.find((c) => c.id === id);

  const displayName = contact?.name ?? conversation?.name ?? name ?? 'Contact';
  const displayAvatar = contact?.avatarUri ?? conversation?.avatarUri ?? (avatar || undefined);
  const about = contact?.about ?? 'Hey there! I am using vchat.';
  const isOnline = conversation?.isOnline;

  const startCall = (mode: 'voice' | 'video') =>
    router.push({
      pathname: '/call/[id]',
      params: { id, name: displayName, avatar: displayAvatar ?? '', mode },
    });

  const confirmBlock = () =>
    Alert.alert(`Block ${displayName}?`, 'Blocked contacts can no longer call you or message you.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Block', style: 'destructive', onPress: () => {} },
    ]);

  return (
    <ThemedView style={styles.screen}>
      {/* Top bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + Spacing.one }]}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.iconBtn}>
          <Icon name="chevron-back" color={theme.accent} size={24} />
        </Pressable>
        <Pressable hitSlop={10} onPress={soon('Edit contact')} style={styles.iconBtn}>
          <Icon name="create-outline" color={theme.accent} size={22} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.five }]}
        showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <Avatar name={displayName} uri={displayAvatar} size={112} online={isOnline} />
          <ThemedText type="subtitle" style={styles.center}>
            {displayName}
          </ThemedText>
          <ThemedText themeColor="textSecondary">
            {isOnline ? 'Online' : 'Last seen recently'}
          </ThemedText>
        </View>

        {/* Quick actions */}
        <View style={styles.quickRow}>
          <QuickAction icon="call" label="Call" onPress={() => startCall('voice')} accent={theme.accent} soft={theme.accentSoft} />
          <QuickAction icon="videocam" label="Video" onPress={() => startCall('video')} accent={theme.accent} soft={theme.accentSoft} />
          <QuickAction icon="search" label="Search" onPress={soon('Search in chat')} accent={theme.accent} soft={theme.accentSoft} />
          <QuickAction icon="notifications-off" label="Mute" onPress={soon('Mute')} accent={theme.accent} soft={theme.accentSoft} />
        </View>

        {/* About */}
        <Card title="About" surface={theme.backgroundElement}>
          <View style={styles.aboutBox}>
            <ThemedText>{about}</ThemedText>
          </View>
        </Card>

        {/* Options */}
        <Card surface={theme.backgroundElement}>
          <SettingsRow icon="star-outline" label="Starred messages" onPress={soon('Starred messages')} />
          <Divider color={theme.separator} />
          <SettingsRow icon="images-outline" label="Media, links & docs" value="0" onPress={soon('Media')} />
          <Divider color={theme.separator} />
          <SettingsRow icon="notifications-outline" label="Mute notifications" onPress={soon('Mute notifications')} />
        </Card>

        {/* Danger zone */}
        <Card surface={theme.backgroundElement}>
          <SettingsRow icon="ban-outline" label={`Block ${displayName}`} destructive showChevron={false} onPress={confirmBlock} />
          <Divider color={theme.separator} />
          <SettingsRow icon="alert-circle-outline" label={`Report ${displayName}`} destructive showChevron={false} onPress={soon('Report')} />
        </Card>
      </ScrollView>
    </ThemedView>
  );
}

/** A circular accent button with a label (Call / Video / Search / Mute). */
function QuickAction({
  icon,
  label,
  onPress,
  accent,
  soft,
}: {
  icon: IconName;
  label: string;
  onPress: () => void;
  accent: string;
  soft: string;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.quickAction, pressed && styles.pressed]}>
      <View style={[styles.quickIcon, { backgroundColor: soft }]}>
        <Icon name={icon} color={accent} size={24} />
      </View>
      <ThemedText type="small" style={{ color: accent }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

/** Titled, rounded group of rows (reused pattern from the profile screen). */
function Card({ title, surface, children }: { title?: string; surface: string; children: ReactNode }) {
  return (
    <View style={styles.cardWrap}>
      {title ? (
        <ThemedText type="small" themeColor="textSecondary" style={styles.cardTitle}>
          {title.toUpperCase()}
        </ThemedText>
      ) : null}
      <View style={[styles.card, { backgroundColor: surface }]}>{children}</View>
    </View>
  );
}

function Divider({ color }: { color: string }) {
  return <View style={[styles.divider, { backgroundColor: color }]} />;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.one,
  },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  content: {
    paddingHorizontal: Spacing.three,
    gap: Spacing.four,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  hero: { alignItems: 'center', gap: Spacing.one, paddingTop: Spacing.two },
  center: { textAlign: 'center' },
  quickRow: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.four },
  quickAction: { alignItems: 'center', gap: Spacing.one },
  quickIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.6 },
  aboutBox: { paddingHorizontal: Spacing.three, paddingVertical: Spacing.three },
  cardWrap: { gap: Spacing.one },
  cardTitle: { marginLeft: Spacing.three, fontWeight: '700', letterSpacing: 0.5 },
  card: { borderRadius: 18, overflow: 'hidden' },
  divider: { height: StyleSheet.hairlineWidth, marginLeft: 66 },
});
