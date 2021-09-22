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
import React from 'react';
import dompurify from 'isomorphic-dompurify';
import { Box } from '@material-ui/core';
import { Button, ButtonSize, ButtonType, LikeButton } from '../components/buttons';
import { ProjectModalBodyStyle } from '../components/projects/modal-body-style';
import { ProjectModalSidebarStyle } from '../components/projects/modal-sidebar-style';
import { ProjectModalContentStyle } from '../components/projects/modal-style';
import { HandleIcon } from '../Icons';
import { getUrlAndOverrideVia } from '../shared/helpers';
import { renderSkeletonBody, renderSkeletonClass, renderSkeletonCommentsSection, renderSkeletonMetadata, } from '../shared/helpers/project-skeletons';
import { useEnvironment, useViewerContext } from '../shared/hooks';
import { UserIdentity, UserIdentityTypes } from '../UserIdentity';
import { ProjectClass } from './ProjectClass';
import { ProjectCommentSection } from './ProjectCommentSection';
import { useProjectContentState } from './ProjectContent/useProjectContentState';
import { ProjectMetadata } from './ProjectMetadata';
export var Project = function (props) {
    var _a, _b, _c, _d, _e, _f, _g;
    var data = props.data;
    var viewer = useViewerContext().user;
    var appHost = useEnvironment().appHost;
    var redirectTo = appHost + "/signup?redirectTo=" + props.redirectTo;
    var coverImages = ((_a = data === null || data === void 0 ? void 0 : data.coverImage) === null || _a === void 0 ? void 0 : _a.sources) || [];
    var getCommentCount = function () {
        var _a;
        var comments = (_a = data === null || data === void 0 ? void 0 : data.comments) !== null && _a !== void 0 ? _a : [];
        var numReplies = comments.reduce(function (count, comment) { var _a, _b; return (_b = count + ((_a = comment === null || comment === void 0 ? void 0 : comment.replies) === null || _a === void 0 ? void 0 : _a.length)) !== null && _b !== void 0 ? _b : 0; }, 0);
        return comments.length + numReplies;
    };
    var useProjectContentStateData = {
        canEdit: (_b = data === null || data === void 0 ? void 0 : data.viewer) === null || _b === void 0 ? void 0 : _b.canEdit,
        hasLiked: (_c = data === null || data === void 0 ? void 0 : data.viewer) === null || _c === void 0 ? void 0 : _c.hasLiked,
        viewerIsFollowing: (_e = (_d = data === null || data === void 0 ? void 0 : data.author) === null || _d === void 0 ? void 0 : _d.viewer) === null || _e === void 0 ? void 0 : _e.isFollowing,
        likeCount: data === null || data === void 0 ? void 0 : data.likeCount,
        commentCount: getCommentCount(),
        authorId: (_f = data === null || data === void 0 ? void 0 : data.author) === null || _f === void 0 ? void 0 : _f.id,
        projectId: data === null || data === void 0 ? void 0 : data.id,
    };
    var _h = useProjectContentState(useProjectContentStateData), numLikes = _h.numLikes, isFollowing = _h.isFollowing, showFilledHeart = _h.showFilledHeart, numComments = _h.numComments, onFollowClick = _h.onFollowClick, onProjectLikeClick = _h.onProjectLikeClick, incrementNumComments = _h.incrementNumComments, decrementNumComments = _h.decrementNumComments;
    var mappedAuthor = function (author) {
        if (!author) {
            return undefined;
        }
        return {
            uid: author.id,
            name: author.firstName + " " + author.lastName,
            profileUrl: "" + appHost + getProfileUrl(author),
            img: author.mediumPictureUrl,
            headline: author.headline,
            isTeacher: author.isTeacher,
            isTopTeacher: author.isTopTeacher,
        };
    };
    var mappedViewer = {
        uid: viewer === null || viewer === void 0 ? void 0 : viewer.id,
        img: viewer === null || viewer === void 0 ? void 0 : viewer.mediumPictureUrl,
    };
    var getProfileUrl = function (user) {
        if (user === null || user === void 0 ? void 0 : user.vanityUsername) {
            return "/user/" + user.vanityUsername;
        }
        else {
            return "/profile/" + user.firstName + "-" + user.lastName + "/" + user.username;
        }
    };
    var mappedProjectClass = function (projectClass) {
        if (!projectClass) {
            return undefined;
        }
        return {
            title: projectClass.title,
            url: getUrlAndOverrideVia(projectClass.url, 'project-details'),
            image: projectClass.smallCoverUrl,
            classAuthorName: projectClass.teacher.name,
            classAuthorProfile: getProfileUrl(projectClass.teacher),
        };
    };
    var srcSetEntries = coverImages.map(function (coverImage) { return coverImage.url + " " + coverImage.width + "w"; });
    return (React.createElement(ProjectModalContentStyle, null,
        React.createElement("div", { className: "project-modal-content-wrapper" },
            React.createElement("div", { className: "project-wrapper" },
                React.createElement("div", { className: "project-container" }, props.loading ? (renderSkeletonBody()) : (React.createElement(React.Fragment, null,
                    ((_g = data.viewer) === null || _g === void 0 ? void 0 : _g.canEdit) && (React.createElement("div", { className: "edit-project-button" },
                        React.createElement("a", { href: "/projects/" + data.key + "/edit" },
                            React.createElement(Button, { text: "Edit Project", type: ButtonType.AltNavyGhost, size: ButtonSize.Medium })))),
                    React.createElement("div", { className: "project" },
                        data.title && React.createElement("h2", null, data.title),
                        !!(coverImages === null || coverImages === void 0 ? void 0 : coverImages.length) && (React.createElement("img", { id: "cover-image", width: coverImages[0].width, height: coverImages[0].height, src: coverImages[0].url, srcSet: srcSetEntries.join(','), sizes: "\n                                                (min-width: 1366px) 1242w,\n                                                (min-width: 1280px) 800w,\n                                                (min-width: 800px) 450w,\n                                                (min-width: 450px) 246w,\n                                                100vw,\n                                            ", alt: data.title + " - student project" })),
                        React.createElement("div", { className: "project-content-wrapper" },
                            React.createElement(ProjectModalBodyStyle, null,
                                React.createElement("div", { className: "body rich-content-wrapper" },
                                    React.createElement("div", { dangerouslySetInnerHTML: {
                                            __html: dompurify.sanitize(data.contentHTML, {
                                                ADD_TAGS: ['iframe'],
                                            }),
                                        } }))))))))),
            React.createElement(ProjectModalSidebarStyle, null,
                React.createElement("div", { className: "project-sidebar" },
                    React.createElement("div", { className: "project-sidebar-wrapper" },
                        React.createElement("div", { className: "project-sidebar-handle" },
                            React.createElement(HandleIcon, null)),
                        React.createElement("div", { className: "project-sidebar-info" }, props.loading ? (renderSkeletonMetadata()) : (React.createElement(React.Fragment, null,
                            React.createElement("div", { className: "project-user-identity" },
                                React.createElement(UserIdentity, { user: mappedAuthor(data.author), onFollowClick: onFollowClick, type: UserIdentityTypes.Main, viewerisFollowing: isFollowing, viewer: mappedViewer, redirectTo: redirectTo, via: "project-details" })),
                            React.createElement("div", { className: "project-metadata-wrapper" },
                                viewer && viewer.id ? (React.createElement(LikeButton, { isFilled: showFilledHeart, onClick: onProjectLikeClick })) : (React.createElement(Box, { display: "flex" },
                                    React.createElement("a", { href: redirectTo },
                                        React.createElement(LikeButton, { width: 24, height: 24, isFilled: false })))),
                                React.createElement(ProjectMetadata, { numLikes: numLikes, numComments: numComments, numViews: data.viewCount }))))),
                        props.loading ? (renderSkeletonCommentsSection()) : (React.createElement(ProjectCommentSection, { viewer: mappedViewer, projectKey: data.key, onCreate: incrementNumComments, onDelete: decrementNumComments, onRefresh: props.onRefresh })),
                        props.loading
                            ? renderSkeletonClass()
                            : data.class && React.createElement(ProjectClass, __assign({}, mappedProjectClass(data.class)))))))));
};
//# sourceMappingURL=Project.js.map