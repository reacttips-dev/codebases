let adsAreBlocked = 'unknown';

export default {
  setAdsAreBlocked: (b: string): void => {
    adsAreBlocked = b;
  },
  getAdsAreBlocked: (): string => {
    return adsAreBlocked;
  }
};
