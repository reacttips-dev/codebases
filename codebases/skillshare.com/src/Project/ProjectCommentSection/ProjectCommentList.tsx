import React from 'react';
import { CommentList } from '../../comments';
export var ProjectCommentList = function (_a) {
    var viewer = _a.viewer, data = _a.data, onRefresh = _a.onRefresh, onCreate = _a.onCreate, onDelete = _a.onDelete;
    return React.createElement(CommentList, { data: data, viewer: viewer, onRefresh: onRefresh, onCreate: onCreate, onDelete: onDelete });
};
//# sourceMappingURL=ProjectCommentList.js.map