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
import { Badge, createStyles, makeStyles } from '@material-ui/core';
import { BellIcon } from '../../Icons';
import { TrackableEvents } from '../../shared';
import { useEventTracker, useViewerContext } from '../../shared/hooks';
import { NotificationsDrawer } from '../NotificationsDrawer';
var useStyles = makeStyles(function () {
    return createStyles({
        root: {
            cursor: 'pointer',
        },
    });
});
export function NotificationsBell() {
    var _a, _b;
    var trackEvent = useEventTracker().trackEvent;
    var viewerContext = useViewerContext();
    var _c = __read(useState(false), 2), open = _c[0], setOpen = _c[1];
    var _d = __read(useState(0), 2), count = _d[0], setCount = _d[1];
    useEffect(function () {
        var _a, _b;
        if ((_b = (_a = viewerContext === null || viewerContext === void 0 ? void 0 : viewerContext.user) === null || _a === void 0 ? void 0 : _a.notifications) === null || _b === void 0 ? void 0 : _b.count) {
            setCount(viewerContext.user.notifications.count);
        }
    }, [(_b = (_a = viewerContext === null || viewerContext === void 0 ? void 0 : viewerContext.user) === null || _a === void 0 ? void 0 : _a.notifications) === null || _b === void 0 ? void 0 : _b.count]);
    var onClick = function () {
        trackEvent(TrackableEvents.OpenNotifications, {});
        if (count) {
            setCount(0);
        }
        toggleDrawer();
    };
    var toggleDrawer = function () {
        setOpen(function (prevState) { return !prevState; });
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(PureNotificationsBell, { count: count, open: open, toggleDrawer: toggleDrawer, onClick: onClick })));
}
export function PureNotificationsBell(props) {
    var classes = useStyles();
    var getCount = function () {
        if (props.count < 1) {
            return undefined;
        }
        return props.count > 9 ? '9+' : props.count.toString();
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Badge, { classes: { root: classes.root }, color: "error", badgeContent: getCount(), onClick: props.onClick },
            React.createElement(BellIcon, null)),
        React.createElement(NotificationsDrawer, { open: props.open, toggleDrawer: props.toggleDrawer })));
}
//# sourceMappingURL=NotificationsBell.js.map