import * as React from "react";
import * as styles from "../style.css";
export const TextBubble = ({ className = "", color = "blue", viewBox = "0 0 32 32", }) => (React.createElement("svg", { focusable: "false", viewBox: viewBox, className: `${styles[color]} ${styles.icon} ${className}` },
    React.createElement("path", { d: "M27.32,3.5H4.72A2.72,2.72,0,0,0,2,6.23V21a2.75,2.75,0,0,0,2.75,\n        2.75H17.26l6.19,4.55a1,1,0,0,0,.57.19,1,1,0,0,0,.79-.39,1,1,0,0,0-.21-1.36L18.15,\n        22a.89.89,0,0,0-.57-.19H4.75A.81.81,0,0,1,3.94,21V6.23a.78.78,0,0,1,.78-.79h22.6a.75.75,\n        0,0,1,.75.75V21a.8.8,0,0,1-.79.79H24a1,1,0,0,0,0,1.94h3.25A2.73,2.73,0,0,0,30,21V6.19A2.69,\n        2.69,0,0,0,27.32,3.5Z" }),
    React.createElement("path", { d: "M10.83,15l10.34.06a.9.9,0,1,0,0-1.79l-10.34-.07a.9.9,0,1,0,0,1.8Z" })));
export default TextBubble;
//# sourceMappingURL=TextBubble.js.map