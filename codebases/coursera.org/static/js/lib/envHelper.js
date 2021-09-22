/**
 * envHelper is a library that can be included in
 * scripts that we want to work in multiple environments (browser and server)
 */

let envHelper;

const windowExists = function () {
  return typeof window !== 'undefined';
};

const hostname = function () {
  return window.location.hostname;
};

const href = function () {
  return window.location.href;
};

const referrer = function () {
  return window.document.referrer;
};

const screenHeight = function () {
  return window.screen.height;
};

const screenWidth = function () {
  return window.screen.width;
};

const isLocalStorageEnabled = function () {
  if (windowExists()) {
    try {
      const testKey = '__test__store__';
      window.localStorage.setItem(testKey, testKey);
      const value = window.localStorage.getItem(testKey);
      window.localStorage.removeItem(testKey);

      return value == testKey;
    } catch (e) {
      return false;
    }
  } else {
    return false;
  }
};

if (typeof window === 'undefined') {
  // TODO: make this work
  envHelper = {};
} else {
  envHelper = {
    windowExists,
    hostname,
    href,
    referrer,
    screenHeight,
    screenWidth,
    isLocalStorageEnabled,
  };
}

export default envHelper;
export { windowExists, hostname, href, referrer, screenHeight, screenWidth, isLocalStorageEnabled };
