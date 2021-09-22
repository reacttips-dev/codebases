import * as React from "react";
import { ChevronDown, ChevronRight, ChevronUp } from "..";
import * as styles from "./styles.css";
const Chevron = (props) => {
    const chevronProps = {
        className: styles.chevron,
        viewBox: "-6 -2 32 32",
    };
    switch (props.type) {
        case "up":
            return React.createElement(ChevronUp, Object.assign({}, chevronProps));
        case "down":
            return React.createElement(ChevronDown, Object.assign({}, chevronProps));
        case "right":
            return React.createElement(ChevronRight, Object.assign({}, chevronProps));
        default:
            return null;
    }
};
const Link = ({ targetSelf, href, className, chevronType, children, onClick = () => { }, ariaLabel, disabled = false, overrides = {}, rel = "external", }) => {
    const target = targetSelf ? "_self" : "_blank";
    const otherProps = Object.assign(Object.assign({}, overrides), { "aria-label": ariaLabel });
    let hrefValue = href || "javascript: void(0);";
    if (disabled) {
        hrefValue = undefined;
    }
    const cssClasses = [
        styles.link,
        chevronType ? styles.withChevron : "",
        className ? className : "",
        disabled ? styles.disabled : "",
    ]
        .filter((cssClass) => !!cssClass)
        .join(" ");
    return (React.createElement("a", Object.assign({ className: cssClasses, href: hrefValue, target: target, rel: rel, onClick: (evt) => {
            if (disabled) {
                evt.preventDefault();
                return;
            }
            onClick(evt);
        } }, otherProps),
        children,
        React.createElement(Chevron, { type: chevronType })));
};
export default Link;
//# sourceMappingURL=Link.js.map