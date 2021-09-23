'use es6';

import 'I18n/classicLoader'; // Importing the logo so that bender publishes it during the build

import 'bender-url!../img/hubspot-logo.png';
import SidebarManager from './manager/SidebarManager';
import { debug, isNotificationsDebugEnabled, isNotificationsDisabled } from './util/DebugUtil';
import { isLocal } from './util/EnvUtil';
import { handleImportError } from './util/ErrorUtil';
var NOTIFICATIONS_LOAD_DELAY = 2000;

function start() {
  if (isLocal() && !isNotificationsDebugEnabled()) {
    // eslint-disable-next-line
    console.log("NOTIFICIATIONS - Exiting, it's local dev and the debug flag is not set.");
    return;
  }

  if (isNotificationsDisabled()) {
    debug('Exiting, explicitly disabled via flag.');
    return;
  }

  if (window.top !== window.parent) {
    debug('Stopping initialising managers from nested iframe');
    return;
  } // Delay setup of notifications to allow other page resources to load


  setTimeout(function () {
    import('./delayedStart'
    /* webpackChunkName: "in-app-delayed" */
    ).then(function (mod) {
      return mod.default;
    }).then(function (delayedStart) {
      return delayedStart();
    }).catch(handleImportError);
  }, NOTIFICATIONS_LOAD_DELAY);
  SidebarManager.setup();
}

start();