import * as React from "react";
import SelectableCard from "../SelectableCard";
import * as styles from "./style.css";
const SelectableItem = ({ children, isSelected = false, isSelectable = false, cardClassName, options, onSelect, }) => {
    return (React.createElement("div", { className: styles.itemContainer, "data-automation": "item-card" },
        React.createElement(SelectableCard, { noPointer: !isSelectable, innerClassName: !!cardClassName && cardClassName, automationLabel: "selectable-item-card", isSelectable: isSelectable, isSelected: isSelected, onSelect: () => typeof onSelect === "function" && onSelect(options.id) }, children)));
};
export default SelectableItem;
//# sourceMappingURL=index.js.map