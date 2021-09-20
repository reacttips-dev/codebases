import { SCRATCHPAD } from '../../appsdk/navigation/constants';
import ThemeManager from '../controllers/theme/ThemeManager';
import { isEmbeddedScratchpad } from '../utils/ScratchpadUtils';
import { ALL_WORKSPACES_IDENTIFIER, OPEN_WORKSPACE_IDENTIFIER } from '../../collaboration/navigation/constants';
import CurrentUserDetailsService from './CurrentUserDetailsService';
import { defaultOfflineWorkspaceId } from '../utils/default-workspace';
import NavigationService from './NavigationService';
import { OPEN_NETWORK_IMPORT_URL } from '../../apinetwork/navigation/constants';
import ShellHelper from '../utils/ShellHelper';
import { UPDATE_WEBVIEW_URL } from '../shell/shellActions';
import { addParamsToUrl } from '../common/utils/url';
import UIEventService from './UIEventService';
import { PageService } from '../../appsdk/services/PageService';

let ipc = pm.sdk.IPC;
const SCRATCHPAD_REQUESTER_CHANNEL = 'scratchpad-requester-channel';

let ScratchpadService = {

  init () {

    if (window.SDK_PLATFORM === 'browser') {
      return;
    }

    if (isEmbeddedScratchpad()) {
      window.addEventListener('click', this._eventHandlerForEmbeddedScratchpad);

      ipc.subscribe(SCRATCHPAD_REQUESTER_CHANNEL, this.handleEventFromOuterView);
    }

    window.addEventListener('switchToScratchpad', () => {
      ScratchpadService.switchToScratchpad();
    });

    this.attachIPCListerners();
  },

  attachIPCListerners () {
    // Subscribed to the actions received from application menu Items. Few of the app menu Items like (undo, redo, delete) are impacted by a issue https://github.com/electron/electron/issues/15728.
    // To fix the issue we have been using a workaround, which is to grab the webview reference and then apply these menu actions on webview. After the introduction of SCRATCHPAD which is a embedded webview, we have to somehow communicate
    // these menu actions to SCRATCHPAD to grab the webview and apply the actions
    // Jira-issue-link:-
    // https://postmanlabs.atlassian.net/browse/APPSDK-471
    // https://postmanlabs.atlassian.net/browse/QUAL-1366
    ipc.subscribe('menu-action-channel', (event, arg) => {
      if (PageService.activePage === SCRATCHPAD) {
        if (arg === 'undo') {
          let view = this.getEmbeddedWebView();
          view && view.undo();
        }

        if (arg === 'redo') {
          let view = this.getEmbeddedWebView();
          view && view.redo();
        }

        if (arg === 'delete') {
          let view = this.getEmbeddedWebView();
          view && view.delete();
        }
      }
    });
  },

  getEmbeddedWebView () {
    return document.querySelector('webview');
  },

  _eventHandlerForEmbeddedScratchpad (event) {
    ipc.sendToHost(SCRATCHPAD_REQUESTER_CHANNEL,
      { type: 'userEventInScratchpad' }, { data: { type: event.type } });
  },

  handleEventFromScratchpad (event) {
    let channel = event.channel,
      type = _.get(event, 'args[0].type'),
      data = _.get(event, 'args[1].data');

    if (channel !== SCRATCHPAD_REQUESTER_CHANNEL || !type) {
      return;
    }

    if (type === 'userEventInScratchpad') {
      let webview = document.querySelector('webview'),
        target = webview || document.body;

      // As the workspace switcher component has click on outside property attached
      // with eventCapturingPhase = false.If the bubbles property is not set to true,
      // this event switcher doesn't listen to this event and doesn't close up
      target.dispatchEvent(new Event(data.type, { 'bubbles': true }));
    }

    if (type === 'switchToWorkspace') {

      let currentURL = new URL(location.href),
        browserWindowId = currentURL.searchParams.get('browserWindowId');

      // when multiple windows are open, navigate only for the window from which
      // the intent was raised
      if (browserWindowId !== data.browserWindowId) {
        return;
      }

      NavigationService.transitionTo(ALL_WORKSPACES_IDENTIFIER);
    }

    if (type === 'showOrHideOverlayInOuterView') {
      this.showOrHideOverlayInOuterView(data.show);
    }

    if (type === 'changeTheme') {
      let theme = data && data.theme;

      if (!theme) {
        return;
      }

      ThemeManager.changeTheme(theme);
    }

    if (type === 'navigate') {
      data && data.route && NavigationService.transitionToURL(data.route);
    }
  },

  handleEventFromOuterView (event, opts) {
    let type = opts.type;

    if (!type || !isEmbeddedScratchpad()) {
      return;
    }

    if (type === 'openEmbeddedViewSettings') {
      pm.mediator.trigger('openSettingsModal');
    }

    if (type === 'openReleaseNotes') {
      UIEventService.publish('openReleaseNotes');
    }
  },

  sendEventToScratchpad (type, data) {
    let view = this.getEmbeddedWebView();
    if (!view) {
      pm.logger.info('ScratchpadService~sendEventToScratchpad - Webview not found');
    }

    let payload = { type, data };
    view.send && view.send(SCRATCHPAD_REQUESTER_CHANNEL, payload);

  },

  sendEventToOuterView (type, data) {
    ipc.sendToHost(SCRATCHPAD_REQUESTER_CHANNEL, { type }, { data });
  },

  switchToWorkspace () {

    // when in logged-in state and in outer web view, the sync status container shows
    // switch to workspaces CTA. Since that event will be triggered from the outer webview only,
    // we will just perform a simple navigation to workspaces
    let isLoggedIn = CurrentUserDetailsService.getCurrentUserDetails().isLoggedIn;
    if (isLoggedIn) {
      NavigationService.transitionTo(ALL_WORKSPACES_IDENTIFIER);
      return;
    }

    // if the trigger happened inside the embedded Scratch Pad, we will send the event
    // to the outer webview, which will in effect perform the navigation to workspaces
    if (isEmbeddedScratchpad()) {
      let currentURL = new URL(location.href),
        browserWindowId = currentURL.searchParams.get('browserWindowId');

      this.sendEventToOuterView('switchToWorkspace', { browserWindowId });
      return;
    }

    // this will be called when the user is in signed out Scratch Pad
    pm.mediator.trigger('showSignInModal', {
      type: 'generic',
      subtitle: 'You need an account to continue exploring Postman.',
      origin: 'ScratchpadActionServices'
    });
  },

  showOrHideOverlayInOuterView (show) {
    if (isEmbeddedScratchpad()) {
      return;
    }

    show ? pm.mediator.trigger('openEmptyOverlay')
      : pm.mediator.trigger('closeEmptyOverlay');
    return;
  },

  triggerOverlayInOuterView (show) {
    this.sendEventToOuterView('showOrHideOverlayInOuterView', { show });
  },

  /**
   * For signed out user transition to private desktop, we keep a track of whitelisted paths that will not clear the init path
   * and instead use the path that is passed as is
   * @param {*} path Path to transition to
   */
  isWhitelistedPathForScratchpadTransition (path) {
    const WHITELISTED_PATHS = [OPEN_NETWORK_IMPORT_URL, 'home'];

    return WHITELISTED_PATHS.some((whitelistedPath) => {
      return path.includes(whitelistedPath);
    });
  },

  /**
   * Get init path for scratchpad for signed out users
   */
  getInitPath (path) {
    if (this.isWhitelistedPathForScratchpadTransition(path)) {
      return path;
    }

    return '';
  },

  switchToScratchpad () {
    let isLoggedIn = CurrentUserDetailsService.getCurrentUserDetails().isLoggedIn;

    if (!isLoggedIn) {

      if (pm.isScratchpad) {
        defaultOfflineWorkspaceId().then((workspaceId) => {
          NavigationService.transitionTo(OPEN_WORKSPACE_IDENTIFIER, { wid: workspaceId });
          return;
        });
        return;
      }

      this.switchFromRequesterToScratchpad('');
      return;
    }

    NavigationService.transitionTo(SCRATCHPAD);
    return;
  },

  switchFromRequesterToScratchpad (initPath) {
    this._switchBetweenShells(/requester.html/, 'scratchpad.html', ScratchpadService.getInitPath(initPath));
  },

  switchFromScratchpadToRequester (initPath) {
    this._switchBetweenShells(/scratchpad.html/, 'requester.html', initPath);
  },

  _switchBetweenShells (currentUrlRegex, newUrlToReplace, initPath) {
    let currentLocation = window.location.href,
      regex = currentUrlRegex,
      newLocation = currentLocation.replace(regex, newUrlToReplace),
      newURL = addParamsToUrl(newLocation, { initialPath: initPath });

    ShellHelper.sendToShell(UPDATE_WEBVIEW_URL, newURL);
  }
};

export default ScratchpadService;
