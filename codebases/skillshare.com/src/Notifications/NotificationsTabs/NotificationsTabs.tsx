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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import React, { useEffect, useRef } from 'react';
import { Box } from '@material-ui/core';
import { Loading } from '../../Loading';
import { useViewerContext } from '../../shared/hooks';
import { Tabs } from '../../Tabs';
import { EmptyActivity } from '../EmptyActivity';
import { NotificationsContainer } from '../NotificationsContainer';
import { useNotificationActions, useNotificationsState, useTeacherNotificationsState, } from '../NotificationsContainer/notifications-state';
export function NotificationsTabs(props) {
    var _a;
    var _b = useNotificationsState(), edges = _b.edges, hasMore = _b.hasMore, onFetchMore = _b.onFetchMore, endCursor = _b.endCursor, error = _b.error, isDataPending = _b.isDataPending;
    var _c = useTeacherNotificationsState(), teacherEdges = _c.edges, teacherHasMore = _c.hasMore, teacherOnFetchMore = _c.onFetchMore, teacherEndCursor = _c.endCursor, teacherError = _c.error, isTeacherDataPending = _c.isDataPending;
    var viewerContext = useViewerContext();
    var loading = isDataPending || isTeacherDataPending;
    var markNotificationsAsRead = useNotificationActions().markNotificationsAsRead;
    var markedAsRead = useRef(false);
    useEffect(function () {
        var _a, _b;
        if (loading || markedAsRead.current) {
            return;
        }
        var edge = edges[0];
        var teacherEdge = teacherEdges[0];
        if (!edge && !teacherEdge) {
            return;
        }
        if (!((_b = (_a = viewerContext === null || viewerContext === void 0 ? void 0 : viewerContext.user) === null || _a === void 0 ? void 0 : _a.notifications) === null || _b === void 0 ? void 0 : _b.count)) {
            return;
        }
        var mostRecentEdge;
        if (edge && teacherEdge) {
            mostRecentEdge = new Date(edge.node.createdAt) > new Date(teacherEdge.node.createdAt) ? edge : teacherEdge;
        }
        else if (edge && !teacherEdge) {
            mostRecentEdge = edge;
        }
        else {
            mostRecentEdge = teacherEdge;
        }
        markNotificationsAsRead(mostRecentEdge.node.createdAt);
        markedAsRead.current = true;
    }, [loading, props.open]);
    return (React.createElement(React.Fragment, null,
        React.createElement(Tabs, { label: "Notifications", tabs: __spread((((_a = viewerContext === null || viewerContext === void 0 ? void 0 : viewerContext.user) === null || _a === void 0 ? void 0 : _a.isTeacher) ? [
                {
                    title: 'My Students',
                    content: (React.createElement(NotificationsContainer, { type: "teacher", notifications: teacherEdges, endCursor: teacherEndCursor, onFetchMore: teacherOnFetchMore, hasMore: teacherHasMore, error: teacherError, emptyMessage: loading ? (React.createElement(Box, null,
                            React.createElement(Loading, null))) : (React.createElement(EmptyActivity, { text: "Teaching is all about community!\n                                                Browse new projects, questions, and discussions created by your students.\n                                                " })) })),
                },
            ]
                : []), [
                {
                    title: 'My Activity',
                    content: (React.createElement(NotificationsContainer, { type: "student", notifications: edges, endCursor: endCursor, onFetchMore: onFetchMore, hasMore: hasMore, error: error, emptyMessage: loading ? (React.createElement(Box, null,
                            React.createElement(Loading, null))) : (React.createElement(EmptyActivity, { text: "Learning is better together!\n                                        Follow this feed for notifications about teachers you follow, class you'll love, and more.\n                                        " })) })),
                },
            ]) })));
}
//# sourceMappingURL=NotificationsTabs.js.map