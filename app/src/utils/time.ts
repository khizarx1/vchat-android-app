/**
 * Pure helpers for formatting timestamps.
 *
 * "Pure" means: same input → same output, no side effects. These are trivial to
 * reuse and test, which is exactly why formatting logic lives here instead of
 * being tangled inside a component.
 */

/**
 * Formats a message timestamp the way chat apps do:
 *  - today        → "2:14 PM"
 *  - yesterday    → "Yesterday"
 *  - last 7 days  → "Mon"
 *  - older        → "Mar 4"
 */
export function formatConversationTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();

  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  const withinAWeek = now.getTime() - date.getTime() < 7 * 86_400_000;
  if (withinAWeek) {
    return date.toLocaleDateString([], { weekday: 'short' });
  }

  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}
