/**
 * Mock data for the conversation list.
 *
 * Why a separate file? The UI shouldn't care *where* data comes from. Today it's
 * this hardcoded array; later we'll swap it for an API call or local database and
 * the screen code won't have to change — it just consumes `Conversation[]`.
 *
 * Timestamps are computed relative to "now" at load time so the list always looks
 * fresh while you're learning, instead of drifting into the past.
 */

import type { Conversation } from '@/types/chat';

const now = Date.now();
const minutesAgo = (m: number) => new Date(now - m * 60_000).toISOString();
const hoursAgo = (h: number) => new Date(now - h * 3_600_000).toISOString();
const daysAgo = (d: number) => new Date(now - d * 86_400_000).toISOString();

export const CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatarUri: 'https://i.pravatar.cc/150?img=47',
    lastMessage: 'See you then! Looking forward to it 😊',
    lastMessageAt: minutesAgo(2),
    unreadCount: 0,
    isOnline: true,
    sentByMe: true,
    deliveryStatus: 'read',
  },
  {
    id: '2',
    name: 'Team Alpha',
    lastMessage: 'Alex: Just pushed the fix, can you review?',
    lastMessageAt: minutesAgo(18),
    unreadCount: 3,
    isOnline: false,
  },
  {
    id: '3',
    name: 'Maya Patel',
    avatarUri: 'https://i.pravatar.cc/150?img=32',
    lastMessage: 'Sounds perfect, let me check my calendar',
    lastMessageAt: hoursAgo(1),
    unreadCount: 1,
    isOnline: true,
  },
  {
    id: '4',
    name: 'David Kim',
    avatarUri: 'https://i.pravatar.cc/150?img=12',
    lastMessage: 'You: Thanks for the help today 🙏',
    lastMessageAt: hoursAgo(5),
    unreadCount: 0,
    sentByMe: true,
    deliveryStatus: 'delivered',
  },
  {
    id: '5',
    name: 'Design Crew',
    lastMessage: 'Priya: New mockups are in Figma',
    lastMessageAt: daysAgo(1),
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: '6',
    name: 'Mom',
    avatarUri: 'https://i.pravatar.cc/150?img=45',
    lastMessage: 'Call me when you get a chance ❤️',
    lastMessageAt: daysAgo(2),
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: '7',
    name: 'Jordan Lee',
    avatarUri: 'https://i.pravatar.cc/150?img=68',
    lastMessage: 'Haha that was hilarious 😂',
    lastMessageAt: daysAgo(4),
    unreadCount: 0,
    sentByMe: true,
    deliveryStatus: 'sent',
  },
];
