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
import { number, object, string } from 'yup';
import { createStyles, makeStyles } from '@material-ui/core';
export var LoginSchema = object().shape({
    email: string().trim().email('Email Address is not a valid email address.').required('Email is required'),
    password: string().trim().required('Password is required'),
    team: number(),
    teamName: string().when('team', {
        is: function (val) { return val === 1; },
        then: string().required('Company is required'),
    }),
});
export function enterKeyPress(_a) {
    var event = _a.event, validate = _a.validate, onSubmit = _a.onSubmit;
    return __awaiter(this, void 0, void 0, function () {
        var validationResult;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(event.code === 'Enter')) return [3, 2];
                    event.preventDefault();
                    return [4, validate([{ name: 'email' }, { name: 'password' }])];
                case 1:
                    validationResult = _b.sent();
                    if (validationResult) {
                        onSubmit();
                    }
                    return [2];
                case 2: return [2];
            }
        });
    });
}
export var getLoginPostData = function (_a) {
    var data = _a.data, tokens = _a.tokens, csrfToken = _a.csrfToken, recaptchaResponse = _a.recaptchaResponse, path = _a.path, team = _a.team, redirectTo = _a.redirectTo;
    var postData = new URLSearchParams();
    postData.append('LoginForm[email]', data.email);
    postData.append('LoginForm[password]', data.password);
    postData.append('LoginForm[timestamp]', tokens.timestamp);
    postData.append('LoginForm[deviceVerificationToken]', tokens.deviceVerificationToken);
    postData.append('YII_CSRF_TOKEN', csrfToken);
    postData.append('recaptcha', recaptchaResponse ? recaptchaResponse : '');
    if (path && path !== '') {
        postData.append('LoginForm[redirectTo]', path);
    }
    if (team && team.isLogin) {
        postData.append('LoginForm[teamName]', data.teamName);
    }
    if (team && team.invitation) {
        postData.append('LoginForm[teamInviteId]', team.invitation.id.toString());
    }
    if (redirectTo) {
        postData.set('LoginForm[redirectTo]', redirectTo);
    }
    return postData;
};
export var useLoginFormStyles = makeStyles(function (_a) {
    var spacing = _a.spacing, typography = _a.typography, palette = _a.palette;
    return createStyles({
        grid: {
            '& .MuiGrid-item': {
                marginBottom: spacing(1.5),
            },
        },
        formSeparator: {
            borderColor: palette.secondary.main,
            borderTopWidth: spacing(0.125),
            borderStyle: 'solid',
            height: spacing(0.125),
            margin: spacing(1.75, 0),
            '& p': {
                fontFamily: typography.fontFamily,
                color: palette.secondary.main,
                fontSize: typography.fontSize - 1,
                fontWeight: typography.fontWeightBold,
                textAlign: 'center',
                margin: spacing(-1.125, 'auto'),
                backgroundColor: palette.common.white,
                display: 'block',
                width: spacing(3.75),
            },
        },
        submitBtn: {
            width: '100%',
            marginTop: spacing(3),
            fontFamily: typography.fontFamily,
            fontSize: typography.body2.fontSize,
            fontWeight: typography.fontWeightBold,
            color: palette.secondary.main,
            '&.Mui-disabled': {
                color: palette.common.white,
                backgroundColor: palette.border.disabled,
            },
        },
        forgotPassword: {
            margin: spacing(1, 0),
            '& a': {
                fontSize: typography.body1.fontSize,
                fontWeight: typography.fontWeightBold,
                color: palette.tertiary.main,
                textDecoration: 'none',
                fontFamily: typography.fontFamily,
                '&:hover': {
                    textDecoration: 'underline',
                },
            },
        },
        member: {
            paddingTop: spacing(0.5),
            fontFamily: typography.fontFamily,
            fontSize: typography.body1.fontSize,
            textAlign: 'center',
            '& button': {
                borderStyle: 'none',
                background: 'none',
                fontFamily: typography.fontFamily,
                fontSize: typography.body1.fontSize,
                fontWeight: typography.fontWeightBold,
                color: palette.tertiary.main,
                '&:hover': {
                    textDecoration: 'underline',
                },
            },
        },
        separator: {
            '& hr': {
                backgroundColor: palette.secondary.main,
                margin: spacing(0.5, 0, 1.75),
            },
        },
    });
});
//# sourceMappingURL=LoginFormTypes.js.map