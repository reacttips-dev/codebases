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
var useStyles = makeStyles(function (_a) {
    var palette = _a.palette, shape = _a.shape, typography = _a.typography;
    return ({
        root: {
            color: palette.primary.main,
            backgroundColor: palette.secondary.main,
            fontWeight: 'bold',
            borderRadius: shape.borderRadius,
            height: 20,
        },
        iconSmall: {
            height: 12,
            width: 12,
        },
        labelSmall: {
            lineHeight: typography.pxToRem(20),
        },
    });
});
export var Badge = function (props) {
    var classes = useStyles();
    return React.createElement(Chip, __assign({}, props, { classes: classes, size: "small" }));
};
//# sourceMappingURL=Badge.js.map