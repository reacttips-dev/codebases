import series from 'async/series';
import { Config } from '../boot/bootConfig';
import Logger from '../boot/bootLogger';
import Messaging from '../boot/bootMessaging';
import Telemetry from '../boot/bootTelemetry';
import bootThemeManager from '../boot/bootThemeManager';
import initializeNavigation, { triggerInitialNavigation } from '../boot/initializeNavigation';
import StaticPageRegistrationService from '../../../appsdk/services/StaticPageRegistrationService';
import getPartitionIdForSignedOutUser from '../../modules/partition-manager/getPartitionIdForSignedOutUser';
import PerformanceTelemetryService from '../../services/PerformanceTelemetryService';
import BrowserLocationService from '../../services/BrowserLocationService';
import CurrentUserDetailsService from '../../services/CurrentUserDetailsService';

const WINDOW_NAME = 'requester';

/**
 * Fetches theme for home
 */
function getTheme () {
  let settingsPartition = localStorage.getItem(`settings-${getPartitionIdForSignedOutUser()}`);
  settingsPartition = settingsPartition ? JSON.parse(settingsPartition) : null;
  if (settingsPartition && settingsPartition.postmanTheme) {
    return settingsPartition.postmanTheme;
  }
  return 'light';
}

/**
 *
 * @param {*} cb
 */
export default function init (cb) {

  // Mock shortcuts. Shortcuts currently use the store for a lot of the functionality
  // so it's not possible to directly initialize them without mocking the globals.
  pm.app = {
    registerMenuActions: function () {
      if (!pm.shortcuts) {
        return;
      }
    },
    get: function (key) {
      switch (key) {
        case 'shortcutsDisabled':
          return false;
        default:
          return null;
      }
    }
  };

  pm.shortcuts = {
    defaultShortcuts: [{
      name: 'universalSearchFocus',
      label: 'Search',
      shortcut: 'mod+k',
      keyLabel: 'Ctrl+K',
      keyLabelDarwin: '⌘K'
    }],
    getShortcuts: () => {
      return {
        'universalSearchFocus': 'mod+k'
      };
    },
    handle: (item) => {
      switch (item) {
        case 'universalSearchFocus':
          return () => {
            window.dispatchEvent(new Event('universalSearchFocus'));
          };
        default:
          () => { };
          break;
      }
    },
    shouldOverrideBrowser: (shortcut) => {
      if (!shortcut) {
        return false;
      }
      return shortcut === 'universalSearchFocus';
    }
  };

  pm.settings = {
    getSetting: (key) => {
      switch (key) {
        case 'postmanTheme':
          return getTheme();
        case 'googleAnalytics':
          return window.SDK_PLATFORM === 'browser' ? true : false;
        default:
          return false;
      }

    }
  };

  const bootConfig = Config.init({
    process: WINDOW_NAME,
    ui: true
  });

  const initSequence = [
    bootConfig,
    CurrentUserDetailsService.init,
    Logger,
    Messaging,
    Telemetry
  ];

  series(initSequence, (err) => {

    if (err) {
      pm.logger.error('Error in requester boot sequence', err);
    }

    // Initialize navigation
    let locationService = BrowserLocationService;
    initializeNavigation(WINDOW_NAME, locationService);

    bootThemeManager(() => { }, getTheme());

    PerformanceTelemetryService.init({
      applicationName: `artemis-${window.RELEASE_CHANNEL}`,
      applicationVersion: 1
    });

    if (!CurrentUserDetailsService.getCurrentUserDetails().isLoggedIn) {
      // Initialize page service with static pages
      StaticPageRegistrationService();
    }

    // triggers initial navigation
    triggerInitialNavigation(cb);

  });
}
