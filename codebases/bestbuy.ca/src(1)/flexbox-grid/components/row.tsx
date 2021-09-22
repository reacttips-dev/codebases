import classNames from "classnames";
import * as React from "react";
import createProps from "../create-props";
import * as style from "../style.css";
const modificatorKeys = ["start", "center", "end", "top", "middle", "bottom", "around", "between", "first", "last"];
function getClassNames(props) {
    const modificators = [style.row];
    for (const key of modificatorKeys) {
        const value = props[key];
        if (value) {
            modificators.push(style[`${key}-${value}`]);
        }
    }
    if (props.reverse) {
        modificators.push(style.reverse);
    }
    return classNames(props.className, modificators);
}
export function Row(props) {
    return React.createElement(props.tagName || "div", createProps(props, getClassNames(props)));
}
//# sourceMappingURL=row.js.map