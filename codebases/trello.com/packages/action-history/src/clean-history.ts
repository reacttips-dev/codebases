import { HistoryEntry } from './types';

// Previous versions may have recorded incomplete history, make sure
// the history we're using matches current expectations
export function cleanHistory(history: unknown): HistoryEntry[] {
  if (!Array.isArray(history)) {
    return [];
  }

  // If we haven't taken a suggestion in the last 30 days,
  // stop suggesting it
  const oldestAllowedTimestamp = Date.now() - 1000 * 60 * 60 * 24 * 30;

  return history.filter(
    (entry: Partial<HistoryEntry>): entry is HistoryEntry =>
      entry.action !== undefined &&
      entry.context !== undefined &&
      entry.timestamp !== undefined &&
      entry.timestamp > oldestAllowedTimestamp,
  );
}
