import 'navigator.sendbeacon';
var url = "/events/track";
function getPayload(deviceSessionId, props) {
    var _a, _b, _c;
    return {
        event: props.action,
        properties: (_a = props.other) !== null && _a !== void 0 ? _a : null,
        model: (_b = props.model) !== null && _b !== void 0 ? _b : null,
        uid: (_c = props.uid) !== null && _c !== void 0 ? _c : null,
        device_session_id: deviceSessionId,
    };
}
export function trackEvent(deviceSessionId, props) {
    if (typeof window === 'undefined') {
        return;
    }
    var data = getPayload(deviceSessionId, props);
    var blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    try {
        window.navigator.sendBeacon(url, blob);
    }
    catch (e) {
        window.fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify(data),
            keepalive: true,
        });
    }
}
//# sourceMappingURL=track-event.js.map