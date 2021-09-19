import {
  CHECKOUT_STEP_MAP,
  CHECKOUT_URL_MAP,
  UNKNOWN_STEP
} from 'constants/checkoutFlow';
import { NON_MARTY_URL } from 'common/regex';
import marketplace from 'cfg/marketplace.json';

const { checkout: { checkoutUrl } } = marketplace;

export const getCleanPath = path => path.replace(NON_MARTY_URL, '$1');

export function getStepFromPath(path) {
  const cleanPath = getCleanPath(path);
  return CHECKOUT_URL_MAP[cleanPath] || UNKNOWN_STEP;
}

export function getPathFromStep(step) {
  return CHECKOUT_STEP_MAP[step] || checkoutUrl;
}
