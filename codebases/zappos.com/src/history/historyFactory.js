import marketplace from 'cfg/marketplace.json';
import createSmartHistory from 'history/createSmartHistory';
import { getForceRefreshConfig } from 'helpers/ClientUtils';

const { homepage, desktopBaseUrl, mobileBaseUrl } = marketplace;

/**
 * Removes any part of the URL that is not the path
 * @param {string} url
 * @return {string} URL without scheme and domain, or unchanged otherwise
 */
function stripSchemeAndDomain(url) {
  return !url
    ? url
    : url.replace(desktopBaseUrl, '')
      .replace(mobileBaseUrl, '');
}

export function urlCleanser(url) {
  if (typeof url === 'string') {
    return stripSchemeAndDomain(url);
  } else if (url && typeof url === 'object' && typeof url.pathname === 'string') {
    const cleanPath = stripSchemeAndDomain(url.pathname);
    return Object.assign({}, url, { pathname: cleanPath });
  } else {
    return url;
  }
}

const homePageLandingRE = new RegExp(`/c/${homepage}`);
export const checkIsHomepage = pathname => /^\/(\?.*)?(#.*)?$/.test(pathname) || homePageLandingRE.test(pathname);

// derives the page type of url (generally based around route).  Should then map to an item in `forceRefresh` config.
export function getType(url) {
  switch (true) {
    case /^(?:\/marty)?\/(ap|zap)\//.test(url):
      return 'zap';
    case /^(?:\/marty)?\/search|.*.zso/.test(url):
    case /^(?:\/marty)?(?:\/filters)?\/search/.test(url):
      return 'search';
    case /^(?:\/marty)?\/(product\/\d+|p\/asin\/\w+|p\/[\w-]+|\/product\/\d+)/.test(url):
      return 'pdp';
    case /^(?:\/marty)?\/i\/\d+/.test(url):
      return 'images';
    case checkIsHomepage(url):
      return 'homepage';
    case /^(?:\/marty)?\/(?:b\/[^/]+\/)?brand\/\d+?/.test(url):
      return 'brand';
    case /^(?:\/marty)?(\/c)?\/survey/.test(url): // above landing for /c/survey to match
      return 'hmd';
    case /^(?:\/marty)?\/c\//.test(url):
      return 'landing';
    case /^(?:\/marty)?\/product\/review\/(?:(?:p\/)?add\/(?:media\/)?)?\d+/.test(url):
      return 'reviews';
    case /^(?:\/marty)?\/cart/.test(url):
      return 'cart';
    case /^(?:\/marty)?\/checkout/.test(url):
      return 'checkout';
    case /^(?:\/marty)?\/confirmation\//.test(url):
      return 'confirmation';
    case /^(?:\/marty)?\/account\/favorites/.test(url):
      return 'favorites';
    case /^(?:\/marty)?\/account/.test(url):
      return 'account';
    case /^(?:\/marty)?\/orders\/\d/.test(url):
      return 'orderInformation';
    case /^(?:\/marty)?\/orders/.test(url):
      return 'orders';
    case /^(?:\/marty)?\/address/.test(url):
      return 'address';
    case /^(?:\/marty)?\/payment/.test(url):
      return 'payment';
    case /^(?:\/marty)?\/return/.test(url):
    case /^(?:\/marty)?\/returns/.test(url):
      return 'returns';
    case /^(?:\/marty)?\/exchange/.test(url):
      return 'exchanges';
    case /^(?:\/marty)?\/vip\/dashboard/.test(url):
    case /^(?:\/marty)?\/rewards\/dashboard/.test(url):
      return 'rewards';
    case /^(?:\/marty)?\/shipments\//.test(url):
      return 'shipments';
    case /^(?:\/marty)?\/livechat/.test(url):
      return 'livechat';
    case /^(?:\/marty)?\/subscriptions/.test(url):
      return 'subscriptions';
    case /^(?:\/marty)?\/(egiftcard|gift-certificate)/.test(url):
      return 'egc';
    case /^(?:\/marty)?\/create-label/.test(url):
      return 'createlabel';
    case /^(?:\/marty)?\/outfit\//.test(url):
      return 'outfit';
    case /^(?:\/marty)?\/influencer\/hub/.test(url):
      return 'influencerhub';
    case /^(?:\/marty)?\/influencer/.test(url):
      return 'influencer';
    default:
      return null;
  }
}

export function shouldForceRefresh(url, currentUrl = null, forceRefresh = getForceRefreshConfig(marketplace)) {
  const urlType = getType(url);
  // if we're going to auth we want a full page load because we haven't implemented auth ever
  if (urlType === 'zap') {
    return true;
  }

  // if we're going to the same type of page (e.g search -> search, or pdp -> a different pdp), just client nav
  if (urlType && urlType === getType(currentUrl)) {
    return false;
  }

  if (urlType in forceRefresh) {
    return forceRefresh[urlType];
  }

  return true;
}

const alwaysForceRefresh = () => true;
const neverForceRefresh = () => false;

/*
  Returns a history implementation based on the environment. If no error condition or environment configuration is specified, it falls back to urls which match `html5RouteRe` to use html5 history and all other urls result in a full refresh.
*/
export default function historyFactory({ alwaysUseHtml5, pageError }, smartHistory = createSmartHistory) {
  let refreshFunction;
  if (pageError) {
    refreshFunction = alwaysForceRefresh;
  } else if (alwaysUseHtml5) {
    refreshFunction = neverForceRefresh;
  } else {
    refreshFunction = shouldForceRefresh;
  }

  return smartHistory({
    urlCleanser,
    shouldForceRefresh: refreshFunction
  });
}
