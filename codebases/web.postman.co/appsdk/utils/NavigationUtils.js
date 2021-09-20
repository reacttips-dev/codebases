import { isServedFromPublicWorkspaceDomain } from './commonWorkspaceUtils';
import { openExternalLink } from '../../js/external-navigation/ExternalNavigationService';
import NavigationService from '../../js/services/NavigationService';

const isBrowser = window && window.SDK_PLATFORM === 'browser';

/**
 * Check if the intent context is public
 * @param {String} url
 */
function _isIntentContextPublic (url) {

  let validUrl = new URL(url);

  if (window.RELEASE_CHANNEL === 'dev') {
    return validUrl.host.match(/^localhost:8778$/) || validUrl.host.match(/^www.postman(-beta|-stage)?.com$/);
  }

  return validUrl.host.match(/^www.postman(-beta|-stage)?.com$/);
}

/**
 * Check the context mismatch and navigate to one URL after switching the context if needed
 * @param {String} url
 */
export function checkContextAndNavigate (url) {

  if (!url) {
    return;
  }

  if (isBrowser) { // Check context mismatch only on browser
    // If present context is public but intent URL context is private then switch context
    // If present context is private but intent URL context is public then switch context
    if ((isServedFromPublicWorkspaceDomain() && !_isIntentContextPublic(url))
      || (!isServedFromPublicWorkspaceDomain() && _isIntentContextPublic(url))) {
      openExternalLink(url);
      return;
    }

    // There's no context mismatch, use openURL for navigation
    NavigationService.openURL(url);
  } else {
    let validUrl;

    try {
      validUrl = new URL(url);
    } catch (err) {
      pm.logger.error('CheckContextAndNavigate ~ invalid URL is provided', url);
      return;
    }

    // Extract the path name from the URL as transitionToURL API needs just the path name
    const urlPathToNavigate = validUrl.href.substring(validUrl.origin.length + 1);

    // For desktop the concept of context is missing
    // Hence, we don't need to check for context mismatch, just directly transition to the route
    NavigationService.transitionToURL(urlPathToNavigate);
  }
}
