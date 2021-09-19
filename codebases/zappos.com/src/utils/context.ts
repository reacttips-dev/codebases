/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext } from 'react';

import { trackLegacyEvent } from 'helpers/analytics';
import { track as amethystTrack, titaniteView } from 'apis/amethyst';
import marketplace from 'cfg/marketplace.json';

export const MartyContext = createContext({
  testId: <T extends string | undefined | null>(id: T) => id,
  loadedWithHash: false,
  touchDetected: false,
  preventOnTouchDevice : (i: any) => i,
  marketplace,
  environmentConfig: {} as any, // TODO ts type this as `AppState.environmentConfig`
  router: {} as any, // TODO ts we do some wacky things with Router/History, let's get this typed correctly
  trackLegacyEvent,
  titaniteView,
  amethystTrack
});
