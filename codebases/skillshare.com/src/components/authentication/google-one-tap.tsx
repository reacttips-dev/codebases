import React from 'react';
import { addRedirectUrl } from '../../shared/helpers/add-redirect-to-parameter';
import { useCookies, useEnvironment, useNavigation, useScript } from '../../shared/hooks';
export var GoogleOneTap = function (_a) {
    var _b;
    var autoSelect = _a.autoSelect, top = _a.top, right = _a.right, left = _a.left, redirectTo = _a.redirectTo, _c = _a.onRenderOneTap, onRenderOneTap = _c === void 0 ? function () { } : _c;
    var _d = useEnvironment(), googleClientId = _d.googleClientId, appHost = _d.appHost;
    var cookies = useCookies().cookies;
    var path = useNavigation().path;
    var csrfToken = (_b = cookies.YII_CSRF_TOKEN) !== null && _b !== void 0 ? _b : '';
    var continueGoogleOneTap = function (notification) {
        if (notification.isNotDisplayed()) {
            return;
        }
        onRenderOneTap();
    };
    if (typeof window !== 'undefined') {
        window.continueGoogleOneTap = continueGoogleOneTap;
    }
    useScript({
        id: 'google-ot-script',
        src: 'https://accounts.google.com/gsi/client',
        isAsync: true,
        isDeferred: true,
        name: 'Google One Tap',
    });
    return (React.createElement("div", { id: "g_id_onload", "data-client_id": googleClientId, "data-login_uri": addRedirectUrl(appHost + "/site/loginViaGoogle", redirectTo !== null && redirectTo !== void 0 ? redirectTo : path), "data-auto_select": autoSelect, "data-prompt_parent_id": "g_id_onload", "data-method": "one-tap", "data-yii_csrf_token": csrfToken, "data-moment_callback": "continueGoogleOneTap", style: {
            position: 'fixed',
            zIndex: 999999,
            top: top,
            right: right,
            left: left,
        } }));
};
//# sourceMappingURL=google-one-tap.js.map