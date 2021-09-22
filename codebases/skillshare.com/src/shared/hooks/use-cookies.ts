import { useContext } from 'react';
import jsCookie from 'js-cookie';
import { CookieContext } from '../../components/providers';
export function useCookies() {
    var cookies = useContext(CookieContext).cookies;
    var hasCookie = function (key) {
        return !!(cookies && Object.keys(cookies).find(function (k) { return !!k.match(key); }));
    };
    var setCookie = function (_a) {
        var key = _a.key, value = _a.value, options = _a.options;
        if (!cookies) {
            return;
        }
        cookies[key] = value;
        jsCookie.set(key, value, options);
    };
    var getCookie = function (key) {
        if (!cookies) {
            return;
        }
        if (cookies[key]) {
            return cookies[key];
        }
        return jsCookie.get(key);
    };
    var removeCookie = function (key) {
        if (!cookies) {
            return;
        }
        delete cookies[key];
        jsCookie.remove(key);
    };
    return {
        cookies: cookies,
        hasCookie: hasCookie,
        setCookie: setCookie,
        getCookie: getCookie,
        removeCookie: removeCookie,
    };
}
//# sourceMappingURL=use-cookies.js.map