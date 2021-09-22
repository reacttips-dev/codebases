import * as React from "react";
import * as styles from "./style.css";
const SuccessTitle = (props) => {
    const { children, className } = props;
    return (React.createElement("div", { className: `${styles.header} ${className ? className : ""}`, "data-automation": "success-header" }, children));
};
export default SuccessTitle;
//# sourceMappingURL=SuccessTitle.js.map