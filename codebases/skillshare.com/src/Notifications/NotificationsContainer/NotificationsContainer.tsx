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
import InfiniteScroll from 'react-infinite-scroll-component';
import { Box, createStyles, makeStyles } from '@material-ui/core';
import { Loading } from '../../Loading';
import { EmptyActivity } from '../EmptyActivity';
import { Notification } from '../Notification/Notification';
var useStyles = makeStyles(function (_a) {
    var spacing = _a.spacing;
    return createStyles({
        container: __assign({ height: '100vh', overflow: 'auto', marginTop: spacing(3) }, padding(0, spacing(2))),
        empty: __assign({ marginTop: spacing(3) }, padding(0, spacing(2))),
        infiniteScrollContainer: {
            marginLeft: spacing(-2),
            marginRight: spacing(-2),
            paddingLeft: spacing(2),
            paddingRight: spacing(2),
        },
    });
});
export var NotificationsContainer = function (props) {
    var classes = useStyles();
    var onFetchMore = function () {
        props.onFetchMore(props.endCursor);
    };
    return (React.createElement(React.Fragment, null, props.notifications && props.notifications.length ? (React.createElement("div", { id: "notificationsScrollableTarget-" + props.type, className: classes.container }, !props.error ? (React.createElement(InfiniteScroll, { className: classes.infiniteScrollContainer, scrollableTarget: "notificationsScrollableTarget-" + props.type, dataLength: props.notifications.length, next: onFetchMore, hasMore: props.hasMore, loader: React.createElement(Box, null,
            React.createElement(Loading, null)) }, props.notifications.map(function (notification) {
        return (React.createElement(Box, { width: 514, key: notification.cursor, marginBottom: 1.25 },
            React.createElement(Notification, __assign({}, notification.node))));
    }))) : (React.createElement(Box, { "data-testid": "error-message" },
        React.createElement(EmptyActivity, { text: "Hmm, something went wrong. Refresh the page or try again in a few minutes." }))))) : (React.createElement("div", { className: classes.empty }, props.emptyMessage))));
};
//# sourceMappingURL=NotificationsContainer.js.map