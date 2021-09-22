import React from 'react';
import { Box, Container, makeStyles, Typography } from '@material-ui/core';
import { ClassesGrid } from '../ClassesGrid';
import { Confetti } from '../Confetti';
var monolithMinM = 991;
var monolithMaxM = 1136;
var mediaQuery = "(min-width: " + monolithMinM + "px) and (max-width: " + monolithMaxM + "px)";
var useStyles = makeStyles(function (_a) {
    var _b, _c, _d, _e;
    var palette = _a.palette, spacing = _a.spacing;
    return {
        root: {
            bottom: 0,
            color: palette.common.white,
            left: 0,
            position: 'absolute',
            right: 0,
            top: 0,
        },
        content: (_b = {
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                justifyContent: 'center',
                paddingTop: spacing(5),
                position: 'absolute',
                zIndex: 3
            },
            _b["@media " + mediaQuery] = {
                paddingTop: spacing(4),
            },
            _b),
        header: (_c = {
                paddingBottom: spacing(3)
            },
            _c["@media " + mediaQuery] = {
                paddingBottom: 0,
                fontSize: 22,
            },
            _c),
        subheader: (_d = {
                paddingBottom: spacing(0.5)
            },
            _d["@media " + mediaQuery] = {
                paddingBottom: 0,
            },
            _d),
        classesContainer: (_e = {
                marginBottom: spacing(4),
                maxWidth: 576,
                width: '100%'
            },
            _e["@media " + mediaQuery] = {
                maxWidth: 356,
            },
            _e),
    };
});
export function PremiumEndCard(_a) {
    var classesList = _a.classesList, header = _a.header, subheader = _a.subheader, via = _a.via;
    var classes = useStyles();
    return (React.createElement(Box, { className: classes.root },
        React.createElement(Confetti, null),
        React.createElement(Container, { className: classes.content },
            React.createElement(Typography, { className: classes.header, variant: "h2", component: "h3" }, header),
            React.createElement(Typography, { className: classes.subheader, variant: "body1" }, subheader),
            React.createElement("div", { className: classes.classesContainer },
                React.createElement(ClassesGrid, { via: via, columnsOverwrite: { md: 2, lg: 2 }, classes: classesList })))));
}
//# sourceMappingURL=PremiumEndCard.js.map