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
import { Box } from '@material-ui/core';
import { LikeButton } from '../../../components/buttons';
import { getFormattedTimestamp } from '../../../shared/helpers/timestamp-formatter';
import { useEnvironment } from '../../../shared/hooks';
import { CommentActionBarStyle } from './CommentActionBar.style';
export var CommentActionBar = function (props) {
    var appHost = useEnvironment().appHost;
    var formattedTimestamp = getFormattedTimestamp(props.createdAt);
    var isLoggedIn = props.viewer && props.viewer.uid;
    var _a = __read(useState(''), 2), redirectTo = _a[0], setRedirectTo = _a[1];
    useEffect(function () {
        setRedirectTo(appHost + "/signup?redirectTo=" + window.location.href);
    }, []);
    var onDeleteClick = function () {
        if (confirm("Are you sure you'd like to delete this post?")) {
            props.onDeleteClick(props.id);
        }
    };
    var renderReplyLink = function () {
        if (props.onReplyClick) {
            if (isLoggedIn) {
                return (React.createElement("a", { className: "reply-link", onClick: props.onReplyClick }, "Reply"));
            }
            return (React.createElement("a", { className: "reply-link", href: redirectTo }, "Reply"));
        }
    };
    return (React.createElement(CommentActionBarStyle, { className: "comment-links-wrapper" },
        React.createElement("div", { className: "comment-links" },
            renderReplyLink(),
            props.viewerCanEdit && (React.createElement(React.Fragment, null,
                React.createElement("a", { className: "edit-link", onClick: props.onEditClick }, "Edit"),
                React.createElement("a", { className: "delete-link", onClick: onDeleteClick }, "Delete"))),
            React.createElement("span", { className: "timestamp" }, formattedTimestamp)),
        React.createElement("div", { className: "comment-like" },
            props.likesCount !== 0 && React.createElement("span", { className: "like-count" }, props.likesCount),
            React.createElement(Box, { display: "flex" }, isLoggedIn ? (React.createElement(LikeButton, { width: 16, isMini: true, isFilled: props.hasLiked, onClick: props.onLikeClick })) : (React.createElement("a", { href: redirectTo },
                React.createElement(LikeButton, { width: 16, isMini: true, isFilled: false })))))));
};
//# sourceMappingURL=CommentActionBar.js.map