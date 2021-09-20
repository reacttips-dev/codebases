import { memberId } from '@trello/session-cookie';
import { clientVersion } from '@trello/config';

const ANONYMOUS_CHANNEL = 'stable';
let channel: string | null = null;

export async function getChannel(): Promise<string | null> {
  // This is not strictly accurate. The active channel is only available through
  // an authenticated API endpoint, so we make a best guess for anonymous
  // users, knowing that the vast majority of them will be on "stable"
  if (!memberId) {
    return ANONYMOUS_CHANNEL;
  }

  if (typeof channel === 'string') {
    return channel;
  }

  try {
    const res = await fetch('/1/members/me?channels=true&fields=', {
      credentials: 'include',
      headers: {
        'X-Trello-Client-Version': clientVersion,
      },
    });

    if (res.ok) {
      const member = await res.json();
      // eslint-disable-next-line require-atomic-updates
      channel = member?.channels?.active ?? null;
      return channel;
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
}

// Resets the cached channel value to null
// Useful for testing
export function resetChannel() {
  channel = null;
}
