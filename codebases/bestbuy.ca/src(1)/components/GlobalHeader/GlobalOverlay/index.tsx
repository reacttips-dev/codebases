import * as React from "react";
import * as styles from "./style.css";
export const GlobalOverlay = ({ onClick, open }) => {
    if (!open) {
        return null;
    }
    const onOverlayClick = (e) => {
        e.preventDefault();
        onClick(e);
    };
    return (React.createElement("div", { className: styles.globalOverlay, "data-automation": "x-global-overlay", onClick: onOverlayClick }));
};
export default GlobalOverlay;
//# sourceMappingURL=index.js.map