import * as React from "react";
import * as styles from "../style.css";
export const PlusCircle = ({ className = "", color = "darkGrey", viewBox = "0 0 32 32", filled = false, }) => (React.createElement("svg", { className: `${styles[color]} ${className} ${styles.icon}`, viewBox: viewBox }, filled ? (React.createElement("path", { d: "M16,.1A15.9,15.9,0,1,0,31.9,16,15.91,15.91,0,0,0,16,.1Zm4,16.8H16.9V20a.9.9,0,1,1-1.8,0V16.9H12a.9.9,0,1,1,0-1.8h3.1V12a.9.9,0,0,1,1.8,0v3.1H20a.9.9,0,0,1,0,1.8Z" })) : (React.createElement(React.Fragment, null,
    React.createElement("path", { d: "M20.09,15H17V11.91a1,1,0,0,0-2,0V15H11.91a1,1,0,0,0,0,2H15v3.09a1,1,0,0,0,2," +
            "0V17h3.09a1,1,0,0,0,0-2Z" }),
    React.createElement("path", { d: "M16,2A14,14,0,1,0,30,16,14,14,0,0,0,16,2Zm0,26.2A12.2,12.2,0,1,1,28.2,16,12.21," +
            "12.21,0,0,1,16,28.2Z" })))));
export default PlusCircle;
//# sourceMappingURL=PlusCircle.js.map