import React from "react";
import { TechnologiesDDItemType } from "../../../filters/technology/types";
import TechnologiesDDHighlightedItem from "../TechnologiesDDItem/TechnologiesDDHighlightedItem";

export type TechnologiesDDVirtualListProps = {
    virtual: {
        style: React.CSSProperties;
        items: readonly TechnologiesDDItemType[];
    };
    itemHeight: number;
    onItemClick(item: TechnologiesDDItemType): void;
};

const TechnologiesDDVirtualList = (props: TechnologiesDDVirtualListProps) => {
    const {
        virtual: { style, items },
        itemHeight,
        onItemClick,
    } = props;

    return (
        <div style={style}>
            {items.map((item) => (
                <TechnologiesDDHighlightedItem
                    item={item}
                    itemHeight={itemHeight}
                    onClick={() => onItemClick(item)}
                    key={`item-${item.name}-${item.type}`}
                />
            ))}
        </div>
    );
};

export default TechnologiesDDVirtualList;
