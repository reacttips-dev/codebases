import * as React from "react";
import * as styles from "../style.css";
export const ChevronUp = ({ className = "", color = "darkGrey", viewBox = "0 0 32 32", }) => (React.createElement("svg", { className: `${styles[color]} ${className} ${styles.icon}`, viewBox: viewBox },
    React.createElement("path", { d: "M16,11.5a1,1,0,0,1,.74.29l7,6.91a1,1,0,0,1,0,1.48,1.06,1.06,0," +
            "0,1-1.49,0L16,14.08,9.82,20.21a1.06,1.06,0,0,1-1.49,0,1,1,0,0,1," +
            "0-1.48l7-6.91A1,1,0,0,1,16,11.5Z" })));
export default ChevronUp;
//# sourceMappingURL=ChevronUp.js.map