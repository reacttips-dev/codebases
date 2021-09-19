import { PAGE_NUMBER_IN_URL_RE, PRODUCT_PRETTY_FRAGMENT_RE, SLASH_SEARCH_RE, ZSO_URL_RE } from 'common/regex';

/*
  Currently, suppress scroll to top for all melody checkout routes.  We might allow a few to jump to top at some point.
*/
export function shouldCheckoutIgnoreScrollToTop() {
  return true;
}

/*
  Returns true if react-router should not scroll to the top of the page for the transition.

  PDP should not scroll back to top when transitioning between different colors for the same product.
*/
export function shouldPdpIgnoreScrollToTop(prevRouterProps, newRouterProps) {
  let suppressScrollOnRouteChange = false;
  if (prevRouterProps) {
    const { params: { productId: prevProductId } } = prevRouterProps;
    const { params: { productId: newProductId }, location: { action } } = newRouterProps;
    suppressScrollOnRouteChange = prevProductId === newProductId && action === 'REPLACE';
  }
  return suppressScrollOnRouteChange;
}

/*
  Returns true if react-router should not scroll to the top of the page for the transition.
  Account should not scroll to top when updating query params for order history filtering and pagination.
*/
export function shouldAccountIgnoreScrollToTop(prevRouterProps, newRouterProps) {
  let suppressScrollOnRouteChange = false;
  if (prevRouterProps) {
    const { location: { path: prevPath, search: prevSearch } } = prevRouterProps;
    const { location: { path: newPath, search: newSearch } } = newRouterProps;
    // Only desktop order history pagination includes "overview" param
    // We don't want to ignore scrollToTop on mobile
    suppressScrollOnRouteChange = prevPath === newPath && prevSearch !== newSearch && newSearch.includes('overview');
  }
  return suppressScrollOnRouteChange;
}

/*
 * Search scroll to top
 * Facet changes shouldn't scroll to top (Mobile you have to be at top to open menu)
 * Everything else scrolls to top.
*/
const removeUrlSearchArtifices = url => url
  .replace('/marty', '')
  .replace('/filters/search/', '/search/')
  .replace(PAGE_NUMBER_IN_URL_RE, '');

export function shouldSearchIgnoreScrollToTop(prevRouterProps, newRouterProps) {
  let suppressScrollOnRouteChange = false;
  if (prevRouterProps && newRouterProps) {
    const prevPath = removeUrlSearchArtifices(prevRouterProps.location.pathname);
    const nextPath = removeUrlSearchArtifices(newRouterProps.location.pathname);
    if ((prevPath !== '/search' && nextPath !== '/search') && (ZSO_URL_RE.test(prevPath) || SLASH_SEARCH_RE.test(prevPath) || PRODUCT_PRETTY_FRAGMENT_RE.test(nextPath))) {
      suppressScrollOnRouteChange = prevPath !== nextPath;
    }
  }
  return suppressScrollOnRouteChange;
}

export const childPathFactory = parent => child => ((parent === '/') ? child : `${parent}${child}`);
