import { trackEvent } from '../helpers/track-event';
import { useCookies } from './use-cookies';
export function useTrackEvent() {
    var _a;
    var cookies = useCookies().cookies;
    var deviceSessionId = (_a = cookies === null || cookies === void 0 ? void 0 : cookies.device_session_id) !== null && _a !== void 0 ? _a : '';
    var trackEventWrapped = function (props) {
        trackEvent(deviceSessionId, props);
    };
    return [trackEventWrapped];
}
//# sourceMappingURL=use-track-event.js.map