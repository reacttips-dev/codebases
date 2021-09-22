var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
// tslint:disable:object-literal-sort-keys
import * as React from "react";
import getClass from "../classNames";
import createProps from "../createProps";
const classMap = {
    xs: "col-xs",
    sm: "col-sm",
    md: "col-md",
    lg: "col-lg",
    xl: "col-xl",
    xsOffset: "col-xs-offset",
    smOffset: "col-sm-offset",
    mdOffset: "col-md-offset",
    lgOffset: "col-lg-offset",
    xlOffset: "col-xl-offset",
};
const isInteger = (value) => typeof value === "number" && isFinite(value) && Math.floor(value) === value;
const getColClassNames = (props) => {
    const extraClasses = [];
    if (props.className) {
        extraClasses.push(props.className);
    }
    if (props.first) {
        extraClasses.push(getClass("first-" + props.first));
    }
    if (props.last) {
        extraClasses.push(getClass("last-" + props.last));
    }
    return Object.keys(props)
        .filter((key) => classMap[key])
        .map((key) => getClass(isInteger(props[key]) ? classMap[key] + "-" + props[key] : classMap[key]))
        .concat(extraClasses);
};
export const getColumnProps = (props) => createProps(props, getColClassNames(props));
export const Col = (props) => {
    const { tagName } = props, columnProps = __rest(props, ["tagName"]);
    return React.createElement(tagName || "div", getColumnProps(columnProps));
};
export default Col;
//# sourceMappingURL=Col.js.map