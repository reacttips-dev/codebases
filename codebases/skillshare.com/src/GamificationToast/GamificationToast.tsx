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
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { Box, createStyles, makeStyles, Snackbar, Typography } from '@material-ui/core';
import Slide from '@material-ui/core/Slide';
import { CloseIcon } from '../Icons';
import { GetGamificationToastQuery } from '../schema/gamification';
import { MarkGamificationActionToastShownMutation, } from '../schema/gamification/mutations';
import { useGamificationToastCopy } from './GamificationToastCopy';
var useStyles = makeStyles(function (_a) {
    var palette = _a.palette, spacing = _a.spacing;
    return createStyles({
        root: {
            zIndex: 10003,
        },
        message: {
            width: '100%',
        },
        snackbar: {
            background: 'linear-gradient(90deg, #3722D3 0%, #17A1A6 69.27%, #00FF84 100%)',
            borderRadius: 8,
            minWidth: 391,
            maxWidth: 460,
            paddingLeft: spacing(4),
            paddingTop: spacing(1.75),
            paddingBottom: spacing(1.75),
        },
        box: {
            width: 'auto',
            display: 'flex',
        },
        icon: {
            marginLeft: 'auto',
            alignSelf: 'center',
            fill: palette.secondary.main,
            cursor: 'pointer',
        },
        textArea: {
            marginRight: spacing(5),
            textDecoration: 'none',
            color: palette.common.white,
            '&:hover': {
                color: palette.common.white,
            },
        },
    });
});
export function GamificationToast(props) {
    var _this = this;
    var _a, _b, _c, _d;
    var classes = useStyles();
    var _e = useQuery(GetGamificationToastQuery, {
        fetchPolicy: 'no-cache',
        variables: {
            step: props.actionStep,
        },
    }), data = _e.data, loading = _e.loading, error = _e.error;
    var _f = __read(useMutation(MarkGamificationActionToastShownMutation), 1), markGamificationActionToastShown = _f[0];
    var showToast = !!((_b = (_a = data === null || data === void 0 ? void 0 : data.gamification) === null || _a === void 0 ? void 0 : _a.toast) === null || _b === void 0 ? void 0 : _b.showToast);
    var joinSkillshare = !!((_d = (_c = data === null || data === void 0 ? void 0 : data.gamification) === null || _c === void 0 ? void 0 : _c.joinSkillshare) === null || _d === void 0 ? void 0 : _d.isCompleted);
    var _g = __read(useState(showToast), 2), open = _g[0], setOpen = _g[1];
    var triggerMutation = function (step) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, markGamificationActionToastShown({ variables: { input: { step: step } } })];
                case 1:
                    _a.sent();
                    return [2];
            }
        });
    }); };
    var handleClose = function () {
        setOpen(false);
    };
    useEffect(function () {
        var shouldOpen = showToast;
        setOpen(shouldOpen);
        if (shouldOpen) {
            triggerMutation(props.actionStep);
        }
    }, [showToast]);
    var _h = useGamificationToastCopy(props.actionStep), title = _h.title, subtext = _h.subtext;
    var contentPropsClasses = {
        root: classes.snackbar,
        message: classes.message,
    };
    if (loading || error || !joinSkillshare) {
        if (error) {
            throw error;
        }
        return null;
    }
    return (React.createElement(Slide, { timeout: 500, direction: "left", in: open, mountOnEnter: true, unmountOnExit: true },
        React.createElement(Snackbar, { open: true, onClose: handleClose, autoHideDuration: 10000, anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
            }, ContentProps: {
                classes: contentPropsClasses,
            }, className: classes.root, message: React.createElement(Box, { className: classes.box },
                React.createElement("a", { className: classes.textArea, href: props.path },
                    React.createElement(Typography, { variant: "h4" }, title),
                    React.createElement(Typography, { variant: "body1" }, subtext)),
                React.createElement(CloseIcon, { "aria-label": "close-icon", "data-testid": "close-icon", onClick: handleClose, className: classes.icon })) })));
}
GamificationToast.propTypes = {
    path: PropTypes.string,
    actionStep: PropTypes.string,
};
//# sourceMappingURL=GamificationToast.js.map