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
import React from 'react';
import { padding } from 'polished';
import PropTypes from 'prop-types';
import { makeStyles, Typography } from '@material-ui/core';
import { ClassCard } from '../components/class-card';
import { TrackableEvents } from '../shared';
import { useTrackEvent } from '../shared/hooks';
var useStyles = makeStyles(function (_a) {
    var breakpoints = _a.breakpoints, palette = _a.palette, spacing = _a.spacing;
    return {
        grid: function (_a) {
            var _b;
            var sm = _a.sm, md = _a.md, lg = _a.lg;
            return _b = {
                    display: 'grid',
                    gridTemplateColumns: '1fr'
                },
                _b[breakpoints.up('sm')] = {
                    gridTemplateColumns: "repeat(" + sm + ", 1fr)",
                },
                _b[breakpoints.up('md')] = {
                    gridTemplateColumns: "repeat(" + md + ", 1fr)",
                },
                _b[breakpoints.up('lg')] = {
                    gridTemplateColumns: "repeat(" + lg + ", 1fr)",
                },
                _b;
        },
        header: __assign({ color: palette.common.white }, padding(0, 0, spacing(3.5), spacing(1))),
        classCardContainer: {
            outline: 'none',
        },
    };
});
export function ClassesGrid(_a) {
    var classes = _a.classes, title = _a.title, columnsOverwrite = _a.columnsOverwrite, via = _a.via, fetchListItems = _a.fetchListItems, onClickListItem = _a.onClickListItem, onCreateNewList = _a.onCreateNewList;
    var _b = __read(useTrackEvent(), 1), trackEvent = _b[0];
    var _c = useStyles(__assign({ sm: 2, md: 3, lg: 4 }, columnsOverwrite)), gridClass = _c.grid, header = _c.header, classCardContainer = _c.classCardContainer;
    var onClassCardClick = function () {
        trackEvent({ action: TrackableEvents['Clicked-Class-End-Class-Card'] });
    };
    return (React.createElement("div", null,
        title && (React.createElement(Typography, { className: header, variant: "h3" }, title)),
        React.createElement("div", { className: gridClass }, classes.map(function (singleClass, key) { return (React.createElement("div", { key: singleClass.sku, className: classCardContainer, tabIndex: key, role: "button", onKeyDown: onClassCardClick, onClick: onClassCardClick },
            React.createElement(ClassCard, __assign({ fetchListItems: fetchListItems, onClickListItem: onClickListItem, onCreateNewList: onCreateNewList, via: via }, singleClass)))); }))));
}
ClassesGrid.propTypes = {
    title: PropTypes.string,
    classes: PropTypes.array.isRequired,
    columnsOverwrite: PropTypes.object,
    via: PropTypes.string,
    fetchListItems: PropTypes.func,
    onClickListItem: PropTypes.func,
    onCreateNewList: PropTypes.func,
};
//# sourceMappingURL=ClassesGrid.js.map