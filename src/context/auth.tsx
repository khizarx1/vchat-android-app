/**
 * AuthProvider — holds "who is logged in" for the whole app.
 *
 * This is ordinary React Context (same as on the web). What's special is how it
 * connects to routing: the root layout reads `isAuthenticated` from here and uses
 * it as the <Stack.Protected> guard. So when `signIn` flips `user` from null to a
 * value, expo-router automatically swaps from the (auth) group to the (tabs) group.
 *
 * For now auth is FAKE and in-memory: there's no backend and no persistence, so a
 * reload logs you out. The TODOs mark exactly where real API + secure storage go.
 */

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type User = {
  id: string;
  name: string;
  email: string;
  about?: string;
  phone?: string;
  avatarUri?: string;
};

/** The fields a user is allowed to edit from the profile screen. */
export type EditableProfile = Partial<Pick<User, 'name' | 'about' | 'phone' | 'avatarUri'>>;

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  updateProfile: (updates: EditableProfile) => void;
};

const DEFAULT_ABOUT = 'Hey there! I am using vchat.';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // useMemo so the context value object is stable between renders unless `user`
  // changes — a small habit that avoids needless re-renders of consumers.
  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,

      async signIn(email, _password) {
        // TODO: call your real backend here, e.g.
        //   const res = await api.post('/login', { email, password })
        //   await SecureStore.setItemAsync('token', res.token)
        await fakeNetworkDelay();
        setUser({ id: '1', name: email.split('@')[0] || 'You', email, about: DEFAULT_ABOUT });
      },

      async signUp(name, email, _password) {
        // TODO: call your real backend here to create the account.
        await fakeNetworkDelay();
        setUser({ id: '1', name, email, about: DEFAULT_ABOUT });
      },

      signOut() {
        // TODO: also clear the stored token here.
        setUser(null);
      },

      updateProfile(updates) {
        // Merge the changes into the current user. The functional update form
        // (prev => ...) means we always build on the latest value.
        setUser((prev) => (prev ? { ...prev, ...updates } : prev));
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Convenience hook so screens just call `useAuth()`. Throws if used outside the provider. */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}

/** Simulates a slow network request so loading spinners are visible while learning. */
function fakeNetworkDelay() {
  return new Promise((resolve) => setTimeout(resolve, 700));
}
