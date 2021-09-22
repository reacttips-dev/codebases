// indicator that this resource is available on the page
window.cloudGlobalAsync = true;

// feature frames have third-party manager and rum passed into the frames
if (!(window.inGlobalContext && window.inGlobalContext.frame && window.inGlobalContext.frame.isFeatureFrame)){
  // RUM library for improved analytics
  require('@invisionapp/rum');

  // provides any third party tools that can be loaded
  // "later" to avoid it impacting user experience
  require('@invisionapp/third-party-manager/async-modules');
}


window.addEventListener('load', function () {
  // don't load the global service worker if we're in app-shell
  if (window.inGlobalContext && window.inGlobalContext.appShell) {
    return;
  }
  
  // for now only a few specific apps should load the global service worker
  const allowedAppNames = ['docviewer', 'prototype-share-web'];
  const currentAppName =
    window.inGlobalContext &&
    window.inGlobalContext.appMetaData &&
    window.inGlobalContext.appMetaData.appName;
  if (allowedAppNames.indexOf(currentAppName) === -1) {
    return;
  }
  
  // get the global service worker loader script from ui-gateway and run it
  const src = '/ui-gateway/service-worker/global-service-worker-loader.js';
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = src;
  script.onerror = function () {
    console.error('Failed to load ' + src);
  };
  const node = document.head || document.getElementsByTagName('head')[0];
  node.appendChild(script);
});