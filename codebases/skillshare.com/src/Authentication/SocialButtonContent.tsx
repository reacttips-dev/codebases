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
import React from 'react';
import { createStyles, Grid, makeStyles } from '@material-ui/core';
import { useAppleLogin, useFacebookLogin, useGoogleLogin } from '../components/authentication';
import { SocialButton, SocialButtonType } from './SocialButon';
export var useSocialStyles = makeStyles(function (_a) {
    var spacing = _a.spacing;
    return createStyles({
        grid: {
            '& .MuiGrid-item': {
                marginBottom: spacing(1.5),
            },
        },
    });
});
export function SocialButtonContent(_a) {
    var _this = this;
    var redirectTo = _a.redirectTo, isSignUp = _a.isSignUp;
    var classes = useSocialStyles();
    var _b = useFacebookLogin(redirectTo), facebookLogin = _b.facebookLogin, facebookSignup = _b.facebookSignup, isFacebookLoading = _b.isFacebookLoading;
    var _c = useGoogleLogin(redirectTo), googleLogin = _c.googleLogin, googleSignup = _c.googleSignup, isGoogleLoading = _c.isGoogleLoading;
    var _d = useAppleLogin(redirectTo), appleLogin = _d.appleLogin, appleSignUp = _d.appleSignUp;
    var handleFacebookLogin = function (event) {
        event.preventDefault();
        if (isSignUp) {
            facebookSignup();
            return;
        }
        facebookLogin();
    };
    var handleGoogleLogin = function (event) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event.preventDefault();
                    if (!isSignUp) return [3, 2];
                    return [4, googleSignup()];
                case 1:
                    _a.sent();
                    return [2];
                case 2: return [4, googleLogin()];
                case 3:
                    _a.sent();
                    return [2];
            }
        });
    }); };
    var handleAppleLogin = function (event) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    event.preventDefault();
                    if (!isSignUp) return [3, 2];
                    return [4, appleSignUp()];
                case 1:
                    _a.sent();
                    return [2];
                case 2: return [4, appleLogin()];
                case 3:
                    _a.sent();
                    return [2];
            }
        });
    }); };
    return (React.createElement(Grid, { container: true, className: classes.grid },
        React.createElement(Grid, { item: true, xs: 12 },
            React.createElement(SocialButton, { className: "facebook-button", text: 'Continue with Facebook', onClick: handleFacebookLogin, isLoading: isFacebookLoading, type: SocialButtonType.facebook })),
        React.createElement(Grid, { item: true, xs: 12 },
            React.createElement(SocialButton, { className: "google-button", text: 'Continue with Google', onClick: handleGoogleLogin, isLoading: isGoogleLoading, type: SocialButtonType.google })),
        React.createElement(Grid, { item: true, xs: 12 },
            React.createElement(SocialButton, { className: "apple-button", text: 'Continue with Apple', onClick: handleAppleLogin, type: SocialButtonType.apple, isLoading: false }))));
}
//# sourceMappingURL=SocialButtonContent.js.map