/**
 * Call screen — one screen for BOTH voice and video calls, chosen by the `mode`
 * route param ('voice' | 'video').
 *
 * Teaches: branching the whole UI on a param, a connecting→active flow with
 * setTimeout, a live duration timer with setInterval (+ cleanup in useEffect),
 * and toggle controls (mute/speaker/video) driven by local state. It's a UI
 * scaffold — there's no real audio/video; that's where a WebRTC SDK plugs in.
 */

import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar } from '@/components/chat/avatar';
import { Icon, type IconName } from '@/components/ui/icon';
import { Spacing } from '@/constants/theme';

const VOICE_BG = ['#06302A', '#0C5A4F', '#117E6B'] as const; // seagreen, on-brand
const VIDEO_BG = ['#11131A', '#0A0B0F'] as const; // dark, like a video feed
const END_RED = '#FF3B30';

function formatDuration(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function CallScreen() {
  const { name, avatar, mode } = useLocalSearchParams<{
    id: string;
    name?: string;
    avatar?: string;
    mode?: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const isVideo = mode === 'video';
  const displayName = name ?? 'Calling';
  const displayAvatar = avatar || undefined;

  const [status, setStatus] = useState<'connecting' | 'active'>('connecting');
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(isVideo);
  const [videoOn, setVideoOn] = useState(isVideo);

  // 1) Pretend to connect for 2s, then mark the call active.
  useEffect(() => {
    const t = setTimeout(() => setStatus('active'), 2000);
    return () => clearTimeout(t);
  }, []);

  // 2) Once active, tick the duration every second. Cleanup clears the interval.
  useEffect(() => {
    if (status !== 'active') return;
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [status]);

  const statusText =
    status === 'connecting' ? (isVideo ? 'Connecting video…' : 'Calling…') : formatDuration(seconds);

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <LinearGradient
        colors={isVideo ? VIDEO_BG : VOICE_BG}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Self-preview (video only) */}
      {isVideo && (
        <View style={[styles.selfPreview, { top: insets.top + Spacing.three }]}>
          <Icon name={videoOn ? 'person' : 'videocam-off'} color="rgba(255,255,255,0.85)" size={28} />
          <Text style={styles.selfLabel}>You</Text>
        </View>
      )}

      {/* Name + status */}
      <View style={[styles.top, { paddingTop: insets.top + Spacing.five }]}>
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.status}>{statusText}</Text>
      </View>

      {/* Center: the other person */}
      <View style={styles.center}>
        <Avatar name={displayName} uri={displayAvatar} size={isVideo ? 100 : 144} />
        {isVideo && <Text style={styles.hint}>Camera preview is a placeholder</Text>}
      </View>

      {/* Controls */}
      <View style={[styles.controls, { paddingBottom: insets.bottom + Spacing.four }]}>
        {isVideo ? (
          <>
            <CallButton icon="camera-reverse" label="Flip" onPress={() => {}} />
            <CallButton
              icon={videoOn ? 'videocam' : 'videocam-off'}
              label="Camera"
              active={!videoOn}
              onPress={() => setVideoOn((v) => !v)}
            />
            <CallButton
              icon={muted ? 'mic-off' : 'mic'}
              label="Mute"
              active={muted}
              onPress={() => setMuted((m) => !m)}
            />
          </>
        ) : (
          <>
            <CallButton
              icon={speaker ? 'volume-high' : 'volume-medium'}
              label="Speaker"
              active={speaker}
              onPress={() => setSpeaker((s) => !s)}
            />
            <CallButton
              icon="videocam"
              label="Video"
              onPress={() => router.setParams({ mode: 'video' })}
            />
            <CallButton
              icon={muted ? 'mic-off' : 'mic'}
              label="Mute"
              active={muted}
              onPress={() => setMuted((m) => !m)}
            />
          </>
        )}
        <CallButton icon="call" label="End" danger onPress={() => router.back()} />
      </View>
    </View>
  );
}

/** A round call-control button. `active` = filled white, `danger` = red hang-up. */
function CallButton({
  icon,
  label,
  onPress,
  active = false,
  danger = false,
}: {
  icon: IconName;
  label: string;
  onPress: () => void;
  active?: boolean;
  danger?: boolean;
}) {
  const bg = danger ? END_RED : active ? '#ffffff' : 'rgba(255,255,255,0.18)';
  const iconColor = danger ? '#fff' : active ? '#0B1A16' : '#fff';

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.btnWrap, pressed && styles.pressed]}>
      <View style={[styles.btn, { backgroundColor: bg }]}>
        <Icon name={icon} color={iconColor} size={26} style={danger ? styles.endIcon : undefined} />
      </View>
      <Text style={styles.btnLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0A0B0F' },
  top: { alignItems: 'center', gap: Spacing.one, paddingHorizontal: Spacing.four },
  name: { color: '#fff', fontSize: 26, fontWeight: '700', textAlign: 'center' },
  status: { color: 'rgba(255,255,255,0.75)', fontSize: 15 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.three },
  hint: { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
  selfPreview: {
    position: 'absolute',
    right: Spacing.three,
    width: 96,
    height: 140,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
    zIndex: 10,
  },
  selfLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 12 },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
  },
  btnWrap: { alignItems: 'center', gap: Spacing.one },
  pressed: { opacity: 0.7 },
  btn: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  endIcon: { transform: [{ rotate: '135deg' }] },
  btnLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 12 },
});
