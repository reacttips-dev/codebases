import { onEvent } from 'helpers/EventHelpers';

let hadRouteChange = false;

/**
 * This is used to indicate to boomerang that the route changed before the plugins finished loading.
 */
export function boomerangRouteChanged() {
  hadRouteChange = true;
}

function instrumentHistoryWithBoomerang() {
  if (window.BOOMR && window.BOOMR.version) {
    const { BOOMR } = window;
    if (BOOMR.plugins && BOOMR.plugins.History) {
      // hooking into the npm history object doesn't seem to work for tracking client routing
      // so we rely on it instrumenting the window history object.
      BOOMR.plugins.History.hook(undefined, hadRouteChange);
    }
    return true;
  }
}

/**
 * Sets up boomerang library to instrument the history object once the library has finished loading.
 */
export function setupBoomerangClientRoutingTracking() {
  if (!instrumentHistoryWithBoomerang()) {
    if (document.addEventListener) {
      onEvent(document, 'onBoomerangLoaded', () => {
        instrumentHistoryWithBoomerang();
      });
    } else if (document.attachEvent) {
      document.attachEvent('onpropertychange', e => {
        e = e || window.event;
        if (e && e.propertyName === 'onBoomerangLoaded') {
          instrumentHistoryWithBoomerang();
        }
      });
    }
  }
}
