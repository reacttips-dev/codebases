import * as React from "react";
import * as styles from "../style.css";
export const Checkmark = ({ className = "", color = "green", viewBox = "0 0 32 32", }) => (React.createElement("svg", { className: `${styles[color]} ${className} ${styles.icon}`, viewBox: viewBox },
    React.createElement("path", { d: "M12.22,24.64a.94.94,0,0,1-1.34,0L4.07,17.69a1,1,0,0,1,0-1.37.93.93,0,0,1,1.34,0l6.17,6.25,15-15" +
            ".21a.93.93,0,0,1,1.34,0,1,1,0,0,1,0,1.36Z" })));
export default Checkmark;
//# sourceMappingURL=Checkmark.js.map