import * as React from "react";
import getClass from "../classNames";
import createProps from "../createProps";
export const Grid = (props) => {
    const containerClass = getClass("container-fluid");
    const classNames = [props.className, containerClass];
    return React.createElement(props.tagName || "div", createProps(props, classNames));
};
export default Grid;
//# sourceMappingURL=Grid.js.map