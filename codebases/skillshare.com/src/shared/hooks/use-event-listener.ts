import { useEffect } from 'react';
export function useEventListener(_a) {
    var eventName = _a.eventName, handler = _a.handler, element = _a.element;
    useEffect(function () {
        var clientElement = element !== null && element !== void 0 ? element : window;
        var isSupported = clientElement && clientElement.addEventListener;
        if (!isSupported) {
            return;
        }
        var eventListener = function (event) {
            handler(event);
        };
        clientElement.addEventListener(eventName, eventListener);
        return function () {
            clientElement.removeEventListener(eventName, eventListener);
        };
    }, [eventName, handler, element]);
}
//# sourceMappingURL=use-event-listener.js.map