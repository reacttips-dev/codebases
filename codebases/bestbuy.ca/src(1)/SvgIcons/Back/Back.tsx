import * as React from "react";
import * as styles from "../style.css";
const Back = ({ className = "", color = "black", viewBox = "0 0 48 48" }) => (React.createElement("svg", { className: `${styles[color]} ${className} ${styles.icon}`, viewBox: viewBox },
    React.createElement("path", { d: "M0 0h48v48h-48z", fill: "none" }),
    React.createElement("path", { d: "M40 22h-24.34l11.17-11.17-2.83-2.83-16 16 16 16 2.83-2.83-11.17-11.17h24.34v-4z" })));
export default Back;
//# sourceMappingURL=Back.js.map