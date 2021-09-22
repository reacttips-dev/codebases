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
export var useScript = function (_a) {
    var id = _a.id, src = _a.src, isAsync = _a.isAsync, isDeferred = _a.isDeferred, name = _a.name, crossOrigin = _a.crossOrigin, _b = _a.hasAsyncInitCallback, hasAsyncInitCallback = _b === void 0 ? false : _b;
    var _c = __read(useState(false), 2), scriptLoaded = _c[0], setLoaded = _c[1];
    var _d = __read(useState(false), 2), asyncCallbackNotCalled = _d[0], setAsyncCallbackNotCalled = _d[1];
    var _e = __read(useState(), 2), error = _e[0], setError = _e[1];
    useEffect(function () {
        var mounted = true;
        var script;
        var onScriptLoad = function () {
            if (mounted) {
                setLoaded(true);
            }
        };
        var onScriptError = function () {
            if (mounted) {
                setError("Failed to load " + name + " script");
                setLoaded(false);
            }
        };
        if (!document.getElementById(id)) {
            script = document.createElement('script');
            script.src = src;
            script.async = isAsync;
            script.defer = isDeferred;
            script.id = id;
            if (crossOrigin) {
                script.crossOrigin = crossOrigin;
            }
            document.body.appendChild(script);
            script.addEventListener('load', onScriptLoad);
            script.addEventListener('error', onScriptError);
        }
        else {
            if (mounted) {
                if (hasAsyncInitCallback) {
                    setAsyncCallbackNotCalled(true);
                }
                setLoaded(true);
            }
        }
        return function () {
            mounted = false;
            if (script) {
                script.removeEventListener('load', onScriptLoad);
                script.removeEventListener('error', onScriptError);
            }
        };
    }, []);
    return { scriptLoaded: scriptLoaded, asyncCallbackNotCalled: asyncCallbackNotCalled, error: error };
};
//# sourceMappingURL=use-script.js.map