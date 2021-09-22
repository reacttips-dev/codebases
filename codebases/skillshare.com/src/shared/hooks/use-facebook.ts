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
import { useEffect, useRef, useState } from 'react';
import { useEnvironment } from './use-environment';
import { useScript } from './use-script';
var facebookSdk = {
    src: 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v5.0',
    id: 'facebook-jssdk',
    version: 'v5.0',
    name: 'facebook',
    crossOrigin: 'anonymous',
};
export var useFacebook = function () {
    var mountedRef = useRef(true);
    var asyncCallbackNotCalled = useScript({
        id: facebookSdk.id,
        src: facebookSdk.src,
        isAsync: true,
        isDeferred: true,
        name: facebookSdk.name,
        crossOrigin: facebookSdk.crossOrigin,
        hasAsyncInitCallback: true,
    }).asyncCallbackNotCalled;
    var _a = __read(useState(false), 2), isFacebookReady = _a[0], setIsFacebookReady = _a[1];
    var facebookId = useEnvironment().facebookId;
    var fbAsyncInit = function () {
        window.FB.init({
            appId: facebookId !== null && facebookId !== void 0 ? facebookId : '',
            version: facebookSdk.version,
            status: false,
            cookie: true,
            xfbml: true,
        });
        if (mountedRef.current) {
            setIsFacebookReady(true);
        }
    };
    if (typeof window !== 'undefined') {
        window.fbAsyncInit = fbAsyncInit;
    }
    useEffect(function () {
        if (mountedRef.current) {
            setIsFacebookReady(true);
        }
    }, [asyncCallbackNotCalled]);
    useEffect(function () {
        return function () {
            mountedRef.current = false;
        };
    }, []);
    return { isFacebookReady: isFacebookReady };
};
//# sourceMappingURL=use-facebook.js.map