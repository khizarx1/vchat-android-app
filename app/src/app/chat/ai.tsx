/**
 * AI Chat screen — deliberately a different, colorful world from the normal chat.
 *
 * Visual language: a vivid diagonal gradient background (expo-linear-gradient),
 * gradient bubbles for the user, frosted-glass bubbles for the AI, suggestion
 * chips, and an animated "typing…" indicator. Everything here uses fixed light
 * colors (not the seagreen theme) because it lives on a dark gradient.
 *
 * The replies are SIMULATED for now (see the setTimeout in `send`). Later, that's
 * the one spot you swap in a real Anthropic API call.
 */

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
    Animated,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui/icon';
import { Spacing } from '@/constants/theme';
import type { Message } from '@/types/chat';

// Gradient palettes (`as const` makes them readonly tuples, which is the type
// LinearGradient's `colors` prop expects). Seagreen family, on-brand with the app.
const BG = ['#04302A', '#0B5E54', '#0E8C78'] as const; // deep emerald → teal
const USER_BUBBLE = ['#2EE6B6', '#10B981'] as const; // bright mint → emerald
const AVATAR = ['#5EEAD4', '#0EA5A5'] as const; // mint → teal

const SUGGESTIONS = ['Give me a fun idea 💡', 'Write a short poem', 'Explain it simply', 'Plan my day'];

const CANNED_REPLIES = [
  'Great question! Here’s how I’d think about it… ✨',
  'Absolutely — let me break that down for you.',
  'Here are a few ideas you might like:\n\n• Option one\n• Option two\n• Option three',
  'I’m on it! Tell me a bit more about what you need.',
];

export default function AiChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 'ai-greeting',
      text: "Hi! I'm your AI assistant ✨\nAsk me anything to get started.",
      sentByMe: false,
      createdAt: new Date().toISOString(),
    },
  ]);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState('');

  // Inverted list wants newest-first.
  const data = useMemo(() => [...messages].reverse(), [messages]);
  const showSuggestions = messages.length <= 1 && !typing;

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text) return;

    const userMessage: Message = {
      id: `u-${Date.now()}`,
      text,
      sentByMe: true,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setDraft('');
    setTyping(true);

    // SIMULATED reply. Replace this block with a real Anthropic API request later.
    setTimeout(() => {
      const reply: Message = {
        id: `a-${Date.now()}`,
        text: CANNED_REPLIES[Math.floor(Math.random() * CANNED_REPLIES.length)],
        sentByMe: false,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, reply]);
      setTyping(false);
    }, 1300);
  };

  return (
    <LinearGradient colors={BG} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.screen}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.one }]}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.iconBtn}>
          <Icon name="chevron-back" color="#fff" size={24} />
        </Pressable>

        <LinearGradient
          colors={AVATAR}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.aiAvatar}>
          <Icon name="sparkles" color="#fff" size={20} />
        </LinearGradient>

        <View style={styles.headerText}>
          <Text style={styles.headerName}>AI Assistant</Text>
          <Text style={styles.headerStatus}>Online • Always here to help</Text>
        </View>

        <Pressable hitSlop={10} onPress={() => {}} style={styles.iconBtn}>
          <Icon name="ellipsis-horizontal" color="#fff" size={22} />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}>
        <FlatList
          data={data}
          inverted
          style={styles.flex}
          keyExtractor={(m) => m.id}
          renderItem={({ item }) => <Bubble message={item} />}
          contentContainerStyle={[styles.listContent, { flexGrow: 1 }]}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
        />

        {typing && <TypingBubble />}

        {showSuggestions && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipsScroll}
            contentContainerStyle={styles.chipsRow}>
            {SUGGESTIONS.map((s) => (
              <Pressable key={s} onPress={() => send(s)} style={styles.chip}>
                <Text style={styles.chipText}>{s}</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}

        {/* Input bar */}
        <View style={[styles.inputBar, { paddingBottom: insets.bottom + Spacing.two }]}>
          <View style={styles.inputBox}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="Ask anything…"
              placeholderTextColor="rgba(255,255,255,0.6)"
              style={styles.input}
              multiline
            />
          </View>
          <Pressable
            onPress={() => send(draft)}
            disabled={!draft.trim()}
            style={[styles.sendBtn, !draft.trim() && styles.sendDisabled]}>
            <LinearGradient
              colors={USER_BUBBLE}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.sendInner}>
              <Icon name="arrow-up" color="#fff" size={20} />
            </LinearGradient>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

/** One bubble — gradient for the user, frosted glass for the AI. */
function Bubble({ message }: { message: Message }) {
  if (message.sentByMe) {
    return (
      <View style={[styles.row, styles.rowRight]}>
        <LinearGradient
          colors={USER_BUBBLE}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.bubble, styles.userBubble]}>
          <Text style={styles.bubbleText}>{message.text}</Text>
        </LinearGradient>
      </View>
    );
  }
  return (
    <View style={[styles.row, styles.rowLeft]}>
      <View style={[styles.bubble, styles.aiBubble]}>
        <Text style={styles.bubbleText}>{message.text}</Text>
      </View>
    </View>
  );
}

/** The "AI is typing" bubble with three pulsing dots. */
function TypingBubble() {
  return (
    <View style={[styles.row, styles.rowLeft, styles.typingWrap]}>
      <View style={[styles.bubble, styles.aiBubble, styles.typingBubble]}>
        <Dot delay={0} />
        <Dot delay={150} />
        <Dot delay={300} />
      </View>
    </View>
  );
}

/** A single dot that loops between faint and bright (RN's built-in Animated). */
function Dot({ delay }: { delay: number }) {
  const value = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(value, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.timing(value, { toValue: 0.3, duration: 350, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [value, delay]);

  return <Animated.View style={[styles.dot, { opacity: value }]} />;
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
  },
  iconBtn: { padding: Spacing.one, alignItems: 'center', justifyContent: 'center' },
  aiAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerText: { flex: 1 },
  headerName: { color: '#fff', fontSize: 16, fontWeight: '700' },
  headerStatus: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 1 },
  listContent: { paddingHorizontal: Spacing.three, paddingVertical: Spacing.two },
  row: { flexDirection: 'row', marginVertical: 4 },
  rowLeft: { justifyContent: 'flex-start' },
  rowRight: { justifyContent: 'flex-end' },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
    borderRadius: 22,
    overflow: 'hidden',
  },
  userBubble: { borderBottomRightRadius: 6 },
  aiBubble: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
    borderBottomLeftRadius: 6,
  },
  bubbleText: { color: '#fff', fontSize: 16, lineHeight: 22 },
  typingWrap: { marginBottom: Spacing.one },
  typingBubble: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: Spacing.three },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#fff' },
  // flexGrow:0 stops the horizontal ScrollView from stretching to fill the column.
  chipsScroll: { flexGrow: 0 },
  // alignItems:'center' keeps each chip at its natural (text) height instead of
  // stretching it to the row's full height.
  chipsRow: {
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
    paddingBottom: Spacing.two,
  },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  chipText: { color: '#fff', fontWeight: '600' },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
  },
  inputBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: Spacing.three,
    minHeight: 46,
    justifyContent: 'center',
  },
  input: { color: '#fff', fontSize: 16, paddingVertical: Platform.OS === 'ios' ? 12 : 8, maxHeight: 120 },
  sendBtn: { width: 46, height: 46, borderRadius: 23, overflow: 'hidden' },
  sendDisabled: { opacity: 0.5 },
  sendInner: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
