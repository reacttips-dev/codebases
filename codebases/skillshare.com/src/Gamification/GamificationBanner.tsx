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
import { Box, makeStyles, Typography } from '@material-ui/core';
import { Popover } from '../components/popover';
import { GAMIFICATION_ACTION_STEPS } from '../GamificationToast/GamificationToastCopy';
import { ArrowUpIcon } from '../Icons/ArrowUpIcon';
import { GetGamificationActionsQuery } from '../schema/gamification';
import { MarkGamificationActionPopoversShownMutation, } from '../schema/gamification/mutations';
import { TrackableEvents } from '../shared';
import { useTrackEvent } from '../shared/hooks';
import { GamificationAction } from './GamificationAction';
var gamificationBannerStyles = makeStyles(function (_a) {
    var _b;
    var spacing = _a.spacing, palette = _a.palette, breakpoints = _a.breakpoints;
    return ({
        root: {
            background: 'linear-gradient(90deg, #3722D3 0%, #17A1A6 83.85%, #00FF84 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        titleMinimize: {
            color: palette.common.white,
            marginLeft: spacing(9),
            marginRight: spacing(4),
            marginTop: spacing(1),
            marginBottom: spacing(1),
            transition: 'margin-top .3s ease-in',
            fontSize: 13,
            width: '100%',
        },
        title: {
            width: 174,
            marginTop: spacing(3),
            marginBottom: spacing(3),
            marginRight: spacing(10),
            fontSize: 18,
        },
        actionContainerMinimize: {
            display: 'none',
        },
        actionContainer: (_b = {
                display: 'flex',
                flexGrow: 0.75,
                flexShrink: 1,
                flexWrap: 'wrap',
                justifyContent: 'center'
            },
            _b[breakpoints.down('md')] = {
                marginTop: spacing(3),
                marginBottom: spacing(3),
                justifyContent: 'flex-start',
            },
            _b),
        arrowTransform: {
            transform: 'rotate(180deg)',
        },
        arrow: {
            marginLeft: 'auto',
            transition: 'transform .5s',
            marginRight: spacing(4.37),
            cursor: 'pointer',
        },
        popover: {
            padding: spacing(2),
            width: '20vw',
            fontWeight: 'normal',
            maxWidth: 240,
        },
    });
});
var GAMIFICATION_STEPS = [
    GAMIFICATION_ACTION_STEPS.JOIN_SKILLSHARE,
    GAMIFICATION_ACTION_STEPS.WATCH_THREE_LESSONS,
    GAMIFICATION_ACTION_STEPS.FINISH_A_CLASS,
    GAMIFICATION_ACTION_STEPS.JOIN_WORKSHOP,
    GAMIFICATION_ACTION_STEPS.UPLOAD_PROJECT,
];
var renderActionList = function (actions, playConfetti, setPlayConfetti) {
    return actions.map(function (action, index) {
        var title = action.title, popoverText = action.popoverText, linkUrl = action.linkUrl, showPopoverOnLoad = action.showPopoverOnLoad, isCompleted = action.isCompleted;
        if (showPopoverOnLoad && !playConfetti && index !== 0) {
            setPlayConfetti(true);
        }
        return (React.createElement(GamificationAction, { index: index, isCompleted: isCompleted, playConfetti: playConfetti, setPlayConfetti: setPlayConfetti, key: title, linkUrl: linkUrl, label: title, showPopoverOnLoad: showPopoverOnLoad, popoverText: popoverText }));
    });
};
export function GamificationBanner(props) {
    var _this = this;
    var _a, _b;
    var _c = __read(useTrackEvent(), 1), trackEvent = _c[0];
    var _d = __read(useState(props.minimize), 2), minimize = _d[0], setMinimize = _d[1];
    var _e = __read(useState(false), 2), playConfetti = _e[0], setPlayConfetti = _e[1];
    var classes = gamificationBannerStyles();
    var _f = useQuery(GetGamificationActionsQuery), data = _f.data, loading = _f.loading, error = _f.error;
    var _g = __read(useMutation(MarkGamificationActionPopoversShownMutation), 1), markGamificationActionPopoversShown = _g[0];
    var triggerMutation = function (steps) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, markGamificationActionPopoversShown({ variables: { input: { steps: steps } } })];
                case 1:
                    _a.sent();
                    return [2];
            }
        });
    }); };
    var handleMinimize = function () {
        trackEvent({
            action: TrackableEvents.ClickedGamificationBar,
            other: {
                minimized: "" + !minimize,
            },
        });
        setMinimize(function (prev) { return !prev; });
    };
    var actions = (_a = data === null || data === void 0 ? void 0 : data.gamification) === null || _a === void 0 ? void 0 : _a.actions;
    var isJoinSkillshareComplete = !!(actions && ((_b = actions[0]) === null || _b === void 0 ? void 0 : _b.isCompleted));
    useEffect(function () {
        if (!actions) {
            return;
        }
        var completedActionsShowingPopOver = actions
            .reduce(function (result, action, index) {
            if (action.isCompleted && action.showPopoverOnLoad) {
                result.push(index);
            }
            return result;
        }, [])
            .map(function (index) { return GAMIFICATION_STEPS[index]; });
        if (completedActionsShowingPopOver.length) {
            triggerMutation(completedActionsShowingPopOver);
        }
    }, [actions]);
    if (loading || error || !isJoinSkillshareComplete) {
        if (error) {
            throw error;
        }
        return null;
    }
    var targetContentComponent = (React.createElement(Typography, { className: classes.titleMinimize + " " + (!minimize && classes.title), variant: "h4" }, props.content));
    return (React.createElement(Box, { className: classes.root },
        !minimize ? (React.createElement(Popover, { top: "-30px", left: "30px", position: "bottom-start", targetContent: targetContentComponent, popoverContent: React.createElement(Typography, { variant: "h5", className: classes.popover }, "We want you to have a great experience learning and creating on Skillshare. Complete these goals, and you\u2019ll be off to a great start!") })) : (targetContentComponent),
        React.createElement("div", { className: minimize ? classes.actionContainerMinimize : classes.actionContainer }, renderActionList(data.gamification.actions, playConfetti, setPlayConfetti)),
        React.createElement("div", { className: (minimize && classes.arrowTransform) + " " + classes.arrow },
            React.createElement(ArrowUpIcon, { "data-testid": "arrow-icon", onClick: handleMinimize }))));
}
GamificationBanner.propTypes = {
    minimize: PropTypes.bool,
    content: PropTypes.string,
    query: PropTypes.object,
};
//# sourceMappingURL=GamificationBanner.js.map