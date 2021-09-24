import enviro from 'enviro';
import Raven from 'Raven';
import { track } from '../common/eventTracking/tracker';
import getLang from 'I18n/utils/getLang';
import { QA } from 'self-service-api/constants/Environments';

var getQueryParam = function getQueryParam(isRetailPortal, isAssignable) {
  if (isRetailPortal) {
    return 'show-retail-tts-chat-en';
  } else if (isAssignable) {
    return 'show-assignable-tts-chat-en';
  } else {
    return "show-unassignable-tts-chat-" + getLang();
  }
};

var openSalesChat = function openSalesChat(hostWindow, upgradeData) {
  if (!hostWindow.HubSpotConversations) {
    Raven.captureMessage('Attempted to open chat without the widget being loaded', {
      tags: {
        location: hostWindow.location.href
      }
    });
    return;
  }

  if (hostWindow.hubspot && hostWindow.hubspot.zorse && !hostWindow.hubspot.zorse.supressed) {
    hostWindow.hubspot.zorse.minimizeZorseWidgetButton();
  }

  hostWindow.HubSpotConversations.on('conversationStarted', function (__payload) {
    track('communicationMethodsInteraction', Object.assign({
      action: 'started conversation'
    }, upgradeData));
  });
  hostWindow.HubSpotConversations.on('conversationClosed', function (__payload) {
    track('communicationMethodsInteraction', Object.assign({
      action: 'ended conversation'
    }, upgradeData));
    hostWindow.HubSpotConversations.widget.close();

    if (hostWindow.hubspot && hostWindow.hubspot.zorse && !hostWindow.hubspot.zorse.supressed) {
      hostWindow.hubspot.zorse.restoreZorseWidgetButton();
    }
  });
  hostWindow.HubSpotConversations.widget.remove();
  hostWindow.HubSpotConversations.widget.load({
    widgetOpen: true
  });
};

var mountConversationsScriptTag = function mountConversationsScriptTag(hostWindow) {
  var qa = enviro.isProd() ? '' : QA;
  var chatPortal = enviro.isProd() ? '53' : '100048175';
  var script = hostWindow.document.createElement('script');
  var env = enviro.getShort();
  script.type = 'text/javascript';
  script.id = 'hubspot-messages-loader';
  script.async = false;
  script.defer = false;
  script.src = "//js.usemessages" + qa + ".com/conversations-embed.js";
  script.setAttribute('data-hsjs-portal', chatPortal);
  script.setAttribute('data-hsjs-env', env);
  hostWindow.document.body.appendChild(script);
};
/**
 * Adds the required query parameter, loads the Conversations script tag,
 * and opens the chat when it's ready.
 *
 *
 * Note that `show-tts-chat=true` is a specific query parameter for
 * the [chatflow in 53](https://app.hubspot.com/chatflows/53/edit/live-chat/548260/target).
 */


export var loadAndOpenSalesChatInWindow = function loadAndOpenSalesChatInWindow(hostWindow) {
  return function (_ref) {
    var upgradeData = _ref.upgradeData,
        _ref$isRetail = _ref.isRetail,
        isRetail = _ref$isRetail === void 0 ? false : _ref$isRetail,
        _ref$isAssignable = _ref.isAssignable,
        isAssignable = _ref$isAssignable === void 0 ? false : _ref$isAssignable;

    // When in a modal, post this the parent, and the parent will open chat
    if (hostWindow.self !== hostWindow.top) {
      hostWindow.parent.postMessage({
        type: 'OPEN_CHAT',
        data: Object.assign({}, upgradeData, {
          isRetail: isRetail,
          upgradeData: upgradeData,
          isAssignable: isAssignable
        })
      }, '*');
      return;
    }

    hostWindow.hsConversationsSettings = {
      loadImmediately: true
    };
    var queryParam = "" + (hostWindow.location.search.length ? '&' : '?') + getQueryParam(isRetail, isAssignable) + "=true";
    var queryParamIsPresent = hostWindow.location.search.includes(queryParam.slice(1));

    if (!queryParamIsPresent) {
      hostWindow.history.pushState(null, '', "" + hostWindow.location.href + queryParam);
    }

    if (hostWindow.HubSpotConversations) {
      openSalesChat(hostWindow, upgradeData);
    } else {
      hostWindow.hsConversationsOnReady = [function () {
        return openSalesChat(hostWindow, upgradeData);
      }];
      mountConversationsScriptTag(hostWindow);
    }
  };
};
export var loadAndOpenSalesChat = function loadAndOpenSalesChat(params) {
  return loadAndOpenSalesChatInWindow(window)(params);
};