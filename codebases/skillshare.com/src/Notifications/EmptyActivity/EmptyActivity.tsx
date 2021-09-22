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
import { padding } from 'polished';
import PropTypes from 'prop-types';
import { Card, CardActionArea, CardContent, makeStyles, Typography } from '@material-ui/core';
var useStyles = makeStyles(function (_a) {
    var spacing = _a.spacing, palette = _a.palette;
    return ({
        root: {
            borderRadius: 8,
            boxShadow: '0 1px 2px 0 rgb(0 0 0 / 16%)',
            '&::after': {
                borderRadius: 5,
                bottom: 0,
                boxShadow: "0 4px 8px 0 " + palette.border.disabled,
                content: "''",
                left: 0,
                opacity: 0,
                pointerEvents: 'none',
                position: 'absolute',
                right: 0,
                top: 0,
                transition: 'opacity 0.2s ease-in-out',
            },
            '&:hover::after': {
                opacity: 1,
                zIndex: 0,
            },
        },
        content: __assign(__assign({}, padding(spacing(5))), { '&:last-child': {
                paddingBottom: spacing(5),
            } }),
        text: {
            textAlign: 'center',
            whiteSpace: 'pre-line',
        },
        focusHighlight: {},
        actionArea: {
            '&:hover $focusHighlight': {
                opacity: 0,
            },
        },
    });
});
export function EmptyActivity(props) {
    var classes = useStyles();
    return (React.createElement(CardActionArea, { classes: {
            root: classes.actionArea,
            focusHighlight: classes.focusHighlight,
        } },
        React.createElement(Card, { className: classes.root },
            React.createElement(CardContent, { className: classes.content },
                React.createElement(Typography, { className: classes.text, variant: "body2" }, props.text)))));
}
EmptyActivity.propTypes = {
    text: PropTypes.string,
};
//# sourceMappingURL=EmptyActivity.js.map