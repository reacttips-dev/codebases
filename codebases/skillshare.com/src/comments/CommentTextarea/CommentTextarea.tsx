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
import React, { useState } from 'react';
import { Avatar } from '../../Avatar';
import { Button, ButtonSize } from '../../components/buttons';
import { Textarea } from '../../Textarea';
import { CommentTextareaStyle } from './CommentTextarea.style';
export var CommentTextarea = function (props) {
    var _a = __read(useState(props.autoFocus || false), 2), postButtonIsVisible = _a[0], setPostButtonIsVisible = _a[1];
    var _b = __read(useState(''), 2), commentTextHTML = _b[0], setCommentTextHTML = _b[1];
    var onChange = function (event) {
        setCommentTextHTML(event.target.value);
    };
    var onFocus = function () {
        setPostButtonIsVisible(true);
    };
    var onPost = function () {
        if (commentTextHTML && props.onPostClick) {
            props.onPostClick(commentTextHTML, props.commentableType);
            setCommentTextHTML('');
            if (props.toggleReplyMode) {
                props.toggleReplyMode();
            }
        }
    };
    return (React.createElement(CommentTextareaStyle, null,
        React.createElement("div", { className: "comment-field" },
            React.createElement(Avatar, { src: props.avatar, size: props.avatarSize, alt: "avatar" }),
            React.createElement(Textarea, { autoFocus: props.autoFocus, value: commentTextHTML, onChange: onChange, onFocus: onFocus, placeholder: props.placeholder })),
        postButtonIsVisible && (React.createElement("div", { className: "comment-post-button" },
            React.createElement(Button, { disabled: !commentTextHTML || props.loading, size: ButtonSize.Medium, loading: props.loading, onClick: onPost, text: "Post", className: "button" })))));
};
//# sourceMappingURL=CommentTextarea.js.map