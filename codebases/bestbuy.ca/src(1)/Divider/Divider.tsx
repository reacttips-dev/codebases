import * as React from "react";
import classnames from "classnames";
import * as styles from "./styles.css";
const Divider = ({ className }) => {
    return React.createElement("hr", { className: classnames([styles.hr, className]) });
};
export default Divider;
//# sourceMappingURL=Divider.js.map