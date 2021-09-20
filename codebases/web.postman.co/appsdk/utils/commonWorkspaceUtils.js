/**
 * Returns `true` if the application is served from the domain for public
 * API network and public workspaces - explore.postman.com.
 *
 * @returns {Boolean}
 */
 export function isServedFromPublicWorkspaceDomain () {
  if (window && window.SDK_PLATFORM === 'browser') {

    if (window.RELEASE_CHANNEL === 'dev') {
      return window.location.host.match(/^localhost:8778$/);
    }

    return window.location.host.match(/^www.postman(-beta|-stage)?.com$/);
  }
  else {
    return false;
  }
}
