import * as React from "react";
import * as styles from "./style.css";
export const CheckmarkAnimated = ({ className = "", color = "green", viewBox = "0 0 52 52", }) => (React.createElement("svg", { className: `${styles[color]} ${styles.circleFill} ${className}`, xmlns: "http://www.w3.org/2000/svg", viewBox: viewBox, "data-automation": "checkmark" },
    React.createElement("circle", { className: `${styles[color]} ${styles.circleOutline}`, cx: "26", cy: "26", r: "25", fill: "none" }),
    React.createElement("path", { className: `${styles[color]} ${styles.checkmark}`, fill: "none", d: "M14.1 27.2l7.1 7.2 16.7-16.8" })));
export default CheckmarkAnimated;
//# sourceMappingURL=CheckmarkAnimated.js.map