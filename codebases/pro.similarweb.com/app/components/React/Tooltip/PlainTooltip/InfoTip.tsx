import React from "react";
import { PlainTooltip } from "./PlainTooltip";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { SWReactIcons } from "@similarweb/icons";
import { IconContainer } from "../../PopularPagesFilters/PopularPagesFilters";
const InfoTip = ({ text }) => {
    return (
        <PlainTooltip text={text}>
            <IconContainer>
                <SWReactIcons iconName="info" size="xs" />
            </IconContainer>
        </PlainTooltip>
    );
};
SWReactRootComponent(InfoTip, "InfoTip");
export default InfoTip;
