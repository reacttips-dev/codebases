import { PageService } from '../../../../appsdk/services/PageService';
import { HOME_IDENTIFIER, DEFAULT_HOME_IDENTIFIER } from '../../../navigation/constants';

/**
 * Returns a boolean value to denote if the home page is currently active
 */
export function isHomePageActive () {
  return PageService.activePageName === HOME_IDENTIFIER || PageService.activePageName === DEFAULT_HOME_IDENTIFIER;
}

/**
 *
 * @param {*} url
 * @param {*} options
 * @param {*} timeout
 * @returns
 */
export function fetchWithTimeout (url, options, timeout = 3000) {
  return Promise.race([
      fetch(url, options),
      new Promise((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), timeout)
      )
  ]);
}
