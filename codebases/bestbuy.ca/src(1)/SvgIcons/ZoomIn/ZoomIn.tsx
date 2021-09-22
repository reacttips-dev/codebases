import * as React from "react";
import * as styles from "../style.css";
export const ZoomIn = ({ className = "", color = "black", viewBox = "0 0 32 32", }) => (React.createElement("svg", { className: `${styles[color]} ${className} ${styles.icon}`, viewBox: viewBox },
    React.createElement("path", { 
        // tslint:disable-next-line: max-line-length
        d: "M27.72,26.39,21,19.62A9.57,9.57,0,1,0,19.62,21l6.77,6.77a.94.94,0,0,0,.67.28.9.9,0,0,0,.66-.28A.94.94,0,0,0,27.72,26.39ZM13.5,21A7.5,7.5,0,1,1,21,13.5,7.5,7.5,0,0,1,13.5,21Z" }),
    React.createElement("path", { d: "M17.84,12.56H14.75v-3a1,1,0,0,0-2,0v3H9.66a1,1,0,0,0,0,2h3.09v3a1,1,0,0,0,2,0v-3h3.09a1,1,0,0,0,0-2Z" })));
export default ZoomIn;
//# sourceMappingURL=ZoomIn.js.map