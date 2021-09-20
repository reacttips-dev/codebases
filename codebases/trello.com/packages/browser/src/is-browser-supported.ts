import {
  Browser,
  BrowserVersion,
  UNKNOWN_BROWSER_VERSION,
  browserStr,
  browserVersion,
} from './browser-detect';
import {
  MINIMUM_REQUIRED_VERSION,
  SupportedBrowser,
} from './minimum-required-versions';

function isBrowserFamilySupported(name: Browser): name is SupportedBrowser {
  return Object.prototype.hasOwnProperty.call(MINIMUM_REQUIRED_VERSION, name);
}

export function isBrowserSupported(
  name: Browser = browserStr,
  version: BrowserVersion = browserVersion,
) {
  // If we couldn't compute the version, assume it's not supported
  if (version === UNKNOWN_BROWSER_VERSION) {
    return false;
  }

  if (!isBrowserFamilySupported(name)) {
    return false;
  }

  return version >= MINIMUM_REQUIRED_VERSION[name];
}
