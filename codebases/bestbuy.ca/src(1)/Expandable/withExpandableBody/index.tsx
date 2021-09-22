import * as React from "react";
import * as styles from "./styles.css";
import useExpandContentTransition from "./hooks/useExpandContentTransition";
const withExpandableBody = (Component) => (props) => {
    const expandableBodyRef = React.useRef(null);
    const containerRef = React.useRef(null);
    const [inlineStyle, open] = useExpandContentTransition(containerRef, expandableBodyRef, props.open);
    return (React.createElement("div", { className: styles.container, ref: containerRef, style: inlineStyle },
        React.createElement(Component, Object.assign({}, props, { ref: expandableBodyRef, open: open }))));
};
export default withExpandableBody;
//# sourceMappingURL=index.js.map