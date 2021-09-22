import * as React from "react";
import getClass from "../classNames";
import createProps from "../createProps";
const rowKeys = ["start", "center", "end", "top", "middle", "bottom", "around", "between"];
const getRowClassNames = (props) => {
    const modificators = [props.className, getClass("row")];
    for (const key of rowKeys) {
        const value = props[key];
        if (value) {
            modificators.push(getClass(`${key}-${value}`));
        }
    }
    if (props.reverse) {
        modificators.push(getClass("reverse"));
    }
    return modificators;
};
export const getRowProps = (props) => createProps(props, getRowClassNames(props));
export const Row = (props) => React.createElement(props.tagName || "div", getRowProps(props));
export default Row;
//# sourceMappingURL=Row.js.map