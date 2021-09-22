import * as React from "react";
import * as styles from "./styles.css";
import classNames from "classnames";
export const LoadingSpinner = ({ isLight = false, width = "auto", containerClass = "", }) => {
    return (React.createElement("div", { className: classNames(styles.loaderContainer, { [containerClass]: containerClass }), "aria-busy": "true", style: { width } },
        React.createElement("svg", { className: styles.spinner, viewBox: "25 25 50 50" },
            React.createElement("circle", { className: classNames(styles.circle, { [styles.light]: isLight }), cx: "50", cy: "50", r: "20", fill: "none", strokeWidth: "3", strokeMiterlimit: "10" }))));
};
export default LoadingSpinner;
//# sourceMappingURL=LoadingSpinner.js.map