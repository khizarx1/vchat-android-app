import { Stack } from 'expo-router';

// When the user is logged out, start on the "welcome" screen.
export const unstable_settings = {
  initialRouteName: 'welcome',
};

export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
