import * as React from "react";
import * as styles from "./styles.css";
import SelectableItem from "./components/SelectableItem";
import classnames from "classnames";
const SelectableCards = ({ cardsOptions, onSelect, selectedItemId, containerClassName, cardClassName, }) => {
    const cardsContainerClassNames = React.useMemo(() => classnames(styles.cardsContainer, {
        [containerClassName]: containerClassName ? containerClassName : "",
    }), [containerClassName]);
    const preparedContent = React.useMemo(() => cardsOptions
        ? cardsOptions.map((option, index) => {
            return (React.createElement(SelectableItem, { cardClassName: cardClassName ? cardClassName : styles.defaultCardStyle, key: `selectable-item-${index}`, options: option, isSelectable: option.isSelectable, isSelected: option.isSelectable && option.id === selectedItemId, onSelect: typeof onSelect === "function" && onSelect }, option.content));
        })
        : "", [cardsOptions, selectedItemId, cardClassName]);
    return React.createElement("div", { className: cardsContainerClassNames }, preparedContent);
};
export default SelectableCards;
//# sourceMappingURL=SelectableCards.js.map