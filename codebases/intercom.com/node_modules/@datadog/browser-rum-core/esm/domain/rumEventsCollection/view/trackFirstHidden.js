import { addEventListener } from '@datadog/browser-core';
var trackFirstHiddenSingleton;
var stopListeners;
export function trackFirstHidden(emitter) {
    if (emitter === void 0) { emitter = window; }
    if (!trackFirstHiddenSingleton) {
        if (document.visibilityState === 'hidden') {
            trackFirstHiddenSingleton = { timeStamp: 0 };
        }
        else {
            trackFirstHiddenSingleton = {
                timeStamp: Infinity,
            };
            (stopListeners = addEventListener(emitter, "pagehide" /* PAGE_HIDE */, function (_a) {
                var timeStamp = _a.timeStamp;
                trackFirstHiddenSingleton.timeStamp = timeStamp;
            }, { capture: true, once: true }).stop);
        }
    }
    return trackFirstHiddenSingleton;
}
export function resetFirstHidden() {
    if (stopListeners) {
        stopListeners();
    }
    trackFirstHiddenSingleton = undefined;
}
//# sourceMappingURL=trackFirstHidden.js.map