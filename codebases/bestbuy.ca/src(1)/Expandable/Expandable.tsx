import * as React from "react";
import { ChevronDown, ChevronUp } from "../SvgIcons";
import * as styles from "./style.css";
const Expandable = ({ variant = "normal", className = "", direction = "down", headerText, toggleHeaderText, children, open = false, onClick, openedIcon, closedIcon, dataAutomation, }) => {
    const [openState, setOpenState] = React.useState(open);
    const [headerTextState, setHeaderTextState] = React.useState(headerText);
    React.useEffect(() => {
        if (openState && toggleHeaderText) {
            setHeaderTextState(toggleHeaderText);
        }
        else {
            setHeaderTextState(headerText);
        }
        if (!!onClick) {
            onClick(openState);
        }
    }, [openState, onClick, toggleHeaderText, headerText]);
    React.useEffect(() => {
        setOpenState(open);
    }, [open]);
    const isCompact = variant === "compact";
    const svgIconProps = { viewBox: "0 0 32 32", color: isCompact ? "blue" : "black" };
    return (React.createElement("div", { className: `${isCompact ? styles.compactContainer : styles.container} ${className}` },
        React.createElement("button", { className: `${isCompact ? styles.compactButton : styles.button} ${styles[direction]}`, onClick: () => {
                setOpenState(!openState);
            }, "data-automation": dataAutomation },
            headerTextState,
            React.createElement("span", { className: `${styles.icon}` }, !!openState
                ? openedIcon || React.createElement(ChevronUp, Object.assign({}, svgIconProps))
                : closedIcon || React.createElement(ChevronDown, Object.assign({}, svgIconProps)))),
        React.createElement("div", { className: `${styles.bodyContainer} ${styles[direction]}` }, React.Children.map(children, (child) => React.cloneElement(child, {
            direction,
            open: openState,
        })))));
};
export default Expandable;
//# sourceMappingURL=Expandable.js.map