import * as React from "react";
import * as styles from "./style.css";
const SuccessBody = (props) => {
    const { children, className } = props;
    return (React.createElement("div", { className: `${styles.body} ${className ? className : ""}`, "data-automation": "details-body" }, children));
};
export default SuccessBody;
//# sourceMappingURL=SuccessBody.js.map