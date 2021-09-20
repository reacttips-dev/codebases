import debounce from 'debounce';

const MAX_URL_LENGTH = 2083;
const VALUE_SEPARATOR = ',';
const TRACKING_DEBOUNCE_MS = 1000;

export function getTrackingUrl(prefix: string) {
  return (values: string[]) =>
    `${prefix}${values
      .map((value) => encodeURIComponent(value))
      .join(VALUE_SEPARATOR)}`;
}

export function getTrackingUrls(
  prefix: string,
  maxChunkLength: number = MAX_URL_LENGTH - prefix.length,
) {
  const getChunkUrl = getTrackingUrl(prefix);

  return (values: string[]) => {
    let currentChunk: string[] = [];
    const chunks: string[][] = [];

    let remainingLength = 0;

    values.forEach((value) => {
      const encoded = encodeURIComponent(value);

      if (remainingLength < encoded.length + VALUE_SEPARATOR.length) {
        currentChunk = [];
        remainingLength = maxChunkLength;
        chunks.push(currentChunk);
      }
      currentChunk.push(value);
      remainingLength -= encoded.length + VALUE_SEPARATOR.length;
    });

    return chunks.map(getChunkUrl);
  };
}

export class TrackingQueue {
  private queue: { value: string; intervalMs: number }[] = [];
  private lastTrackedTimestamp: Map<string, number> = new Map();
  private sendQueuedDebounced: () => void;
  private getChunkUrls: (values: string[]) => string[];
  private extractValueFromUrl: (url: string) => string | undefined;

  constructor(
    trackPrefix: string,
    extractValueFromUrl: (url: string) => string | undefined,
  ) {
    this.getChunkUrls = getTrackingUrls(trackPrefix);
    this.extractValueFromUrl = extractValueFromUrl;
    this.sendQueuedDebounced = debounce(this.sendQueued, TRACKING_DEBOUNCE_MS);
  }

  private sendQueued() {
    const now = Date.now();

    const newValues = this.queue
      .filter(({ value, intervalMs }) => {
        const lastTracked = this.lastTrackedTimestamp.get(value);
        return lastTracked === undefined || lastTracked + intervalMs < now;
      })
      .map((entry) => entry.value);

    const uniqueNewValues = Array.from(new Set(newValues));

    // eslint-disable-next-line @trello/fetch-includes-client-version
    this.getChunkUrls(uniqueNewValues).forEach((url) => fetch(url));

    uniqueNewValues.forEach((value) =>
      this.lastTrackedTimestamp.set(value, now),
    );

    this.queue = [];
  }

  enqueue(urls: string[], intervalMs: number) {
    const values = urls
      .map(this.extractValueFromUrl)
      .filter((value): value is string => value !== undefined);

    if (values.length > 0) {
      this.queue = [
        ...this.queue,
        ...values.map((value) => ({ value, intervalMs })),
      ];

      this.sendQueuedDebounced();
    }
  }
}
