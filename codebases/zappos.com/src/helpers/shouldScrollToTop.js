/**
 *  Factory function for the business logic for react-router-scroll to determine whether a given route transition should scroll to the top of the page
 *
 * @param pageTransitionScrollTarget what value should be passed to the scroll-behavior module to determine what element is scrolled. `true`indicates the window.
 * @returns {function} function which returns boolean|String depending on whether the page should scroll.  If a string , it is the ID of the element to scroll to, true if it is the window, and false if the scroll position should be preserved
 */
export default function shouldScrollToTopFactory(pageTransitionScrollTarget) {
  return function(prevRouterProps, nextRouterProps) {
    const shouldScroll = !nextRouterProps.routes.some(route => {
      if (route.suppressScrollOnRouteChange) {
        return route.suppressScrollOnRouteChange(prevRouterProps, nextRouterProps);
      }
    });
    // See https://github.com/taion/react-router-scroll#custom-scroll-behavior for info on what can be returned here
    // (https://github01.zappos.net/mweb/marty/issues/7222)
    return shouldScroll &&
      (pathNameOrSearchChanged(prevRouterProps?.location, nextRouterProps?.location) ?
        pageTransitionScrollTarget :
        !prevRouterProps && returnFromBackButton());
  };
}
/**
 * Returns true if the either the path or query string differs between the two location objects.  Explicitly does NOT take into account whether the hash changed.
 * @param oldLocation
 * @param newLocation
 * @returns {boolean}
 */
function pathNameOrSearchChanged(oldLocation, newLocation) {
  return oldLocation && (oldLocation.pathname !== newLocation.pathname || oldLocation.search !== newLocation.search); // oldLocation is undefined on first nav
}
/**
 * Issue #10763:
 * Using the performance API we can tell if a user has come back to a page with either the back or forward button.
 * Utilizing this along with prevRouterProps gives us a good idea that we're doing the right thing by returning
 * the user to their previous scroll position.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/Performance/getEntriesByType
 * window.performance.getEntriesByType returns an array. When 'navigation' is passed, one item is returned in
 * the array. This is unlike passing 'resource' which returns multiple items. Checking the array for one item
 * to be safe.
 * @returns {boolean}
 */
function returnFromBackButton() {
  const perf = window.performance;
  if (!perf) {
    return false;
  } else if (
    (typeof perf.getEntriesByType === 'function' && perf.getEntriesByType('navigation')[0]?.type === 'back_forward') ||
    perf.navigation?.type === 2
  ) {
    return true;
  }
  return false;
}
