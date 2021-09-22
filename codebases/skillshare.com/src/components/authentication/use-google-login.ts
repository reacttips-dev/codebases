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
import { addRedirectUrl } from '../../shared/helpers/add-redirect-to-parameter';
import { useCookies, useGoogle, useRequest } from '../../shared/hooks';
var genericError = 'Something went wrong. Please try again.';
var loginUrl = '/site/loginViaGoogle';
var signupUrl = '/site/signupViaGoogle';
export var useGoogleLogin = function (redirectUrl) {
    var isGoogleReady = useGoogle().isGoogleReady;
    var execute = useRequest({ isAjaxRequest: true }).execute;
    var _a = __read(useState(), 2), googleError = _a[0], setGoogleError = _a[1];
    var _b = __read(useState(true), 2), isGoogleLoading = _b[0], setIsGoogleLoading = _b[1];
    var cookies = useCookies().cookies;
    var csrfToken = getCsrfToken(cookies);
    var googleLogin = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!isGoogleLoading) return [3, 2];
                    setIsGoogleLoading(true);
                    return [4, login(loginUrl)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2];
            }
        });
    }); };
    var googleSignup = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!isGoogleLoading) return [3, 2];
                    setIsGoogleLoading(true);
                    return [4, login(signupUrl)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2];
            }
        });
    }); };
    var login = function (requestUrl) { return __awaiter(void 0, void 0, void 0, function () {
        var googleUser, response, postData, url, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4, window.gapi.auth2.getAuthInstance().signIn()];
                case 1:
                    googleUser = _a.sent();
                    response = googleUser.getAuthResponse();
                    postData = new URLSearchParams();
                    postData.append('idtoken', response.id_token);
                    postData.append('YII_CSRF_TOKEN', csrfToken);
                    url = addRedirectUrl(requestUrl, redirectUrl);
                    return [4, execute({ url: url, data: postData, method: 'POST' })];
                case 2:
                    result = _a.sent();
                    setIsGoogleLoading(false);
                    window.location = result.data.redirectTo;
                    return [3, 4];
                case 3:
                    error_1 = _a.sent();
                    setIsGoogleLoading(false);
                    setGoogleError(genericError);
                    return [3, 4];
                case 4: return [2];
            }
        });
    }); };
    useEffect(function () {
        if (isGoogleReady) {
            setIsGoogleLoading(false);
        }
    }, [isGoogleReady]);
    return { googleLogin: googleLogin, googleSignup: googleSignup, googleError: googleError, isGoogleLoading: isGoogleLoading };
};
function getCsrfToken(cookies) {
    var token = cookies && cookies.YII_CSRF_TOKEN ? cookies.YII_CSRF_TOKEN : '';
    return token;
}
//# sourceMappingURL=use-google-login.js.map