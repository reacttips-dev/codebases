import * as React from "react";
import * as styles from "../style.css";
export const Menu = ({ className, color = "black", viewBox = "4 4 24 24" }) => (React.createElement("svg", { className: `${styles[color]} ${className} ${styles.icon}`, viewBox: viewBox },
    React.createElement("path", { fillRule: "evenodd", d: "M5,21H27a1,1,0,0,1,0,2H5a1,1,0,0,1,0-2ZM5,9H27a1,1,0,0,1,0,2H5A1,1,0,0,1,5,9Zm0,6H27a1,1,0,0,1,0,2H5a1,1,0,0,1,0-2Z" })));
export default Menu;
//# sourceMappingURL=Menu.js.map