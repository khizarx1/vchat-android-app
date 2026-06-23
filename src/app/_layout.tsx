import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AuthProvider, useAuth } from '@/context/auth';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        <RootNavigator />
      </ThemeProvider>
    </AuthProvider>
  );
}

// A separate component so it can call useAuth(), which must run INSIDE the
// <AuthProvider> rendered above.
function RootNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* These screens exist only when the guard is true. */}
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(tabs)" />
        {/* Full-screen chat thread, pushed over the tabs. */}
        <Stack.Screen name="chat/[id]" />
        {/* The contact's profile, pushed over the chat thread. */}
        <Stack.Screen name="contact/[id]" />
        {/* Voice/video call — full-screen, covers everything. */}
        <Stack.Screen name="call/[id]" options={{ presentation: 'fullScreenModal' }} />
        <Stack.Screen name="chat/ai" />
        {/* A modal that slides up over the tabs. `presentation: 'modal'` is the
            native iOS card-style sheet; on Android it's a full-screen page. */}
        <Stack.Screen name="edit-profile" options={{ presentation: 'modal' }} />
        <Stack.Screen name="new-chat" options={{ presentation: 'modal' }} />
      </Stack.Protected>

      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}
