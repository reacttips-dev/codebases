import navQuerySelector from 'unified-navigation-ui/utils/navQuerySelector';
import getCurrentApp from 'unified-navigation-ui/utils/getCurrentApp';
import { getNavLinkUsageTracker, getNavUsageTracker } from './NavUsageTrackers';
import { isMobile } from 'unified-navigation-ui/utils/eventListeners';
export var NavEventType = {
  ACCOUNTS: 'ACCOUNTS',
  SEARCH: 'SEARCH'
};

function _getLevelFromClass(element) {
  if (element.className === 'primary-link') {
    return 'primary';
  } else if (element.className === 'navSecondaryLink') {
    return 'secondary';
  } else if (element.className === 'navTertiaryLink') {
    return 'tertiary';
  } else if (element.className === 'locked-item' || element.className === 'locked-item-control') {
    return 'locked-item';
  }

  return '';
}

export function inExperimentEvent(name, bucket) {
  var NavUsageTracker = getNavUsageTracker();

  if (!NavUsageTracker) {
    return;
  }

  NavUsageTracker.track('inExperiment', {
    experimentName: name,
    experimentParams: bucket
  });
}
export function navOptOutEvent() {
  var NavLinkUsageTracker = getNavLinkUsageTracker();

  if (!NavLinkUsageTracker) {
    return;
  }

  NavLinkUsageTracker.track('navOptOutEvent', {
    currentUrl: window.location.pathname,
    isNewNav: true,
    currentApp: getCurrentApp()
  });
}
export function navOptInEvent() {
  var NavLinkUsageTracker = getNavLinkUsageTracker();

  if (!NavLinkUsageTracker) {
    return;
  }

  NavLinkUsageTracker.track('navOptInEvent', {
    currentUrl: window.location.pathname,
    isNewNav: true,
    currentApp: getCurrentApp()
  });
}
export function navEvent(element, type) {
  var NavUsageTracker = getNavUsageTracker();
  var NavLinkUsageTracker = getNavLinkUsageTracker();
  var currentUrl = window.location.href.replace(/[0-9]/g, '');
  var destinationUrl = element.hasAttribute('href') ? element.getAttribute('href').replace(/[0-9]/g, '') : '';
  var payload = {
    currentUrl: currentUrl,
    destinationUrl: destinationUrl,
    currentApp: getCurrentApp(),
    isNewNav: true,
    level: _getLevelFromClass(element),
    mobile: isMobile(),
    target: element.id
  };

  if (type === 'navClickEvent' && NavLinkUsageTracker) {
    NavLinkUsageTracker.track(type, payload);
  } else if (NavUsageTracker) {
    NavUsageTracker.track(type, payload);
  }
}
export function dispatchNavEvent(eventName, payload) {
  var customEvent = payload ? new CustomEvent(eventName, {
    detail: payload
  }) : new CustomEvent(eventName);
  navQuerySelector().dispatchEvent(customEvent);
}
export function addNavEventListener(eventName, callback) {
  navQuerySelector().addEventListener(eventName, callback);
}
export function addClickTracking(element) {
  element.addEventListener('click', function () {
    navEvent(element, 'navClickEvent');
  });
}
export function addHoverTracking(element) {
  element.addEventListener('mouseenter', function () {
    if (_getLevelFromClass(element) === 'primary' && !element.parentElement.classList.contains('active')) {
      // Top level nav was hovered but the menu isn't expanded, so ignore
      return;
    } else if (_getLevelFromClass(element) === 'secondary') {
      // We handle this in `hoverTriangle.js`
      return;
    }

    navEvent(element, 'navHoverEvent');
  });
}
export function addFocusTracking(element) {
  element.addEventListener('focus', function () {
    navEvent(element, 'navFocusEvent');
  });
}