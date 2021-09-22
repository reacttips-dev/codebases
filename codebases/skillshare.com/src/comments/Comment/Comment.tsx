var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
import dompurify from 'isomorphic-dompurify';
import { useMutation } from '@apollo/react-hooks';
import { AvatarSizes } from '../../Avatar';
import * as Models from '../../models/comments';
import { LikeMutation, UnlikeMutation } from '../../schema/likeable';
import { UserIdentity, UserIdentityTypes } from '../../UserIdentity';
import { CommentList } from '../CommentList/CommentList';
import { CommentStyle } from './Comment.style';
import { CommentActionBar } from './CommentActionBar';
import { CommentEditor } from './CommentEditor';
import { useCommentState } from './useCommentState';
import { CommentTextarea } from '..';
import { useCommentCreateAction, useCommentDeleteAction, useCommentUpdateAction } from '.';
export var Comment = function (props) {
    var _a = __read(useMutation(LikeMutation), 1), like = _a[0];
    var _b = __read(useMutation(UnlikeMutation), 1), unlike = _b[0];
    var comment = props.data, onRefresh = props.onRefresh, onCreate = props.onCreate, onDelete = props.onDelete;
    var createComment = useCommentCreateAction(comment, {
        onCreate: onCreate,
        onRefresh: onRefresh,
    }).createComment;
    var deleteComment = useCommentDeleteAction(comment, {
        onDelete: onDelete,
        onRefresh: onRefresh,
    }).deleteComment;
    var commentUpdateAction = useCommentUpdateAction(comment, {
        onRefresh: onRefresh,
    });
    var _c = useCommentState(comment, commentUpdateAction), isLoading = _c.isLoading, discardChanges = _c.discardChanges, saveChanges = _c.saveChanges, setEditMode = _c.setEditMode, setEditedContentHTML = _c.setEditedContentHTML, toggleReplyMode = _c.toggleReplyMode, toggleShowReplies = _c.toggleShowReplies, toggleViewerHasLiked = _c.toggleViewerHasLiked;
    var renderShowMoreRepliesButton = function () {
        if (comment.replies && comment.replies.length) {
            var numReplies = comment.replies.length;
            var buttonText = "Show " + numReplies + " ";
            buttonText += numReplies === 1 ? 'Reply' : 'Replies';
            return (React.createElement("div", { className: "show-more-replies-btn", onClick: toggleShowReplies }, buttonText));
        }
    };
    var onUpdateContentHTML = function (event) {
        setEditedContentHTML(event.target.innerHTML);
    };
    var onReplyClick = function () {
        if (!comment.isShowingReplies) {
            toggleShowReplies();
            toggleReplyMode();
        }
    };
    var onLikeClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    toggleViewerHasLiked();
                    if (!comment.viewerHasLiked) return [3, 2];
                    return [4, unlike({ variables: { input: { likeableId: comment.id } } })];
                case 1:
                    _a.sent();
                    return [3, 4];
                case 2: return [4, like({ variables: { input: { likeableId: comment.id } } })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2];
            }
        });
    }); };
    var isLoggedIn = props.viewer && props.viewer.uid;
    var showReplyField = isLoggedIn && ((comment.isReplying && !comment.isEditing) || comment.isShowingReplies);
    return (React.createElement(CommentStyle, null,
        React.createElement(React.Fragment, null,
            React.createElement(UserIdentity, { user: comment.author, type: comment.isReply ? UserIdentityTypes.Reply : UserIdentityTypes.Comment, via: "project-details" }),
            React.createElement("div", { className: "comment-text-wrapper " + (comment.isReply ? 'reply' : '') },
                !comment.isEditing && (React.createElement(React.Fragment, null,
                    React.createElement("div", { className: "comment-text", dangerouslySetInnerHTML: {
                            __html: dompurify.sanitize(comment.contentHTML, { ADD_ATTR: ['target'] }),
                        } }),
                    React.createElement("div", { className: "comment-links-wrapper" },
                        React.createElement(CommentActionBar, { id: comment.key, onReplyClick: comment.isReply ? undefined : onReplyClick, onDeleteClick: deleteComment, onEditClick: setEditMode, createdAt: comment.createdAt, hasLiked: comment.viewerHasLiked, onLikeClick: onLikeClick, likesCount: comment.likes, viewerCanEdit: comment.viewerCanEdit, viewer: props.viewer })))),
                comment.isEditing && comment.viewerCanEdit && (React.createElement(CommentEditor, { contentHTML: comment.contentHTML, onUpdateText: onUpdateContentHTML, onUpdateClick: saveChanges, onCancelClick: discardChanges, isLoading: isLoading })),
                !comment.isShowingReplies && renderShowMoreRepliesButton()),
            comment.replies && comment.isShowingReplies && (React.createElement(React.Fragment, null,
                React.createElement(CommentList, { data: comment.replies, viewer: props.viewer, onRefresh: onRefresh, onCreate: onCreate, onDelete: onDelete, onLike: onLikeClick })))),
        showReplyField && (React.createElement("div", { className: "reply-field" },
            React.createElement(CommentTextarea, { id: comment.key, onPostClick: createComment, toggleReplyMode: toggleReplyMode, avatar: (props.viewer && props.viewer.img) || '', avatarSize: AvatarSizes.XSmall, placeholder: "Leave a reply", commentableType: Models.CommentableTypes.Comment, autoFocus: comment.isReplying || comment.isShowingReplies })))));
};
//# sourceMappingURL=Comment.js.map