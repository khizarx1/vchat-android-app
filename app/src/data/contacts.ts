/**
 * Mock contacts you can start a new chat with.
 *
 * IDs 1/3/4/6/7 intentionally match people in conversations.ts, so starting a
 * chat with them opens their existing thread (with history). The higher IDs are
 * fresh contacts — their chat starts from the default messages.
 */

import type { Contact } from '@/types/chat';

export const CONTACTS: Contact[] = [
  { id: '1', name: 'Sarah Chen', avatarUri: 'https://i.pravatar.cc/150?img=47', about: 'Available' },
  { id: '3', name: 'Maya Patel', avatarUri: 'https://i.pravatar.cc/150?img=32', about: 'At work' },
  { id: '4', name: 'David Kim', avatarUri: 'https://i.pravatar.cc/150?img=12', about: 'Hey there! I am using vchat.' },
  { id: '6', name: 'Mom', avatarUri: 'https://i.pravatar.cc/150?img=45', about: 'Call me ❤️' },
  { id: '7', name: 'Jordan Lee', avatarUri: 'https://i.pravatar.cc/150?img=68', about: 'Busy' },
  { id: '8', name: 'Aisha Khan', avatarUri: 'https://i.pravatar.cc/150?img=20', about: 'Available' },
  { id: '9', name: 'Carlos Mendez', avatarUri: 'https://i.pravatar.cc/150?img=15', about: 'In a meeting' },
  { id: '10', name: 'Emma Wilson', avatarUri: 'https://i.pravatar.cc/150?img=49', about: 'Sleeping 😴' },
  { id: '11', name: 'Liam Brown', about: 'Hey there! I am using vchat.' },
  { id: '12', name: 'Sofia Rossi', avatarUri: 'https://i.pravatar.cc/150?img=24', about: 'On vacation 🏝️' },
];
