/**
 * Edit Profile — a modal screen (presented from the Profile screen).
 *
 * It seeds local state from the current user, lets you edit, and on Save calls
 * `updateProfile(...)` in the auth context, then `router.back()` to dismiss the
 * modal. Because the Profile screen reads the SAME context, your edits appear
 * there instantly — that's the value of a single source of truth.
 */

import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@/components/chat/avatar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TextField } from '@/components/ui/text-field';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth';
import { useTheme } from '@/hooks/use-theme';

export default function EditProfileScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { user, updateProfile } = useAuth();

  // Seed the form from the current user (only runs once, on mount).
  const [name, setName] = useState(user?.name ?? '');
  const [about, setAbout] = useState(user?.about ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter your name.');
      return;
    }
    updateProfile({ name: name.trim(), about: about.trim(), phone: phone.trim() });
    router.back();
  };

  return (
    <ThemedView style={styles.screen}>
      {/* Custom top bar — this screen is a headerless modal, so we draw our own. */}
      <View style={[styles.topBar, { paddingTop: insets.top + Spacing.two }]}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <ThemedText themeColor="textSecondary">Cancel</ThemedText>
        </Pressable>
        <ThemedText style={styles.topTitle}>Edit Profile</ThemedText>
        <Pressable onPress={handleSave} hitSlop={10}>
          <ThemedText style={{ color: theme.accent, fontWeight: '700' }}>Save</ThemedText>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.avatarWrap}>
            <Pressable onPress={() => Alert.alert('Change photo', 'Photo upload is coming soon.')}>
              <Avatar name={name || 'You'} uri={user?.avatarUri} size={96} />
            </Pressable>
            <Pressable onPress={() => Alert.alert('Change photo', 'Photo upload is coming soon.')}>
              <ThemedText type="small" style={{ color: theme.accent, fontWeight: '700' }}>
                Change photo
              </ThemedText>
            </Pressable>
          </View>

          <View style={styles.form}>
            <TextField
              label="Name"
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              autoCapitalize="words"
            />
            <TextField
              label="About"
              value={about}
              onChangeText={setAbout}
              placeholder="Hey there! I am using vchat."
              multiline
              style={styles.multiline}
            />
            <TextField
              label="Phone"
              value={phone}
              onChangeText={setPhone}
              placeholder="Add phone number"
              keyboardType="phone-pad"
            />
            <ThemedText type="small" themeColor="textSecondary" style={styles.note}>
              Email ({user?.email}) can’t be changed.
            </ThemedText>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  flex: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two,
  },
  topTitle: { fontWeight: '700' },
  content: { paddingHorizontal: Spacing.four, paddingTop: Spacing.four, gap: Spacing.four },
  avatarWrap: { alignItems: 'center', gap: Spacing.two },
  form: { gap: Spacing.three },
  multiline: { height: 92, paddingTop: 14, textAlignVertical: 'top' },
  note: { marginLeft: Spacing.one },
});
