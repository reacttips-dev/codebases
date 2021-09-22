/**
 * window.detectedTimezone is set via our SSR service. If this does not exist,
 * default to UTC (Europe/London), same as server-side rendering.
 * Server-side implementation of this method is js/lib/timezone.server
 */

declare global {
  interface Window {
    detectedTimezone?: string;
  }
}

function getTimezone(): string {
  const detectedTimezone = window.detectedTimezone;

  if (detectedTimezone == null || detectedTimezone.length === 0) {
    return 'Europe/London';
  }

  return detectedTimezone;
}

export default {
  get(): string {
    return getTimezone();
  },
};
