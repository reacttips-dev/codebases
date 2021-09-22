import * as React from "react";
import * as styles from "./style.css";
import FormItem from "../FormItem";
export const RangeSelection = ({ totalTiles = 5, preselectedTile, isSelectable, name, value, title, rangeLabels, clearButtonLabel, handleSyncChange, className = "", getSelectedRatingLabel, ariaLabels, }) => {
    const selectedTile = typeof value === "string" ? parseInt(value, 10) || 0 : value;
    const clearButtonAriaLabel = ariaLabels && ariaLabels.clearButton;
    React.useEffect(() => {
        const roundedPreselectedTile = Math.round(preselectedTile) || 0;
        handleSyncChange(name, roundedPreselectedTile);
    }, [preselectedTile]);
    const getTiles = () => {
        const tiles = [];
        for (let i = 1; i <= totalTiles; i++) {
            const filledTile = i <= selectedTile ? styles.filled : "";
            const tileAriaLabel = ariaLabels && ariaLabels.tiles && ariaLabels.tiles[i - 1];
            tiles.push(React.createElement("button", { type: "button", onClick: handleTileSelection, key: `tile-${i}`, value: i, name: name, className: `${styles.tile} ${filledTile}`, disabled: !isSelectable, "data-automation": `${name}-tile-${i}`, "aria-label": tileAriaLabel }));
        }
        return tiles;
    };
    const handleTileSelection = (e) => {
        handleSyncChange(name, parseInt(e.currentTarget.value, 10) || 0);
    };
    const clearTileSelection = () => {
        handleSyncChange(name, 0);
    };
    return (React.createElement("fieldset", { className: `${styles.rangeSelectionContainer} ${className}` },
        React.createElement("div", { className: styles.titleButtonContainer },
            title && (React.createElement("legend", { className: styles.title, "data-automation": "attribute-label" },
                title,
                !!selectedTile && (React.createElement("p", { className: styles.selectedRating, "aria-hidden": true, "data-automation": "selected-rating" }, getSelectedRatingLabel(selectedTile))))),
            clearButtonLabel && !!isSelectable && !!selectedTile && (React.createElement("button", { className: styles.clearButton, onClick: clearTileSelection, "data-automation": "clear-button", "aria-label": clearButtonAriaLabel }, clearButtonLabel))),
        React.createElement("div", { className: `${styles.rangeSelection} ${!isSelectable ? styles.disabled : ""}`, "data-automation": `${name}-rangeSelection` }, getTiles()),
        rangeLabels && (React.createElement("div", { className: styles.rangeContainer, "aria-hidden": true },
            React.createElement("p", null, rangeLabels.min),
            React.createElement("p", null, rangeLabels.max)))));
};
export default FormItem({ showLabel: false })(RangeSelection);
//# sourceMappingURL=RangeSelection.js.map