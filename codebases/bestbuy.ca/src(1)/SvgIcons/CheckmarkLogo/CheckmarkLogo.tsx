import * as React from "react";
import * as styles from "../style.css";
export const CheckmarkLogo = ({ className = "", color = "green", viewBox = "0 0 32 32", }) => (React.createElement("svg", { viewBox: viewBox, className: `${className} ${styles[color]} ${styles.icon}` },
    React.createElement("path", { d: "M16,2A14,14,0,1,0,30,16,14,14,0,0,0,16,2Zm6.93,10.22-8.71,8.92a.94.94,\n            0,0,1-1.34,0c-.25-.25.48.43-3.81-3.95a1,1,0,0,1,0-1.37.93.93,0,0,1,1.34,0l3.17,3.25,\n            8-8.21a.93.93,0,0,1,1.34,0A1,1,0,0,1,22.93,12.22Z" })));
export default CheckmarkLogo;
//# sourceMappingURL=CheckmarkLogo.js.map