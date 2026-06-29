/**
 * ChatInput — the message composer pinned at the bottom of a chat.
 *
 * It owns its own draft text (local state), and calls `onSend` with the trimmed
 * text when you tap send, then clears itself. The parent screen decides what
 * "send" actually does (append to messages, call an API, etc.) — this component
 * is reusable for both a normal chat and the AI chat.
 */

import { useState } from 'react';
import { Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ChatInputProps = {
  onSend: (text: string) => void;
  /** Safe-area bottom inset so the bar clears the home indicator. */
  bottomInset: number;
};

export function ChatInput({ onSend, bottomInset }: ChatInputProps) {
  const theme = useTheme();
  const [text, setText] = useState('');
  const canSend = text.trim().length > 0;

  const handleSend = () => {
    if (!canSend) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <View
      style={[
        styles.wrap,
        {
          paddingBottom: bottomInset + Spacing.two,
          backgroundColor: theme.background,
          borderTopColor: theme.separator,
        },
      ]}>
      <View style={[styles.inputBox, { backgroundColor: theme.backgroundElement }]}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Message"
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { color: theme.text }]}
          multiline
        />
      </View>

      <Pressable
        onPress={handleSend}
        disabled={!canSend}
        style={({ pressed }) => [
          styles.sendBtn,
          { backgroundColor: canSend ? theme.accent : theme.backgroundElement },
          pressed && { opacity: 0.85 },
        ]}>
        <Icon
          name="arrow-up"
          color={canSend ? theme.onAccent : theme.textSecondary}
          size={20}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  inputBox: {
    flex: 1,
    borderRadius: 22,
    paddingHorizontal: Spacing.three,
    minHeight: 44,
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,
    // Keep the bubble height comfortable and cap growth for long messages.
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    maxHeight: 120,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
