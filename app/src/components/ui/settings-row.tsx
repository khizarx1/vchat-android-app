/**
 * SettingsRow — one tappable row inside a settings/profile card.
 *
 * Reusable "leaf" component: an icon in a tinted square, a label, an optional
 * value on the right, and an optional chevron. The `destructive` flag turns it
 * red (used for "Log out"). Notice how a single small component, varied by props,
 * builds an entire settings screen — that's composition.
 */

import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const DESTRUCTIVE = '#E5484D';

type SettingsRowProps = {
  /** An Ionicons name, e.g. 'notifications-outline'. */
  icon: IconName;
  label: string;
  /** Optional grey text on the right (e.g. the current value). */
  value?: string;
  destructive?: boolean;
  showChevron?: boolean;
  onPress?: () => void;
};

export function SettingsRow({
  icon,
  label,
  value,
  destructive = false,
  showChevron = true,
  onPress,
}: SettingsRowProps) {
  const theme = useTheme();
  const tint = destructive ? DESTRUCTIVE : theme.accent;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View
        style={[
          styles.iconWrap,
          { backgroundColor: destructive ? 'rgba(229,72,77,0.12)' : theme.accentSoft },
        ]}>
        <Icon name={icon} color={tint} size={19} />
      </View>

      <ThemedText
        style={[styles.label, destructive && { color: DESTRUCTIVE }]}
        numberOfLines={1}>
        {label}
      </ThemedText>

      {value ? (
        <ThemedText type="small" themeColor="textSecondary" numberOfLines={1} style={styles.value}>
          {value}
        </ThemedText>
      ) : null}

      {showChevron && !destructive ? (
        <Icon name="chevron-forward" color={theme.textSecondary} size={14} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.two + 2,
    paddingHorizontal: Spacing.three,
  },
  pressed: {
    opacity: 0.6,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    fontWeight: '600',
  },
  value: {
    maxWidth: '45%',
  },
});
