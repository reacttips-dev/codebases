var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled from 'styled-components';
import { color, typography } from '../../themes/utils';
export var ProjectMetadataStyle = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    color: ", ";\n    ", "\n\n    margin-left: 16px;\n\n    .likes-counter,\n    .comments-counter,\n    .views-counter {\n        display: inline-block;\n    }\n\n    .likes-counter,\n    .comments-counter {\n        &:after {\n            color: ", ";\n            content: '\\00B7';\n            padding-left: 4px;\n            padding-right: 4px;\n            font-weight: 600;\n        }\n    }\n"], ["\n    color: ", ";\n    ", "\n\n    margin-left: 16px;\n\n    .likes-counter,\n    .comments-counter,\n    .views-counter {\n        display: inline-block;\n    }\n\n    .likes-counter,\n    .comments-counter {\n        &:after {\n            color: ", ";\n            content: '\\\\00B7';\n            padding-left: 4px;\n            padding-right: 4px;\n            font-weight: 600;\n        }\n    }\n"])), color(function (c) { return c.navy; }), typography(function (t) { return t.links.nav.small; }), color(function (c) { return c.navy; }));
export var ProjectMetadata = function (props) { return (React.createElement(ProjectMetadataStyle, null,
    React.createElement("div", { className: "likes-counter" },
        props.numLikes,
        " likes"),
    React.createElement("div", { className: "comments-counter" },
        props.numComments || 0,
        " comments"),
    React.createElement("div", { className: "views-counter" },
        props.numViews,
        " views"))); };
var templateObject_1;
//# sourceMappingURL=ProjectMetadata.js.map