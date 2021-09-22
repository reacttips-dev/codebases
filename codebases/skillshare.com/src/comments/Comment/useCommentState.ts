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
import dompurify from 'isomorphic-dompurify';
import { useMutation } from '@apollo/react-hooks';
import { UpdateCommentStateMutation } from '../../schema/comments';
export var useCommentState = function (comment, commentUpdateAction) {
    var _a = __read(useMutation(UpdateCommentStateMutation), 2), mutate = _a[0], isLoading = _a[1].loading;
    var setState = function (state) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, mutate({
                        variables: {
                            input: __assign(__assign({}, state), { id: comment.id }),
                        },
                    })];
                case 1:
                    _a.sent();
                    return [2];
            }
        });
    }); };
    var setIsEditing = function (isEditing) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, setState({
                        isEditing: isEditing,
                    })];
                case 1:
                    _a.sent();
                    return [2];
            }
        });
    }); };
    var setEditMode = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, setIsEditing(true)];
                case 1:
                    _a.sent();
                    return [2];
            }
        });
    }); };
    var toggleShowReplies = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, setState({
                        isShowingReplies: !comment.isShowingReplies,
                    })];
                case 1:
                    _a.sent();
                    return [2];
            }
        });
    }); };
    var toggleReplyMode = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, setState({
                        isReplying: !comment.isReplying,
                    })];
                case 1:
                    _a.sent();
                    return [2];
            }
        });
    }); };
    var setEditedContentHTML = function (contentHTML) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, setState({
                        editedContentHTML: contentHTML,
                    })];
                case 1:
                    _a.sent();
                    return [2];
            }
        });
    }); };
    var toggleViewerHasLiked = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, setState({
                        viewerHasLiked: !comment.viewerHasLiked,
                        likes: comment.viewerHasLiked ? comment.likes - 1 : comment.likes + 1,
                    })];
                case 1:
                    _a.sent();
                    return [2];
            }
        });
    }); };
    var saveChanges = function () { return __awaiter(void 0, void 0, void 0, function () {
        var sanitizedContentHTML;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!comment.editedContentHTML.length) return [3, 2];
                    return [4, setState({
                            isEditing: false,
                        })];
                case 1:
                    _a.sent();
                    return [2];
                case 2:
                    sanitizedContentHTML = dompurify.sanitize(comment.editedContentHTML, { ADD_ATTR: ['target'] });
                    return [4, setState({
                            contentHTML: sanitizedContentHTML,
                            editedContentHTML: sanitizedContentHTML,
                            isEditing: false,
                        })];
                case 3:
                    _a.sent();
                    if (!(sanitizedContentHTML.length > 0 && sanitizedContentHTML !== comment.contentHTML)) return [3, 5];
                    return [4, commentUpdateAction.updateComment(sanitizedContentHTML)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [2];
            }
        });
    }); };
    var discardChanges = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, setState({
                        isEditing: false,
                        contentHTML: comment.contentHTML,
                        editedContentHTML: comment.contentHTML,
                    })];
                case 1:
                    _a.sent();
                    return [2];
            }
        });
    }); };
    return {
        isLoading: isLoading,
        setEditMode: setEditMode,
        setEditedContentHTML: setEditedContentHTML,
        saveChanges: saveChanges,
        discardChanges: discardChanges,
        toggleShowReplies: toggleShowReplies,
        toggleReplyMode: toggleReplyMode,
        toggleViewerHasLiked: toggleViewerHasLiked,
    };
};
//# sourceMappingURL=useCommentState.js.map