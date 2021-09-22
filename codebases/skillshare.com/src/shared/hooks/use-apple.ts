var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { useEffect } from 'react';
import { addRedirectUrl } from '../helpers/add-redirect-to-parameter';
import { useCookies } from './use-cookies';
import { useEnvironment } from './use-environment';
import { useScript } from './use-script';
var signInWithPopup = function (redirectUrl) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, authorization, user, formData, requestUrl, url, response, redirectTo;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4, globalThis.AppleID.auth.signIn()];
            case 1:
                _a = _b.sent(), authorization = _a.authorization, user = _a.user;
                formData = new URLSearchParams();
                formData.append('id_token', authorization.id_token);
                formData.append('code', authorization.code);
                formData.append('state', authorization.state);
                if (user) {
                    formData.append('user', JSON.stringify(user));
                }
                requestUrl = '/site/loginViaApple';
                url = addRedirectUrl(requestUrl, redirectUrl);
                return [4, fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'X-Requested-With': 'XMLHttpRequest',
                            Accept: 'application/json',
                        },
                        body: formData,
                    })];
            case 2:
                response = _b.sent();
                return [4, response.json()];
            case 3:
                redirectTo = (_b.sent()).redirectTo;
                globalThis.location.assign(redirectTo !== null && redirectTo !== void 0 ? redirectTo : globalThis.location.href);
                return [2];
        }
    });
}); };
export var useApple = function (redirectUrl) {
    var appleClientId = useEnvironment().appleClientId;
    var cookies = useCookies().cookies;
    var csrfToken = cookies && cookies.YII_CSRF_TOKEN ? cookies.YII_CSRF_TOKEN : '';
    var scriptLoaded = useScript({
        id: 'appleid-auth',
        src: 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js',
        isAsync: true,
        isDeferred: true,
        name: 'Sign-in with Apple',
    }).scriptLoaded;
    useEffect(function () {
        if (!scriptLoaded || !globalThis.AppleID) {
            return;
        }
        globalThis.AppleID.auth.init({
            clientId: appleClientId || 'com.skillshare.Skillshare.SignIn',
            scope: 'name email',
            state: csrfToken,
            redirectURI: globalThis.location.origin + "/site/loginViaApple",
            usePopup: true,
        });
    }, [scriptLoaded]);
    var appleSignIn = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, signInWithPopup(redirectUrl)];
                case 1: return [2, _a.sent()];
            }
        });
    }); };
    return { appleSignIn: appleSignIn };
};
//# sourceMappingURL=use-apple.js.map