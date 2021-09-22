var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React from 'react';
import styled from 'styled-components';
import { color, typography } from '../../themes/utils';
var ProjectClassStyle = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    .project-class {\n        display: flex;\n\n        &-header {\n            ", "\n\n            font-size: 12px;\n            letter-spacing: 1px;\n            color: ", ";\n            text-transform: uppercase;\n            margin-top: 16px;\n            padding-bottom: 16px;\n        }\n\n        &-image {\n            min-width: 80px;\n            align-self: center;\n            height: 45px;\n            border-radius: 4px;\n        }\n\n        &-info {\n            ", "\n\n            margin-left: 8px;\n\n            .class-title {\n                color: ", ";\n                font-weight: bold;\n                text-decoration: none;\n\n                &-wrapper {\n                    margin-bottom: 4px;\n                }\n\n                &:hover {\n                    text-decoration: underline;\n                }\n            }\n\n            .class-author-name {\n                color: ", ";\n\n                text-decoration: none;\n            }\n        }\n    }\n"], ["\n    .project-class {\n        display: flex;\n\n        &-header {\n            ", "\n\n            font-size: 12px;\n            letter-spacing: 1px;\n            color: ", ";\n            text-transform: uppercase;\n            margin-top: 16px;\n            padding-bottom: 16px;\n        }\n\n        &-image {\n            min-width: 80px;\n            align-self: center;\n            height: 45px;\n            border-radius: 4px;\n        }\n\n        &-info {\n            ", "\n\n            margin-left: 8px;\n\n            .class-title {\n                color: ", ";\n                font-weight: bold;\n                text-decoration: none;\n\n                &-wrapper {\n                    margin-bottom: 4px;\n                }\n\n                &:hover {\n                    text-decoration: underline;\n                }\n            }\n\n            .class-author-name {\n                color: ", ";\n\n                text-decoration: none;\n            }\n        }\n    }\n"])), typography(function (t) { return t.label; }), color(function (c) { return c.navy; }), typography(function (t) { return t.links.nav.small; }), color(function (c) { return c.violet; }), color(function (c) { return c.charcoal; }));
export var ProjectClass = function (props) {
    return (React.createElement(ProjectClassStyle, null,
        React.createElement("div", { className: "project-class-header" }, "Class"),
        React.createElement("div", { className: "project-class" },
            React.createElement("a", { target: "_blank", rel: "noreferrer", href: props.url + "?via=project-details" },
                React.createElement("img", { className: "project-class-image", alt: "Project Class", src: props.image })),
            React.createElement("div", { className: "project-class-info" },
                React.createElement("div", { className: "class-title-wrapper" },
                    React.createElement("a", { className: "class-title", target: "_blank", rel: "noreferrer", href: props.url + "?via=project-details" }, props.title)),
                React.createElement("div", { className: "class-author-name-wrapper" },
                    React.createElement("a", { target: "_blank", rel: "noreferrer", href: props.classAuthorProfile, className: "class-author-name" }, props.classAuthorName))))));
};
var templateObject_1;
//# sourceMappingURL=ProjectClass.js.map