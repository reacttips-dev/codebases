import React from "react";
import { CheckboxIcon } from "@similarweb/ui-components/dist/dropdown";
import { TechnologiesDDItemType } from "../../../filters/technology/types";
import { StyledItemContainer, StyledItemCheckbox } from "./styles";

export type TechnologiesDDItemProps = {
    item: TechnologiesDDItemType;
    itemHeight?: number;
    onClick(): void;
    renderText(item: TechnologiesDDItemType): React.ReactNode;
};

const TechnologiesDDItem = (props: TechnologiesDDItemProps) => {
    const { item, itemHeight, onClick, renderText } = props;

    return (
        <StyledItemContainer onClick={onClick} itemHeight={itemHeight} data-automation="dd-item">
            {renderText(item)}
            <StyledItemCheckbox>
                <CheckboxIcon selected={item.isSelected} />
            </StyledItemCheckbox>
        </StyledItemContainer>
    );
};

export default TechnologiesDDItem;
