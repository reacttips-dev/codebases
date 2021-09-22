import * as React from "react";
import * as styles from "../../style.css";
import withExpandableBody from "../../withExpandableBody";
export const DisplayLimitTable = React.forwardRef((props, ref) => (React.createElement("div", { ref: ref, className: `${styles.body} ${styles[props.direction || "down"]} ${props.className || ""}`, "data-automation": props.dataAutomation }, props.open ? props.children : React.Children.toArray(props.children).splice(0, props.limitRows))));
export default withExpandableBody(DisplayLimitTable);
//# sourceMappingURL=DisplayLimitTable.js.map