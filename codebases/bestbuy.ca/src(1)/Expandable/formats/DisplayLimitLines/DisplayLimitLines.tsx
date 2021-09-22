import * as React from "react";
import * as globalStyles from "../../style.css";
import * as styles from "./styles.css";
import withExpandableBody from "../../withExpandableBody";
const DisplayLimitLines = React.forwardRef((props, ref) => {
    const inlineStyle = {
        WebkitLineClamp: props.open ? "initial" : props.lines,
    };
    const classes = [
        globalStyles.body,
        globalStyles[props.direction || "down"],
        styles.container,
        props.className,
        props.open ? styles.open : styles.closed,
    ]
        .filter((classString) => !!classString)
        .join(" ");
    return (React.createElement("div", { style: inlineStyle, ref: ref, className: classes, "data-automation": props.dataAutomation },
        React.createElement("div", { className: styles.clampedText }, props.children)));
});
export default withExpandableBody(DisplayLimitLines);
//# sourceMappingURL=DisplayLimitLines.js.map