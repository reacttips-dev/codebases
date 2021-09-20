interface RetryAssetDownloadOptions {
  maxAttempts?: number;
  delay?: number;
}

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms);
  });

export const importWithRetry = async <T>(
  promiseFactory: () => Promise<T>,
  { maxAttempts = 3, delay = 500 }: RetryAssetDownloadOptions = {},
): Promise<T> => {
  let result: T | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let error: any;
  let success = false;

  let attempt = 1;
  while (!success && attempt <= maxAttempts) {
    // If this is a retry, we want to wait for the delay before
    // issuing another request
    if (attempt > 1) {
      await sleep(delay);
    }

    try {
      result = await promiseFactory();
      success = true;
    } catch (e) {
      // We only want to retry if there was a ChunkLoadError, other
      // errors (e.g. errors that occur while parsing the script after
      // loading it) should still fail immediately
      if (e.name === 'ChunkLoadError') {
        error = e;
        attempt++;
      } else {
        throw e;
      }
    }
  }

  if (success) {
    return result as T;
  } else {
    throw error;
  }
};
