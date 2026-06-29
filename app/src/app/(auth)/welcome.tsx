import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Icon } from '@/components/ui/icon';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function WelcomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ThemedView
      style={[styles.screen, { paddingTop: insets.top, paddingBottom: insets.bottom + Spacing.four }]}>
      <View style={styles.hero}>
        <View style={[styles.logo, { backgroundColor: theme.accentSoft }]}>
          <Icon name="chatbubbles" color={theme.accent} size={52} />
        </View>
        <ThemedText type="title" style={styles.center}>
          vchat
        </ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.center}>
          Fast, private messaging for the people who matter most.
        </ThemedText>
      </View>

      <View style={styles.actions}>
        <PrimaryButton label="Sign in" onPress={() => router.push('/sign-in')} />
        <PrimaryButton
          label="Create account"
          variant="ghost"
          onPress={() => router.push('/sign-up')}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: Spacing.four, justifyContent: 'space-between' },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.three },
  logo: {
    width: 104,
    height: 104,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { textAlign: 'center' },
  actions: { gap: Spacing.two },
});
