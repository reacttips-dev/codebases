import * as React from "react";
import * as styles from "../style.css";
export const Clear = ({ className = "", color = "mediumGrey", viewBox = "0 0 32 32", }) => (React.createElement("svg", { className: `${styles[color]} ${className} ${styles.icon}`, focusable: "false", viewBox: viewBox, "aria-hidden": "true" },
    React.createElement("path", { d: "M21.66,10.34a1,1,0,0,1,0,1.42L17.41,16l4.25,4.24a1,1,0,0,1-1.42,1.42L16,17.41l-4.24,4.25a1,1,0,0,1-1.42-1.42L14.59,16l-4.25-4.24a1,1,0,0,1,1.42-1.42L16,14.59l4.24-4.25A1,1,0,0,1,21.66,10.34ZM25.9,6.1a14,14,0,1,0,0,19.8A14,14,0,0,0,25.9,6.1Z" })));
export default Clear;
//# sourceMappingURL=Clear.js.map