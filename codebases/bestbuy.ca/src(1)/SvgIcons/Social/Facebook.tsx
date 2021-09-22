/* tslint:disable:max-line-length */
import * as React from "react";
import * as styles from "../style.css";
export const Facebook = ({ color = "black", className = "", viewBox = "0 0 20 20" }) => (React.createElement("svg", { className: `${className} ${styles.icon}`, viewBox: viewBox, version: "1.1", xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink" },
    React.createElement("defs", null,
        React.createElement("path", { d: "M13.3333333,9.33333333 L13.3333333,7.73333333 C13.3333333,7.04 13.4933333,6.66666667 14.6133333,6.66666667 L16,6.66666667 L16,4 L13.8666667,4 C11.2,4 10.1333333,5.76 10.1333333,7.73333333 L10.1333333,9.33333333 L8,9.33333333 L8,12 L10.1333333,12 L10.1333333,20 L13.3333333,20 L13.3333333,12 L15.68,12 L16,9.33333333 L13.3333333,9.33333333 Z", id: "path-Facebook" })),
    React.createElement("g", { id: "logos/social/facebook", stroke: "none", strokeWidth: "1", fill: "none", fillRule: "evenodd" },
        React.createElement("g", { id: "facebook" },
            React.createElement("rect", { id: "bounds", x: "0", y: "0", width: "24", height: "24" }),
            React.createElement("mask", { id: "mask-2", fill: "white" },
                React.createElement("use", { xlinkHref: "#path-Facebook" })),
            React.createElement("use", { className: styles[color], id: "Mask", fill: "#000000", xlinkHref: "#path-Facebook" })))));
//# sourceMappingURL=Facebook.js.map