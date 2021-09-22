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
export var EmailSignUpFormSchemaNoLastName = object().shape({
    firstName: string().trim().max(50, 'Name fields must be fewer than 50 characters'),
    team: number(),
    teamName: string().when('team', {
        is: 1,
        then: string().required('Company is required'),
    }),
    email: string()
        .trim()
        .min(5, 'Email field must have at least 5 characters')
        .max(100, 'Email field must be fewer than 100 characters')
        .email('Email field is not a valid email address.')
        .required('Email is required'),
    password: string()
        .trim()
        .min(8, 'Password field must have at least 8 characters')
        .max(64, 'Password field must be fewer than 64 characters')
        .required('Password is required'),
});
export var EmailSignUpFormSchema = object().shape({
    firstName: string()
        .trim()
        .max(50, 'Name fields must be fewer than 50 characters')
        .required('First Name is required'),
    lastName: string().trim().max(50, 'Name fields must be fewer than 50 characters').required('Last Name is required'),
    team: number(),
    teamName: string().when('team', {
        is: 1,
        then: string().required('Company is required'),
    }),
    email: string()
        .trim()
        .min(5, 'Email field must have at least 5 characters')
        .max(100, 'Email field must be fewer than 100 characters')
        .email('Email field is not a valid email address.')
        .required('Email is required'),
    password: string()
        .trim()
        .min(8, 'Password field must have at least 8 characters')
        .max(64, 'Password field must be fewer than 64 characters')
        .required('Password is required'),
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
                    return [4, validate([
                            { name: 'firstName' },
                            { name: 'lastName' },
                            { name: 'email' },
                            { name: 'password' },
                        ])];
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
export var getPostData = function (_a) {
    var data = _a.data, team = _a.team, tokens = _a.tokens, csrfToken = _a.csrfToken, recaptchaResponse = _a.recaptchaResponse, redirectTo = _a.redirectTo;
    var postData = new URLSearchParams();
    postData.append('SignupForm[firstName]', data.firstName);
    postData.append('SignupForm[lastName]', data.lastName);
    postData.append('SignupForm[email]', data.email);
    postData.append('SignupForm[password]', data.password);
    postData.append('SignupForm[timestamp]', tokens.timestamp);
    postData.append('SignupForm[deviceVerificationToken]', tokens.deviceVerificationToken);
    postData.append('YII_CSRF_TOKEN', csrfToken);
    postData.append('recaptcha', recaptchaResponse !== null && recaptchaResponse !== void 0 ? recaptchaResponse : '');
    addTeamData(team, postData, data);
    if (redirectTo) {
        postData.append('SignupForm[redirectTo]', redirectTo);
    }
    return postData;
};
var addTeamData = function (team, postData, data) {
    if (team) {
        if (team.isSignUp) {
            postData.append('SignupForm[teamName]', data.teamName);
        }
        if (team.isInvitation) {
            postData.append('SignupForm[teamInviteId]', team.invitation.id.toString());
        }
    }
};
export var useEmailSignUpFormStyles = makeStyles(function (_a) {
    var spacing = _a.spacing, typography = _a.typography, palette = _a.palette;
    return createStyles({
        grid: {
            '& .MuiGrid-item': {
                marginBottom: spacing(1.5),
            },
            '& .MuiOutlinedInput-input': {
                height: 38,
                padding: spacing(0, 1.75),
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
        nameField: {
            width: '48% !important',
        },
        passwordRequirement: {
            fontFamily: typography.fontFamily,
            color: palette.secondary.main,
            fontSize: typography.caption.fontSize,
        },
        passwordSpacing: {
            '&.MuiGrid-item': {
                marginBottom: spacing(0.5),
            },
        },
        submitBtn: {
            width: '100%',
            fontFamily: typography.fontFamily,
            fontSize: typography.body2.fontSize,
            fontWeight: typography.fontWeightBold,
            color: palette.secondary.main,
            height: 40,
            margin: function (_a) {
                var hideLogin = _a.hideLogin;
                return (hideLogin ? spacing(0.5, 0) : 0);
            },
            '&.Mui-disabled': {
                color: palette.common.white,
                backgroundColor: palette.border.disabled,
            },
        },
        member: {
            paddingTop: spacing(1.75),
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
                margin: spacing(1.75, 0),
            },
        },
        terms: {
            '&.MuiGrid-item': {
                marginBottom: 0,
            },
        },
    });
});
//# sourceMappingURL=EmailSignUpFormTypes.js.map