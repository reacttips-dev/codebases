import React from 'react';
import { Chip, makeStyles } from '@material-ui/core';
import { TriangleRightIcon } from '../../Icons';
import { InnerLiveBadge } from './InnerLiveBadge';
var useStyles = makeStyles(function (_a) {
    var typography = _a.typography, palette = _a.palette, spacing = _a.spacing;
    return ({
        root: {
            height: 'auto',
            borderWidth: 2,
            borderStyle: 'solid',
            backgroundColor: palette.secondary.main,
            borderColor: palette.lightAccent.main,
            color: palette.getContrastText(palette.secondary.main),
        },
        icon: {
            marginLeft: 0,
        },
        label: {
            paddingLeft: spacing(0),
            fontSize: typography.fontSize * 1.3,
        },
    });
});
export var EncoreLiveBadge = function () {
    var classes = useStyles();
    return (React.createElement(Chip, { classes: classes, className: "live-badge", label: React.createElement("span", { className: "label" }, "Encore"), icon: React.createElement(InnerLiveBadge, { icon: React.createElement(TriangleRightIcon, null), color: "lightAccent" }) }));
};
//# sourceMappingURL=EncoreLiveBadge.js.map