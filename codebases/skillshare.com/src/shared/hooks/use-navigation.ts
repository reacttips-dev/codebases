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
import { useEffect, useState } from 'react';
export var useNavigation = function () {
    var _a = __read(useState(''), 2), path = _a[0], setPath = _a[1];
    var _b = __read(useState(''), 2), via = _b[0], setVia = _b[1];
    var _c = __read(useState(null), 2), redirectTo = _c[0], setRedirectTo = _c[1];
    var checkWindow = function () {
        return typeof window === 'object';
    };
    var setOptions = function () {
        var _a;
        if (checkWindow()) {
            setPath(window.location.pathname);
            var params = new URLSearchParams(window.location.search);
            var paramVia = (_a = params.get('via')) !== null && _a !== void 0 ? _a : '';
            var paramRedirectTo = params.get('redirectTo');
            setVia(paramVia);
            setRedirectTo(paramRedirectTo);
        }
    };
    useEffect(function () {
        setOptions();
    });
    return { path: path, via: via, redirectTo: redirectTo };
};
//# sourceMappingURL=use-navigation.js.map