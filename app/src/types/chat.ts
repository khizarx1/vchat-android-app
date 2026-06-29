/**
 * The core data shapes for the chat app.
 *
 * We define these BEFORE building UI. In a real app these types would also
 * describe what your backend/API returns, so the same `Conversation` type
 * flows from the network layer all the way into your components — one source
 * of truth, checked by the compiler.
 */

/** Delivery state of a message *you* sent (drives the ✓ / ✓✓ ticks). */
export type DeliveryStatus = 'sent' | 'delivered' | 'read';

/** One row in the conversation list. */
export interface Conversation {
  id: string;
  /** Display name of the person or group. */
  name: string;
  /** Optional remote avatar photo. If absent, we render colored initials. */
  avatarUri?: string;
  /** Preview text shown under the name (the most recent message). */
  lastMessage: string;
  /** ISO 8601 timestamp of the last message — formatted for display at render time. */
  lastMessageAt: string;
  /** How many unread messages — 0 means fully read. */
  unreadCount: number;
  /** Whether the other person is currently online (green dot). */
  isOnline?: boolean;
  /** True when the last message was sent by the current user (shows ticks). */
  sentByMe?: boolean;
  /** Delivery state — only meaningful when `sentByMe` is true. */
  deliveryStatus?: DeliveryStatus;
}

/** A single message inside a conversation thread. */
export interface Message {
  id: string;
  text: string;
  /** True if the current user sent it (renders on the right, in the accent color). */
  sentByMe: boolean;
  /** ISO 8601 timestamp. */
  createdAt: string;
}

/** A person you can start a new chat with. */
export interface Contact {
  id: string;
  name: string;
  avatarUri?: string;
  /** Short status line shown under the name (e.g. "Available"). */
  about?: string;
}
