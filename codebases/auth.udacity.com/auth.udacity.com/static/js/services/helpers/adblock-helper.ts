let adsAreBlocked = 'unknown';

export default {
  testAdBlock: (): Promise<string> => {
    const testURL =
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';

    const adRequest = new Request(testURL, {
      method: 'HEAD',
      mode: 'no-cors'
    });

    // Just do a HEAD on a Google ads resource, if it fails,
    // mark that we know they're blocking ads
    return fetch(adRequest)
      .then(
        (response): Response => {
          return response;
        }
      )
      .then((): string => {
        return 'false';
      })
      .catch((): string => {
        return 'true';
      });
  },

  setAdsAreBlocked: (b: string): void => {
    adsAreBlocked = b;
  },
  getAdsAreBlocked: (): string => {
    return adsAreBlocked;
  }
};
