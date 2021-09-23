import navQuerySelector from 'unified-navigation-ui/utils/navQuerySelector';
import { loadIframe } from 'unified-navigation-ui/utils/loadDependentScripts';
import { getPortalId } from 'unified-navigation-ui/js/utils/getPortalId';
import { getQueryParam } from 'unified-navigation-ui/utils/queryParamHelpers';
import { globalNavHeight, globalNavHeightNumber } from 'nav-meta/global-nav-height';
var iframeElement;
var searchIframeDomainInfo = getIframeSrc();
var URL_SEARCH_KEY_WORDS = 'globalSearchQuery';
var searchParent;
var searchInput;
var searchKeyword = getSearchKeyWordsFromPath();
var searchInputId = 'navSearch-input';
var POST_MESSAGE_ROOT_KEY = 'global_search';
var WINDOW_MESSAGE_CODES = {
  ROUTE: 'route',
  CLOSE: 'close'
};
export function setupSearch() {
  if (!searchIframeDomainInfo.domain) return;
  searchParent = navQuerySelector('.navSearch-v2');
  searchInput = searchParent.querySelector("#" + searchInputId);
  registerSearchInputListener();

  if (searchKeyword) {
    searchInput.dispatchEvent(new Event('click'));
  }
}
export function getIframeSrc() {
  var ENABLED_APP_DOMAINS = ['localhost', 'local.hubspotqa.com', 'local.hubspot.com', 'app.hubspotqa.com', 'app.hubspot.com', 'hubspotqa.com', 'hubspot.com'];
  var domain = document.domain.toLowerCase() || '';
  if (!domain || !ENABLED_APP_DOMAINS.includes(domain)) return {
    domain: '',
    iframeSrc: ''
  };
  var isDevelopmentMode = process.env.NODE_ENV === 'development';
  var domainSuffix = domain.indexOf('qa') >= 0 ? 'qa' : '';
  var portalId = getPortalId();
  var prefix = isDevelopmentMode ? 'local' : 'app';
  return {
    domain: "https://" + prefix + ".hubspot" + domainSuffix + ".com",
    iframeSrc: "https://" + prefix + ".hubspot" + domainSuffix + ".com/global-search-ui/" + portalId
  };
}

var searchInputClickHandler = function searchInputClickHandler(event) {
  if (event.target.id !== searchInputId) return;

  if (iframeElement == null) {
    loadSearchIframe({
      width: window.innerWidth,
      height: document.scrollingElement.scrollHeight
    });
    initialSearchBox();
    return;
  }

  if (iframeElement.hidden) {
    initialSearchBox();
    iframeElement.hidden = false;
  }
};

var searchInputKeyUpHandler = function searchInputKeyUpHandler(event) {
  searchKeyword = event.target.value || '';
  sentMessageToIframe(searchKeyword);
};

function registerSearchInputListener() {
  searchInput.addEventListener('click', searchInputClickHandler);
  searchInput.addEventListener('keyup', searchInputKeyUpHandler);
}

function removeSearchInputListener() {
  searchInput.removeEventListener('click', searchInputClickHandler);
  searchInput.removeEventListener('keyup', searchInputKeyUpHandler);
}

function initialSearchBox() {
  searchParent.className = searchParent.className + " open";
  searchInput.value = searchKeyword;
}

function sentMessageToIframe(message) {
  var wn = iframeElement.contentWindow;
  wn.postMessage({
    key: POST_MESSAGE_ROOT_KEY,
    message: message
  }, searchIframeDomainInfo.domain);
}

function getSearchKeyWordsFromPath() {
  return getQueryParam(URL_SEARCH_KEY_WORDS) || '';
}

function loadSearchIframe(_ref) {
  var width = _ref.width,
      height = _ref.height;
  // Todo: z-index should be "UranusLayer": "value": "1211" or less
  // for now just keep 2001 to reuse the old css stuff
  // will take care css stuff later
  loadIframe(searchIframeDomainInfo.iframeSrc, {
    height: height || '100vw',
    width: width || "calc(100vh - " + globalNavHeight + ")",
    style: "position: absolute; top: " + globalNavHeight + "; z-index:2001; opacity: 1; left: 0; border: none;",
    id: 'global-search',
    onload: onLoadedSearchIframe,
    onerror: failToLoadSearch,
    allowfullscreen: ''
  });
}

function onLoadedSearchIframe() {
  iframeElement = document.querySelector('#global-search');
  registerWindowListener();
  window.scrollTo(0, 0);
  sentMessageToIframe(searchKeyword);
}

function failToLoadSearch() {
  console.warn('fail to load search iframe');
}

function setIframeStyle(_ref2) {
  var width = _ref2.width,
      height = _ref2.height,
      hidden = _ref2.hidden;
  iframeElement.width = width || iframeElement.width;
  iframeElement.height = height || iframeElement.height;
  iframeElement.hidden = hidden || iframeElement.hidden;
}

var windowResize = function windowResize() {
  setIframeStyle({
    width: window.innerWidth,
    height: window.innerHeight - globalNavHeightNumber
  });
};

var windowMessageAction = function windowMessageAction(event) {
  if (event.origin !== searchIframeDomainInfo.domain || typeof event.data !== 'string') {
    return;
  }

  try {
    var codes = JSON.parse(event.data || '{}');

    if (Object.keys(codes).length < 2 || codes.app !== POST_MESSAGE_ROOT_KEY) {
      return;
    }

    switch (codes.key) {
      case WINDOW_MESSAGE_CODES.CLOSE:
        {
          closeSearch();
          break;
        }

      case WINDOW_MESSAGE_CODES.ROUTE:
        {
          if (!codes.url) return;
          routeToViews(codes.url);
          break;
        }

      default:
        // Todo: escape(code);
        break;
    }
  } catch (error) {
    console.warn(error);
  }
};

function registerWindowListener() {
  window.addEventListener('resize', windowResize);
  window.addEventListener('message', windowMessageAction);
}

function removeWindowListener() {
  window.removeEventListener('resize', windowResize);
  window.removeEventListener('message', windowMessageAction);
}

function closeSearch() {
  iframeElement.hidden = true;
  searchParent.className = searchParent.className.replace(' open', '');
  sentMessageToIframe(searchKeyword = '');
}

function routeToViews(route) {
  if (!route) return;
  var url = decodeURI(route);
  var isExternalURl = url.startsWith('https://') || url.startsWith('http://');

  try {
    if (isExternalURl) {
      window.open(url, '_blank', 'noopener');
    } else {
      document.location.href = url;
      removeWindowListener();
      removeSearchInputListener();
    }
  } catch (error) {
    console.warn(error);
  }
}

export default {
  setupSearch: setupSearch
};