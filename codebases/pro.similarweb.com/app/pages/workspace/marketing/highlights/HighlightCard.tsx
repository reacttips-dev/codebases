import * as React from "react";
import { FC } from "react";
import {
    BoldText,
    BottomWrapper,
    ChangeWrapper,
    ChannelWrapper,
    Domain,
    DomainWrapper,
    DurationWrapper,
    GraphWrapper,
    HighlightCardWrapper,
    Icon,
    Marker,
    Percent,
    StyledIcon,
    TextWrapper,
} from "./StyledComponents";
import I18n from "components/WithTranslation/src/I18n";
import { percentageSignFilter } from "filters/ngFilters";
import { TrendGraph } from "./TrendGraph";
import { trafficSources } from "Shared/utils";

enum HighlightsTypes {
    "continues_increase" = "continues_increase",
    "jumped" = "jumped",
    "continues_decrease" = "continues_decrease",
    "dropped" = "dropped",
}

const IncreaseTypes = [HighlightsTypes.continues_increase, HighlightsTypes.jumped];

export const TrendTypes = [HighlightsTypes.continues_increase, HighlightsTypes.continues_decrease];

const Types = {
    [HighlightsTypes.continues_increase]: {
        icon: "trend-up",
        type: "arena.strategic-overview.highlights.continues-increase.type",
    },
    [HighlightsTypes.jumped]: {
        icon: "arrow-up",
        type: "arena.strategic-overview.highlights.jumped.type",
    },
    [HighlightsTypes.continues_decrease]: {
        icon: "trend-down",
        type: "arena.strategic-overview.highlights.continues-decrease.type",
    },
    [HighlightsTypes.dropped]: {
        icon: "arrow-down",
        type: "arena.strategic-overview.highlights.dropped.type",
    },
};

interface IHighlightCardProps {
    site: string;
    type: HighlightsTypes;
    channel: string;
    change: number;
    traffic: object;
    color: string;
    onCardClicked: (channel: string) => void;
}

export const HighlightCard: FC<IHighlightCardProps> = ({
    site,
    type,
    channel,
    change,
    traffic,
    color,
    onCardClicked,
}) => {
    const isIncrease = IncreaseTypes.includes(type);
    const isTrend = TrendTypes.includes(type);

    return (
        <HighlightCardWrapper onClick={() => onCardClicked(channel)}>
            <DomainWrapper>
                <Domain>
                    <Marker color={color} /> {site}
                </Domain>
                <Icon iconName="arrow-right" size="xs" />
            </DomainWrapper>
            <ChannelWrapper isIncrease={isIncrease}>
                <StyledIcon
                    iconName={Types[type].icon}
                    isIncrease={isIncrease}
                    isRotate={isTrend}
                />
                <TextWrapper>
                    <BoldText>
                        <I18n>{trafficSources[channel]?.title}</I18n>&nbsp;
                    </BoldText>
                    <I18n>{Types[type].type}</I18n>
                </TextWrapper>
            </ChannelWrapper>
            <BottomWrapper>
                <GraphWrapper>
                    <TrendGraph traffic={traffic}></TrendGraph>
                    <I18n>arena.strategic-overview.highlights.past4weeks</I18n>
                </GraphWrapper>
                <ChangeWrapper>
                    <Percent isIncrease={isIncrease}>
                        {isIncrease && "+"}
                        {percentageSignFilter()(change, 0)}
                    </Percent>
                    <DurationWrapper>
                        {isTrend ? (
                            <I18n>arena.strategic-overview.highlights.avg-weekly-change</I18n>
                        ) : isIncrease ? (
                            <I18n>arena.strategic-overview.highlights.growth-this-week</I18n>
                        ) : (
                            <I18n>arena.strategic-overview.highlights.drop-this-week</I18n>
                        )}
                    </DurationWrapper>
                </ChangeWrapper>
            </BottomWrapper>
        </HighlightCardWrapper>
    );
};
