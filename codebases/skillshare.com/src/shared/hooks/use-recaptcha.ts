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
export var useRecaptcha = function () {
    var _a = __read(useState(), 2), recaptchaResponse = _a[0], setRecaptchaResponse = _a[1];
    var _b = __read(useState(true), 2), isRecaptchaLoading = _b[0], setIsRecaptchaLoading = _b[1];
    var _c = __read(useState(), 2), recaptchaError = _c[0], setRecaptchaError = _c[1];
    var recaptcha = useEnvironment().recaptcha;
    var recaptchaRef = useRef(null);
    var recaptchaId = useRef(0);
    var scriptLoaded = useScript({
        id: 'recaptcha-id',
        src: 'https://www.google.com/recaptcha/api.js',
        isAsync: true,
        isDeferred: true,
        name: 'Recaptcha',
    }).scriptLoaded;
    useEffect(function () {
        var mounted = true;
        var captchaElement = recaptchaRef.current;
        if (scriptLoaded && typeof window.grecaptcha !== 'undefined' && captchaElement) {
            var captchaCallback_1 = function (response) {
                if (mounted) {
                    window.grecaptcha.reset(recaptchaId.current);
                    setIsRecaptchaLoading(false);
                    setRecaptchaResponse(response);
                }
            };
            var captchaErrorCallback_1 = function () {
                if (mounted) {
                    setIsRecaptchaLoading(false);
                    setRecaptchaError('Something went wrong. Please try again.');
                }
            };
            window.grecaptcha.ready(function () {
                recaptchaId.current = window.grecaptcha.render(captchaElement, {
                    sitekey: recaptcha.siteKey,
                    size: 'invisible',
                    callback: captchaCallback_1,
                    'error-callback': captchaErrorCallback_1,
                });
                setIsRecaptchaLoading(false);
            });
        }
        return function () {
            mounted = false;
        };
    }, [scriptLoaded]);
    var executeRecaptcha = function () {
        window.grecaptcha.execute(recaptchaId.current);
    };
    return {
        isRecaptchaLoading: isRecaptchaLoading,
        executeRecaptcha: executeRecaptcha,
        recaptchaResponse: recaptchaResponse,
        recaptchaRef: recaptchaRef,
        recaptchaError: recaptchaError,
    };
};
//# sourceMappingURL=use-recaptcha.js.map