/**
 * GlassSurface — a frosted "liquid glass" surface that degrades gracefully.
 *
 * Apple's liquid glass (via `expo-glass-effect`) only exists on recent iOS. On
 * Android and web it isn't available, so rendering <GlassView> there would do
 * nothing useful. The industry-standard answer is a single wrapper component:
 * use the real glass when the platform supports it, otherwise fall back to a
 * subtle translucent card. Every screen imports THIS, never GlassView directly,
 * so the fallback logic lives in exactly one place.
 */

import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { View, type ViewProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

// Evaluate once at module load — the answer can't change while the app runs.
// Wrapped in try/catch because the function is a no-op shim on web.
const LIQUID_GLASS_SUPPORTED = (() => {
  try {
    return isLiquidGlassAvailable();
  } catch {
    return false;
  }
})();

export type GlassSurfaceProps = ViewProps & {
  /** 'regular' = standard frosted material, 'clear' = lighter/more transparent. */
  glassStyle?: 'regular' | 'clear';
};

export function GlassSurface({
  style,
  children,
  glassStyle = 'regular',
  ...rest
}: GlassSurfaceProps) {
  const theme = useTheme();

  if (LIQUID_GLASS_SUPPORTED) {
    return (
      <GlassView style={style} glassEffectStyle={glassStyle} {...rest}>
        {children}
      </GlassView>
    );
  }

  // Fallback: a faintly tinted, translucent surface that reads as "glassy"
  // without the native blur.
  return (
    <View style={[{ backgroundColor: theme.glassFallback }, style]} {...rest}>
      {children}
    </View>
  );
}

/** Exposed in case a screen wants to branch on glass support itself. */
export { LIQUID_GLASS_SUPPORTED };
