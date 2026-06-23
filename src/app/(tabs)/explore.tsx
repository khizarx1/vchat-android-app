/**
 * Profile / Settings screen (the second tab).
 *
 * Demonstrates: a scrollable settings layout built from grouped "cards", a
 * reusable SettingsRow, native Alert dialogs, and navigating to a modal route
 * (/edit-profile) that edits data living in the auth context.
 */

import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@/components/chat/avatar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Icon } from '@/components/ui/icon';
import { SettingsRow } from '@/components/ui/settings-row';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth';
import { useTheme } from '@/hooks/use-theme';

const comingSoon = () => Alert.alert('Coming soon', 'This screen is not built yet.');
const changePhoto = () => Alert.alert('Change photo', 'Photo upload is coming soon.');

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();
  const { user, signOut } = useAuth();

  // Native confirmation dialog before a destructive action.
  const confirmLogout = () =>
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: signOut },
    ]);

  const goEdit = () => router.push('/edit-profile');

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + Spacing.five,
            paddingBottom: insets.bottom + BottomTabInset + Spacing.five,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        {/* Header: avatar with a camera badge, name, about line */}
        <View style={styles.header}>
          <Pressable onPress={changePhoto}>
            <Avatar name={user?.name ?? 'You'} uri={user?.avatarUri} size={92} />
            <View
              style={[
                styles.cameraBadge,
                { backgroundColor: theme.accent, borderColor: theme.background },
              ]}>
              <Icon name="camera" color={theme.onAccent} size={13} />
            </View>
          </Pressable>
          <ThemedText type="subtitle">{user?.name ?? 'You'}</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.about}>
            {user?.about ?? ''}
          </ThemedText>
        </View>

        {/* Account */}
        <Card title="Account" surface={theme.backgroundElement}>
          <SettingsRow
            icon="person-outline"
            label="Name"
            value={user?.name}
            onPress={goEdit}
          />
          <Divider color={theme.separator} />
          <SettingsRow
            icon="mail-outline"
            label="Email"
            value={user?.email}
            onPress={goEdit}
          />
          <Divider color={theme.separator} />
          <SettingsRow
            icon="call-outline"
            label="Phone"
            value={user?.phone || 'Add'}
            onPress={goEdit}
          />
        </Card>

        {/* Preferences */}
        <Card title="Preferences" surface={theme.backgroundElement}>
          <SettingsRow
            icon="notifications-outline"
            label="Notifications"
            onPress={comingSoon}
          />
          <Divider color={theme.separator} />
          <SettingsRow
            icon="lock-closed-outline"
            label="Privacy"
            onPress={comingSoon}
          />
          <Divider color={theme.separator} />
          <SettingsRow
            icon="color-palette-outline"
            label="Appearance"
            onPress={comingSoon}
          />
        </Card>

        {/* Support */}
        <Card title="Support" surface={theme.backgroundElement}>
          <SettingsRow
            icon="help-circle-outline"
            label="Help"
            onPress={comingSoon}
          />
          <Divider color={theme.separator} />
          <SettingsRow
            icon="information-circle-outline"
            label="About vchat"
            value="v1.0.0"
            showChevron={false}
            onPress={comingSoon}
          />
        </Card>

        {/* Log out */}
        <Card surface={theme.backgroundElement}>
          <SettingsRow
            icon="log-out-outline"
            label="Log out"
            destructive
            showChevron={false}
            onPress={confirmLogout}
          />
        </Card>
      </ScrollView>
    </ThemedView>
  );
}

/** A titled, rounded group of rows (the iOS "inset grouped" look). */
function Card({
  title,
  surface,
  children,
}: {
  title?: string;
  surface: string;
  children: ReactNode;
}) {
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

/** A hairline separator, inset so it starts under the label (not the icon). */
function Divider({ color }: { color: string }) {
  return <View style={[styles.divider, { backgroundColor: color }]} />;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.three,
    gap: Spacing.four,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  header: { alignItems: 'center', gap: Spacing.two },
  about: { textAlign: 'center' },
  cameraBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardWrap: { gap: Spacing.one },
  cardTitle: { marginLeft: Spacing.three, fontWeight: '700', letterSpacing: 0.5 },
  card: { borderRadius: 18, overflow: 'hidden' },
  divider: { height: StyleSheet.hairlineWidth, marginLeft: 66 },
});
