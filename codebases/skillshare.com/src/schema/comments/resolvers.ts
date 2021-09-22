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
import { gql } from 'apollo-boost';
var CommentFragment = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    fragment Comment on Comment {\n        id\n        contentHTML\n        editedContentHTML\n        isReplying\n        isShowingReplies\n        isEditing\n        viewerHasLiked\n        likes\n    }\n"], ["\n    fragment Comment on Comment {\n        id\n        contentHTML\n        editedContentHTML\n        isReplying\n        isShowingReplies\n        isEditing\n        viewerHasLiked\n        likes\n    }\n"])));
var CommentStateFragment = gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    fragment CommentState on Comment {\n        contentHTML\n        editedContentHTML\n        isReplying\n        isShowingReplies\n        isEditing\n        viewerHasLiked\n        likes\n    }\n"], ["\n    fragment CommentState on Comment {\n        contentHTML\n        editedContentHTML\n        isReplying\n        isShowingReplies\n        isEditing\n        viewerHasLiked\n        likes\n    }\n"])));
var updateCommentState = function (root, _a, context) {
    var input = _a.input;
    return __awaiter(void 0, void 0, void 0, function () {
        var _b, comment, commentId, editedComment;
        return __generator(this, function (_c) {
            _b = getComment(input.id, context), comment = _b.comment, commentId = _b.commentId;
            editedComment = __assign(__assign({}, comment), input);
            context.cache.writeFragment({
                id: commentId,
                fragment: CommentStateFragment,
                data: __assign(__assign({}, editedComment), { __typename: 'Comment' }),
            });
            return [2, {
                    comment: editedComment,
                    __typename: 'UpdateCommentEditContextPayload',
                }];
        });
    });
};
export var CommentResolvers = {
    Mutation: {
        updateCommentState: updateCommentState,
    },
    Query: {
        projectByKey: function (root, args, context) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (root.projectByKey) {
                    root.projectByKey.comments.forEach(function (comment) {
                        setCommentDefaults(comment, context);
                        if (comment.replies) {
                            comment.replies.forEach(function (reply) {
                                setCommentDefaults(reply, context);
                            });
                        }
                    });
                }
                return [2, root.projectByKey];
            });
        }); },
    },
};
function getComment(id, context) {
    var cache = context.cache, getCacheKey = context.getCacheKey;
    var commentId = getCacheKey({
        id: id,
        __typename: 'Comment',
    });
    var comment = cache.readFragment({
        id: commentId,
        fragment: CommentFragment,
    });
    return { comment: comment, commentId: commentId };
}
function setCommentDefaults(comment, context) {
    var cache = context.cache, getCacheKey = context.getCacheKey;
    var id = getCacheKey({
        id: comment.id,
        __typename: 'Comment',
    });
    var cachedComment = cache.readFragment({
        fragment: CommentFragment,
        id: id,
    });
    if (!cachedComment) {
        comment.isEditing = false;
        comment.isReplying = false;
        comment.isShowingReplies = false;
        comment.editedContentHTML = '';
        comment.viewerHasLiked = comment.viewerHasLiked || false;
        comment.likes = comment.likes || 0;
    }
}
var templateObject_1, templateObject_2;
//# sourceMappingURL=resolvers.js.map