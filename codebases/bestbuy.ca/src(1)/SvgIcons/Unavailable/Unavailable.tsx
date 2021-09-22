import * as React from "react";
import * as styles from "../style.css";
const Unavailable = ({ className = "", color = "black", viewBox = "0 0 32 32", }) => (React.createElement("svg", { className: `${className} ${styles[color]}`, viewBox: viewBox },
    React.createElement("path", { 
        // tslint:disable-next-line: max-line-length
        d: "M25.93 6.14A14 14 0 0 0 6.08 25.87 14 14 0 0 0 25.93 6.14zM16 3.8a12.14 12.14 0 0 1 8 3L6.77 24A12.19 12.19 0 0 1 16 3.8zm0 24.4a12.14 12.14 0 0 1-8-3L25.23 8A12.19 12.19 0 0 1 16 28.2z" })));
export default Unavailable;
//# sourceMappingURL=Unavailable.js.map