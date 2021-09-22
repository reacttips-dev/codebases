import React from 'react';
import { Box } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { ProjectCommentSectionStyle } from '../../Project/ProjectCommentSection';
export var renderSkeletonBody = function () {
    return (React.createElement(Box, { paddingTop: 4 },
        React.createElement(Skeleton, { variant: "rect", animation: "wave", width: 348, height: 32 }),
        React.createElement(Box, { paddingTop: 2 },
            React.createElement(Skeleton, { variant: "rect", animation: "wave", height: 336 })),
        React.createElement(Box, { paddingTop: 4, paddingBottom: 4 },
            React.createElement(Skeleton, { variant: "rect", animation: "wave", height: 16 }),
            React.createElement(Box, { paddingTop: 2, paddingBottom: 2 },
                React.createElement(Skeleton, { variant: "rect", animation: "wave", height: 16 })),
            React.createElement(Box, { paddingBottom: 2 },
                React.createElement(Skeleton, { variant: "rect", animation: "wave", height: 16 })),
            React.createElement(Skeleton, { variant: "rect", animation: "wave", width: 362, height: 16 })),
        React.createElement(Skeleton, { variant: "rect", animation: "wave", height: 336 })));
};
export var renderSkeletonMetadata = function () {
    return (React.createElement(React.Fragment, null,
        React.createElement(Box, { display: "flex" },
            React.createElement(Skeleton, { variant: "circle", width: 72, height: 72 }),
            React.createElement(Box, { paddingLeft: 1 },
                React.createElement(Skeleton, { variant: "rect", width: 175, height: 16 }),
                React.createElement(Box, { paddingTop: 1, paddingBottom: 1 },
                    React.createElement(Skeleton, { variant: "rect", width: 209, height: 16 })),
                React.createElement(Skeleton, { variant: "rect", width: 85, height: 16 }))),
        React.createElement(Box, { display: "flex", alignItems: "center", paddingTop: 3 },
            React.createElement(Skeleton, { variant: "circle", width: 40, height: 40 }),
            React.createElement(Box, { paddingLeft: 2 },
                React.createElement(Skeleton, { variant: "rect", width: 209, height: 16 })))));
};
export var renderSkeletonComment = function () {
    return (React.createElement(Box, { display: "flex" },
        React.createElement(Skeleton, { variant: "circle", width: 32, height: 32 }),
        React.createElement(Box, { paddingLeft: 1 },
            React.createElement(Skeleton, { variant: "rect", width: 136, height: 16 }),
            React.createElement(Box, { paddingTop: 2, paddingBottom: 1 },
                React.createElement(Skeleton, { variant: "rect", height: 16 })),
            React.createElement(Box, { paddingBottom: 2 },
                React.createElement(Skeleton, { variant: "rect", width: 236, height: 16 })),
            React.createElement(Skeleton, { variant: "rect", width: 111, height: 16 }))));
};
export var renderSkeletonCommentsSection = function () {
    return (React.createElement(ProjectCommentSectionStyle, null,
        React.createElement(Box, { paddingTop: 2 },
            React.createElement(Skeleton, { variant: "rect", width: 97, height: 16 })),
        React.createElement(Box, { display: "flex", paddingTop: 2, paddingBottom: 3 },
            React.createElement(Skeleton, { variant: "circle", width: 32, height: 32 }),
            React.createElement(Box, { paddingLeft: 1 },
                React.createElement(Skeleton, { variant: "rect", width: 304, height: 58 }))),
        renderSkeletonComment(),
        React.createElement(Box, { paddingTop: 4, paddingBottom: 4 }, renderSkeletonComment()),
        renderSkeletonComment(),
        React.createElement(Box, { paddingTop: 3, paddingLeft: 5 },
            React.createElement(Skeleton, { variant: "rect", height: 32 }))));
};
export var renderSkeletonClass = function () {
    return (React.createElement(React.Fragment, null,
        React.createElement(Box, { paddingTop: 2 },
            React.createElement(Skeleton, { variant: "rect", height: 16, width: 55 })),
        React.createElement(Box, { display: "flex", paddingTop: 2 },
            React.createElement(Skeleton, { variant: "rect", height: 45, width: 82 }),
            React.createElement(Box, { paddingLeft: 1 },
                React.createElement(Box, { paddingBottom: 1 },
                    React.createElement(Skeleton, { variant: "rect", width: 254, height: 16 })),
                React.createElement(Skeleton, { variant: "rect", height: 16, width: 154 })))));
};
//# sourceMappingURL=project-skeletons.js.map