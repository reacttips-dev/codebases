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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
import { kebabCase } from 'lodash';
import PropTypes from 'prop-types';
import { makeStyles, Tab, Tabs as MuiTabs } from '@material-ui/core';
export var a11yProps = function (index, label) {
    var kebabCaseLabel = kebabCase(label);
    return {
        id: kebabCaseLabel + "-tab-" + index,
        'aria-controls': kebabCaseLabel + "-tabpanel-" + index,
    };
};
function TabPanel(props) {
    var children = props.children, value = props.value, index = props.index, label = props.label;
    var kebabCaseLabel = kebabCase(label);
    return (React.createElement("div", { role: "tabpanel", hidden: value !== index, id: kebabCaseLabel + "-tabpanel-" + index, "aria-labelledby": kebabCaseLabel + "-tab-" + index }, children));
}
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.any.isRequired,
    label: PropTypes.string.isRequired,
};
var useStyles = makeStyles(function (_a) {
    var palette = _a.palette, typography = _a.typography;
    return ({
        root: {
            '& .MuiTabs-indicator': {
                backgroundColor: palette.tertiary.main,
                height: 4,
                zIndex: 1,
            },
            '& .MuiTab-wrapper': {
                fontWeight: 'bold',
            },
        },
        tabs: {
            position: 'relative',
            '&:after': {
                content: '" "',
                height: 2,
                width: '100%',
                backgroundColor: palette.border.disabled,
                position: 'absolute',
                bottom: 0,
                left: 0,
            },
        },
        tab: {
            minWidth: 'auto',
            color: palette.secondary.main,
            opacity: 1,
            fontSize: typography.body1.fontSize,
            '&.Mui-selected': {
                color: palette.tertiary.main,
            },
        },
    });
});
export function Tabs(_a) {
    var tabs = _a.tabs, _b = _a.label, label = _b === void 0 ? 'Tabs' : _b, _c = _a.className, className = _c === void 0 ? '' : _c, other = __rest(_a, ["tabs", "label", "className"]);
    var classes = useStyles();
    var _d = __read(React.useState(0), 2), currentTab = _d[0], setCurrentTab = _d[1];
    var handleChange = function (event, newTab) {
        setCurrentTab(newTab);
    };
    return (React.createElement("div", __assign({ className: classes.root + " " + className }, other),
        React.createElement(MuiTabs, { className: classes.tabs, value: currentTab, onChange: handleChange, "aria-label": label }, tabs.map(function (_a, index) {
            var title = _a.title;
            return (React.createElement(Tab, __assign({ className: classes.tab, label: title, key: title }, a11yProps(index, label))));
        })),
        tabs.map(function (_a, index) {
            var title = _a.title, content = _a.content;
            return (React.createElement(TabPanel, { value: currentTab, index: index, key: title, label: label }, content));
        })));
}
Tabs.propTypes = {
    label: PropTypes.string,
    className: PropTypes.string,
    tabs: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string,
        content: PropTypes.node,
    })).isRequired,
};
//# sourceMappingURL=Tabs.js.map