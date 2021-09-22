var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { AvatarSizes } from '../../Avatar';
import { CommentTextarea } from '../../comments';
import { useCommentCreateAction } from '../../comments/Comment';
import { Button, ButtonSize, ButtonType } from '../../components/buttons';
import { useProjectCommentsState } from '../../components/projects/comment-list/comment-list.state';
import { Loading } from '../../Loading';
import { CommentableTypes } from '../../models/comments';
import { color } from '../../themes/utils';
import { ProjectCommentList } from './ProjectCommentList';
export var ProjectCommentSectionStyle = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    &:after,\n    &:before {\n        content: '';\n        border-bottom: ", " 1px solid;\n        display: block;\n        padding-top: 32px;\n    }\n\n    .loading {\n        position: relative;\n        opacity: 0.5;\n        min-height: 160px;\n    }\n\n    .spinner-container {\n        position: absolute;\n        left: 40%;\n        top: 336px;\n    }\n\n    .load-more-comments-btn {\n        margin-left: 40px;\n    }\n"], ["\n    &:after,\n    &:before {\n        content: '';\n        border-bottom: ", " 1px solid;\n        display: block;\n        padding-top: 32px;\n    }\n\n    .loading {\n        position: relative;\n        opacity: 0.5;\n        min-height: 160px;\n    }\n\n    .spinner-container {\n        position: absolute;\n        left: 40%;\n        top: 336px;\n    }\n\n    .load-more-comments-btn {\n        margin-left: 40px;\n    }\n"])), color(function (c) { return c.concrete; }));
export var ProjectCommentSection = function (props) {
    var _a = __read(useState(false), 2), loadMoreComments = _a[0], setLoadMoreComments = _a[1];
    var _b = useProjectCommentsState(props.projectKey), onRefresh = _b.onRefresh, updatedComments = _b.comments, isDataPending = _b.isDataPending;
    var _c = __read(useState([]), 2), comments = _c[0], setComments = _c[1];
    useEffect(function () {
        if (!isDataPending && updatedComments) {
            setComments(updatedComments);
        }
    }, [isDataPending, updatedComments]);
    var project = {
        key: props.projectKey,
    };
    var createComment = useCommentCreateAction(project, {
        onRefresh: props.onRefresh || onRefresh,
        onCreate: props.onCreate,
    }).createComment;
    var toggleLoadMoreComments = function () {
        setLoadMoreComments(true);
    };
    var commentLimit = 3;
    var initialComments = comments.slice(0, commentLimit);
    var restComments = comments.slice(commentLimit);
    var defaultProps = {
        onRefresh: props.onRefresh || onRefresh,
        viewer: props.viewer,
        onCreate: props.onCreate,
        onDelete: props.onDelete,
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(ProjectCommentSectionStyle, null,
            React.createElement("div", { className: "modal-section-header" }, "Comments"),
            props.viewer && props.viewer.uid && (React.createElement(CommentTextarea, { id: props.projectKey, avatar: props.viewer.img, avatarSize: AvatarSizes.Small, placeholder: "Share your feedback", commentableType: CommentableTypes.Project, onPostClick: createComment })),
            isDataPending && React.createElement(Loading, { size: 80 }),
            React.createElement("div", { className: "" + (isDataPending ? 'loading' : '') },
                comments.length <= commentLimit && React.createElement(ProjectCommentList, __assign({ data: comments }, defaultProps)),
                comments.length > commentLimit && (React.createElement(React.Fragment, null,
                    React.createElement(ProjectCommentList, __assign({ data: initialComments }, defaultProps)),
                    !loadMoreComments && (React.createElement("div", { className: "load-more-comments-btn" },
                        React.createElement(Button, { text: "Load more comments", type: ButtonType.AltNavyGhost, fullWidth: true, size: ButtonSize.Medium, onClick: toggleLoadMoreComments }))),
                    loadMoreComments && React.createElement(ProjectCommentList, __assign({ data: restComments }, defaultProps))))))));
};
var templateObject_1;
//# sourceMappingURL=ProjectCommentSection.js.map