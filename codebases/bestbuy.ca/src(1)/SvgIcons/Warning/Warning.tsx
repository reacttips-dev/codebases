import * as React from "react";
import * as styles from "../style.css";
export const Warning = ({ color = "black", className = "", viewBox = "0 0 32 32", }) => (React.createElement("svg", { className: `${styles[color]} ${className}`, viewBox: viewBox },
    React.createElement("path", { 
        // tslint:disable-next-line: max-line-length
        d: "M29.88,26.74,16.74,4.42a.86.86,0,0,0-1.48,0L2.11,26.74a.84.84,0,0,0,0,.84.88.88,0,0,0,.75.42H29.14a.85.85,0,0,0,.74-.42A.8.8,0,0,0,29.88,26.74ZM4.34,26.32,16,6.52l11.66,19.8Z" }),
    React.createElement("path", { d: "M15.16,12.92l-.06,6.46a.9.9,0,0,0,1.8,0L17,12.92a.9.9,0,0,0-1.8,0Z" }),
    React.createElement("path", { d: "M16,21.85a1.34,1.34,0,1,0,1.33,1.34A1.33,1.33,0,0,0,16,21.85Z" })));
export default Warning;
//# sourceMappingURL=Warning.js.map