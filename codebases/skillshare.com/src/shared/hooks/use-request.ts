var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import useAxios from 'axios-hooks';
import { useCookies } from './use-cookies';
import { useEnvironment } from './use-environment';
export function useRequest(props) {
    if (props === void 0) { props = { isAjaxRequest: false }; }
    var cookies = useCookies().cookies;
    var csrfToken = cookies && cookies.YII_CSRF_TOKEN ? cookies.YII_CSRF_TOKEN : '';
    var appHost = useEnvironment().appHost;
    var defaultConfig = __assign({ baseURL: appHost, headers: {
            'x-csrftoken': csrfToken,
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'x-requested-with': props.isAjaxRequest ? 'XMLHttpRequest' : '',
        } }, props.options);
    var _a = __read(useAxios(defaultConfig, { manual: true }), 2), _b = _a[0], data = _b.data, loading = _b.loading, error = _b.error, response = _b.response, execute = _a[1];
    return { data: data, loading: loading, response: response, error: error, execute: execute };
}
//# sourceMappingURL=use-request.js.map