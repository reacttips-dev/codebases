import * as React from "react";
import * as styles from "./style.css";
import { CheckmarkLogo } from "../../../SvgIcons/CheckmarkLogo";
import classnames from "classnames";
const SelectableCard = ({ automationLabel = "selectable-card", children, innerClassName, outerClassName, isSelected = false, noPointer = true, onSelect, isSelectable = false, }) => {
    const cardClassNames = classnames(styles.selectableCard, { [styles.selected]: isSelected ? ` ${styles.selected}` : "" }, { [styles.noPointer]: noPointer ? ` ${styles.noPointer}` : "" }, { [styles.outerClassName]: outerClassName ? ` ${outerClassName}` : "" });
    const checkmarkContainer = isSelectable && isSelected ? React.createElement(CheckmarkLogo, { className: styles.checkmark }) : React.createElement("span", { className: styles.oval });
    return (React.createElement("div", { className: cardClassNames, onClick: typeof onSelect === "function" && onSelect },
        isSelectable && checkmarkContainer,
        React.createElement("div", { className: innerClassName, "data-automation": automationLabel }, children)));
};
export default SelectableCard;
//# sourceMappingURL=index.js.map