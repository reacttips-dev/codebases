/* tslint:disable:max-line-length */
import * as React from "react";
import * as styles from "../style.css";
export const Youtube = ({ color = "black", className = "", viewBox = "0 0 20 20" }) => (React.createElement("svg", { className: `${className} ${styles.icon}`, viewBox: viewBox, version: "1.1", xmlns: "http://www.w3.org/2000/svg", xmlnsXlink: "http://www.w3.org/1999/xlink" },
    React.createElement("defs", null,
        React.createElement("path", { d: "M17.0766667,6.12275013 C14.674,5.95875013 9.32266667,5.95941679 6.92333333,6.12275013 C4.32533333,6.30008346 4.01933333,7.86941679 4,12.0000835 C4.01933333,16.1234168 4.32266667,17.6994168 6.92333333,17.8774168 C9.32333333,18.0407501 14.674,18.0414168 17.0766667,17.8774168 C19.6746667,17.7000835 19.9806667,16.1307501 20,12.0000835 C19.9806667,7.87675013 19.6773333,6.30075013 17.0766667,6.12275013 Z M10,14.6667501 L10,9.33341679 L15.3333333,11.9954168 L10,14.6667501 L10,14.6667501 Z", id: "path-Youtube" })),
    React.createElement("g", { id: "logos/social/youtube", stroke: "none", strokeWidth: "1", fill: "none", fillRule: "evenodd" },
        React.createElement("g", { id: "youtube" },
            React.createElement("polygon", { id: "bounds", points: "0 0 24 0 24 24 0 24" }),
            React.createElement("mask", { id: "mask-2", fill: "white" },
                React.createElement("use", { xlinkHref: "#path-Youtube" })),
            React.createElement("use", { className: styles[color], id: "Mask", fill: "#000000", xlinkHref: "#path-Youtube" })))));
//# sourceMappingURL=Youtube.js.map