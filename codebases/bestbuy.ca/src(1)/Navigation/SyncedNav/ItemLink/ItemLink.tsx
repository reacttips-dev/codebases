import * as React from "react";
import { Link } from "../../../Link";
import { ChevronDown, ChevronUp } from "../../../";
import * as styles from "./styles.css";
const Chevron = ({ isOpen, className = "", onClick, }) => {
    const handleClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        onClick();
    };
    return (React.createElement("button", { onClick: handleClick, className: className }, isOpen ? React.createElement(ChevronUp, null) : React.createElement(ChevronDown, null)));
};
const Icon = ({ icon }) => {
    return React.createElement("div", { className: styles.icon }, icon);
};
const ItemLink = ({ children, hasChildren, className = "", onClick, onExpandToggle, href, isSelected, isExpanded, isExternal, icon, }) => {
    const linkClassNames = [className, isSelected && styles.selected, icon && styles.withIcon, styles.itemLink]
        .filter((item) => item)
        .join(" ");
    return (React.createElement(Link, { className: linkClassNames, href: href, onClick: onClick, targetSelf: isExternal ? false : true, rel: href ? "external" : "" },
        icon && React.createElement(Icon, { icon: icon }),
        children,
        hasChildren && React.createElement(Chevron, { className: styles.chevron, onClick: onExpandToggle, isOpen: isExpanded })));
};
export default ItemLink;
//# sourceMappingURL=ItemLink.js.map