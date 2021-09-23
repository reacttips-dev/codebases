import { getBaseUrl } from '../../utils/API';
import NavInjector from 'nav-helpers/NavInjector';
import NavSibling from 'nav-helpers/NavSibling';
import each from 'unified-navigation-ui/utils/each';
import navQuerySelectorAll from 'unified-navigation-ui/utils/navQuerySelectorAll';
import { disableBackgroundScrolling, restoreBackgroundScrolling } from './scrollLock';
import { remove } from '../../utils/tempStorage';
import { getPortalId } from '../../utils/getPortalId';
export function delayUntilIdle(callback) {
  var delay = window.requestIdleCallback || window.setTimeout;
  var delayOptions = delay === window.requestIdleCallback ? {
    timeout: 5000
  } : 0;
  delay(callback, delayOptions);
}

function removeElement(id) {
  var element = document.getElementById(id);

  if (element && element.parentElement) {
    element.parentElement.removeChild(element);
  }
}

function insertRootElement(element) {
  var navSibling = new NavSibling({
    key: 'trial-banner',
    element: element
  });
  NavInjector.insertBefore(navSibling);
  return navSibling;
}

function parseData(data) {
  try {
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
}

// Create trial banner query params
function createQueryParams(trialState) {
  var stringifiedTrialState = encodeURIComponent(JSON.stringify(trialState));
  return "?trialState=" + stringifiedTrialState + "&root=" + window.location.pathname.split('/')[1];
} // Get trial banner iframe src


export function getFrameSrc(_ref) {
  var trialState = _ref.trialState;
  return getBaseUrl({
    localOverride: 'TRIAL_BANNER_ENV',
    subDomain: 'app'
  }) + "/trial-banner-ui/" + getPortalId() + createQueryParams(trialState);
} // Create trial banner iframe

export function createFrameElement(_ref2) {
  var trialState = _ref2.trialState;
  var frameElement = document.createElement('iframe');
  frameElement.id = 'trial-banner-frame';
  frameElement.frameBorder = '0';
  frameElement.style.position = 'absolute';
  frameElement.style.width = '100%';
  frameElement.style.height = '0';
  frameElement.style.zIndex = '1001';
  frameElement.setAttribute('data-test-id', 'trial-banner-frame');
  frameElement.src = getFrameSrc({
    trialState: trialState
  });
  return frameElement;
}

function hideActiveNavItems() {
  each(navQuerySelectorAll('#navbar .active'), function (activeNavItem) {
    activeNavItem.classList.remove('active');
    var anchor = activeNavItem.querySelector('a');

    if (anchor) {
      anchor.setAttribute('aria-expanded', 'false');
    }
  });
}

export function removePlaceholderTrialBanner() {
  removeElement('placeholder-trial-banner-style');
  removeElement('placeholder-trial-banner');
}

function createTrialBannerMessageHandler() {
  var frameHeight = 50;
  var modalOpen = false;

  function handleMessages(_ref3) {
    var message = _ref3.message,
        blockElement = _ref3.blockElement,
        frameElement = _ref3.frameElement;
    var type = message.type;

    switch (type) {
      case 'FRAME_READY':
        {
          blockElement.style.height = '50px';
          frameElement.style.height = '50px';
          removePlaceholderTrialBanner();
          break;
        }

      case 'FRAME_CLICK':
        {
          hideActiveNavItems();
          break;
        }

      case 'MODAL_OPEN':
        {
          window.scrollTo(0, 0);
          frameElement.style.height = '100vh';
          modalOpen = true;
          disableBackgroundScrolling();
          break;
        }

      case 'MODAL_CLOSE':
        {
          modalOpen = false;
          frameElement.style.height = frameHeight + "px";
          restoreBackgroundScrolling();
          break;
        }

      case 'HEIGHT_CHANGE':
        {
          frameHeight = message.value;

          if (!modalOpen) {
            frameElement.style.height = frameHeight + "px";
          }

          break;
        }

      case 'FLYDOWN_OPEN':
        {
          frameElement.style.boxShadow = '0 30px 30px 0 rgba(0, 0, 0, 0.11), 0 15px 15px 0 rgba(0, 0, 0, 0.08)';
          break;
        }

      case 'FLYDOWN_CLOSE':
        {
          frameElement.style.boxShadow = 'unset';
          break;
        }

      case 'BANNER_CLOSE':
        {
          blockElement.style.display = 'none';
          frameElement.style.display = 'none';
          remove('PLACEHOLDER_TRIAL_BANNER');
          break;
        }

      case 'OPEN_CHAT':
        {
          frameElement.contentWindow.postMessage(message, '*');
          break;
        }

      case 'REDIRECT':
        {
          window.location.href = message.href;
          break;
        }

      case 'DOMAIN_REQUEST':
        {
          var domain = document.domain;
          frameElement.contentWindow.postMessage({
            type: 'DOMAIN_REQUEST',
            data: domain
          }, '*');
          break;
        }

      default:
    }
  }

  return handleMessages;
}

function createRootElement(trialState) {
  // Create iframe container block element
  var blockElement = document.createElement('div');
  blockElement.id = 'trial-banner-block';
  blockElement.style.display = 'relative'; // Create and append iframe to container

  var frameElement = createFrameElement({
    trialState: trialState
  });
  blockElement.appendChild(frameElement); // Handle post messages from iframe

  var messageHandler = createTrialBannerMessageHandler();
  window.addEventListener('message', function (event) {
    try {
      // Verify event is from iframe
      if (frameElement.contentWindow === event.source) {
        var message = typeof event.data === 'string' ? parseData(event.data) : event.data;

        if (message) {
          messageHandler({
            message: message,
            blockElement: blockElement,
            frameElement: frameElement
          });
        }
      }
    } catch (e) {
      return;
    }
  }); // Close flydown on outside clicks

  document.documentElement.addEventListener('click', function (event) {
    try {
      // Don't close the flydown unless the click is within the banner
      // For portal specifically, must remove if we don't use that implementation
      if (!(event.target && blockElement.contains(event.target))) {
        frameElement.contentWindow.postMessage('FLYDOWN_CLOSE', '*');
      }
    } catch (e) {
      return;
    }
  });
  return blockElement;
}

export function insertTrialBanner(trialState) {
  var rootElement = createRootElement(trialState);
  insertRootElement(rootElement);
}