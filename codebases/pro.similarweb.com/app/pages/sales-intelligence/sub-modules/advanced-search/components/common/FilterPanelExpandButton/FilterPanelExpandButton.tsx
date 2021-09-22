import React from "react";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { StyledExpandButtonIcon } from "./styles";

type FilterPanelExpandButtonProps = {
    iconName: string;
    tooltipText: string;
    onClick(): void;
};

const FilterPanelExpandButton = (props: FilterPanelExpandButtonProps) => {
    const { iconName, tooltipText, onClick } = props;

    return (
        <PlainTooltip tooltipContent={tooltipText}>
            <StyledExpandButtonIcon>
                <IconButton type="flat" iconSize="sm" onClick={onClick} iconName={iconName} />
            </StyledExpandButtonIcon>
        </PlainTooltip>
    );
};

export default FilterPanelExpandButton;
