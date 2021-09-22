import { SWReactIcons } from "@similarweb/icons";
import {
    ChartTooltipContainer,
    ChartTooltipRowContainer,
    Circle,
    Text,
    ShortText,
    IconContainer,
    CircleContainer,
} from "components/React/MarketingChannelsDistribution/styledComponents";
import React from "react";
import { iconTypes } from "UtilitiesAndConstants/Constants/IconTypes";

const ChartTooltipRow = (props) => {
    const { item } = props;
    const {
        displayName,
        tooltipColor: color,
        isMarketingChannelsType,
        displayValue,
        isLeadSite,
    } = item;
    const isBoldText = isMarketingChannelsType || isLeadSite;
    return (
        <ChartTooltipRowContainer>
            <div style={{ display: "flex" }}>
                <CircleContainer>
                    <Circle color={color} />
                </CircleContainer>
                <ShortText isBold={isBoldText}>{displayName}</ShortText>
                {isLeadSite && (
                    <IconContainer>
                        <SWReactIcons iconName={iconTypes.WINNER} />
                    </IconContainer>
                )}
            </div>
            <Text isBold={isBoldText}>{displayValue}</Text>
        </ChartTooltipRowContainer>
    );
};
export const ChartTooltip = (props) => {
    const { chart } = props;
    const { hoverSeries } = chart;
    const { data: hoverSeriesData } = hoverSeries;
    return (
        <ChartTooltipContainer>
            {hoverSeriesData.map((item, index, hoverSeriesData) => (
                <ChartTooltipRow
                    key={index}
                    index={index}
                    item={item}
                    hoverSeriesData={hoverSeriesData}
                />
            ))}
        </ChartTooltipContainer>
    );
};
