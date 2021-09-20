/**
 * Check if the current process is the main process or not. According to the docs,
 * process.type === 'browser' for the main process.
 * (https://github.com/electron/electron/blob/v7.3.2/docs/api/process.md#processtype-readonly)
 *
 * Also, if the 'process' variable is not defined, then the process cannot be the main
 * process since main is a node process and 'process' is always defined for that.
 */
function isMain () {
  return process && process.type === 'browser';
}

/**
 * Check if the app is running on the browser or not. This can be used in case the
 * window.SDK_PLATFORM is not necessarily available. For example - If some code runs in both
 * the main and renderer processes on the native app, then the SDK_PLATFORM flag won't be
 * available when the code is running in the main process.
 *
 * In those cases, we can use this function.
 */
function isBrowser () {
  // If we can say that it is the main process, then we are definitely running the native app
  if (isMain()) {
    return false;
  }

  // If it is not the main process, then we can either be in the renderer process OR running on
  // the browser. In both these cases, the window object would be present and so we can check the
  // SDK_PLATFORM flag.
  return window && (window.SDK_PLATFORM === 'browser');
}

module.exports = {
  isMain,
  isBrowser
};
