var mode;

var isMobile = function isMobile() {
  return mode === 'mobile';
};

var setupMobileSwitchListener = function setupMobileSwitchListener() {
  document.addEventListener('switchedToMobile', function () {
    mode = 'mobile';
  });
  document.addEventListener('switchedToDesktop', function () {
    mode = 'desktop';
  });
};

var addDesktopEventListener = function addDesktopEventListener(element, eventType, listener) {
  if (!element) {
    return;
  }

  element.addEventListener(eventType, function (e) {
    if (!mode || mode === 'desktop') {
      listener(e);
    }
  });
};

var addMobileEventListener = function addMobileEventListener(element, eventType, listener) {
  if (!element) {
    return;
  }

  element.addEventListener(eventType, function (e) {
    if (!mode || mode === 'mobile') {
      listener(e);
    }
  });
};

export { isMobile, setupMobileSwitchListener, addDesktopEventListener, addMobileEventListener };