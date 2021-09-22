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
import { Box, Dialog, makeStyles, Typography } from '@material-ui/core';
import { Confetti } from '../Confetti';
import { CloseIcon, SKPathIcon } from '../Icons';
import { GetGamificationCompletionQuery } from '../schema/gamification';
import { MarkGamificationCompletionMessageShownMutation, } from '../schema/gamification/mutations';
var useStyles = makeStyles(function (_a) {
    var spacing = _a.spacing;
    return ({
        paper: {
            maxWidth: 817,
            maxHeight: 452,
        },
        imgContainer: {
            flexBasis: '37%',
        },
        img: {
            width: '100%',
            minWidth: 302,
        },
        dialogContent: {
            display: 'flex',
            height: 452,
        },
        dialogCopyContainer: {
            display: 'flex',
            flexDirection: 'column',
            flexBasis: '63%',
        },
        background: {
            position: 'absolute',
            width: '100%',
            zIndex: 1,
            height: '82%',
            top: 82,
            left: 210,
        },
        closeIcon: {
            alignSelf: 'flex-end',
            marginTop: spacing(3.5),
            marginRight: spacing(3.5),
            cursor: 'pointer',
        },
        dialogTitle: {
            marginLeft: spacing(6),
            marginTop: spacing(11),
        },
        dialogSubHeader: {
            fontWeight: 'normal',
            marginLeft: spacing(6),
            marginRight: spacing(10),
            marginTop: spacing(4),
        },
    });
});
export function GamificationModal(_a) {
    var _this = this;
    var _b;
    var imageSrc = _a.imageSrc;
    var _c = __read(useState(false), 2), open = _c[0], setOpen = _c[1];
    var _d = useQuery(GetGamificationCompletionQuery), data = _d.data, loading = _d.loading, error = _d.error;
    var _e = __read(useMutation(MarkGamificationCompletionMessageShownMutation), 1), markGamificationCompletionMessageShown = _e[0];
    var classes = useStyles();
    var showCompletionMessage = !!((_b = data === null || data === void 0 ? void 0 : data.gamification) === null || _b === void 0 ? void 0 : _b.showCompletionMessage);
    var triggerMutation = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, markGamificationCompletionMessageShown()];
                case 1:
                    _a.sent();
                    return [2];
            }
        });
    }); };
    useEffect(function () {
        setOpen(showCompletionMessage);
        if (showCompletionMessage) {
            triggerMutation();
        }
    }, [showCompletionMessage]);
    var handleClose = function () {
        setOpen(false);
    };
    if (loading || error || !showCompletionMessage) {
        if (error) {
            throw error;
        }
        return null;
    }
    return (React.createElement(React.Fragment, null,
        React.createElement(Confetti, { backgroundColor: "transparent", recycle: open, width: "100vw", height: "100vh" }),
        React.createElement(Dialog, { classes: { paper: classes.paper }, maxWidth: "md", open: open, onClose: handleClose, "aria-labelledby": "dialog-label", "aria-describedby": "dialog-description" },
            React.createElement(Box, { className: classes.dialogContent },
                React.createElement("div", { className: classes.imgContainer },
                    React.createElement("img", { className: classes.img, alt: "modal", src: imageSrc })),
                React.createElement(Box, { className: classes.dialogCopyContainer },
                    React.createElement(CloseIcon, { "data-testid": "close-icon", className: classes.closeIcon, onClick: handleClose }),
                    React.createElement(Typography, { variant: "h1", className: classes.dialogTitle, id: "dialog-label" }, "Way to go!"),
                    React.createElement(Typography, { variant: "h3", className: classes.dialogSubHeader, id: "dialog-description" }, "Your creative journey with Skillshare is off to a great start. But it\u2019s just the beginning. So keep making. Keep expressing. Keep exploring."),
                    React.createElement(SKPathIcon, { className: classes.background }))))));
}
GamificationModal.propTypes = {
    showCompletionMessage: PropTypes.bool,
    imageSrc: PropTypes.string,
};
//# sourceMappingURL=GamificationModal.js.map