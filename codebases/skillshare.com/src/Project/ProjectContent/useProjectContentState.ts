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
import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { LikeMutation, UnlikeMutation } from '../../schema/likeable';
import { FollowUserMutation, UnfollowUserMutation } from '../../schema/user/client/mutations';
var useProjectCommentCountState = function (projectNumComments) {
    var _a = __read(useState(projectNumComments), 2), numComments = _a[0], setNumComments = _a[1];
    useEffect(function () {
        if (projectNumComments) {
            setNumComments(projectNumComments);
        }
    }, [projectNumComments]);
    var incrementNumComments = function () {
        setNumComments(numComments + 1);
    };
    var decrementNumComments = function (comment) {
        var count = comment.replies ? comment.replies.length + 1 : 1;
        setNumComments(numComments - count);
    };
    return {
        numComments: numComments,
        incrementNumComments: incrementNumComments,
        decrementNumComments: decrementNumComments,
    };
};
export var useProjectContentState = function (data) {
    var _a = __read(useState(data.likeCount), 2), numLikes = _a[0], setNumLikes = _a[1];
    var _b = __read(useState(data.viewerIsFollowing), 2), isFollowing = _b[0], setIsFollowing = _b[1];
    var _c = __read(useState(data.hasLiked), 2), showFilledHeart = _c[0], setShowFilledHeart = _c[1];
    var _d = useProjectCommentCountState(data.commentCount), numComments = _d.numComments, incrementNumComments = _d.incrementNumComments, decrementNumComments = _d.decrementNumComments;
    useEffect(function () {
        if (data) {
            setNumLikes(data.likeCount);
        }
    }, [data.likeCount]);
    useEffect(function () {
        if (data) {
            setIsFollowing(data.viewerIsFollowing);
        }
    }, [data.viewerIsFollowing]);
    useEffect(function () {
        if (data) {
            setShowFilledHeart(data.hasLiked);
        }
    }, [data.hasLiked]);
    var _e = __read(useMutation(FollowUserMutation), 1), followUser = _e[0];
    var _f = __read(useMutation(UnfollowUserMutation), 1), unfollowUser = _f[0];
    var _g = __read(useMutation(LikeMutation), 1), like = _g[0];
    var _h = __read(useMutation(UnlikeMutation), 1), unlike = _h[0];
    var onFollowClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isFollowing) return [3, 2];
                    return [4, unfollowUser({ variables: { id: data.authorId } })];
                case 1:
                    _a.sent();
                    return [3, 4];
                case 2: return [4, followUser({ variables: { id: data.authorId } })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    setIsFollowing(!isFollowing);
                    return [2];
            }
        });
    }); };
    var onProjectLikeClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!showFilledHeart) return [3, 2];
                    setShowFilledHeart(false);
                    setNumLikes(numLikes - 1);
                    return [4, unlike({ variables: { input: { likeableId: data.projectId } } })];
                case 1:
                    _a.sent();
                    return [3, 4];
                case 2:
                    setShowFilledHeart(true);
                    setNumLikes(numLikes + 1);
                    return [4, like({ variables: { input: { likeableId: data.projectId } } })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2];
            }
        });
    }); };
    return {
        numLikes: numLikes,
        isFollowing: isFollowing,
        showFilledHeart: showFilledHeart,
        numComments: numComments,
        onFollowClick: onFollowClick,
        onProjectLikeClick: onProjectLikeClick,
        incrementNumComments: incrementNumComments,
        decrementNumComments: decrementNumComments,
    };
};
//# sourceMappingURL=useProjectContentState.js.map