/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * DS209: Avoid top-level return
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

import 'regenerator-runtime/runtime';
import 'core-js';
import './codemirror';

import React from 'react';
import ReactDOM from 'react-dom';
import Combokeys from 'combokeys';
import addCombokeysPluginGlobalBind from 'combokeys/plugins/global-bind';
import { initSentry } from './sentry';
import PageEvents from './dom/page-events';
import { SEGMENT_WRITE_KEY } from './env';
import registerKeyboardShortcuts from './keyboard-shortcuts';
import Application from './models/application';
import App from './components/App';
import 'details-element-polyfill';
import 'mdn-polyfills/HTMLCanvasElement.prototype.toBlob';
import 'path2d-polyfill';

// Setup sentry ASAP to collect errors
initSentry();

const embedded = window.location.pathname.startsWith('/embed');

// Set the embed body class at the first possible moment. This class adds
// an offset to every DOM element in the iFrame, so if it's applied later,
// everything in the layout is shifted, which is visually jarring.
if (embedded) {
  document.body.classList.add('embedded');
}

/* istanbul ignore if */
if (document.location.pathname === '/edit/index.html') {
  document.location.pathname = '/edit/';
} else {
  global.analytics.load(SEGMENT_WRITE_KEY, {
    integrations: {
      'Lucky Orange': false, // Disable Lucky Orange for editor and embeds
    },
  });

  const application = Application();
  application.start();

  global.application = application;

  ReactDOM.render(
    <React.StrictMode>
      <App application={application} />
    </React.StrictMode>,
    document.getElementById('__react-app-root'),
  );

  const combokeys = new Combokeys(document.documentElement);
  addCombokeysPluginGlobalBind(combokeys);
  // This must be called after the template is in the DOM
  registerKeyboardShortcuts(combokeys, application);

  const SECOND = 1000;
  const MINUTE = 60 * SECOND;

  const {
    activityCheck,
    userBroadcast,
    notifyAnonUserLimitsVisible,
    receivePostMessage,
    mouseenter,
    mouseleave,
    focus,
    blur,
    refreshCheck,
    securitypolicyviolation,
  } = PageEvents(application);

  window.setInterval(activityCheck(document), 5 * SECOND);
  window.setInterval(userBroadcast, 10 * SECOND);
  window.setInterval(application.sendLogSocketKeepAlive, 30 * SECOND);

  const notifyAnonTimer = 2 * MINUTE; // Two minutes
  setTimeout(notifyAnonUserLimitsVisible, notifyAnonTimer);

  window.addEventListener('message', receivePostMessage, false);

  document.body.addEventListener('mouseenter', mouseenter);
  document.body.addEventListener('mouseleave', mouseleave);
  window.addEventListener('focus', focus);
  window.addEventListener('blur', blur);
  window.addEventListener('keydown', refreshCheck);
  document.addEventListener('securitypolicyviolation', securitypolicyviolation);

  window.addEventListener('load', () => {
    application.getNewProjectTemplates();
  });
}
