import React from "react";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { StyledTooltipText, StyledTooltipTitle } from "./styles";
import { SWReactIcons } from "@similarweb/icons";

type VisualisationSwitchItemProps = {
    iconName: string;
    tooltipText: string;
    tooltipTitle: string;
};

const VisualisationSwitchItem = (props: VisualisationSwitchItemProps) => {
    const { iconName, tooltipText, tooltipTitle } = props;

    return (
        <PlainTooltip
            maxWidth={227}
            tooltipContent={
                <>
                    <StyledTooltipTitle>{tooltipTitle}</StyledTooltipTitle>
                    <StyledTooltipText>{tooltipText}</StyledTooltipText>
                </>
            }
        >
            <div>
                <SWReactIcons iconName={iconName} size="sm" />
            </div>
        </PlainTooltip>
    );
};

export default VisualisationSwitchItem;
