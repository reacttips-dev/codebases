import { Browser } from './browser-detect';

// This reflects the minimum browser version for a given family that was
// used by at least 0.5% of active users in the last 7 days
//
// Latest suggested minima can be found by running
// https://modeanalytics.com/trello/reports/09af80a7654d

export const MINIMUM_REQUIRED_VERSION = {
  // https://trello.com/platforms says we support the latest version of
  // these four browsers
  [Browser.Chrome]: 72,
  [Browser.Firefox]: 77,
  [Browser.Edge]: 80,
  [Browser.Safari]: 13,

  // We don't officially support Opera, but it's being used by about 1% of users
  [Browser.Opera]: 58,

  // Vivaldi accounts for less than 0.5% of traffic,
  // but we can leave it in until it causes a problem
  [Browser.Vivaldi]: 2,
};

export type SupportedBrowser = keyof typeof MINIMUM_REQUIRED_VERSION;
