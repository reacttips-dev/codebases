import * as React from "react";
import { Close } from "../SvgIcons/Close";
import * as styles from "./styles.css";
export const Tooltip = (props) => {
    const { children, className, contentProps, onClose, theme, visible = false } = props;
    const [isVisible, setIsVisible] = React.useState(visible);
    const themeTooltip = theme ? styles[theme] : styles.defaultTheme;
    const classNames = `${styles.tooltipContainer} ${isVisible ? styles.visible : ""} ${themeTooltip} ${className}`;
    const handleOnCloseClick = (e) => {
        if (e) {
            e.preventDefault();
        }
        if (onClose) {
            onClose();
        }
        setIsVisible(false);
    };
    React.useEffect(() => {
        setIsVisible(visible);
    }, [visible]);
    return (React.createElement("div", { className: styles.tooltip },
        React.createElement("div", { className: "toggleElement", "data-automation": "tooltip-toggle-btn" }, children),
        React.createElement("div", { className: classNames },
            React.createElement("div", { className: "bgTransparent", onClick: handleOnCloseClick }),
            React.createElement("section", { className: "tooltip" },
                React.createElement("button", { onClick: handleOnCloseClick, "data-automation": "tooltip-close-btn", className: "closeIconWrapper" },
                    React.createElement(Close, { className: "closeIcon", viewBox: "0 0 28 28" })),
                contentProps))));
};
export default Tooltip;
//# sourceMappingURL=Tooltip.js.map