import React from "react";
import { SWReactIcons } from "@similarweb/icons";
import { StyledDropdownEmptyItem } from "./styles";

type DropdownEmptyItemProps = {
    text: string;
    iconName?: string;
    iconSize?: string;
};

const DropdownEmptyItem = (props: DropdownEmptyItemProps) => {
    const { text, iconName = "no-search-results", iconSize = "sm" } = props;

    return (
        <StyledDropdownEmptyItem>
            <SWReactIcons iconName={iconName} size={iconSize} />
            <span>{text}</span>
        </StyledDropdownEmptyItem>
    );
};

export default React.memo(DropdownEmptyItem);
