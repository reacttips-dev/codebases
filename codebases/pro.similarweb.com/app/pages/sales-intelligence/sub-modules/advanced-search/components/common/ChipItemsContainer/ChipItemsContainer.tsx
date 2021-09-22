import React from "react";
import { StyledContainer, StyledItemWithSeparator } from "./styles";

type ChipItemType = {
    text: string;
    id: string | number;
    onCloseItem(e?: React.MouseEvent<HTMLSpanElement>): void;
};

type ChipItemsContainerProps<C extends ChipItemType> = {
    items: C[];
    className?: string;
    ChipComponent: React.ComponentType<C>;
    renderSeparator?(index: number): React.ReactNode;
};

const ChipItemsContainer = <C extends ChipItemType>(props: ChipItemsContainerProps<C>) => {
    const { items, ChipComponent, className = null, renderSeparator } = props;

    const renderItemWithSeparator = (item: C, index: number, array: C[]) => {
        if (typeof renderSeparator !== "function" || index === array.length - 1) {
            return <ChipComponent key={item.id} {...item} />;
        }

        return (
            <StyledItemWithSeparator key={item.id}>
                <ChipComponent {...item} />
                {renderSeparator(index)}
            </StyledItemWithSeparator>
        );
    };

    return (
        <StyledContainer className={className}>
            {items.map(renderItemWithSeparator)}
        </StyledContainer>
    );
};

export default ChipItemsContainer;
