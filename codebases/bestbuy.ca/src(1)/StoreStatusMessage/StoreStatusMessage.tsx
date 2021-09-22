import * as React from "react";
import { Link } from "../Link";
import * as styles from "./styles.css";
export const StoreStatusMessage = ({ message, linkProps, className = "" }) => {
    if (!message) {
        return null;
    }
    return (React.createElement("div", { className: `${styles.storeStatusMessageContainer} ${className}` },
        React.createElement("p", { className: styles.storeStatusMessage }, message),
        linkProps && linkProps.href && linkProps.ctaText && (React.createElement(Link, { href: linkProps.href, chevronType: "right", targetSelf: linkProps.targetSelf, ariaLabel: linkProps.ariaLabel, className: styles.link }, linkProps.ctaText))));
};
export default StoreStatusMessage;
//# sourceMappingURL=StoreStatusMessage.js.map