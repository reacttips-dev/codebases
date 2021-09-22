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
import { useEnvironment } from './use-environment';
import { useScript } from './use-script';
var googleSdk = {
    src: 'https://apis.google.com/js/platform.js',
    id: 'google-sdk',
    cookiePolicy: 'single_host_origin',
};
export var useGoogle = function () {
    var googleClientId = useEnvironment().googleClientId;
    var _a = __read(useState(false), 2), isGoogleReady = _a[0], setIsGoogleReady = _a[1];
    var _b = __read(useState(), 2), useGoogleError = _b[0], setUseGoogleError = _b[1];
    var scriptLoaded = useScript({
        id: googleSdk.id,
        src: googleSdk.src,
        isAsync: true,
        isDeferred: true,
        name: 'Google Auth2',
    }).scriptLoaded;
    useEffect(function () {
        var mounted = true;
        if (scriptLoaded && !isGoogleReady && window.gapi) {
            window.gapi.load('auth2', function () {
                window.gapi.auth2
                    .init({
                    client_id: googleClientId,
                    cookie_policy: googleSdk.cookiePolicy,
                })
                    .then(function () {
                    if (mounted) {
                        setIsGoogleReady(true);
                    }
                }, function (reason) {
                    if (mounted) {
                        setIsGoogleReady(true);
                        setUseGoogleError(reason.error);
                    }
                });
            });
        }
        return function () {
            mounted = false;
        };
    }, [scriptLoaded]);
    return { isGoogleReady: isGoogleReady, useGoogleError: useGoogleError };
};
//# sourceMappingURL=use-google.js.map