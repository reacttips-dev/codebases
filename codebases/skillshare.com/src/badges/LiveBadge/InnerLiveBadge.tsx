var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React from 'react';
import { Chip, makeStyles } from '@material-ui/core';
import { DotIcon } from '../../Icons';
import { TimeKind } from '../../shared/time-kind';
var useStyles = makeStyles(function (_a) {
    var typography = _a.typography, palette = _a.palette, spacing = _a.spacing;
    return ({
        root: function (props) {
            var color;
            switch (props.color) {
                case 'lightAccent':
                    color = palette.lightAccent.main;
                    break;
                case 'mediumAccent':
                    color = palette.mediumAccent.main;
                    break;
                case 'hardAccent':
                    color = palette.hardAccent.main;
                    break;
                default:
                    color = palette.primary.main;
                    break;
            }
            return {
                color: color,
                height: 28,
                fontWeight: 'bold',
                fontSize: typography.fontSize * 1.3,
            };
        },
        icon: function (_a) {
            var animated = _a.animated, kind = _a.kind;
            var spacingValue = kind === TimeKind.FUTURE ? 2 : 0.75;
            var iconProps = {
                width: 15,
                height: 15,
                marginLeft: spacing(spacingValue),
            };
            return __assign(__assign({}, iconProps), (animated && {
                animationName: 'pulse',
                animationDuration: '600ms',
                animationPlayState: 'running',
                animationDirection: 'alternate',
                animationIterationCount: 'infinite',
                animationTimingFunction: 'ease-in-out',
            }));
        },
        label: {
            paddingLeft: spacing(1),
            paddingRight: spacing(1),
        },
    });
});
export function InnerLiveBadge(props) {
    var _a = props.icon, icon = _a === void 0 ? React.createElement(DotIcon, null) : _a, _b = props.color, color = _b === void 0 ? 'default' : _b, _c = props.animated, animated = _c === void 0 ? false : _c;
    var classes = useStyles(__assign(__assign({}, props), { color: color, animated: animated }));
    return React.createElement(Chip, { className: "chip", label: "Live.", icon: icon, color: "secondary", classes: classes });
}
//# sourceMappingURL=InnerLiveBadge.js.map