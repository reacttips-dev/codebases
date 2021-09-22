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
import { Chip, makeStyles, Typography } from '@material-ui/core';
import { Popover } from '../components/popover';
import { Confetti } from '../Confetti';
import { CircleCheckIcon } from '../Icons/CircleCheckIcon';
import { EmptyCircleCheckIcon } from '../Icons/EmptyCircleCheckIcon';
var gamificationActionStyles = makeStyles(function (_a) {
    var _b, _c;
    var spacing = _a.spacing, typography = _a.typography, palette = _a.palette, breakpoints = _a.breakpoints;
    return ({
        root: (_b = {
                backgroundColor: 'transparent',
                fontSize: typography.fontSize * 1.3,
                marginRight: spacing(5.3),
                transition: 'margin-right .3s',
                cursor: 'pointer'
            },
            _b[breakpoints.down('md')] = {
                pointerEvents: 'none',
            },
            _b[breakpoints.up('lg')] = {
                marginRight: spacing(5.6),
            },
            _b),
        label: {
            fontSize: typography.h6.fontSize,
            fontWeight: typography.h6.fontWeight,
            color: palette.common.white,
            padding: 0,
        },
        icon: (_c = {
                marginRight: spacing(1.25),
                transition: 'margin-right .3s'
            },
            _c[breakpoints.up('lg')] = {
                marginRight: spacing(1.75),
            },
            _c),
        popover: {
            padding: spacing(2),
            fontWeight: 'normal',
        },
        cursor: {
            cursor: 'pointer',
        },
    });
});
var renderTargetComponent = function (linkUrl, classes, icon, label) {
    var component = linkUrl ? 'a' : 'div';
    return (React.createElement("div", { className: classes.cursor },
        React.createElement(Chip, { href: linkUrl, component: component, icon: icon, label: label, classes: { root: classes.root, label: classes.label, icon: classes.icon } })));
};
export function GamificationAction(props) {
    var classes = gamificationActionStyles();
    var showPopoverOnLoad = props.showPopoverOnLoad, popoverText = props.popoverText, isCompleted = props.isCompleted, linkUrl = props.linkUrl, label = props.label, setPlayConfetti = props.setPlayConfetti;
    var icon = isCompleted ? React.createElement(CircleCheckIcon, null) : React.createElement(EmptyCircleCheckIcon, null);
    var _a = __read(useState(showPopoverOnLoad), 2), popoverOpen = _a[0], setPopoverOpen = _a[1];
    var POPOVER_TIMEOUT = 6000;
    useEffect(function () {
        if (popoverOpen) {
            var timer_1 = setTimeout(function () {
                setPopoverOpen(false);
                return setPlayConfetti(false);
            }, 6000);
            return function () { return clearTimeout(timer_1); };
        }
    }, [popoverOpen]);
    return (React.createElement(React.Fragment, null,
        props.index === 0 && !!props.playConfetti && (React.createElement(Confetti, { backgroundColor: "transparent", recycle: false, width: "100vw", height: "100vh" })),
        React.createElement(Popover, { timeoutProp: popoverOpen ? POPOVER_TIMEOUT : null, isOpen: popoverOpen, position: "bottom-start", width: "160px", top: "-10px", setHoverModeTimeout: false, targetContent: renderTargetComponent(linkUrl, classes, icon, label), popoverContent: popoverText && (React.createElement(Typography, { variant: "h5", className: classes.popover }, popoverText)) })));
}
GamificationAction.propTypes = {
    isCompleted: PropTypes.bool,
    showPopoverOnLoad: PropTypes.bool,
    label: PropTypes.string,
    popoverText: PropTypes.string,
    setPlayConfetti: PropTypes.func,
    linkUrl: PropTypes.string,
    playConfetti: PropTypes.bool,
    index: PropTypes.number,
};
//# sourceMappingURL=GamificationAction.js.map