import React from 'react';
import { Comment } from '../Comment';
import { CommentListStyle } from './CommentList.style';
export var CommentList = function (_a) {
    var data = _a.data, viewer = _a.viewer, onRefresh = _a.onRefresh, onCreate = _a.onCreate, onDelete = _a.onDelete, onLike = _a.onLike;
    return (React.createElement(CommentListStyle, null,
        React.createElement("div", { className: "comment-replies" }, data.map(function (comment) {
            return (React.createElement("div", { key: comment.key, className: "comment-wrapper " + (comment.isReply ? 'reply' : '') },
                React.createElement(Comment, { data: comment, viewer: viewer, onRefresh: onRefresh, onCreate: onCreate, onDelete: onDelete, onLike: onLike })));
        }))));
};
//# sourceMappingURL=CommentList.js.map