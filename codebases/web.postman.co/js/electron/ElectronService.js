const shell = require('electron').shell,
  remote = require('electron').remote,
  app = remote.app;

/**
 * Opens external links.
 *
 * @param {string} href url to open.
 * @param {string} target indicates where to open the link. Only required on browser. Default is '_self'.
 *  Supported values are '_blank', '_self', '_parent', '_top'
 */
export function openURL (href, target = '_self') {
  // noopener window feature is added to prevent the opening page(Postman) to be accessible
  // by the opened page(External Link)
  //
  // noreferrer prevents sending of the page address as referrer in the HTTP header
  if (window.SDK_PLATFORM === 'browser') {
    window.open(href, target, 'noopener,noreferrer');
  } else {
    shell.openExternal(href);
  }
}

/**
 * @method getAppInstallationId
 * @returns {String}
 */
export function getAppInstallationId () {
  // @TODO [APPSDK-667] refactor this logic once desktop platform APIs are exposed
  // On the web, there is no concept of unique installationId
  // For the desktop app, we use it to uniquely identity the signed-out users
  // On Artemis it shouldn't be needed since only signed-in users are allowed
  // On Artemis, you should be using the userId as unique identifier instead
  // Returning some valid string here just for compatibility reasons
  if (window.SDK_PLATFORM === 'browser') {
    return 'web';
  }

  return app.installationId;
}

/**
 * @method getAppVersion
 * @returns {String}
 */
export function getAppVersion () {
  // @TODO [APPSDK-667] refactor this logic once desktop platform APIs are exposed
  if (window.SDK_PLATFORM === 'browser') {
    return window.APP_VERSION;
  }

  return app.getVersion();
}

/**
 * Returns the current BrowserWindow
 */
export function getCurrentWindow () {
  let windowURL = new URL(window.location.href),
      browserWindowId = parseInt(windowURL.searchParams.get('browserWindowId'));

  return remote.BrowserWindow.fromId(browserWindowId);
}

/**
 * Returns the params attached to the BrowserWindow
 */
export function getLaunchParams () {
  if (window.SDK_PLATFORM === 'browser') {
    return Promise.resolve([{}, { session: {} }]);
  }

  return Promise.resolve(getCurrentWindow().params);
}

/**
* Returns the path to User data directory for this app
 *
 * @method getUserDataPath
 * @returns {String}
 */
export function getUserDataPath () {
  return app.getPath('userData');
}

/**
 * Returns the browser window ID for the current window
 */
export function getCurrentWindowId () {
  let windowURL = new URL(window.location.href),
    browserWindowId = parseInt(windowURL.searchParams.get('browserWindowId'));

  return browserWindowId;
}
