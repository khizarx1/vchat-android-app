/**
 * Mock messages per conversation.
 *
 * Stored oldest → newest (natural reading order). The chat screen reverses a copy
 * for its inverted FlatList. Like conversations.ts, this is a stand-in for what a
 * real API / database will provide later.
 */

import type { Message } from '@/types/chat';

const now = Date.now();
const minsAgo = (m: number) => new Date(now - m * 60_000).toISOString();

const SARAH: Message[] = [
  { id: 's1', text: 'Hey! Are we still on for tomorrow?', sentByMe: false, createdAt: minsAgo(62) },
  { id: 's2', text: 'Yes, definitely! 2pm works great.', sentByMe: true, createdAt: minsAgo(58) },
  { id: 's3', text: 'Perfect. Same coffee place?', sentByMe: false, createdAt: minsAgo(55) },
  { id: 's4', text: 'Yep, the one on 5th street ☕', sentByMe: true, createdAt: minsAgo(54) },
  { id: 's5', text: 'See you then! Looking forward to it 😊', sentByMe: false, createdAt: minsAgo(2) },
];

const DEFAULT: Message[] = [
  { id: 'd1', text: 'Hey there 👋', sentByMe: false, createdAt: minsAgo(30) },
  { id: 'd2', text: 'Hi! How are you?', sentByMe: true, createdAt: minsAgo(28) },
  { id: 'd3', text: 'Doing great, thanks! What about you?', sentByMe: false, createdAt: minsAgo(25) },
];

const BY_ID: Record<string, Message[]> = {
  '1': SARAH,
};

/** Returns a fresh copy so screens can edit their own local state safely. */
export function getMessages(conversationId: string | undefined): Message[] {
  const source = (conversationId && BY_ID[conversationId]) || DEFAULT;
  return [...source];
}
