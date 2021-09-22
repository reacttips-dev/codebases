import * as React from "react";
import * as styles from "../../style.css";
import withExpandableBody from "../../withExpandableBody";
export const DisplayLimitText = React.forwardRef((props, ref) => (React.createElement("div", { ref: ref, className: `${styles.body} ${styles[props.direction || "down"]} ${props.className}`, "data-automation": props.dataAutomation }, props.open
    ? props.text
    : props.text
        .split(" ")
        .splice(0, props.limitWords)
        .join(" "))));
export default withExpandableBody(DisplayLimitText);
//# sourceMappingURL=DisplayLimitText.js.map