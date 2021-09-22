import * as React from "react";
import createProps from "../create-props";
import * as style from "../style.css";
const classMap = {
    xs: "col-xs",
    // tslint:disable-next-line:object-literal-sort-keys
    sm: "col-sm",
    md: "col-md",
    lg: "col-lg",
    xsOffset: "col-xs-offset",
    smOffset: "col-sm-offset",
    mdOffset: "col-md-offset",
    lgOffset: "col-lg-offset",
};
function isInteger(value) {
    return typeof value === "number" &&
        isFinite(value) &&
        Math.floor(value) === value;
}
function getClassNames(props) {
    const extraClasses = [];
    if (props.className) {
        extraClasses.push(props.className);
    }
    if (props.reverse) {
        extraClasses.push(style.reverse);
    }
    return Object.keys(props)
        .filter((key) => classMap[key])
        .map((key) => style[isInteger(props[key]) ? (classMap[key] + "-" + props[key]) : classMap[key]])
        .concat(extraClasses)
        .join(" ");
}
export function Col(props) {
    const className = getClassNames(props);
    return React.createElement(props.tagName || "div", createProps(props, className));
}
//# sourceMappingURL=col.js.map