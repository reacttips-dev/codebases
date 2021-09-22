import * as React from "react";
import * as globalStyles from "../../style.css";
import * as styles from "./styles.css";
import withExpandableBody from "../../withExpandableBody";
const DisplayDefault = React.forwardRef((props, ref) => {
    const classes = [
        globalStyles.body,
        globalStyles[props.direction || "down"],
        props.className,
        props.open ? styles.open : styles.closed,
    ]
        .filter((classString) => !!classString)
        .join(" ");
    return (React.createElement("div", { ref: ref, className: classes, "data-automation": props.dataAutomation }, props.children));
});
export default withExpandableBody(DisplayDefault);
//# sourceMappingURL=DisplayDefault.js.map