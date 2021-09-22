import * as React from "react";
import * as svgIconStyles from "../style.css";
import * as styles from "./style.css";
export const Caret = ({ className = "", color = "black", variant = "right", viewBox = "0 0 32 32", }) => (React.createElement(React.Fragment, null,
    React.createElement("svg", { className: `${svgIconStyles[color]} ${styles[variant]} ${className}`, viewBox: viewBox },
        React.createElement("path", { className: "cls-1", d: "M19.5,16.71l-5.59,5.59a1,1,0,0,1-1.71-.71V10.41a1,1,0,0,1,1.71-.71l5.59,5.59A1,1,0,0,1,19.5,16.71Z" }))));
export const CaretDown = (props) => React.createElement(Caret, Object.assign({}, props, { variant: "down" }));
export const CaretRight = (props) => React.createElement(Caret, Object.assign({}, props, { variant: "right" }));
export const CaretUp = (props) => React.createElement(Caret, Object.assign({}, props, { variant: "up" }));
export const CaretLeft = (props) => React.createElement(Caret, Object.assign({}, props, { variant: "left" }));
//# sourceMappingURL=Caret.js.map